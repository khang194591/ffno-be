import { z } from 'zod';

export const signInResSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  imgUrl: z.string(),
});

export type SignInResDto = z.infer<typeof signInResSchema>;
