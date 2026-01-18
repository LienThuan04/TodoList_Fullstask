import { Module } from '@nestjs/common';
import { TaskService } from '@/tasks/tasks.service';
import { TaskController } from '@/tasks/tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@/tasks/schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
