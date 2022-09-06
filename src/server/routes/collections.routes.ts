import { Router } from "express";
import {
    createCollection,
    getCollections,
    deleteCollection,
    getImages,
    updateCollection,
    removeImage,
} from "@server/handlers/collection.handlers";
import requireAuth from "@server/middleware/requireAuth";
import parseParams from "@server/middleware/parseParam";

const router = Router();

//gets the authenticated user
router.get("/:username", parseParams, getCollections);

router.get("/images/:collectionName", parseParams, getImages);

router.put("/:collectionName", requireAuth, parseParams, updateCollection);

router.post("/", requireAuth, createCollection);

// router.post("/:public_id", (req, res) => {
//     //todo add image to a collection
// });

// router.delete("/image/:public_id", (req, res) => {
//     //todo delete image from collection.
// });

router.delete("/:collectionName", requireAuth, parseParams, deleteCollection);

router.delete("/image/:collectionName", requireAuth, parseParams, removeImage);

export default router;
