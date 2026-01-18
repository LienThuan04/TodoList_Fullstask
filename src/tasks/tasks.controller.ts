import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { TaskService } from '@/tasks/tasks.service';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { User } from '@/decorators/user.decorator';
import type { IUser } from '@/users/interfaces/IUser';
import { ApiQuery } from '@nestjs/swagger';
import { FindTaskQueryDto } from './dto/find-task-query.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: IUser) {
    try {
      return { message: 'Task created successfully', data: await this.taskService.create(createTaskDto, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  @Get()
  @ApiQuery({ name: 'filterDate', required: false })
  async findAll(@User() user: IUser, @Query() query?: FindTaskQueryDto) {
    const now = new Date();
    let startDate: Date | null = null;
    switch (query?.filterDate) {
      case 'today': {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 11/08/2024 00:00:00
        break;
      };
      case 'this_week': {
        const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
        startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate); // Set to the most recent Monday
        break;
      };
      case 'this_month': {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      };
      case 'this_year': {
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      };
      case 'all_time':
      default: {
        startDate = null; // No date filtering
        break;
      };
    };
    const results = await this.taskService.findAllTasksByOwnerId(user._id, startDate);
    if( results.tasks.length === 0 ){
      return { message: 'No tasks found', data: results };
    }
    return { message: 'Tasks retrieved successfully', data: results };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user: IUser) {
    try {
      const isOwner = await this.taskService.TaskIsOwner(id, user._id);
      if (!isOwner) {
        throw new BadRequestException('You do not have permission to update this task');
      }
      return { message: 'Task updated successfully', data: await this.taskService.update(id, updateTaskDto, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    try {
      const isOwner = await this.taskService.TaskIsOwner(id, user._id);
      if (!isOwner) {
        throw new BadRequestException('You do not have permission to remove this task');
      }
      return { message: 'Task removed successfully', data: await this.taskService.remove(id, user._id) };
    } catch (error) {
      throw new BadRequestException('Failed to remove task: ' + error.message);
    }
  }
}
