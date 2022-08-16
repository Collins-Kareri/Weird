import { Router } from "express";
import { publish, deleteImgNode } from "@server/handlers/image.handlers";
import { deleteAsset } from "@server/cloudinary";

const router = Router();

router.post("/publish", publish);

router.delete("/:public_id", async (req, res) => {
    const { public_id } = req.body;
    deleteAsset(public_id);
    deleteImgNode(public_id);
    res.json({ msg: "ok" });
});

export default router;
