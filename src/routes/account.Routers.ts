import { CreateAccount, GetImgAvatarAccount, GetInfoAccount, LoginAccount, setAvatar } from "controller/accounts.controller";
import type { Express } from "express";
import { Router } from "express";
import checkJwt from "middleware/jwt.middleware";
import { fileUploadAvatar } from "middleware/multer.middleware";

const router = Router();
const routesAccounts = (app: Express) => {
    router.get("/infor", GetInfoAccount);
    router.post("/register", CreateAccount);
    router.post("/login", LoginAccount);
    router.post("/avatar", fileUploadAvatar('avatar', '/avatars'), setAvatar);
    router.get("/avatar", GetImgAvatarAccount);
    app.use("/api/accounts", checkJwt, router);
};

export default routesAccounts;