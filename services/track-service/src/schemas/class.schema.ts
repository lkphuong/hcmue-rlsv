import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ collection: 'classs' })
export class Class {
  @Prop({ name: '_id', type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ name: 'name' })
  name: string;

  @Prop({ name: 'departmentId', type: Types.ObjectId, ref: 'department' })
  departmentId: Types.ObjectId;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
