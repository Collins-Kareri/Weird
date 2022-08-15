import { writeService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { Request, Response } from "express";

export async function publish(req: Request, res: Response) {
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User {name:$username})
    CREATE (img:Image 
        {
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

    if (username.length <= 0 || url.length <= 0) {
        res.status(400).json({ msg: "cannot publish" });
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
