import "dotenv/config";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { Neo4jError } from "neo4j-driver";
import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const { jwt_secret } = process.env;

interface CreateUserResponse extends Omit<User, "password"> {
    token: string;
}

type LoginCredentials = Omit<User, "email" | "password">;

function _hash(password: string) {
    const salt = genSaltSync();
    return hashSync(password, salt);
}

export async function create(req: Request, res: Response, next: NextFunction) {
    const credentials: User = req.body;
    const driver = getDriver();
    const session = driver.session();
    const hashedPassword = _hash(credentials.password);

    try {
        const writeQuery = `
        CREATE (u:User {id: randomUUID(), name:$username, email:$email, password:$password})
        RETURN {id:u.id, username: u.name, email: u.email, password: u.password } as user
        `;
        const writeRes = await writeService<User>(session, writeQuery, { ...credentials, password: hashedPassword });

        if (writeRes.records[0].length > 0) {
            const user: UserSafeProps = writeRes.records[0].get("user");

            return req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                res.status(201).json({
                    msg: "account was successfully created",
                } as Server.responseObj<CreateUserResponse>);

                return user;
            });
        }
    } catch (error) {
        if ((error as Neo4jError).code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
            const errMsg = (error as Neo4jError).message;

            if (errMsg.includes("property") && errMsg.includes("email")) {
                return res.json({ msg: "email taken" } as Server.responseObj<string>);
            }

            return res.json({
                msg: "username taken",
            } as Server.responseObj<string>);
        }

        next(error);
    }
}

export async function login(username: string, unhashedPassword: string) {
    const driver = getDriver();
    const session = driver.session();

    const readQuery = `
        MATCH (u:User { name:$username })
        RETURN {id:u.id, username: u.name, email: u.email, hashedPassword: u.password } as user
        `;

    const readRes = await readService<LoginCredentials>(session, readQuery, { username });

    if (readRes.records[0].length > 0) {
        const { hashedPassword, ...safeProps } = readRes.records[0].get("user");
        return compareSync(unhashedPassword, hashedPassword) ? safeProps : "password not valid";
    } else {
        return `user with username: ${username} doesn't exist`;
    }
}
