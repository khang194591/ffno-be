import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import { CreateReviewDto, GetListReviewDto } from 'src/shared/dto';
import { CreateReviewCommand } from './commands';
import { GetListReviewQuery } from './queries';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListReview(@Query() query: GetListReviewDto) {
    return this.queryBus.execute(new GetListReviewQuery(query));
  }

  @Post()
  async createReview(
    @CurrentMemberId() staffId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.commandBus.execute(new CreateReviewCommand(staffId, body));
  }
}
