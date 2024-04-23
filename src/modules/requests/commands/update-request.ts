import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { RequestCategory, RequestStatus } from 'src/libs/constants';
import { UpdateRequestDto } from 'src/libs/dto';

export class UpdateRequestCommand {
  constructor(
    public readonly memberId: string,
    public readonly data: UpdateRequestDto,
  ) {}
}

@CommandHandler(UpdateRequestCommand)
export class UpdateRequestHandler
  implements ICommandHandler<UpdateRequestCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ memberId, data }: UpdateRequestCommand): Promise<string> {
    const { id, status } = data;

    const request = await this.prisma.request.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.memberReceiveRequest.update({
      where: {
        requestId_memberId: { memberId: memberId, requestId: id },
      },
      data: { status },
    });

    if (status === RequestStatus.REJECTED) {
      await this.prisma.request.update({
        where: { id },
        data: { status: RequestStatus.REJECTED },
      });
      return id;
    }

    const receivedRequests = await this.prisma.memberReceiveRequest.findMany({
      where: { requestId: id },
    });

    const isAccepted = receivedRequests.every(
      (request) => request.status === RequestStatus.ACCEPTED,
    );

    if (isAccepted) {
      await this.prisma.request.update({
        where: { id },
        data: { status: RequestStatus.ACCEPTED },
      });

      if (request.unitId && request.category === RequestCategory.UNIT_LEASE) {
        await this.prisma.unit.update({
          where: { id: request.unitId },
          data: { tenants: { connect: { id: request.senderId } } },
        });
      }
    }

    return id;
  }
}
