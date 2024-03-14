import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StaffId } from 'src/libs/decorators';
import { GetListContactDto, IdUUIDParams } from 'src/libs/dto';
import { MemberService } from './member.service';

@Controller('members')
@ApiTags('Members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('contacts')
  async getContacts(@StaffId() id: string, @Query() query: GetListContactDto) {
    return this.memberService.getContacts(id, query);
  }

  @Get(':id')
  async getMember(@Param() { id }: IdUUIDParams) {
    return this.memberService.getMemberOrThrow(id);
  }
}
