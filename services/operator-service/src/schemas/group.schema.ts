import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ collection: 'group' })
export class Group {
  @Prop({ name: 'departmentId', type: Types.ObjectId, ref: 'department' })
  departmentId: Types.ObjectId;

  @Prop({ name: 'managerId', type: Types.ObjectId, ref: 'major' })
  managerId: Types.ObjectId;

  @Prop({ name: 'name' })
  name: string;

  @Prop({ name: 'description' })
  description: string;

  @Prop({ name: 'level' })
  level: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
