import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserGroupDocument = UserGroup & Document;

@Schema({ collection: 'user_group' })
export class UserGroup {
  @Prop({ name: 'userId', type: Types.ObjectId, ref: 'user' })
  userId: Types.ObjectId;

  @Prop({ name: 'groupId', type: Types.ObjectId, ref: 'group' })
  groupId: Types.ObjectId;
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
