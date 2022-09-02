import { Request, Response, NextFunction } from "express";

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated() && !req.session?.isPopulated) {
        res.status(401).json({ msg: "unauthenticated" });
        return;
    }
    next();
}

export default requireAuth;
