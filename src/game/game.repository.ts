import { Inject, Injectable } from "@nestjs/common";
import { Game } from "./schemas/game.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CACHE_MANAGER, Cache, CacheKey } from "@nestjs/cache-manager";
import { UpdateGameDto } from "./dto/update-game.dto";
import { CreateGameDto } from "./dto/create-game.dto";

@Injectable()
export class GameRepository{

    constructor(
        @InjectModel('Game') private readonly gameModel: Model<Game>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
    
    async find(args: unknown): Promise<Game> {
        const game = await this.gameModel.findOne(args);
        return game;
    }

    @CacheKey('games')
    async findOne(roomId: string): Promise<Game>{
        const cachedGame = await this.cacheManager.get<Game>(roomId);
        if(cachedGame) return cachedGame;

        const game = await this.gameModel.findOne({roomId: roomId});
        await this.cacheManager.set(game.roomId, game);

        return game;
    }
    @CacheKey('games')
    async updateOne(roomId: string, updateGameDto: UpdateGameDto): Promise<Game>{
        const game = await this.gameModel.findOneAndUpdate({roomId: roomId}, updateGameDto);
        await this.cacheManager.set(game.roomId, game);

        return game;
    }

    async create(createGameDto: CreateGameDto): Promise<Game>{
        return await this.gameModel.create(createGameDto);
    }
}