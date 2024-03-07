import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const StaffId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const staff = request.staff;

    return staff.id;
  },
);
