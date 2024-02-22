import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerGateway } from './player.gateway';
import { TemplateTextModule } from 'src/template-text/template-text.module';
import { GameModule } from 'src/game/game.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TemplateTextModule,
    GameModule,
    SocketModule
  ],
  providers: [PlayerGateway, PlayerService],
})
export class PlayerModule {}
