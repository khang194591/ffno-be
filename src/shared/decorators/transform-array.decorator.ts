import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray } from 'class-validator';

export const TransformArray = () =>
  applyDecorators(Transform(({ value }) => (isArray(value) ? value : [value])));
