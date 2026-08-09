import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
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

  @Get('profile-picture')
  getProfilePicture(@Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': 'image/jpeg',
    });
    return new StreamableFile(this.profileService.getProfilePictureStream());
  }
}
