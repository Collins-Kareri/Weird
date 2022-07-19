import { NextFunction, Request, Response, Router } from "express";
import { create } from "@src/server/handlers/user.handlers";
import passport from "passport";

const router = Router();

router.post("/create", create);

router.post("/login", passport.authenticate("local", { failureMessage: true }), (req, res) => {
    res.json({ msg: "login successful" });
});

router.get("/:id", (req, res) => {
    res.json({ name: "hello", email: "mail" });
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err);
        res.status(401).json({ msg: "failed to authenticate user" });
    }
});

export default router;
