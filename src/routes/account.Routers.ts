import { CreateAccount } from "controller/accounts.controller";
import type { Express } from "express";
import { Router } from "express";

const router = Router();
const routesAccounts = (app: Express) => {
    router.post("/", CreateAccount);
    app.use("/api/accounts", router);
};

export default routesAccounts;