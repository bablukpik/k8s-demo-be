import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        if (mongoUri) {
          return { uri: mongoUri };
        }

        const user = configService.get<string>('USER_NAME', 'admin');
        const password = configService.get<string>('USER_PWD', 'password');
        const dbUrl = configService.get<string>('DB_URL', 'localhost:27017');
        const dbName = configService.get<string>('DB_NAME', 'my-db');
        return {
          uri: `mongodb://${user}:${password}@${dbUrl}/${dbName}?authSource=admin`,
        };
      },
    }),
    ProfileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
