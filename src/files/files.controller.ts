import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody,  } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { UserService } from '@/users/users.service';
import { User } from '@/decorators/user.decorator';
import type { IUser } from '@/users/interfaces/IUser';
import type { Request } from 'express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly userService: UserService,
  ) {}

  @Post('upload-avatar')
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ // swagger file upload support
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @User() user: IUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Get current user to check for existing avatar
    const existUser: any = await this.userService.findOne(user._id);
    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    // Upload new avatar (and delete old one if exists)
    const avatarUrl = await this.filesService.replaceAvatar(existUser.avatar, file, existUser._id);

    // Update user with new avatar URL
    await this.userService.update(user._id, { avatar: avatarUrl });

    return {
      message: 'Avatar uploaded successfully',
      avatarUrl,
    };
  }

  @Delete('delete-avatar')
  @ApiOperation({ summary: 'Delete avatar image' })
  async deleteAvatar(@User() user: IUser) {
    const userId = user._id;

    // Get current user
    const existUser = await this.userService.findOne(userId);

    if (!existUser.avatar) {
      throw new BadRequestException('User has no avatar to delete');
    }

    // Delete avatar from Supabase
    await this.filesService.deleteAvatar(existUser.avatar);

    // Update user to remove avatar URL
    await this.userService.update(userId, { avatar: '' });

    return {
      message: 'Avatar deleted successfully',
    };
  }
}
