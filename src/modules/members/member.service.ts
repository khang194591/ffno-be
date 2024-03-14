import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { isEmail } from 'class-validator';
import { PrismaService } from 'src/config';
import { MemberContactType } from 'src/libs/constants';
import {
  GetListContactDto,
  GetListResDto,
  GetMemberResDto,
  SignUpDto,
} from 'src/libs/dto';

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

  async getContacts(
    id: string,
    query: GetListContactDto,
  ): Promise<GetListResDto<GetMemberResDto>> {
    const { type, keyword, skip, take } = query;
    const where: Prisma.MemberContactsWhereInput = {
      type,
      contactId: id,
      contactWith: keyword && {
        OR: [
          { name: { search: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { phone: { contains: keyword } },
        ],
      },
    };

    const [total, members] = await this.prisma.$transaction([
      this.prisma.memberContacts.count({ where }),
      this.prisma.memberContacts.findMany({
        skip,
        take,
        where,
        select: {
          contactWith: {
            include: {
              unit: type === MemberContactType.TENANT && {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    const contacts = members.map((member) =>
      plainToClass(GetMemberResDto, member.contactWith),
    );

    return { total, data: contacts };
  }
}
