import { Router } from "express";

const router = Router();

//gets the authenticated user
router.get("/", (req, res) => {
    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { profilePicPublicId, profilePicUrl } = req.user as UserSafeProps;
        let user;

        if (profilePicPublicId && profilePicUrl) {
            user = { profilePic: { public_id: profilePicPublicId, url: profilePicUrl }, ...req.user };
        } else {
            user = req.user;
        }

        res.json({ msg: "authenticated", user });
        return;
    }

    res.status(401).json({ msg: "not authenticated" });
});

export default router;
