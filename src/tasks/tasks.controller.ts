import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TaskService } from '@/tasks/tasks.service';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { User } from '@/decorators/user.decorator';
import type { IUser } from '@/users/interfaces/IUser';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: IUser) {
    try {
      return { message: 'Task created successfully', data: await this.taskService.create(createTaskDto, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user: IUser) {
    try {
      return { message: 'Task updated successfully', data: await this.taskService.update(id, updateTaskDto, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    try {
      return { message: 'Task removed successfully', data: await this.taskService.remove(id, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to remove task: ' + error.message);
    }
  }
}
