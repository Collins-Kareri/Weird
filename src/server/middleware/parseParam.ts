import { Request, Response, NextFunction } from "express";

/**
 * Remove : from params
 * @param req
 * @param res
 * @param next
 * @returns
 */
function parseParams(req: Request, res: Response, next: NextFunction) {
    const keys = Object.keys(req.params);
    req.params;
    if (keys.length > 0) {
        const newParams = req.params;

        keys.forEach((key) => {
            const value = req.params[key];
            newParams[key] = value.replace(":", "");
            value.replace(":", ""), key;
        });

        req.params = newParams;
        next();
        return;
    }

    next();
}

export default parseParams;
