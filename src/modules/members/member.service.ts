import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { isEmail, isPhoneNumber } from 'class-validator';
import { PrismaService } from 'src/config';
import { MemberResDto, SignUpDto } from 'src/libs/dto';

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

  async getMember(keyword: string) {
    if (isEmail(keyword)) {
      return this.prisma.member.findUnique({ where: { email: keyword } });
    }
    if (isPhoneNumber(keyword)) {
      return this.prisma.member.findUnique({ where: { phone: keyword } });
    }
    return this.prisma.member.findUnique({ where: { id: keyword } });
  }

  async getMemberOrThrow(id: string) {
    const member = await this.getMember(id);

    if (!member) {
      throw new NotFoundException(`Member with identity = ${id} not found`);
    }

    return plainToInstance(MemberResDto, member);
  }
}
