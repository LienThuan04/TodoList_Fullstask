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

  async findAll() {
    return `This action returns all task`;
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
}
