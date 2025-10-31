import type { Request, Response } from "express";
import Task from "models/Task.models";

export const getAllTasks = async (req: Request, res: Response) => {
  // res.status(200).json({ message: "you have 20 tasks need to be completed", data: [] });
  try {
    const tasks = await Task.find().sort({ createdAt: 'desc' }); // Retrieve all tasks from the database, sorted by creation date in descending order
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", data: [] });
    }
    res.status(200).json({ message: "Tasks retrieved successfully", data: tasks });
  } catch (error) {
    console.error("Error Get All tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error: error });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });// Create a new Task instance with the title and description from the request body
    const savedTask = await newTask.save(); // Save the new task to the database
    res.status(201).json({ message: "Task created successfully", data: savedTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      String(id),
      { title, description, status, completedAt },
      { new: true },// Return value the updated document, not the value original. if set to false, return the document as it was before the update was applied.
    );
    if (!updatedTask) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    } else {
      return res.status(200).json({ message: "Task updated successfully", data: updatedTask });
    }

  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task", error: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(String(id));
    if (!deletedTask) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    } else {
      return res.status(200).json({ message: "Task deleted successfully", data: deletedTask });
      
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task", error: error });
  }
};