import { GetListPropertyHandler } from './get-list-property';
import { GetListTenantHandler } from './get-list-tenant';
import { GetPropertyHandler } from './get-property';
import { GetSimpleListPropertyHandler } from './get-simple-list-property';

export * from './get-list-property';
export * from './get-list-tenant';
export * from './get-property';
export * from './get-simple-list-property';

export const QueryHandlers = [
  GetListPropertyHandler,
  GetPropertyHandler,
  GetListTenantHandler,
  GetSimpleListPropertyHandler,
];
