import { INestApplication } from '@nestjs/common';
import { Member, PrismaClient } from '@prisma/client';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { fakeMember } from 'test/factory/member';

export type AuthHeader = Record<'Cookie', string>;

export class AuthHelper {
  private app: INestApplication;
  private prisma: PrismaClient;
  private authService: AuthService;

  constructor() {
    this.app = global.testContext.app;
    this.prisma = global.testContext.prisma;
    this.authService = this.app.select(AuthModule).get(AuthService);
  }

  async createMember(override: Partial<Member> = {}) {
    return this.authService.signUp(fakeMember(override));
  }

  async getMember(id: string) {
    return this.prisma.member.findUnique({ where: { id } });
  }

  async getUsers(ids?: string[]) {
    if (ids) {
      return this.prisma.member.findMany({
        where: { id: { in: ids } },
      });
    }
    return this.prisma.member.findMany();
  }

  async clearMembers() {
    await this.prisma.member.deleteMany();
  }

  async fakeAuthHeader(
    overrideUser: Partial<Member> = {},
  ): Promise<AuthHeader> {
    const { token } = await this.createMember(overrideUser);

    return { Cookie: `token=${token}` };
  }
}
