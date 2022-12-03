import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Class } from './class.schema';
import { Department } from './department.schema';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @Prop({ name: '_id', type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ name: 'classId', type: Types.ObjectId, ref: 'class' })
  classId: Types.ObjectId;

  @Prop({ name: 'departmentId', type: Types.ObjectId, ref: 'department' })
  departmentId: Types.ObjectId;

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

  department: Department;

  class: Class;
}

export const UserSchema = SchemaFactory.createForClass(User);
