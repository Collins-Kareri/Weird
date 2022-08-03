import { writeService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@src/server/neo4j/neo4j.driver";
import { Request, Response } from "express";

export async function publish(req: Request, res: Response) {
    const driver = getDriver();
    const session = driver.session();

    const query = `MATCH (usr:User {name:$username})
    CREATE (img:Image {name,url,createdAt})
    CREATE (img)<-[rel:UPLOADED]-(usr)
    RETURN {imgName:img.name,imgUrl:img.url},rel`;

    if (!req.isAuthenticated() && !req.session?.isPopulated) {
        res.status(401).json({ msg: "login first" });
        return;
    }

    const { username } = req.user as User;
    const { url } = req.body;

    if (username.length <= 0 || url.length <= 0) {
        res.status(400).json({ msg: "cannot publish" });
    }

    try {
        const dbRes = await writeService(session, query, { username, publicUrl: url });

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
