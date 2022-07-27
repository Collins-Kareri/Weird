import "dotenv/config";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { Neo4jError } from "neo4j-driver";
import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import { Request, Response } from "express";
import "cookie-session";

type UsernameObj = Omit<User, "email" | "password">;

function _hash(password: string) {
    const salt = genSaltSync();
    return hashSync(password, salt);
}

export async function create(req: Request, res: Response) {
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
        if ((error as Neo4jError).code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
            const errMsg = (error as Neo4jError).message;

            if (errMsg.includes("property") && errMsg.includes("email")) {
                res.status(401).json({ msg: "email taken" });
                return;
            }

            res.status(401).json({ msg: "username taken" });
            return;
        }

        res.json({ msg: (error as Error).name });
        return;
    }
}

export async function login(username: string, unhashedPassword: string) {
    const driver = getDriver();
    const session = driver.session();

    const query = `
        MATCH (u:User { name:$username })
        RETURN {id:u.id, username: u.name, email: u.email, hashedPassword: u.password } as user
        `;

    const queryRes = await readService<UsernameObj>(session, query, { username });

    if (queryRes.records.length > 0 && queryRes.records[0].length > 0) {
        const { hashedPassword, ...safeProps } = queryRes.records[0].get("user");

        return compareSync(unhashedPassword, hashedPassword) ? safeProps : "password not valid";
    } else {
        return "username doesn't exist";
    }
}

export async function remove(req: Request, res: Response) {
    const { username } = req.params;
    const driver = getDriver();
    const session = driver.session();
    try {
        const query = `
        MATCH (usr:User {name:$username})
        DELETE usr`;

        const queryRes = await writeService<UsernameObj>(session, query, {
            username: username.replace(":", ""),
        });

        const { counters } = queryRes.summary;

        if (counters.containsUpdates() && counters.updates().nodesDeleted === 1) {
            res.json({ msg: "ok" });
            return;
        }

        res.status(404).json({ msg: "user not found" });
        return;
    } catch (error) {
        res.json({ msg: (error as Error).name });
        return;
    }
}

export async function find(identifier: string, identifierType: string) {
    try {
        const query = `
        MATCH (usr:User {${identifierType}:$identifier})
        RETURN {${identifierType}:usr.${identifierType}} as user`;
        const driver = getDriver();
        const session = driver.session();

        const queryRes = await readService(session, query, { identifier });

        if (queryRes.records.length > 0 && queryRes.records[0].length > 0) {
            // const user = queryRes.records[0].get("user");
            // console.log(user);
            return { msg: "found" };
        }

        return { msg: "not found" };
    } catch (err) {
        console.log((err as Error).message);
        return { msg: "can't find user", error: (err as Error).name };
    }
}
