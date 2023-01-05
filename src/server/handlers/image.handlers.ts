import { writeService, readService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@server/neo4j/neo4j.driver";
import { toNativeTypes } from "@serverUtils/neo4j.utils";
import { Request, Response } from "express";
import { updateImage } from "@server/cloudinary";
import { addImageDataToDb } from "@server/neo4j/neo4j.handlers";

/**
 * Creates image node in neo4j db
 * @param  {Request} req
 * @param  {Response} res
 */
export async function publish(req: Request, res: Response) {
    const { username } = req.user as User;
    const { public_id, asset_id, url, secure_url } = req.body;

    if (username.length <= 0 || (url && url.length <= 0)) {
        res.status(400).json({ msg: "cannot publish" });
        return;
    }

    try {
        const result = await addImageDataToDb({ username, public_id, asset_id, url, secure_url });
        res.status(201).json({ msg: "published", user: result });
        return;
    } catch (error) {
        res.status(500).json({ msg: "failed" });
        return;
    }
}

/**
 * Deletes image from neo4j using public_id
 * @param  {string} public_id
 */
export async function deleteImgNode(public_id: string, username: string) {
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User {name:$username})-[:UPLOADED]->(img:Image {public_id:$public_id})
    CALL{
        WITH img
        DETACH DELETE img
    }
    RETURN { id: usr.id, username: usr.name, email: usr.email , 
        public_id: usr.profilePicPublicId, url: usr.profilePicUrl, noOfUploadedImages:  SIZE((usr)-[:UPLOADED]->(:Image)), noOfCollections: SIZE( (:Collection)-[:CURATED_BY]->(usr) )  } as user`;

    try {
        const dbRes = await writeService(session, query, { public_id, username });
        const nodesDeleted = dbRes.summary.counters.updates().nodesDeleted;
        const relationshipsDeleted = dbRes.summary.counters.updates().relationshipsDeleted;

        if (nodesDeleted === 1 && relationshipsDeleted === 1) {
            let user;
            if (dbRes.records && dbRes.records[0]) {
                user = dbRes.records[0].get("user");
            }
            return user ? toNativeTypes(user) : "ok";
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

export async function getAllImages(req: Request, res: Response) {
    const { skip, limit } = req.query;

    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (img:Image)-[:UPLOADED]-(usr:User)
    RETURN { url: img.secure_url, public_id: img.public_id,user:{name:usr.name,profilePic:usr.profilePicUrl} } as image ORDER BY img.createdAt DESC SKIP $skip LIMIT $limit`;

    try {
        const readRes = await readService<{ skip: number; limit: number }>(session, query, {
            skip: parseInt(skip as string, 10),
            limit: parseInt(limit as string, 10),
        });

        if (readRes.records && readRes.records[0] && readRes.records[0].length > 0) {
            res.json({ msg: "found", images: readRes.records.map((record) => toNativeTypes(record.get("image"))) });
            return;
        }

        return res.json({ msg: "no images found" });
    } catch (error) {
        return res.status(500).json({ msg: "can't read images" });
    }
}

export async function getUsersImages(req: Request, res: Response) {
    const { username } = req.params;
    const { skip, limit } = req.query;

    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH ( usr:User { name:$username } )-[:UPLOADED]->( img:Image )
    RETURN { url: img.secure_url, public_id: img.public_id, user:{name:usr.name,profilePic:usr.profilePicUrl} } as image ORDER BY img.createdAt DESC SKIP $skip LIMIT $limit`;

    try {
        const readRes = await readService<{ username: string; skip: number; limit: number }>(session, query, {
            username,
            skip: parseInt(skip as string, 10),
            limit: parseInt(limit as string, 10),
        });

        if (readRes.records && readRes.records[0] && readRes.records[0].length > 0) {
            res.json({ msg: "found", images: readRes.records.map((record) => toNativeTypes(record.get("image"))) });
            return;
        }

        return res.json({ msg: "no images found" });
    } catch (error) {
        return res.status(500).json({ msg: "can't read images" });
    }
}

export async function updateUserImages(req: Request, res: Response) {
    const { public_id } = req.params;
    const { tags, description } = req.body as { tags: string[]; description: string };

    if (tags.length <= 0) {
        res.status(400).json({ msg: "cannot update." });
    }

    let uploadData;
    if (description) {
        uploadData = { context: `alt=${description}`, tags };
    } else {
        uploadData = { tags };
    }

    try {
        const { tags, description } = (await updateImage(public_id.replace("_", "/") as string, uploadData)) as {
            tags?: string;
            description?: string;
        };
        res.json({
            msg: "ok",
            imgData: {
                tags: tags ? tags : [],
                description: description ? description : "",
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "couldn't update image." });
    }
}
