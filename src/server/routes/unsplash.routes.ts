import { Router } from "express";
import node_fetch from "node-fetch";
import "dotenv/config";

const router = Router();
// const node_fetch = (url: RequestInfo, init?: RequestInit) =>
//     import("node-fetch").then(({ default: fetch }) => fetch(url, init));

router.get("/list", (req, res) => {
    node_fetch(`https://api.unsplash.com/photos?page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`)
        .then((result) => result.json())
        .then((result) => res.json(result))
        .catch((error) => res.status(500).json({ msg: error }));
});

export default router;
