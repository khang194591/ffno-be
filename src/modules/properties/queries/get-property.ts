import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetPropertyResDto } from 'src/shared/dto';

export class GetPropertyQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetPropertyQuery)
export class GetPropertyHandler implements IQueryHandler<GetPropertyQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetPropertyQuery): Promise<GetPropertyResDto> {
    const property = await this.prisma.property.findUniqueOrThrow({
      where: { id },
      include: {
        amenities: true,
        units: { include: { tenants: true } },
        reviews: {
          include: {
            author: { select: { id: true, name: true, imgUrl: true } },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
            phone: true,
            imgUrl: true,
          },
        },
      },
    });

    return plainToInstance(GetPropertyResDto, property);
  }
}
