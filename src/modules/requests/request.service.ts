import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { RequestStatus } from 'src/libs/constants';
import { CreateRequestDto, GetRequestResDto } from 'src/libs/dto';

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
    staffId: string,
    data: CreateRequestDto,
  ): Promise<Prisma.RequestCreateInput> {
    const { receiverIds, ...partialRequest } = data;
    const members = await this.prisma.member.findMany({
      where: { id: { in: [staffId, ...receiverIds] } },
    });

    if (members.length !== 2) {
      throw new BadRequestException(
        `Invalid member's id ${staffId}, ${receiverIds}`,
      );
    }

    return {
      ...partialRequest,
      status: RequestStatus.PENDING,
      category: partialRequest.category,
      sender: { connect: { id: staffId } },
      receivers: {
        createMany: {
          data: receiverIds.map((receiverId) => ({
            memberId: receiverId,
            status: RequestStatus.PENDING,
          })),
        },
      },
    };
  }
}
