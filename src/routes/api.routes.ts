import type { Request, Response, Express } from "express";
import { Router } from "express";

const router = Router();

const routes = (app: Express) => {
    router.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });
    app.use("/api", router);
}


export default routes;