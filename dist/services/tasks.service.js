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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskIsOwner = exports.deleteTaskById = exports.updateTaskById = exports.getAllTasksByOwner = exports.createNewTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Task_models_1 = __importDefault(require("models/Task.models"));
const createNewTask = (title, description, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = new Task_models_1.default({ title, description, owner });
    return yield newTask.save();
});
exports.createNewTask = createNewTask;
const getAllTasksByOwner = (owner, startDate) => __awaiter(void 0, void 0, void 0, function* () {
    // ensure owner is an ObjectId when stored as ObjectId in the Task schema
    const ownerId = new mongoose_1.default.Types.ObjectId(owner);
    const queryDateFilter = startDate ? { createdAt: { $gte: startDate } } : {};
    const result = yield Task_models_1.default.aggregate([
        { $match: Object.assign({ owner: ownerId }, queryDateFilter) },
        {
            $facet: {
                tasks: [
                    { $sort: { createdAt: -1 } },
                    { $project: { title: 1, description: 1, status: 1, completedAt: 1, createdAt: 1, updatedAt: 1 } }
                ],
                pending: [{ $match: { status: "pending" } }, { $count: "count" }],
                activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                inProgressCount: [{ $match: { status: "in-progress" } }, { $count: "count" }],
                completedCount: [{ $match: { status: "completed" } }, { $count: "count" }],
            }
        }
    ]);
    return result && result.length > 0 ? result[0] : { tasks: [], pending: [], activeCount: [], inProgressCount: [], completedCount: [] };
});
exports.getAllTasksByOwner = getAllTasksByOwner;
const updateTaskById = (id, updateData, owner) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Task_models_1.default.findOneAndUpdate({ _id: id, owner }, updateData, { new: true });
});
exports.updateTaskById = updateTaskById;
const deleteTaskById = (id, owner) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Task_models_1.default.findOneAndDelete({ _id: id, owner });
});
exports.deleteTaskById = deleteTaskById;
const TaskIsOwner = (taskId, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_models_1.default.findOne({ _id: taskId, owner: ownerId });
    return !!task; // Return true if task exists, false otherwise
});
exports.TaskIsOwner = TaskIsOwner;
//# sourceMappingURL=tasks.service.js.map