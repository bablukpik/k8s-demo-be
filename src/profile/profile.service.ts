import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { extname, join } from 'path';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

const PROFILE_IMAGE_NAMES = [
  'profile.jpg',
  'profile.jpeg',
  'profile.png',
  'profile.webp',
] as const;

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const UPLOAD_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

@Injectable()
export class ProfileService {
  private readonly defaultUserId = 1;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile() {
    const user = await this.userModel
      .findOne({ userid: this.defaultUserId })
      .lean()
      .exec();

    if (!user) {
      return {};
    }

    const legacy = user as typeof user & { interests?: string };
    return {
      ...user,
      skills: user.skills || legacy.interests,
    };
  }

  async updateProfile(dto: UpdateProfileDto) {
    const userObj = { ...dto, userid: this.defaultUserId };
    await this.userModel
      .updateOne(
        { userid: this.defaultUserId },
        { $set: userObj, $unset: { interests: '' } },
        { upsert: true },
      )
      .exec();
    return userObj;
  }

  private imageDirs(): string[] {
    return [
      join(process.cwd(), 'images'),
      join(__dirname, '..', '..', 'images'),
    ];
  }

  private writableImagesDir(): string {
    const dir = join(process.cwd(), 'images');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  hasCustomProfilePicture(): boolean {
    for (const dir of this.imageDirs()) {
      for (const name of PROFILE_IMAGE_NAMES) {
        if (existsSync(join(dir, name))) {
          return true;
        }
      }
    }
    return false;
  }

  getProfilePictureMeta() {
    return {
      custom: this.hasCustomProfilePicture(),
    };
  }

  getProfilePicture(): { path: string; contentType: string; custom: boolean } {
    for (const dir of this.imageDirs()) {
      for (const name of PROFILE_IMAGE_NAMES) {
        const candidate = join(dir, name);
        if (existsSync(candidate)) {
          const ext = extname(candidate).toLowerCase();
          return {
            path: candidate,
            contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
            custom: true,
          };
        }
      }
    }

    for (const dir of this.imageDirs()) {
      const placeholder = join(dir, 'placeholder.svg');
      if (existsSync(placeholder)) {
        return {
          path: placeholder,
          contentType: 'image/svg+xml',
          custom: false,
        };
      }
    }

    throw new NotFoundException(
      'No profile image found. Upload a photo or add profile.jpg under images/.',
    );
  }

  getProfilePictureStream() {
    const { path, contentType, custom } = this.getProfilePicture();
    return {
      stream: createReadStream(path),
      contentType,
      custom,
    };
  }

  saveProfilePicture(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = UPLOAD_MIME_TO_EXT[file.mimetype];
    if (!ext) {
      throw new BadRequestException(
        'Unsupported file type. Use JPEG, PNG, or WebP.',
      );
    }

    const imagesDir = this.writableImagesDir();

    for (const name of PROFILE_IMAGE_NAMES) {
      const existing = join(imagesDir, name);
      if (existsSync(existing)) {
        unlinkSync(existing);
      }
    }

    const target = join(imagesDir, `profile${ext}`);
    writeFileSync(target, file.buffer);

    return {
      filename: `profile${ext}`,
      contentType: file.mimetype,
    };
  }
}
