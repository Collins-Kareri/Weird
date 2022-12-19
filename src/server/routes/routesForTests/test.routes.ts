import { Router } from "express";
import requireAuth from "@server/middleware/usedInTests/requireAuth_Test";
import { uploadImage } from "@server/cloudinary";
import { addImageDataToDb } from "@server/neo4j/neo4j.handlers";

const route = Router();

route.post("/upload_img", requireAuth, async (req, res) => {
    try {
        const { public_id, secure_url, url, imagePath, asset_id } = req.body;
        const { username } = req.user as UserSafeProps;
        const results = await Promise.all([
            uploadImage({ public_id: public_id.split("/")[1], imagePath }),
            addImageDataToDb({ public_id, asset_id, url, secure_url, username }),
        ]);

        res.json({ msg: "success", public_id: results[0] });
        return;
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
});

export default route;
