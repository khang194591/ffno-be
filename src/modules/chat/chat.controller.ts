import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  async getListChannel(@CurrentMemberId() memberId: string) {
    return this.chatService.getListChannel(memberId);
  }

  @Get('channels/:channelId')
  async getChannelMessages(
    @CurrentMemberId() memberId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.chatService.getChannelMessages({ channelId, memberId });
  }
}
