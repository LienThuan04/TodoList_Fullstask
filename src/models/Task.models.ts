import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        // Reference to the Account that owns/created this task
        owner: {
            type: mongoose.Schema.Types.ObjectId, // Owner is an ObjectId
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
        status:{
            type: String, // Status of the task have to be a string
            enum: ['active', 'pending', 'in-progress', 'completed'], // Allowed values for status
            default: 'pending', // Default status is 'pending'
        },
        completedAt: {
            type: Date, // completedAt must be a Date
            default: null, // Default value is null
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    },
);

const Task = mongoose.model("Task", taskSchema); // Create a Mongoose model named "Task" using the defined schema
export default Task; // Export the Task model for use in other parts of the application