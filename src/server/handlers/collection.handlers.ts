import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@server/neo4j/neo4j.driver";
import { Request, Response } from "express";
import parseParam from "@serverUtils/parseParam";
import { toNativeTypes } from "@serverUtils/neo4j.utils";
import { parseUser } from "@server/passport/passport";

/**
 * Creates a collection.
 * @param req
 * @param res
 * @returns
 */
export async function createCollection(req: Request, res: Response) {
    const { username } = req.user as UserSafeProps;
    // const username = "johnDoe";
    const driver = getDriver();
    const session = driver.session();
    const { collectionName, description } = req.body as { collectionName: string; description: string };

    const query = `MATCH (usr:User { name:$username })
        MERGE (col:Collection { name: $collectionName })<-[rel:CURATED]-(usr)
        ON CREATE 
          SET col.createdAt = dateTime(), col.description = $description
        RETURN rel, SIZE( (usr)-[rel]->(col) ) as noOfCollections`;

    try {
        const dbRes = await writeService(session, query, { username, collectionName, description });

        if (dbRes.records && dbRes.records[0].length > 0) {
            const noOfCollections = dbRes.records[0].get("noOfCollections").toNumber();
            const user = (req.user as UserSafeProps) || {};
            user.noOfCollections = noOfCollections;

            return req.login(user, (err) => {
                if (err) {
                    res.status(401).json({ msg: "unauthenticated" });
                    return;
                }
                res.status(201).json({ msg: "ok", user });
                return;
            });
        }

        res.json({ msg: "not created" });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "couldn't create collection" });
        return;
    }
}

/**
 * Get collections
 */
export async function getCollections(req: Request, res: Response) {
    //todo get collection
    const { username } = req.params;
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User { name: $username })-[:CURATED]->(col:Collection)
    CALL {
        WITH col
        MATCH (col)--(img:Image)
        RETURN count(img) as noOfItems
    }
    RETURN  {name: col.name,
     description: col.description, coverImage: col.coverImage, noOfItems: noOfItems} as collection ORDER BY col.createdAt DESC `;

    try {
        const dbRes = await readService(session, query, { username: parseParam(username) });

        if (dbRes && dbRes.records[0] && dbRes.records[0].length > 0) {
            const collections = dbRes.records.map((record) => toNativeTypes(record.get("collection")));
            res.json({
                msg: "ok",
                collections,
            });
            return;
        }

        res.json({
            msg: "ok",
            collections: undefined,
        });
        return;
    } catch (error) {
        res.status(500).json({ msg: "error occured finding collection" });
        return;
    }
}

/**
 * Delete collection
 * @param  {Request} req
 * @param  {Response} res
 */
export async function deleteCollection(req: Request, res: Response) {
    const { collectionName } = req.params;
    const { username } = req.user as UserSafeProps;
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User { name: $username })-[:CURATED]->(col:Collection {name: $collectionName })
    CALL {
        WITH col
        DETACH DELETE col
    }
    RETURN { id: usr.id, username: usr.name, email: usr.email , 
        public_id: usr.profilePicPublicId, url: usr.profilePicUrl, noOfUploadedImages:  SIZE((usr)-[:UPLOADED]->(:Image)), noOfCollections: SIZE( (usr)-[:CURATED]->(:Collection) )  } as user
  `;

    try {
        const queryRes = await writeService(session, query, { username, collectionName: parseParam(collectionName) });

        const { counters } = queryRes.summary;
        const user = queryRes.records.map((record) => toNativeTypes(record.get("user")));

        if (counters.containsUpdates() && counters.updates().nodesDeleted === 1) {
            return req.login(user[0], (err) => {
                if (err) {
                    res.status(401).json({ msg: "ok" });
                    return;
                }

                res.json({ msg: "ok", user: parseUser(user[0] as unknown as UserSafeProps) });
                return;
            });
        } else {
            res.json({ msg: "not found" });
            return;
        }
    } catch (error) {
        res.status(500).json({ msg: "error occured deleting collection" });
        return;
    }
}
