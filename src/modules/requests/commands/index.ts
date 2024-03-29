import { CreateRequestHandler } from './create-request';
import { UpdateRequestHandler } from './update-request';

export * from './create-request';
export * from './update-request';

export const CommandHandlers = [CreateRequestHandler, UpdateRequestHandler];
