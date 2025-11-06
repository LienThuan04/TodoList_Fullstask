import mongoose from 'mongoose';
import Task from "models/Task.models";

export const createNewTask = async (title: string, description: string, owner: string) => {
    const newTask = new Task({ title, description, owner });
    return await newTask.save();
};
export const getAllTasksByOwner = async (owner: string, startDate: Date | null): Promise<{ tasks: any[], pending: any[], activeCount: any[], inProgressCount: any[], completedCount: any[] }> => {
    // ensure owner is an ObjectId when stored as ObjectId in the Task schema
    const ownerId = new mongoose.Types.ObjectId(owner);
    const queryDateFilter = startDate ? { createdAt: { $gte: startDate } } : {};
    const result = await Task.aggregate([
        { $match: { owner: ownerId, ...queryDateFilter } },
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
    return result && result.length > 0 ? result[0] : { tasks: [], pending: [] , activeCount: [], inProgressCount: [], completedCount: [] };
};

export const updateTaskById = async (id: string, updateData: { title?: string; description?: string; status?: string; completedAt?: Date }, owner: string) => {
    return await Task.findOneAndUpdate(
        { _id: id, owner },
        updateData,
        { new: true }, // Return the updated document
    );
}
export const deleteTaskById = async (id: string, owner: string) => {
    return await Task.findOneAndDelete({ _id: id, owner });
};

export const TaskIsOwner = async (taskId: string, ownerId: string): Promise<boolean> => {
    const task = await Task.findOne({ _id: taskId, owner: ownerId });
    return !!task; // Return true if task exists, false otherwise
};