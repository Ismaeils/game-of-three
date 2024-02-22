import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { PlayerService } from './player.service';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway()
export class PlayerGateway implements OnGatewayConnection {

  constructor(
    private readonly playerService: PlayerService,
    private readonly socketService: SocketService) {}
  
  afterInit(server: Server){
    this.socketService.server = server;
  }
  handleConnection(socket: Socket) {
    this.playerService.handlePlayerConnection(socket);
  }
  

  @SubscribeMessage('playerReady')
  onPlayerReady(socket: Socket) {
    this.playerService.handleOnPlayerReady(socket);
  }

  @SubscribeMessage('playGame')
  onPlayGame(@MessageBody() startNumber: any, @ConnectedSocket() socket: Socket){
    this.playerService.handleOnPlayGame(socket, startNumber);
  }
}
