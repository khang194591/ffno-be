import { MemberRole } from 'src/libs/constants';

declare module 'express' {
  interface Request {
    staff: { id: string; role: MemberRole };
  }
}

export {};
