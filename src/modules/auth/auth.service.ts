import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Member } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { SignInDto, SignInResDto, SignUpDto } from 'src/shared/dto';
import { MemberService } from '../members/member.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const member = await this.memberService.createMember(dto);

    return this.signToken(member);
  }

  async signIn(dto: SignInDto) {
    const member = await this.memberService.getMember(dto.email);

    if (!member || !compareSync(dto.password, member.password)) {
      throw new UnauthorizedException('Thông tin đăng nhập không đúng');
    }

    return this.signToken(member);
  }

  private signToken(member: Member) {
    const payload = {
      id: member.id,
      name: member.name,
      role: member.role,
      imgUrl: member.imgUrl,
    };

    const token = this.jwtService.sign(payload);

    return { token, member: plainToInstance(SignInResDto, member) };
  }
}
