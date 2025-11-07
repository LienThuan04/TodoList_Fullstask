"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = require("controller/tasks.controller");
const jwt_middleware_1 = __importDefault(require("middleware/jwt.middleware"));
const router = (0, express_1.Router)();
const routesTasks = (app) => {
    router.get("/", tasks_controller_1.getAllTasks);
    router.post("/", tasks_controller_1.createTask);
    router.put("/:id", tasks_controller_1.updateTask);
    router.delete("/:id", tasks_controller_1.deleteTask);
    app.use("/api/tasks", jwt_middleware_1.default, router);
};
exports.default = routesTasks;
//# sourceMappingURL=tasksRouters.js.map