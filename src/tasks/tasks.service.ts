import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '@/tasks/schema/task.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}


  async create(createTaskDto: CreateTaskDto, userId: string) {
    const newTask: Task = {
      ...createTaskDto,
      ownerId: new Types.ObjectId(userId),
      description: createTaskDto.description ?? null,
    };
    const createdTask = await this.taskModel.create(newTask);
    if (!createdTask){
      throw new Error('Failed to create task');
    }
    return createdTask;
  }

  async findAllTasksByOwnerId(ownerId: string, startDate: Date | null): Promise<{ tasks: Task[]; counts: { pending: number; active: number; inProgress: number; completed: number; total: number } }> {
    const ownerIdObj = new Types.ObjectId(ownerId);
    const queryDateFilter = startDate ? { createdAt: { $gte: startDate } } : {};
    const results = await this.taskModel.aggregate([
      { $match: { ownerId: ownerIdObj, ...queryDateFilter } },
      {
        $facet: { // Faceted Search to get tasks and counts in one query
          task: [
            { $sort: { createdAt: -1 } },
            { $project: { title: 1, description: 1, status: 1, completedAt: 1, createdAt: 1, updatedAt: 1 } }
          ],
          pendingCount: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          activeCount: [{ $match: { status: 'active' } }, { $count: 'count' }],
          inProgressCount: [{ $match: { status: 'in-progress' } }, { $count: 'count' }],
          completedCount: [{ $match: { status: 'completed' } }, { $count: 'count' }],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ]);
    return results && results.length > 0 ? {
      tasks: results[0]?.task,
      counts: {
        pending: results[0]?.pendingCount[0]?.count || 0,
        active: results[0]?.activeCount[0]?.count || 0,
        inProgress: results[0]?.inProgressCount[0]?.count || 0,
        completed: results[0]?.completedCount[0]?.count || 0,
        total: results[0]?.totalCount[0]?.count || 0,
      }
    } : { tasks: [], counts: { pending: 0, active: 0, inProgress: 0, completed: 0, total: 0 } };
  }

  async TaskIsOwner(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskModel.findOne({ _id: taskId, ownerId: new Types.ObjectId(userId) }).exec();
    return !!task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    updateTaskDto.status = updateTaskDto.status?.toLowerCase() as 'active' | 'pending' | 'in-progress' | 'completed'; // Normalize status to lowercase
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id, ownerId: new Types.ObjectId(userId) },
      { $set: { ...updateTaskDto, ...(updateTaskDto.status === 'completed' ? { completedAt: new Date() } : {}) } },
      { new: true }
    ).exec();
    if (!updatedTask) {
      throw new Error('Failed to update task');
    }
    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const deletedTask = await this.taskModel.findOneAndDelete(
      { _id: id, ownerId: new Types.ObjectId(userId) }
    ).exec();
    if (!deletedTask) {
      throw new Error('Failed to remove task');
    }
    return deletedTask;
  }

  async findById(id: string, userId: string) {
    const task = await this.taskModel.findOne({ _id: id, ownerId: new Types.ObjectId(userId) }).exec();
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }
}
