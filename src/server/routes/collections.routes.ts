import { Router } from "express";
import { createCollection, getCollections, deleteCollection } from "@server/handlers/collection.handlers";
import requireAuth from "@server/middleware/requireAuth";

const router = Router();

//gets the authenticated user
router.get("/:username", getCollections);

router.post("/", requireAuth, createCollection);

// router.post("/:public_id", (req, res) => {
//     //todo add image to a collection
// });

// router.delete("/image/:public_id", (req, res) => {
//     //todo delete image from collection.
// });

router.delete("/:collectionName", requireAuth, deleteCollection);

export default router;
