import { User } from '@/decorators/user.decorator';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET')!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed (jpeg, jpg, png, gif, webp, svg+xml, avif)');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    // Generate unique filename
    const fileExt = file.originalname.split('.').pop(); // get file extension
    const fileName = `${userId}.${fileExt}`; // file name format: userId.extension
    const filePath = `avatars/${fileName}`; 

    try {
      // Upload file to Supabase
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        throw new BadRequestException(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteAvatar(fileUrl?: string | null): Promise<void> {
    if (!fileUrl) {
      return;
    }

    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.indexOf(this.bucketName);
      
      if (bucketIndex === -1) {
        throw new BadRequestException('Invalid file URL');
      }

      const filePath = pathSegments.slice(bucketIndex + 1).join('/');

      // Delete file from Supabase
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error(`Failed to delete file: ${error.message}`);
        // Don't throw error, just log it
      }
    } catch (error: any) {
      console.error(`Failed to delete file: ${error.message}`);
      // Don't throw error for deletion failures
    }
  }

  async replaceAvatar(oldFileUrl: string | null | undefined, newFile: Express.Multer.File , userId: string): Promise<string> {
    // Delete old avatar if exists
    if (oldFileUrl) {
      await this.deleteAvatar(oldFileUrl);
    }

    // Upload new avatar
    return await this.uploadAvatar(newFile, userId);
  }
}
