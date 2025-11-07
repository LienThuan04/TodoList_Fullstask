"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = void 0;
const tasks_service_1 = require("services/tasks.service");
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { filterDate = 'all_time' } = req.query;
    const now = new Date();
    let startDate = null;
    switch (filterDate) {
        case 'today':
            {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 11/08/2024 00:00:00
                break;
            }
            ;
        case 'this_week':
            {
                const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
                startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate); // Set to the most recent Monday
                break;
            }
            ;
        case 'this_month':
            {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            }
            ;
        case 'this_year':
            {
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            }
            ;
        case 'all_time':
        default:
            {
                startDate = null; // No date filtering
                break;
            }
            ;
    }
    ;
    try {
        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized: No owner ID found" });
        }
        const tasks = yield (0, tasks_service_1.getAllTasksByOwner)(ownerId, startDate);
        if (!tasks || !tasks.tasks || tasks.tasks.length === 0) {
            return res.status(200).json({ message: "No tasks found", data: { tasks: [], pending: 0, activeCount: 0, inProgressCount: 0, completedCount: 0 } });
        }
        console.log('user:', req.user);
        // Normalize counts returned by aggregation facet: empty arrays mean 0
        const pendingCount = (_d = (_c = (_b = tasks.pending) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
        const activeCount = (_g = (_f = (_e = tasks.activeCount) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.count) !== null && _g !== void 0 ? _g : 0;
        const inProgressCount = (_k = (_j = (_h = tasks.inProgressCount) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.count) !== null && _k !== void 0 ? _k : 0;
        const completedCount = (_o = (_m = (_l = tasks.completedCount) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.count) !== null && _o !== void 0 ? _o : 0;
        res.status(200).json({
            message: "Tasks retrieved successfully",
            data: { tasks: tasks.tasks, pendingCount, activeCount, inProgressCount, completedCount }
        });
    }
    catch (error) {
        console.error("Error Get All tasks:", error);
        res.status(500).json({ message: "Error retrieving tasks", error: error });
    }
});
exports.getAllTasks = getAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description } = req.body;
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized: No owner ID found" });
        }
        const savedTask = yield (0, tasks_service_1.createNewTask)(title, description, ownerId);
        if (!savedTask) {
            throw new Error("Task creation failed");
        }
        res.status(201).json({ message: "Task created successfully", data: savedTask });
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, status, completedAt } = req.body;
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized: No owner ID found" });
        }
        const taskExists = yield (0, tasks_service_1.TaskIsOwner)(id, ownerId);
        if (!taskExists) {
            return res.status(403).json({ message: "Forbidden: You do not own this task" });
        }
        const updatedTask = yield (0, tasks_service_1.updateTaskById)(id, { title, description, status, completedAt }, ownerId);
        if (!updatedTask) {
            return res.status(404).json({ message: `Update failed: Task with id ${id} not found or not owned by user` });
        }
        else {
            return res.status(200).json({ message: "Task updated successfully", data: updatedTask });
        }
    }
    catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Error updating task", error: error });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized: No owner ID found" });
        }
        const taskExists = yield (0, tasks_service_1.TaskIsOwner)(id, ownerId);
        if (!taskExists) {
            return res.status(403).json({ message: "Forbidden: You do not own this task" });
        }
        const deletedTask = yield (0, tasks_service_1.deleteTaskById)(id, ownerId);
        if (!deletedTask) {
            return res.status(404).json({ message: `Delete failed: Task with id ${id} not found or not owned by user` });
        }
        else {
            return res.status(200).json({ message: "Task deleted successfully", data: deletedTask });
        }
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Error deleting task", error: error });
    }
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=tasks.controller.js.map