import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const { success, data, error } = this.schema.safeParse(value);
    if (success) {
      return data;
    }
    console.log(JSON.stringify(error, null, 2));

    throw new BadRequestException(
      error.issues
        .map((issue) => `${issue.path[0]} is ${issue.message}`.toLowerCase())
        .join(', '),
    );
  }
}
