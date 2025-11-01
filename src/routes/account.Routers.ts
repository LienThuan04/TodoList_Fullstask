import { CreateAccount, LoginAccount } from "controller/accounts.controller";
import type { Express } from "express";
import { Router } from "express";

const router = Router();
const routesAccounts = (app: Express) => {
    router.post("/register", CreateAccount);
    router.post("/login", LoginAccount);
    app.use("/api/accounts", router);
};

export default routesAccounts;