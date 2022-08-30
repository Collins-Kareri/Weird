import { Router } from "express";
import { createUser, deleteUser, findUser, updateUser } from "@server/handlers/user.handlers";
import passport from "passport";
import parseParam from "@serverUtils/parseParam";

const router = Router();

router.get("/:username", async (req, res) => {
    // id sample :/
    const { username } = req.params;
    const formattedId = parseParam(username);

    const findRes = await findUser(formattedId);

    if (findRes.msg === "can't find user") {
        res.status(500).json(findRes);
        return;
    }

    res.json(findRes);
    return;
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

router.put("/update", async (req, res) => {
    const newUserData = req.body;

    if (req.isAuthenticated() && req.session?.isPopulated) {
        const { id } = req.user as UserSafeProps;

        const updatedUserData = await updateUser(newUserData, id);

        if (typeof updatedUserData === "undefined") {
            res.status(500).json({ msg: "failed" });
            return;
        }

        req.login(updatedUserData, (loginErr) => {
            if (loginErr) {
                res.status(401).json({ msg: "authentication failed", error: (loginErr as Error).name });
                return;
            }

            res.json({ msg: "successful", user: updatedUserData });
            return;
        });

        return;
    }

    res.status(401).json({ msg: "unauthenticated" });
});

router.delete("/:username", deleteUser);

export default router;
