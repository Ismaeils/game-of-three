import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TemplateText extends Document {
  @Prop({ required: true })
  key: string;
  
  @Prop({ required: true })
  content: string;
}

export const TemplateTextSchema = SchemaFactory.createForClass(TemplateText);
