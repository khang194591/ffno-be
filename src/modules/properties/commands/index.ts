import { CreatePropertyCommand } from './create-property';
import { DeletePropertyCommand } from './delete-property';
import { UpdatePropertyCommand } from './update-property';

export * from './create-property';
export * from './delete-property';
export * from './update-property';

export const CommandHandlers = [
  CreatePropertyCommand,
  UpdatePropertyCommand,
  DeletePropertyCommand,
];
