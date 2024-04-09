import { CreatePropertyHandler } from './create-property';
import { DeletePropertyHandler } from './delete-property';
import { UpdatePropertyHandler } from './update-property';

export * from './create-property';
export * from './delete-property';
export * from './update-property';

export const CommandHandlers = [
  CreatePropertyHandler,
  UpdatePropertyHandler,
  DeletePropertyHandler,
];
