declare module 'express' {
  interface Request {
    staff: { id: string };
  }
}

export {};
