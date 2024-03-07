import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { isEmail } from 'class-validator';
import { PrismaService } from 'src/config';
import { SignUpDto } from 'src/libs/dto';
import { GetMemberResDto } from 'src/libs/dto/members/get-member-res.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(data: SignUpDto) {
    const member = await this.getMember(data.email);

    if (member) {
      throw new BadRequestException('This email is already taken');
    }

    data.password = hashSync(data.password, 10);

    return this.prisma.member.create({ data });
  }

  async getMember(id: string) {
    if (isEmail(id)) {
      return this.prisma.member.findUnique({ where: { email: id } });
    }
    return this.prisma.member.findUnique({ where: { id } });
  }

  async getMemberOrThrow(id: string) {
    const member = await this.getMember(id);

    if (!member) {
      throw new NotFoundException(`Member with identity = ${id} not found`);
    }

    return plainToInstance(GetMemberResDto, member);
  }
}
