import { Router } from "express";

const router = Router();

//gets the authenticated user
router.get("/", (req, res) => {
    if (req.isAuthenticated() && req.session?.isPopulated) {
        res.json({ msg: "authenticated", user: req.user });
        return;
    }

    res.status(401).json({ msg: "not authenticated" });
});

export default router;
