import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { CreateReviewDto } from 'src/shared/dto';
import { ReviewService } from '../review.service';
import { BadRequestException } from '@nestjs/common';

export class CreateReviewCommand {
  constructor(
    public readonly currentMemberId: string,
    public readonly data: CreateReviewDto,
  ) {}
}

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewService: ReviewService,
  ) {}

  async execute(query: CreateReviewCommand): Promise<string> {
    const { data, currentMemberId } = query;

    const { unitId, propertyId, memberId } = data;

    const existingReview = await this.prisma.review.findFirst({
      where: { unitId, propertyId, memberId, authorId: currentMemberId },
    });

    if (existingReview) {
      throw new BadRequestException('You cannot post review twice');
    }

    const review = await this.prisma.review.create({
      data: {
        ...data,
        authorId: currentMemberId,
      },
    });

    return review.id;
  }
}
