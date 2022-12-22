import { Router } from "express";
import node_fetch from "node-fetch";
import "dotenv/config";

const router = Router();

async function fetchWrapper(url: string) {
    return new Promise((resolve, reject) => {
        node_fetch(url)
            .then((result) => result.json())
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });
}

router.get("/list", async (req, res) => {
    const my_url = `https://api.unsplash.com/photos?page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

    try {
        const results = await fetchWrapper(my_url);
        res.json({ results });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

router.get("/search", async (req, res) => {
    const terms = req.query.terms;
    const my_url = `https://api.unsplash.com/photos?query=${terms}&page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

    try {
        const results = await fetchWrapper(my_url);
        res.json({ results });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

export default router;
