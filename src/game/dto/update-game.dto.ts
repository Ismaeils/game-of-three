import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { GameRoomStatus } from '../interfaces/game-room.interface';
import { GameMove } from '../interfaces/game-move.interface';

export interface UpdateGameDto extends CreateGameDto {}
