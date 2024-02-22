import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameRoomStatus } from '../interfaces/game-room.interface';
import { GameMove } from '../interfaces/game-move.interface';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop()
  roomId: string;

  @Prop()
  playerA: string;

  @Prop()
  playerB: string;

  @Prop()
  status: GameRoomStatus

  @Prop()
  winningPlayer: string;

  @Prop()
  moves: GameMove[]

}

export const GameSchema = SchemaFactory.createForClass(Game);
