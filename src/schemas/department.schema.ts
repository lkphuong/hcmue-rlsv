import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ collection: 'department' })
export class Department {
  @Prop({ name: 'name' })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
