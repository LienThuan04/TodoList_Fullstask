import type { Request, Response } from "express";
import { createNewTask, deleteTaskById, getAllTasksByOwner, TaskIsOwner, updateTaskById } from "services/tasks.service";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized: No owner ID found" });
    }
    const tasks = await getAllTasksByOwner(ownerId);
    if (!tasks || !tasks.tasks || tasks.tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", data: { tasks: [], pending: 0, activeCount: 0, inProgressCount: 0, completedCount: 0 } });
    }
    console.log('user:', req.user);

    // Normalize counts returned by aggregation facet: empty arrays mean 0
    const pendingCount: number = tasks.pending?.[0]?.count ?? 0;
    const activeCount: number = tasks.activeCount?.[0]?.count ?? 0;
    const inProgressCount: number = tasks.inProgressCount?.[0]?.count ?? 0;
    const completedCount: number = tasks.completedCount?.[0]?.count ?? 0;

    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: { tasks: tasks.tasks, pendingCount, activeCount, inProgressCount, completedCount }
    });
  } catch (error) {
    console.error("Error Get All tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error: error });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized: No owner ID found" });
    }
    const savedTask = await createNewTask(title, description, ownerId);
    if (!savedTask) {
      throw new Error("Task creation failed");
    }
    res.status(201).json({ message: "Task created successfully", data: savedTask });
  } catch (error: any) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, completedAt } = req.body;
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized: No owner ID found" });
    }
    const taskExists = await TaskIsOwner(id, ownerId);
    if (!taskExists) {
      return res.status(403).json({ message: "Forbidden: You do not own this task" });
    }
    const updatedTask = await updateTaskById(id, { title, description, status, completedAt }, ownerId);
    if (!updatedTask) {
      return res.status(404).json({ message: `Update failed: Task with id ${id} not found or not owned by user` });
    } else {
      return res.status(200).json({ message: "Task updated successfully", data: updatedTask });
    }

  } catch (error: any) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task", error: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized: No owner ID found" });
    }
    const taskExists = await TaskIsOwner(id, ownerId);
    if (!taskExists) {
      return res.status(403).json({ message: "Forbidden: You do not own this task" });
    }
    const deletedTask = await deleteTaskById(id, ownerId);
    if (!deletedTask) {
      return res.status(404).json({ message: `Delete failed: Task with id ${id} not found or not owned by user` });
    } else {
      return res.status(200).json({ message: "Task deleted successfully", data: deletedTask });
      
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task", error: error });
  }
};