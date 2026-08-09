import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  userid: number;

  @Prop()
  name?: string;

  @Prop()
  title?: string;

  @Prop()
  email?: string;

  @Prop()
  interests?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
