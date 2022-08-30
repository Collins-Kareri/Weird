import { Router } from "express";
import { publish, deleteImgNode, deleteProfileImage, getUsersImages } from "@server/handlers/image.handlers";
import { deleteAsset, generateSignature } from "@server/cloudinary";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.get("/signature/:upload_preset", (req, res) => {
    const { upload_preset } = req.params;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { public_id } = req.user as UserSafeProps;
        const signature = generateSignature(parseParam(upload_preset), { public_id });

        if (typeof signature === "string") {
            res.json({ msg: signature });
            return;
        }

        res.json({ msg: "ok", ...signature });

        return;
    }

    res.status(401).json({ msg: "unauthenticated" });
});

router.get("/:username", async (req, res) => {
    //get images uploaded by user
    const { username } = req.params;
    const { skip, limit } = req.query;
    if ((skip && limit) || skip) {
        const limitVal = typeof limit === "undefined" ? undefined : parseInt(limit as string, 10);

        const images = await getUsersImages(parseParam(username), parseInt(skip as string, 10), limitVal);

        if (images.msg.includes("no")) {
            res.json({ ...images });
        } else if (images.msg.includes("can't")) {
            res.status(500).json({ ...images });
        } else {
            res.json({ ...images });
        }

        return;
    }

    res.status(400).json({ msg: "invalid request" });
    return;
});

router.post("/publish", publish);

router.post("/signature/:upload_preset", (req, res) => {
    const { upload_preset } = req.params;
    const extraParams = req.body;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { public_id } = req.user as UserSafeProps;

        const signature = generateSignature(parseParam(upload_preset), { public_id, ...extraParams });

        if (typeof signature === "string") {
            res.json({ msg: signature });
            return;
        }

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

router.delete("/profileImage/delete", async (req, res) => {
    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { id, public_id } = req.user as UserSafeProps;

        const deleteRes: [UserSafeProps | undefined, string] = await Promise.all([
            deleteProfileImage(id),
            deleteAsset(public_id),
        ]);

        if (typeof deleteRes[0] === "undefined" || deleteRes[1] === "failed") {
            res.status(500).json({ msg: "fail" });
        } else {
            req.login(deleteRes[0], (loginErr) => {
                if (loginErr) {
                    res.status(401).json({ msg: "authentication failed", error: (loginErr as Error).name });
                    return;
                }

                res.json({ msg: "ok", user: deleteRes[0] });
                return;
            });
            return;
        }

        return;
    }

    res.status(401).json({ msg: "unauthenticated." });
});

export default router;
