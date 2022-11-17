import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @Prop({ name: 'classId', type: Types.ObjectId, ref: 'class' })
  classId: Types.ObjectId;

  @Prop({ name: 'majorId', type: Types.ObjectId, ref: 'major' })
  majorId: Types.ObjectId;

  @Prop({ name: 'username' })
  username: string;

  @Prop({ name: 'password' })
  password: string;

  @Prop({ name: 'fullname' })
  fullname: string;

  @Prop({ name: 'birthday' })
  birthday: Date;

  @Prop({ name: 'address' })
  address: string;

  @Prop({ name: 'phone' })
  phone: string;

  @Prop({ name: 'email' })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
