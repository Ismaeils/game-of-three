import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { GameMove } from 'src/game/interfaces/game-move.interface';
import { GameRoomStatus } from 'src/game/interfaces/game-room.interface';
import { Game } from 'src/game/schemas/game.schema';
import { SocketService } from 'src/socket/socket.service';
import { TemplateTextService } from 'src/template-text/template-text.service';
import { extractRoomId } from './player.utils';

@Injectable()
export class PlayerService {
  constructor(
    private readonly socketService: SocketService,
    private readonly gameService: GameService,
    private readonly templateTextService: TemplateTextService,
  ) {}

  async handlePlayerConnection(socket: Socket): Promise<void> {
    socket.emit('general', {
      message: await this.templateTextService.getPlayerConnMsg(socket.id),
    });

    this.socketService.server.to(socket.id).emit('general', {
      message: await this.templateTextService.getWelcomeMsg(),
      description: await this.templateTextService.getwelcomeMsgDesc(),
    });

    socket.on('disconnect', () => {
      this.socketService.server.emit('general', {
        message: this.templateTextService.getPlayerDisonnMsg(socket.id),
      });
    });
  }

  async handleOnPlayerReady(socket: Socket) {
    const game = await this.gameService.getIncompleteGame();
    if (game) {
      socket.join(game.roomId);

      if (game.status === GameRoomStatus.NOT_FULL) {
        this.gameService.handleGameNotFull(game, socket);
      } else if (game.status === GameRoomStatus.FIRST_MOVE_DRAWN) {
        this.handleFirstMoveDrawn(game, socket);
      }
    } else {
      this.gameService.handleNewGame(socket);
    }
  }

  async handleOnPlayGame(socket: Socket, startNumber: any) {
    const roomId = extractRoomId(socket);
    const game = await this.gameService.getGame(roomId);

    if (game.status == GameRoomStatus.NOT_FULL)
      this.handleLonerPlayer(socket.id, game, startNumber);

    if (game.status == GameRoomStatus.READY)
      this.handleReadyGame(socket.id, game, startNumber);
  }

  private async handleFirstMoveDrawn(game: Game, socket: Socket) {
    await this.gameService.update(game.roomId, {
      playerA: game.playerA,
      playerB: socket.id,
      status: GameRoomStatus.IN_PLAY,
    });

    game.moves[0].to = socket.id;

    this.socketService.server
      .to(game.roomId)
      .emit(
        'game',
        await this.templateTextService.getPlayerTwoJoinedMsg(socket.id),
      );

    await this.gameService.play(game.moves[0], game.roomId);
  }

  private async handleLonerPlayer(
    playerId: string,
    game: Game,
    startNumber: any,
  ) {
    if(!startNumber || startNumber == "")  startNumber = faker.number.int({ min: 500, max: 5000 });
    else startNumber = parseInt(startNumber);
    const fristMove: GameMove = {
      drawer: playerId,
      move: startNumber,
      outcome: startNumber,
    };

    await this.gameService.update(game.roomId, {
      status: GameRoomStatus.FIRST_MOVE_DRAWN,
      moves: [fristMove],
    });

    this.socketService.server
      .to(game.roomId)
      .emit(
        'game',
        await this.templateTextService.getPlayerMoveMsg([
          playerId,
          fristMove.move,
          0,
          3,
          fristMove.outcome,
          'Player B',
        ]),
      );
  }

  private async handleReadyGame(
    playerId: string,
    game: Game,
    startNumber: any,
  ) {
    if(!startNumber || startNumber == "")  startNumber = faker.number.int({ min: 500, max: 5000 });
    else startNumber = parseInt(startNumber);
    const fristMove: GameMove = {
      drawer: playerId,
      move: startNumber,
      outcome: startNumber,
      to: game.playerB,
    };

    await this.gameService.update(game.roomId, {
      status: GameRoomStatus.IN_PLAY,
      moves: [fristMove],
    });

    this.socketService.server
      .to(game.roomId)
      .emit(
        'game',
        await this.templateTextService.getPlayerMoveMsg([
          playerId,
          fristMove.move,
          0,
          3,
          fristMove.outcome,
          playerId,
        ]),
      );
    await this.gameService.play(fristMove, game.roomId);
  }
}
