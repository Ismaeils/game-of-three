import { GameMove } from "./game-move.interface"

export enum GameRoomStatus {
    NOT_FULL = "NOT_FULL",
    READY = "READY",
    IN_PLAY = "IN_PLAY",
    FIRST_MOVE_DRAWN = "FIRST_MOVE_DRAWN",
    FINISHED = "FINISHED"
}

export interface GameRoom {
    id: string
    playerA: string
    playerB?: string
    status?: GameRoomStatus
    moves?: GameMove[]
}