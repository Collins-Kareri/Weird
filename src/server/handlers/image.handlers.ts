import { writeService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { Request, Response } from "express";

/**
 * Creates image node in neo4j db
 * @param  {Request} req
 * @param  {Response} res
 */
export async function publish(req: Request, res: Response) {
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User {name:$username})
    CREATE (img:Image 
        {
            name:$asset_id,
            url:$url,
            secure_url:$secure_url,
            public_id:$public_id,
            asset_id:$asset_id,
            createdAt:dateTime()
        })
    MERGE (img)<-[rel:UPLOADED]-(usr)
    RETURN img as image,rel`;

    if (!req.isAuthenticated() && !req.session?.isPopulated) {
        res.status(401).json({ msg: "login first" });
        return;
    }

    const { username } = req.user as User;
    const { public_id, asset_id, url, secure_url } = req.body;

    if (username.length <= 0 || (url && url.length <= 0)) {
        res.status(400).json({ msg: "cannot publish" });
        return;
    }

    try {
        const dbRes = await writeService(session, query, { username, url, secure_url, public_id, asset_id });

        if (dbRes.records[0].length > 0) {
            res.status(201).json({ msg: "published" });
            return;
        }

        res.json({ msg: "failed" });
    } catch (error) {
        res.status(500).json({ msg: "failed" });
        return;
    }
}

/**
 * Deletes image from neo4j using public_id
 * @param  {string} public_id
 */
export async function deleteImgNode(public_id: string) {
    const driver = getDriver();
    const session = driver.session();
    const query = `MATCH (img:Image {public_id:$public_id})
    DETACH DELETE img`;

    try {
        const dbRes = await writeService(session, query, { public_id });
        const nodesDeleted = dbRes.summary.counters.updates().nodesDeleted;
        const relationshipsDeleted = dbRes.summary.counters.updates().relationshipsDeleted;

        if (nodesDeleted === 1 && relationshipsDeleted === 1) {
            return "ok";
        }

        return "not found";
    } catch (error) {
        throw "error deleting node";
    }
}

/**
 * Deletes profile picture from user node
 * @param id
 * @returns UsersafeProps | undefined
 */
export async function deleteProfileImage(id: string): Promise<UserSafeProps | undefined> {
    const driver = getDriver();
    const session = driver.session();
    const query = `MATCH (usr:User {id:$id})
    REMOVE usr.profilePicPublicId, usr.profilePicUrl
    RETURN {id: usr.id, username: usr.name, email: usr.email } as user`;

    try {
        const queryRes = await writeService<{ id: string }>(session, query, { id });
        const { counters } = queryRes.summary;

        if (counters.containsUpdates() && counters.updates().propertiesSet === 2) {
            return queryRes.records[0].get("user") as UserSafeProps;
        }

        return;
    } catch (error) {
        return;
    }
}
