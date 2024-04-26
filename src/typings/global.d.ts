import { MemberRole } from 'src/libssss/constants';

declare module 'express' {
  interface Request {
    staff: {
      id: string;
      name: string;
      email: string;
      role: MemberRole;
    };
  }
}

export {};
