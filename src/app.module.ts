import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplateTextModule } from './template-text/template-text.module';
import { SocketService } from './socket/socket.service';
import { SocketModule } from './socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CommandModule } from 'nestjs-command';
import { TemplateTextSeed } from './template-text/seeds/template-text.seed';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI')
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true
    }),
    PlayerModule, 
    GameModule, 
    TemplateTextModule, 
    SocketModule,
    CommandModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService, SocketService, TemplateTextSeed],
})
export class AppModule {}
