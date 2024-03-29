import { CreateInvoiceHandler } from './create-invoice';
import { UpdateInvoiceHandler } from './update-invoice';

export * from './create-invoice';
export * from './update-invoice';

export const CommandHandlers = [CreateInvoiceHandler, UpdateInvoiceHandler];
