import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { TemplateTextService } from '../template-text.service';

@Injectable()
export class TemplateTextSeed {
constructor(
    private readonly templateTextService: TemplateTextService,
) { }

@Command({ command: 'template-text:seed', describe: 'create a user' })
async create() {
    const templateText = await this.templateTextService.create(
        'WELCOME_MSG',
        '[INFO] Welcome Player to the Game of Threes! Here are some directions for you to follow in this game...'
    );

    const templateText1 = await this.templateTextService.create(
        'PLAYER_CONN_MSG',
        '[INFO] Player {0} has just connected!'
    );

    const templateText2 = await this.templateTextService.create(
        'WELCOME_MSG_DESC',
        'Instructions are simple, to play in this game you have fire the event "playerReady", you will be paired with a game room in which you could start playing by firing the event "playGame"'
    );

    const templateText3 = await this.templateTextService.create(
        'PLAYER_DISCONN_MSG',
        '[INFO] Player {0} has just disconnected!'
    );

    const templateText4 = await this.templateTextService.create(
        'PLAYER_MOVE_MSG',
        '[MOVE] Player {0} -- {1} + {2} / {3} = {4} --> {5}'
    )

    const templateText5 = await this.templateTextService.create(
        'GAME_WON_MSG',
        'Game Won by Player {0}'
    )

    const templateText6 = await this.templateTextService.create(
        'GAME_ROOM_CREATED_MSG',
        '[INFO] New game room has been created, a game has to have a second player to function. Still, you can draw your first move by triggering game:start event using a number'
    )

    const templateText7 = await this.templateTextService.create(
        'GAME_READY_MSG',
        '[INFO] The game is ready to play! One of you should trigger the game:start event'
    )

    const templateText8 = await this.templateTextService.create(
        'PLAYER_TWO_JOIN_MSG',
        '[INFO] Player {0} has joined the game and it is already their turn!'
    )
}
}
