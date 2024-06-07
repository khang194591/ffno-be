import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { RequestCategory, RequestStatus } from 'src/libs';
import { CreateRequestDto, RequestResDto } from 'src/shared/dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getRequestOrThrow(id: string): Promise<RequestResDto> {
    const request = await this.prisma.request.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(RequestResDto, request);
  }

  async validateRequestInput(
    staffId: string,
    data: CreateRequestDto,
  ): Promise<Prisma.RequestCreateInput> {
    const {
      unitId,
      propertyId,
      contractId,
      equipmentId,
      receiverIds = [],
      ...partialRequest
    } = data;

    if (unitId && propertyId && !receiverIds.length) {
      const { property, tenants } = await this.prisma.unit.findUnique({
        where: { id: unitId },
        select: {
          property: { select: { ownerId: true } },
          tenants: { select: { id: true } },
        },
      });

      receiverIds.push(property.ownerId);
      if (partialRequest.category === RequestCategory.UNIT_LEASE) {
        receiverIds.push(...tenants.map(({ id }) => id));
      }
    }

    if (contractId) {
      const { tenantId, landlordId } =
        await this.prisma.contract.findUniqueOrThrow({
          where: { id: contractId },
        });

      receiverIds.push(tenantId === staffId ? landlordId : tenantId);
    }

    return {
      ...partialRequest,
      status: RequestStatus.PENDING,
      category: partialRequest.category,
      unit: unitId && { connect: { id: unitId } },
      equipment: equipmentId && { connect: { id: equipmentId } },
      contract: contractId && { connect: { id: contractId } },
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
