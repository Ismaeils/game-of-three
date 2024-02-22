import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { faker } from '@faker-js/faker';
import { GameMove } from './interfaces/game-move.interface';
import { Socket } from 'socket.io';
import { GameRepository } from './game.repository';
import { SocketService } from 'src/socket/socket.service';
import { GameRoomStatus } from './interfaces/game-room.interface';
import { Game } from './schemas/game.schema';
import { TemplateTextService } from 'src/template-text/template-text.service';

@Injectable()
export class GameService {
  private readonly gameRooms: Map<string, Socket> = new Map();

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly socketService: SocketService,
    private readonly templateTextService: TemplateTextService,
  ) {}

  async handleNewGame(socket: Socket) {
    const game = await this.create({
      roomId: faker.string.uuid(),
      playerA: socket.id,
      status: GameRoomStatus.NOT_FULL,
    });
    socket.join(game.roomId);
    this.socketService.server
      .to(game.roomId)
      .emit('game', await this.templateTextService.getGameRoomCreatedMsg());
  }

  async handleGameNotFull(game: Game, socket: Socket) {
    await this.update(game.roomId, {
      playerA: game.playerA,
      playerB: socket.id,
      status: GameRoomStatus.READY,
    });

    this.socketService.server
      .to(game.roomId)
      .emit('game', await this.templateTextService.getGameReadyMsg());
  }

  async handleFinishedGame(gameMove: GameMove, roomId: string) {
    const game = await this.getGame(roomId);
    await this.update(roomId, {
      winningPlayer: gameMove.drawer,
      status: GameRoomStatus.FINISHED,
      moves: [...game.moves, gameMove],
    });
  }

  fakeTimeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async play(gameMove: GameMove, roomId: string): Promise<GameMove> {
    const added = this.getNumToAdd(gameMove.outcome);
    const outcome = (gameMove.outcome + added) / 3;
    const drawer = gameMove.to;
    const to = gameMove.drawer;

    const thisMove: GameMove = {
      move: gameMove.move,
      added: added,
      outcome: outcome,
      drawer: drawer,
      to: to,
    };

    if (thisMove.outcome == 1) {
      this.socketService.server
      .to(roomId)
      .emit(
        'game',
        await this.templateTextService.getPlayerMoveMsg([
          drawer,
          thisMove.move,
          thisMove.added,
          3,
          outcome,
          "END",
        ]),
      );
      this.socketService.server
        .to(roomId)
        .emit('game', await this.templateTextService.getGameWonMsg(drawer));
      await this.handleFinishedGame(thisMove, roomId);
      return thisMove;
    }

    this.socketService.server
      .to(roomId)
      .emit(
        'game',
        await this.templateTextService.getPlayerMoveMsg([
          drawer,
          thisMove.move,
          thisMove.added,
          3,
          outcome,
          to,
        ]),
      );
    thisMove.move = outcome;
    await this.fakeTimeDelay(1500);
    this.play(thisMove, roomId);
  }

  getNumToAdd(startNumber: number): number {
    if (startNumber % 3 == 0) return 0;
    if ((startNumber + 1) % 3 == 0) return 1;
    if ((startNumber - 1) % 3 == 0) return -1;
  }

  startGame(startNumber: number = faker.number.int({ min: 100, max: 1000 })) {
    // initiate algorithm
    if (startNumber == 1) return 1;

    this.startGame((startNumber + this.getNumToAdd(startNumber)) / 3);
  }

  async create(createGameDto: CreateGameDto) {
    return this.gameRepository.create(createGameDto);
  }

  async getGame(roomId: string) {
    return this.gameRepository.findOne(roomId);
  }

  async getIncompleteGame() {
    return this.gameRepository.find({ playerB: { $exists: false } });
  }

  update(roomId: string, updateGameDto: UpdateGameDto) {
    return this.gameRepository.updateOne(roomId, updateGameDto);
  }
}
