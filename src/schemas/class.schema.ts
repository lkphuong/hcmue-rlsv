import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ collection: 'class' })
export class Class {
  @Prop({ name: 'name' })
  name: string;

  @Prop({ name: 'departmentId', type: Types.ObjectId, ref: 'department' })
  departmentId: Types.ObjectId;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
