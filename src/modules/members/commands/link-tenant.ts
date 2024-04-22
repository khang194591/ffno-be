import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs/constants';
import { MemberResDto } from 'src/libs/dto';
import { NotificationService } from 'src/modules/services/notification.service';
import { MemberService } from '../member.service';

export class LinkTenantCommand {
  constructor(
    public readonly currentMember: MemberResDto,
    public readonly data: string,
  ) {}
}

@CommandHandler(LinkTenantCommand)
export class LinkTenantHandler implements ICommandHandler<LinkTenantCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MemberService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(query: LinkTenantCommand): Promise<any> {
    const { currentMember, data } = query;
    const member = await this.memberService.getMember(data);

    // TODO: Handle send email or OTP
    if (member) {
      await this.prisma.memberContacts.create({
        data: {
          type: MemberRole.TENANT,
          contactId: currentMember.id,
          contactWithId: member.id,
        },
      });
    } else {
      await this.notificationService.sendEmail({
        to: data,
        subject: 'Invitation to Join FFNO',
        template: 'invitation-tenant',
        context: {
          tenantName: data,
          landlordName: currentMember.name,
          invitationLink: 'http://localhost:8000/auth/sign-up?invi',
        },
      });
    }
  }
}
