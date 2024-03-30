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
    const { senderId, receiverId, ...partialRequest } = data;
    const members = await this.prisma.member.findMany({
      where: { id: { in: [senderId, receiverId] } },
    });

    if (members.length !== 2) {
      throw new BadRequestException(
        `Invalid member's id ${senderId}, ${receiverId}`,
      );
    }

    return {
      ...partialRequest,
      category: partialRequest.category,
      receiver: { connect: { id: receiverId } },
      sender: { connect: { id: senderId } },
    };
  }
}
