import { GetListRequestHandler } from './get-list-request';
import { GetRequestHandler } from './get-request';

export * from './get-list-request';
export * from './get-request';

export const QueryHandlers = [GetListRequestHandler, GetRequestHandler];
