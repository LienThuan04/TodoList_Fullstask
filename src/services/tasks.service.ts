import Task from "models/Task.models";

export const createNewTask = async (title: string, description: string, owner: string) => {
    const newTask = new Task({ title, description, owner });
    return await newTask.save();
};
export const getAllTasksByOwner = async (owner: string) => {
    return await Task.find({ owner }).sort({ createdAt: 'desc' }).select('-__v -owner').lean();
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