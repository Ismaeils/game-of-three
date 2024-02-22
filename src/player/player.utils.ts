import { Socket } from "socket.io";

export function extractRoomId(socket: Socket) {
    return Array.from(socket.rooms)[1];
}