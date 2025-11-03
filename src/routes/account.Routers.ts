import { CreateAccount, GetInfoAccount, LoginAccount } from "controller/accounts.controller";
import type { Express } from "express";
import { Router } from "express";
import checkJwt from "middleware/jwt.middleware";

const router = Router();
const routesAccounts = (app: Express) => {
    router.get("/infor",checkJwt , GetInfoAccount);
    router.post("/register", CreateAccount);
    router.post("/login", LoginAccount);
    app.use("/api/accounts", router);
};

export default routesAccounts;