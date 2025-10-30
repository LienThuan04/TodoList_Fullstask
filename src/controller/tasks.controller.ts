import { Request, Response } from "express";

export const getAllTasks = (req: Request, res: Response) => {
  res.status(200).json({ message: "you have 20 tasks need to be completed", data: [] });
};

export const createTask = (req: Request, res: Response) => {
  res.status(201).json({ message: "Task created successfully", data: req.body });
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({ message: `Task with id ${id} updated successfully`, data: req.body });
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({ message: `Task with id ${id} deleted successfully` });
};