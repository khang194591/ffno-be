import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/config';
import {
  CHAT_PATTERNS,
  CHAT_SERVICE,
  ContactType,
  IGetListMessageDto,
  IGetMessageDto,
} from 'src/libs';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE) private readonly client: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}

  async getChannelMessages(payload: IGetListMessageDto) {
    const { memberId, channelId } = payload;

    // Create new contact if not
    const contactWithId = channelId.replace(memberId, '').replace('_', '');

    let contact = await this.prismaService.memberContacts.findUnique({
      where: {
        contactId_contactWithId: { contactId: memberId, contactWithId },
      },
      include: { contactWith: { select: { name: true, imgUrl: true } } },
    });

    if (!contact) {
      console.log(memberId, contactWithId);

      contact = await this.prismaService.memberContacts.create({
        data: { type: ContactType.TENANT, contactId: memberId, contactWithId },
        include: { contactWith: { select: { name: true, imgUrl: true } } },
      });
    }

    // Get list message
    const pattern = CHAT_PATTERNS.GET_LIST_MESSAGES;
    return await lastValueFrom(
      this.client.send(pattern, {
        ...payload,
        channelName: contact.contactWith.name,
        channelImgUrl: contact.contactWith.imgUrl,
      }),
    );
  }

  async getListChannel(memberId: string) {
    const pattern = CHAT_PATTERNS.GET_LIST_CHANNEL;
    return await lastValueFrom(this.client.send(pattern, memberId));
  }

  async getMessage(payload: IGetMessageDto) {
    const pattern = CHAT_PATTERNS.GET_MESSAGE;
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
