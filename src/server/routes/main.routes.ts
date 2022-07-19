import { Router } from "express";
import userRoutes from "@src/server/routes/user.routes";

const router = Router();

router.use("/user", userRoutes);

router.get("/ping", (req, res) => {
    res.status(200).json({ msg: "active" });
});

export default router;
