import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('get-profile')
  getProfile() {
    return this.profileService.getProfile();
  }

  @Post('update-profile')
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(dto);
  }

  @Get('profile-picture/meta')
  getProfilePictureMeta() {
    return this.profileService.getProfilePictureMeta();
  }

  @Get('profile-picture')
  getProfilePicture(@Res({ passthrough: true }) res: Response) {
    const { stream, contentType } =
      this.profileService.getProfilePictureStream();
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    });
    return new StreamableFile(stream);
  }

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return this.profileService.saveProfilePicture(file);
  }
}
