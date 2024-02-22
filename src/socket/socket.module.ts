import { Global, Module } from '@nestjs/common';
import { SocketService } from './socket.service';

@Global()
@Module({
    exports: [SocketService],
    providers: [SocketService]
})
export class SocketModule {}
