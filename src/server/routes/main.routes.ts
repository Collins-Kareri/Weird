import { Router } from "express";
import userRoutes from "@server/routes/user.routes";
import authRoutes from "@server/routes/auth.routes";
import imageRoutes from "@server/routes/image.routes";
import collectionRoutes from "@server/routes/collections.routes";
import testRoutes from "@server/routes/routesForTests/test.routes";
import unsplashRoutes from "@server/routes/unsplash.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/image", imageRoutes);
router.use("/collection", collectionRoutes);
router.use("/test", testRoutes);
router.use("/unsplash", unsplashRoutes);

router.get("/ping", (req, res) => {
    res.status(200).json({ msg: "active" });
});

export default router;
