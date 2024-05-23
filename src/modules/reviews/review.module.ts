import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [ReviewService, ...CommandHandlers, ...QueryHandlers],
  exports: [ReviewService],
})
export class ReviewModule {}
