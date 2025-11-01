import type { Request, Response, Express } from "express";
import { Router } from "express";
import { createTask, deleteTask, getAllTasks, updateTask } from "controller/tasks.controller";
import checkJwt from "middleware/jwt.middleware";

const router = Router();

const routesTasks = (app: Express) => {
  router.get("/", getAllTasks);
  router.post("/", createTask);
  router.put("/:id", updateTask);
  router.delete("/:id", deleteTask);

  app.use("/api/tasks", checkJwt, router);
};


export default routesTasks;