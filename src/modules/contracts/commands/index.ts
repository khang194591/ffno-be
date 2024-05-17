import { CreateContractHandler } from './create-contract';
import { UpdateContractHandler } from './update-contract';

export * from './create-contract';
export * from './update-contract';

export const CommandHandlers = [CreateContractHandler, UpdateContractHandler];
