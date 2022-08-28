import { Router } from "express";

const router = Router();

//gets the authenticated user
router.get("/", (req, res) => {
    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { public_id, url, ...others } = req.user as UserSafeProps;

        let user;

        if (public_id && url) {
            user = { profilePic: { public_id, url }, ...others };
        } else {
            user = others;
        }

        res.json({ msg: "authenticated", user });
        return;
    }

    res.status(401).json({ msg: "not authenticated" });
});

export default router;
