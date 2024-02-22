import { GameMove } from "../interfaces/game-move.interface"
import { GameRoomStatus } from "../interfaces/game-room.interface"

export interface CreateGameDto {
    roomId?: string
    playerA?: string
    playerB?: string
    status?: GameRoomStatus
    moves?: GameMove[]
    winningPlayer?: string
}
