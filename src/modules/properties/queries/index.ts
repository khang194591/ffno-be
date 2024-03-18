import { GetListPropertyHandler } from './get-list-property';
import { GetListTenantHandler } from './get-list-tenant';
import { GetPropertyHandler } from './get-property';

export * from './get-list-property';
export * from './get-list-tenant';
export * from './get-property';

export const QueryHandlers = [
  GetListPropertyHandler,
  GetPropertyHandler,
  GetListTenantHandler,
];
