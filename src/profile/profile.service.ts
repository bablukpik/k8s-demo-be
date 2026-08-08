import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class ProfileService {
  private readonly defaultUserId = 1;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile() {
    const user = await this.userModel
      .findOne({ userid: this.defaultUserId })
      .lean()
      .exec();
    return user ?? {};
  }

  async updateProfile(dto: UpdateProfileDto) {
    const userObj = { ...dto, userid: this.defaultUserId };
    await this.userModel
      .updateOne({ userid: this.defaultUserId }, { $set: userObj }, { upsert: true })
      .exec();
    return userObj;
  }

  getProfilePicturePath(): string {
    const candidates = [
      join(process.cwd(), 'images', 'profile-1.jpg'),
      join(__dirname, '..', '..', 'images', 'profile-1.jpg'),
    ];

    const imagePath = candidates.find((candidate) => existsSync(candidate));
    if (!imagePath) {
      throw new Error('Profile picture not found');
    }
    return imagePath;
  }

  getProfilePictureStream() {
    return createReadStream(this.getProfilePicturePath());
  }
}
