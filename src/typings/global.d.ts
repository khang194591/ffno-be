import { MemberRole } from 'src/libs/constants';

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
