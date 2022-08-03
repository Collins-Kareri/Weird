import { Router } from "express";
import { publish } from "@server/handlers/image.handlers";

const router = Router();

router.post("/publish", publish);

export default router;
