import { Router } from "express";
import { publish, deleteImgNode } from "@server/handlers/image.handlers";
import { deleteAsset, generateSignature } from "@server/cloudinary";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.get("/signature/:upload_preset", (req, res) => {
    const { upload_preset } = req.params;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { public_id } = req.user as UserSafeProps;

        const signature = generateSignature(parseParam(upload_preset), public_id);

        res.json({ msg: "ok", ...signature });

        return;
    }

    res.status(401).json({ msg: "unauthenticated" });
});

router.post("/publish", publish);

router.post("/signature/:upload_preset", (req, res) => {
    const { upload_preset } = req.params;
    const extraParams = req.body;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { public_id } = req.user as UserSafeProps;

        const signature = generateSignature(parseParam(upload_preset), public_id, extraParams);

        res.json({ msg: "ok", ...signature });

        return;
    }
});

router.delete("/:public_id", async (req, res) => {
    const { public_id } = req.params;

    const parsedId = parseParam(public_id).replace(/_/g, "/");

    Promise.all([deleteAsset(parsedId), deleteImgNode(parsedId)])
        .then(() => {
            res.json({ msg: "ok" });
        })
        .catch(() => {
            res.status(500).json({ msg: "fail" });
        });
});

export default router;
