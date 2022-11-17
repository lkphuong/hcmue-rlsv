import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type _KDocument = _K & Document;

@Schema({ collection: '_k' })
export class _K {
  @Prop({ name: 'name' })
  name: string;

  @Prop({ name: 'description' })
  description: string;
}

export const _KSchema = SchemaFactory.createForClass(_K);
