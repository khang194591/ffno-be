import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { RequestStatus } from 'src/libs';
import { UpdateRequestDto } from 'src/shared/dto';

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

    const requestStatus = receivedRequests.every(
      (request) => request.status === RequestStatus.ACCEPTED,
    )
      ? RequestStatus.ACCEPTED
      : receivedRequests.some(
            (request) => request.status === RequestStatus.REJECTED,
          )
        ? RequestStatus.REJECTED
        : undefined;

    if (requestStatus) {
      await this.prisma.request.update({
        where: { id },
        data: { status: requestStatus },
      });
    }

    return id;
  }
}
