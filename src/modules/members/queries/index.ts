import { GetListContactHandler } from './get-list-contact';
import { GetMemberHandler } from './get-member';

export * from './get-list-contact';
export * from './get-member';

export const QueryHandlers = [GetMemberHandler, GetListContactHandler];
