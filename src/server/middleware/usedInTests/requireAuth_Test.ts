import { Request, Response, NextFunction } from "express";

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated() && !req.session?.isPopulated) {
        res.status(401).json({ msg: "unauthenticated" });
        return;
    }

    if ((req.user as UserSafeProps).username === "Eino.Grimes92") {
        next();
    } else {
        res.status(401).json({ msg: "unauthorized" });
        return;
    }
}

export default requireAuth;
