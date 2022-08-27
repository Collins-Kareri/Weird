import { Router } from "express";
import { publish, deleteImgNode } from "@server/handlers/image.handlers";
import { deleteAsset, generateSignature } from "@server/cloudinary";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.get("/signature/:upload_preset", (req, res) => {
    const { upload_preset } = req.params;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const signature = generateSignature(parseParam(upload_preset));

        res.json({ msg: "ok", ...signature });
        return;
    }

    res.status(401).json({ msg: "unauthenticated" });
});

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
