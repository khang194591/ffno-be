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
            port: configService.get('CHAT_SERVICE_PORT') ?? 3020,
          },
          transport: Transport.TCP,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
