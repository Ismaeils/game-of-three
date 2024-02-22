import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameSchema } from './schemas/game.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GameRepository } from './game.repository';
import { SocketModule } from 'src/socket/socket.module';
import { TemplateTextModule } from 'src/template-text/template-text.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
    SocketModule,
    TemplateTextModule,
  ],
  providers: [GameService, GameRepository],
  exports: [GameService]
})
export class GameModule {}
