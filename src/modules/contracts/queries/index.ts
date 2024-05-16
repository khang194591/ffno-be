import { GetContractHandler } from './get-contract';
import { GetListContractHandler } from './get-list-contract';

export * from './get-contract';
export * from './get-list-contract';

export const QueryHandlers = [GetContractHandler, GetListContractHandler];
