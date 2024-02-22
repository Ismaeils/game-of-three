import { Module } from '@nestjs/common';
import { TemplateTextService } from './template-text.service';
import { TemplateTextSchema } from './schemas/template-text.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateTextRepository } from './template-text.repository';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'TemplateText', schema: TemplateTextSchema }])
  ],
  providers: [TemplateTextService, TemplateTextRepository],
  exports: [TemplateTextService]
})
export class TemplateTextModule {}
