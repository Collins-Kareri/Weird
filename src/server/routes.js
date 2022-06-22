import { Router } from "express";
const router = Router();

router.get("/ping", (req, res) => {
    res.status(200).json({ msg: "active" });
});

export default router;