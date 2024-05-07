import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import { IdUUIDParams } from 'src/shared/dto';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('message/:id')
  async getMessage(
    @CurrentMemberId() memberId: string,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.chatService.getMessage({ id, memberId });
  }

  @Get(':channelId')
  async getListMessage(
    @CurrentMemberId() memberId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.chatService.getListMessage({ channelId, memberId });
  }
}
