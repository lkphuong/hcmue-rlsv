import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MajorDocument = Major & Document;

@Schema({ collection: 'major' })
export class Major {
  @Prop({ name: 'name' })
  name: string;
}

export const MajorSchema = SchemaFactory.createForClass(Major);
