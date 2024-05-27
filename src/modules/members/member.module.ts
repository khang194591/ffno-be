import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from '../services/notification.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, NotificationModule],
  controllers: [MemberController],
  providers: [MemberService, ...QueryHandlers],
  exports: [MemberService],
})
export class MemberModule {}
