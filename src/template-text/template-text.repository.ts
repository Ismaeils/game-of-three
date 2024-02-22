import { Injectable } from '@nestjs/common';
import { TemplateText } from './schemas/template-text.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TemplateTextRepository {

    constructor(@InjectModel('TemplateText') private readonly templateTextModel: Model<TemplateText>) {}

    async findOne(key: string): Promise<TemplateText> {
        const text = await this.templateTextModel.findOne({ key: key });
        return text;
    }

    async create(key: string, content: string): Promise<TemplateText> {
        return await this.templateTextModel.create({key, content});
    }

}
