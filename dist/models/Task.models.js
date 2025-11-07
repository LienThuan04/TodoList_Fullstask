"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    // Reference to the Account that owns/created this task
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId, // Owner is an ObjectId
        ref: 'Account', // Reference to the Account model
        required: true,
        index: true, // Index for faster queries on owner field
    },
    title: {
        type: String, // Title of the task have to be a string
        required: true, // Title is required: cannot be empty
        trim: true, // Remove whitespace from both ends of the string
    },
    description: {
        type: String, // Description of the task have to be a string
        maxLength: 1000, // Maximum length of description is 1000 characters
    },
    status: {
        type: String, // Status of the task have to be a string
        enum: ['active', 'pending', 'in-progress', 'completed'], // Allowed values for status
        default: 'pending', // Default status is 'pending'
    },
    completedAt: {
        type: Date, // completedAt must be a Date
        default: null, // Default value is null
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
const Task = mongoose_1.default.model("Task", taskSchema); // Create a Mongoose model named "Task" using the defined schema
exports.default = Task; // Export the Task model for use in other parts of the application
//# sourceMappingURL=Task.models.js.map