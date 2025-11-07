"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_controller_1 = require("controller/accounts.controller");
const express_1 = require("express");
const jwt_middleware_1 = __importDefault(require("middleware/jwt.middleware"));
const multer_middleware_1 = require("middleware/multer.middleware");
const router = (0, express_1.Router)();
const routesAccounts = (app) => {
    router.get("/infor", accounts_controller_1.GetInfoAccount);
    router.post("/register", accounts_controller_1.CreateAccount);
    router.post("/login", accounts_controller_1.LoginAccount);
    router.post("/avatar", (0, multer_middleware_1.fileUploadAvatar)('avatar', '/avatars'), accounts_controller_1.setAvatar);
    router.get("/avatar", accounts_controller_1.GetImgAvatarAccount);
    app.use("/api/accounts", jwt_middleware_1.default, router);
};
exports.default = routesAccounts;
//# sourceMappingURL=account.Routers.js.map