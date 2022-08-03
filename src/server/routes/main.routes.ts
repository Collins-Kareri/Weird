import { Router } from "express";
import userRoutes from "@server/routes/user.routes";
import authRoutes from "@server/routes/auth.routes";
import imageRoutes from "@server/routes/image.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/image", imageRoutes);

router.get("/ping", (req, res) => {
    res.status(200).json({ msg: "active" });
});

export default router;
