import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CHAT_SERVICE } from 'src/libs';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: CHAT_SERVICE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          options: {
            host: 'localhost',
            port: 6379,
          },
          transport: Transport.REDIS,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
