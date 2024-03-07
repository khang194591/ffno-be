/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { IdUUIDParams } from 'src/common/dto';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':id')
  async getMember(@Param() { id }: IdUUIDParams) {
    return this.memberService.getMemberOrThrow(id);
  }
}
