import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({ example: 'user', description: 'The username of the new user' })
    @IsNotEmpty({ message: 'Title must not be empty' })
    @IsString({ message: 'Title must be a string' })
    @MaxLength(100, { message: 'Title must be at most 100 characters long' })
    @MinLength(1, { message: 'Title must be at least 1 character long' })
    title: string;

    @ApiProperty({ example: 'This is a sample task description.', description: 'The description of the task' })
    @IsNotEmpty({ message: 'Description must not be empty' })
    @IsString({ message: 'Description must be a string' })
    @MaxLength(500, { message: 'Description must be at most 500 characters long' })
    description?: string | null;
}
