import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ collection: 'department' })
export class Department {
  @Prop({ name: '_id', type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ name: 'name' })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
