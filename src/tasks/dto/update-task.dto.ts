import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ example: 'active', description: 'The status of the task', required: false })
    @IsOptional({ message: 'Status is optional' })
    @IsString({ message: 'Status must be a string' })
    @IsEnum(['active', 'pending', 'in-progress', 'completed'], { message: 'Status must be one of the following values: active, pending, in-progress, completed' })
    status?: 'active' | 'pending' | 'in-progress' | 'completed';

    // @ApiProperty({ example: '2023-12-31T23:59:59.999Z', description: 'The completion date of the task', required: false })
    // @IsOptional({ message: 'CompletedAt is optional' })
    // completedAt?: Date | null;
}
