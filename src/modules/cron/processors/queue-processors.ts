import { Process, Processor } from '@nestjs/bull';
import { QUEUE, QUEUE_JOB_NAMES } from 'src/libs';
import { CronService } from '../cron.service';

@Processor(QUEUE)
export class QueueProcessors {
  constructor(private readonly cronService: CronService) {}

  @Process({ name: QUEUE_JOB_NAMES.MONTHLY_INVOICE })
  async createMonthlyInvoice() {
    console.log('Create monthly invoice');
    await this.cronService.bulkCreateMonthlyInvoice();
  }

  @Process({ name: QUEUE_JOB_NAMES.HANDLE_LISTING })
  async handleListing() {
    console.log('Handle listing');
    await this.cronService.handleUnitListing();
  }
}
