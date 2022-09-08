import { Router } from "express";
import {
    publish,
    deleteImgNode,
    deleteProfileImage,
    getUsersImages,
    updateUserImages,
} from "@server/handlers/image.handlers";
import { deleteAsset, generateSignature, getImageData } from "@server/cloudinary";
import requireAuth from "@server/middleware/requireAuth";
import parseParams from "@server/middleware/parseParam";

const router = Router();

interface AuthenticatedUser extends Omit<UserSafeProps, "public_id" | "url"> {
    profilePic: {
        public_id: string;
        url: string;
    };
}

router.get("/signature/:upload_preset", requireAuth, parseParams, (req, res) => {
    const { upload_preset } = req.params;

    const { public_id } = req.user as UserSafeProps;
    const signature = generateSignature(upload_preset, { public_id });

    if (typeof signature === "string") {
        res.json({ msg: signature });
        return;
    }

    res.json({ msg: "ok", ...signature });

    return;
});

router.get("/:username", parseParams, getUsersImages);

router.get("/data/:public_id", parseParams, async (req, res) => {
    //todo get image data from cloudinary
    const { public_id } = req.params;
    try {
        const { tags, description } = (await getImageData(public_id.replace(/_/g, "/"))) as {
            tags?: string[];
            description?: string;
        };

        res.json({ msg: "ok", imgData: { tags: tags ? tags : [], description: description ? description : "" } });
    } catch (error) {
        res.status(500).json({ msg: "could not get image data." });
    }
});

router.post("/publish", requireAuth, publish);

router.post("/signature/:upload_preset", requireAuth, parseParams, (req, res) => {
    const { upload_preset } = req.params;
    const extraParams = req.body;

    const { public_id } = req.user as UserSafeProps;

    const signature = generateSignature(upload_preset, { public_id, ...extraParams });

    if (typeof signature === "string") {
        res.json({ msg: signature });
        return;
    }

    res.json({ msg: "ok", ...signature });

    return;
});

router.put("/data/:public_id", requireAuth, parseParams, updateUserImages);

router.delete("/:public_id", requireAuth, parseParams, async (req, res) => {
    const { public_id } = req.params;
    const { username } = req.user as UserSafeProps;
    const parsedId = public_id.replace(/_/g, "/");

    Promise.all([deleteAsset(parsedId), deleteImgNode(parsedId, username)])
        .then((result) => {
            if (typeof result[1] !== "string") {
                return req.login(result[1], (err) => {
                    if (err) {
                        res.json({ msg: "ok", user: result[1] });
                        return;
                    }
                    res.json({ msg: "ok", user: result[1] });
                    return;
                });
            }
            res.json({ msg: "ok" });
            return;
        })
        .catch(() => {
            res.status(500).json({ msg: "fail" });
        });
});

router.delete("/profileImage/delete", requireAuth, async (req, res) => {
    const { id, profilePic } = req.user as AuthenticatedUser;
    const deleteRes: [UserSafeProps | undefined, string] = await Promise.all([
        deleteProfileImage(id),
        deleteAsset(profilePic.public_id),
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
});

export default router;
