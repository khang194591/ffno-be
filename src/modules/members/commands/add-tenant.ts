import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { AddTenantDto } from 'src/libs/dto';
import { MemberService } from '../member.service';

export class AddTenantCommand {
  constructor(public readonly data: AddTenantDto) {}
}

@CommandHandler(AddTenantCommand)
export class AddTenantHandler implements ICommandHandler<AddTenantCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MemberService,
  ) {}

  async execute(query: AddTenantCommand): Promise<string> {
    const { data } = query;

    // let member = await this.memberService.getMember(data.email);
    return data.name;
  }
}
