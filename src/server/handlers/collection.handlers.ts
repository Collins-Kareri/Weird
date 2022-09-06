import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@server/neo4j/neo4j.driver";
import { Request, Response } from "express";
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
        MERGE (col:Collection { name: $collectionName })-[rel:CURATED_BY]->(usr)
        ON CREATE 
          SET col.createdAt = dateTime(), col.description = $description
        RETURN rel, SIZE( (col)-[rel]->(user) ) as noOfCollections`;

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

    const query = `MATCH (col:Collection)-[:CURATED_BY]->(usr:User { name: $username })
    CALL {
        WITH col
        OPTIONAL MATCH (col)--(img:Image)
        OPTIONAL MATCH (col)<-[:PARTOF]-(IMG:Image)
        RETURN count(img) as noOfItems, IMG as image ORDER BY IMG.createdAt DESC SKIP 0 LIMIT 1 
    }
    RETURN  SIZE( (:Collection)-[:CURATED_BY]->(usr) ) AS noOfCollections, {name: col.name,
     description: col.description, coverImage: image.secure_url, noOfItems: noOfItems} as collection ORDER BY col.createdAt DESC`;

    try {
        const dbRes = await readService(session, query, { username });

        if (dbRes && dbRes.records[0] && dbRes.records[0].length > 0) {
            const collections = dbRes.records.map((record) => toNativeTypes(record.get("collection")));
            const noOfCollections = dbRes.records[0].get("noOfCollections").toNumber();

            res.json({
                msg: "ok",
                collections,
                noOfCollections,
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

    const query = `MATCH (col:Collection {name: $collectionName })-[:CURATED_BY]->(usr:User { name: $username })
    CALL {
        WITH col
        DETACH DELETE col
    }
    RETURN { id: usr.id, username: usr.name, email: usr.email , 
        public_id: usr.profilePicPublicId, url: usr.profilePicUrl, noOfUploadedImages:  SIZE((usr)-[:UPLOADED]->(:Image)), noOfCollections: SIZE( (:Collection)-[:CURATED_BY]->(usr) )  } as user
  `;

    try {
        const queryRes = await writeService(session, query, { username, collectionName });

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

export async function getImages(req: Request, res: Response) {
    const { collectionName } = req.params;
    const { username, limit, skip } = req.query;
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (col:Collection {name:$collectionName})-[:CURATED_BY]->(usr:User {name:$username})
    MATCH (img:Image)-[:PARTOF]->(col)
    RETURN { public_id:img.public_id, url:img.secure_url } as images ORDER BY img.createdAt DESC SKIP $skip LIMIT $limit`;

    try {
        const dbRes = await readService(session, query, {
            username,
            collectionName,
            limit: parseInt(limit as string, 10),
            skip: parseInt(skip as string, 10),
        });

        if (dbRes.records && dbRes.records[0] && dbRes.records[0].length > 0) {
            const images = dbRes.records.map((record) => toNativeTypes(record.get("images")));
            res.json({ msg: "ok", images });
            return;
        }

        res.json({ msg: "Not found" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error occured fetching images." });
        return;
    }
}

export async function updateCollection(req: Request, res: Response) {
    const { collectionName } = req.params;
    const { name, description } = req.body as { name?: string; description?: string };
    const { username } = req.user as UserSafeProps;
    const driver = getDriver();
    const session = driver.session();
    const query = `MATCH (col:Collection { name:$collectionName })-[:CURATED_BY]->(:User { name:$username })
    SET col.name = $newCollectionName, col.description = $newDescription
    return {collectionName:col.name, description:col.description, noOfItems:SIZE((:Image)-[:PARTOF]->(col))} AS collection`;

    try {
        const dbRes = await writeService(session, query, {
            collectionName,
            username,
            newCollectionName: name,
            newDescription: description,
        });

        if (dbRes.records && dbRes.records[0] && dbRes.records[0].length > 0) {
            const collection = toNativeTypes(dbRes.records[0].get("collection"));
            res.json({ msg: "ok", collection });
            return;
        }

        res.json({ msg: "not updated" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error occurred updating collection." });
    }
}

export async function removeImage(req: Request, res: Response) {
    const { collectionName } = req.params;
    const { public_id } = req.body as { public_id: string };
    const { username } = req.user as UserSafeProps;

    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (col:Collection { name:$collectionName })-[:CURATED_BY]->(:User { name:$username })
    CALL {
        WITH col
        MATCH (Img:Image { public_id:$public_id })-[rel:PARTOF]->(col)
        DELETE rel
    }
    return { collectionName:col.name, description:col.description, noOfItems:SIZE ( (:Image)-[:PARTOF]->(col) ) } as collection`;

    try {
        const dbRes = await writeService(session, query, {
            collectionName,
            username,
            public_id,
        });

        if (dbRes.records && dbRes.records[0] && dbRes.records[0].length > 0) {
            const collection = toNativeTypes(dbRes.records[0].get("collection"));
            res.json({ msg: "ok", collection });
            return;
        }

        res.json({ msg: "fail" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error occurred removing collection." });
    }
}
