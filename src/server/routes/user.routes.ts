import { Router } from "express";
import { createUser, deleteUser, findUser } from "@src/server/handlers/user.handlers";
import passport from "passport";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.get("/:id", async (req, res) => {
    // id sample :/
    const { id } = req.params;
    const formattedId = parseParam(id);
    // const idRegex = /^[0-9A-F-]+$/i;
    const usernameRegex = /^[0-9a-z._]+$/i;
    const emailRegex = /^\S+@\S+\.\S+$/;

    /*
    find by id
     if (idRegex.test(formattedId)) {
         const findRes = await find(formattedId, "id");
         res.json(findRes);
         return;
     }
    */

    //find by user
    if (usernameRegex.test(formattedId)) {
        const findRes = await findUser(formattedId, "name");
        res.json(findRes);
        return;
    }

    //find by email
    if (emailRegex.test(formattedId)) {
        const findRes = await findUser(formattedId, "email");
        res.json(findRes);
        return;
    }

    res.status(404).json({ error: "route not valid" });
});

router.post("/create", createUser);

router.post("/login", function (req, res, next) {
    //call passport authenticate as an iife.
    passport.authenticate("local", { session: false }, (err, user) => {
        function isUsernameExistsErr(err: string): boolean {
            // const test = err.match(/\b(username)\b/gi);
            return /\b(username)\b/gi.test(err);
        }

        if (err) {
            if (typeof err === "string" && (err.toLowerCase() === "password not valid" || isUsernameExistsErr(err))) {
                res.status(400).json({ msg: err });
            } else {
                res.status(500).json({ msg: "login failed", error: (err as Error).name });
            }
            return;
        }

        return req.login(user, (loginErr) => {
            if (loginErr) {
                res.status(401).json({ msg: "authentication failed", error: (loginErr as Error).name });
                return;
            }

            res.json({ msg: "successful" });
            return;
        });
    })(req, res, next);
});

router.put("/update", (req, res) => {
    // const updateData = req.body;
    if (req.isAuthenticated() && req.session?.isPopulated) {
        res.json({ msg: "updated" });
    }

    res.status(401).json({ msg: "unauthenticated" });
});

router.delete("/:username", deleteUser);

export default router;
