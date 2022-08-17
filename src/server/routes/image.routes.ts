import { Router } from "express";
import { publish, deleteImgNode } from "@server/handlers/image.handlers";
import { deleteAsset } from "@server/cloudinary";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.post("/publish", publish);

router.delete("/:public_id", async (req, res) => {
    const { public_id } = req.params;

    const parsedId = parseParam(public_id);

    Promise.all([deleteAsset(parsedId), deleteImgNode(parsedId)])
        .then(() => {
            res.json({ msg: "ok" });
        })
        .catch(() => {
            res.status(500).json({ msg: "fail" });
        });
});

export default router;
