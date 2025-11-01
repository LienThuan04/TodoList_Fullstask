import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "types/index.dt";

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const whitelist = [
        "/api/accounts/login",
        "/api/accounts/register",
    ];
    const isWhitelisted = whitelist.includes(path);
    console.log("Request Path:", path, "Is Whitelisted:", isWhitelisted);
    if (isWhitelisted) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
    try {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" }); // 403 Forbidden for invalid token
            }
            console.log("Decoded JWT Payload:", decoded);
            req.user = {
                id: (decoded as any).id,
                email: (decoded as any).email,
                username: (decoded as any).username
            } as User; // Type assertion to User in folder types file index.dt.ts
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error });
    }
};

export default checkJwt;
