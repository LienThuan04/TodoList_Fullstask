"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const checkJwt = (req, res, next) => {
    const path = req.path;
    const whitelist = [
        "/login",
        "/register",
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
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" }); // 403 Forbidden for invalid token
            }
            console.log("Decoded JWT Payload:", decoded);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
            }; // Type assertion to User in folder types file index.dt.ts
            next();
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error });
    }
};
exports.default = checkJwt;
//# sourceMappingURL=jwt.middleware.js.map