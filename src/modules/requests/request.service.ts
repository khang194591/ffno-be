import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  CreateRequestDto,
  GetRequestResDto,
  UpdateRequestDto,
} from 'src/libs/dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getRequestOrThrow(id: string): Promise<GetRequestResDto> {
    const request = await this.prisma.request.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(GetRequestResDto, request);
  }

  async validateRequestInput(
    data: CreateRequestDto | UpdateRequestDto,
  ): Promise<Prisma.RequestCreateInput | Prisma.RequestUpdateInput> {
    const { category, fromId, toId, ...partialRequest } = data;
    await this.validateCategories([category]);
    const members = await this.prisma.member.findMany({
      where: { id: { in: [fromId, toId] } },
    });

    if (members.length !== 2) {
      throw new BadRequestException(`Invalid member's id ${fromId}, ${toId}`);
    }

    return {
      ...partialRequest,
      to: { connect: { id: toId } },
      from: { connect: { id: fromId } },
      Category: { connect: { name: category } },
    };
  }

  private async validateCategories(categories: string[]) {
    const foundCategories = await this.prisma.requestCategory.findMany({
      where: { name: { in: categories } },
    });

    if (foundCategories.length !== categories.length) {
      throw new BadRequestException(`Invalid request categories`);
    }
  }
}
