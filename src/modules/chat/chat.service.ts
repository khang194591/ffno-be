import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CHAT_PATTERNS,
  CHAT_SERVICE,
  IGetListMessageDto,
  IGetMessageDto,
} from 'src/libs';

@Injectable()
export class ChatService {
  constructor(@Inject(CHAT_SERVICE) private readonly client: ClientProxy) {}

  async getListMessage(payload: IGetListMessageDto) {
    const pattern = CHAT_PATTERNS.GET_LIST_MESSAGES;
    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async getMessage(payload: IGetMessageDto) {
    const pattern = CHAT_PATTERNS.GET_MESSAGE;
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
