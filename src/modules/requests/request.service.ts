import { Injectable } from '@nestjs/common';
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
    const { unitId, propertyId, receiverIds = [], ...partialRequest } = data;

    if (unitId && propertyId && !receiverIds.length) {
      const { property, tenants } = await this.prisma.unit.findUnique({
        where: { id: unitId },
        select: {
          property: { select: { ownerId: true } },
          tenants: { select: { id: true } },
        },
      });

      receiverIds.push(property.ownerId);
      receiverIds.push(...tenants.map(({ id }) => id));
    }

    return {
      ...partialRequest,
      status: RequestStatus.PENDING,
      category: partialRequest.category,
      unit: { connect: { id: unitId } },
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
