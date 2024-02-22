import { Injectable } from '@nestjs/common';
import { TemplateTextRepository } from './template-text.repository';
import * as template from 'string-template';

@Injectable()
export class TemplateTextService {
    constructor(private readonly templateTextRepository: TemplateTextRepository){}

    getInterpolatedText(text: string, values: any[]): string {
        return template(text, values);
    }

    async getWelcomeMsg(): Promise<String> {
        return (await this.templateTextRepository.findOne("WELCOME_MSG")).content
    }

    async getPlayerConnMsg(text: string): Promise<String> {
        return this.getInterpolatedText(
            (await this.templateTextRepository.findOne("PLAYER_CONN_MSG")).content,
            [text]
        )
    }

    async getwelcomeMsgDesc(): Promise<String> {
        return (await this.templateTextRepository.findOne("WELCOME_MSG_DESC")).content;
    }

    async getPlayerDisonnMsg(text: string): Promise<String> {
        return this.getInterpolatedText(
            (await this.templateTextRepository.findOne("PLAYER_DISCONN_MSG")).content,
            [text]
        )
    }

    async getPlayerMoveMsg(texts: any[]): Promise<string>{
        return this.getInterpolatedText(
            (await this.templateTextRepository.findOne("PLAYER_MOVE_MSG")).content,
            texts
        )
    }

    async getGameWonMsg(text: string): Promise<string>{
        return this.getInterpolatedText(
            (await this.templateTextRepository.findOne("GAME_WON_MSG")).content,
            [text]
        )
    }

    async getGameRoomCreatedMsg(): Promise<string>{
        return (await this.templateTextRepository.findOne("GAME_ROOM_CREATED_MSG")).content
    }

    async getGameReadyMsg(): Promise<string>{
        return (await this.templateTextRepository.findOne("GAME_READY_MSG")).content
    }

    async getPlayerTwoJoinedMsg(text:string): Promise<string>{
        return this.getInterpolatedText(
            (await this.templateTextRepository.findOne("PLAYER_TWO_JOIN_MSG")).content,
            [text]
        )
    }

    async create(key: string, content: string){
        return this.templateTextRepository.create(key, content);
    }
}



