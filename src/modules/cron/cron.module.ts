import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { QUEUE, QUEUE_JOB_NAMES } from 'src/libs';
import { CronService } from './cron.service';
import { Processors } from './processors';

@Module({
  imports: [CqrsModule, BullModule.registerQueue({ name: QUEUE })],
  providers: [...Processors, CronService],
  exports: [BullModule],
})
export class CronModule implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE)
    private readonly queue: Queue,
  ) {}

  async onModuleInit() {
    await this.queue.add(
      QUEUE_JOB_NAMES.MONTHLY_INVOICE,
      { payload: {} },
      {
        repeat: {
          cron: CronExpression.EVERY_10_HOURS,
        },
      },
    );

    await this.queue.add(
      QUEUE_JOB_NAMES.HANDLE_LISTING,
      { payload: {} },
      {
        repeat: {
          cron: CronExpression.EVERY_DAY_AT_MIDNIGHT,
        },
      },
    );
  }
}
