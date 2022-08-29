import "dotenv/config";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { Neo4jError } from "neo4j-driver";
import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import { deleteAsset } from "@server/cloudinary";
import { Request, Response } from "express";
import "cookie-session";
import parseParam from "@serverUtils/parseParam";

type UsernameObj = Omit<User, "email" | "password">;

interface UpdateUser {
    username?: string;
    email?: string;
    public_id?: string;
    url?: string;
}

function _hash(password: string) {
    const salt = genSaltSync();
    return hashSync(password, salt);
}

export async function createUser(req: Request, res: Response) {
    const credentials: User = req.body;

    if (credentials.email.length <= 0 || credentials.username.length <= 0 || credentials.password.length <= 0) {
        res.status(400).json({ msg: "missing fields" });
        return;
    }

    const driver = getDriver();
    const session = driver.session();
    const hashedPassword = _hash(credentials.password);

    try {
        const query = `
        CREATE (u:User {id: randomUUID(), name:$username, email:$email, password:$password})
        RETURN {id:u.id, username: u.name, email: u.email } as user
        `;

        const queryRes = await writeService<User>(session, query, { ...credentials, password: hashedPassword });

        if (queryRes.records[0].length > 0) {
            const user: UserSafeProps = queryRes.records[0].get("user");

            return req.login(user, (err) => {
                if (err) {
                    res.json({ msg: "can't create user", error: (err as Error).name });
                    return;
                }

                res.status(201).json({
                    msg: "created",
                });

                return;
            });
        }
    } catch (error) {
        if (
            (error as Error).name.toLowerCase() === "neo4jerror" &&
            (error as Neo4jError).code === "Neo.ClientError.Schema.ConstraintValidationFailed"
        ) {
            const errMsg = (error as Neo4jError).message;

            if (errMsg.includes("property") && errMsg.includes("email")) {
                res.status(400).json({ msg: "email taken" });
                return;
            }

            res.status(400).json({ msg: "username taken" });
            return;
        }

        res.status(500).json({ msg: "couldn't create account" });
        return;
    }
}

export async function loginUser(username: string, unhashedPassword: string) {
    const driver = getDriver();
    const session = driver.session();

    const query = `
        MATCH (usr:User { name:$username })
        RETURN { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
            public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user
        `;

    const queryRes = await readService<UsernameObj>(session, query, { username });

    if (queryRes.records.length > 0 && queryRes.records[0].length > 0) {
        const { password, ...safeProps } = queryRes.records[0].get("user");

        return compareSync(unhashedPassword, password) ? safeProps : "password not valid";
    } else {
        return "username doesn't exist";
    }
}

export async function deleteUser(req: Request, res: Response) {
    const { username } = req.params;

    // if ((!req.isAuthenticated() && !req.session?.isPopulated) || (req.user as UserSafeProps).username !== username) {
    //     res.status(401).json({ msg: "unauthenticated" });
    //     return;
    // }

    const public_id = undefined;
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `MATCH (usr:User {name:$username})
        DETACH DELETE usr`;

        const deleteUserRes = await Promise.all([
            deleteAsset(public_id),
            writeService<UsernameObj>(session, query, {
                username: parseParam(username),
            }),
        ]);

        const queryRes = deleteUserRes[1];

        const { counters } = queryRes.summary;

        if (counters.containsUpdates() && counters.updates().nodesDeleted === 1) {
            req.logout({ keepSessionInfo: false }, (err) => {
                if (err) {
                    res.json({ msg: "logout failed" });
                    return;
                }

                return;
            });

            res.json({ msg: "ok" });
            return;
        } else {
            res.json({ msg: "not found" });
            return;
        }
    } catch (error) {
        res.status(500).json({ msg: "couldn't delete user" });
        return;
    }
}

export async function findUser(identifier: string, identifierType: string) {
    try {
        const query = `
        MATCH (usr:User {${identifierType}:$identifier})
        RETURN { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
            public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user`;

        const driver = getDriver();
        const session = driver.session();

        const queryRes = await readService(session, query, { identifier });

        if (queryRes.records.length > 0 && queryRes.records[0].length > 0) {
            return { msg: "found" };
        }

        return { msg: "not found" };
    } catch (err) {
        return { msg: "can't find user" };
    }
}

export async function updateUser(updateData: UpdateUser, id: string): Promise<UserSafeProps | undefined> {
    const { username, email, public_id, url } = updateData;

    const driver = getDriver();
    const session = driver.session();
    let query;

    try {
        if (public_id && url) {
            query = `MATCH (usr:User { id:$id })
            SET usr.profilePicPublicId= $public_id, usr.profilePicUrl= $url

            return { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
                public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user`;

            const queryRes = await writeService(session, query, {
                id,
                public_id,
                url,
            });

            const user = queryRes.records[0].get("user");

            return user;
        }

        if (username && email) {
            query = `MATCH (usr:User { id:$id })
            SET usr.name = $username, usr.email = $email

            return { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
                public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user`;

            const queryRes = await writeService(session, query, {
                id,
                email,
                username,
            });

            const user = queryRes.records[0].get("user");
            delete user.password;
            return user;
        }

        if (username) {
            query = `MATCH (usr:User {id:$id})
            SET usr.name = $username

            return { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
                public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user`;

            const queryRes = await writeService(session, query, {
                id,
                username,
            });

            const user = queryRes.records[0].get("user");
            delete user.password;
            return user;
        }

        if (email) {
            query = `MATCH (usr:User {id: $id})
            SET usr.email = $email
            return { id: usr.id, username: usr.name, email: usr.email, password: usr.password, 
                public_id: usr.profilePicPublicId, url: usr.profilePicUrl } as user`;

            const queryRes = await writeService(session, query, {
                id,
                email,
            });

            const user = queryRes.records[0].get("user");
            delete user.password;
            return user;
        }

        return;
    } catch (error) {
        console.log((error as Neo4jError).code);
        return;
    }
}
