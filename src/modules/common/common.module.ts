import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
