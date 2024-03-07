import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as util from 'util';

function getExtendedClient() {
  const client = () =>
    new PrismaClient().$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;
            /* istanbul ignore next */
            if (process.env.NODE_ENV !== 'test') {
              console.log(
                util.inspect(
                  `${operation} on ${model} table take ${time} milliseconds`,
                ),
              );
            }
            return result;
          },
        },
      },
      result: {
        propertyAmenity: {},
        member: {},
      },
    });

  return class {
    // wrapper with type-safety 🎉
    constructor() {
      return client();
    }
  } as new () => ReturnType<typeof client>;
}

@Injectable()
export class PrismaService extends getExtendedClient() {}
