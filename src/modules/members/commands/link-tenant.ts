import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs/constants';
import { MemberService } from '../member.service';

export class LinkTenantCommand {
  constructor(
    public readonly staffId: string,
    public readonly data: string,
  ) {}
}

@CommandHandler(LinkTenantCommand)
export class LinkTenantHandler implements ICommandHandler<LinkTenantCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MemberService,
  ) {}

  async execute(query: LinkTenantCommand): Promise<any> {
    const { staffId, data } = query;
    const member = await this.memberService.getMemberOrThrow(data);

    // TODO: Handle send email or OTP
    await this.prisma.memberContacts.create({
      data: {
        type: MemberRole.TENANT,
        contactId: staffId,
        contactWithId: member.id,
      },
    });
  }
}
