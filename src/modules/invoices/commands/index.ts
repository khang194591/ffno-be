import { CreateInvoiceHandler } from './create-invoice';
import { MergeInvoicesHandler } from './merge-invoices';
import { UpdateInvoiceHandler } from './update-invoice';

export * from './create-invoice';
export * from './merge-invoices';
export * from './update-invoice';

export const CommandHandlers = [
  CreateInvoiceHandler,
  UpdateInvoiceHandler,
  MergeInvoicesHandler,
];
