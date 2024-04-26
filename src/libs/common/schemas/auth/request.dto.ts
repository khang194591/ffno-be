import { z } from 'zod';
import { Gender, MemberRole } from '../../enums';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(1),
  gender: z.nativeEnum(Gender),
  address: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  identityNumber: z.string().length(12).optional(),
  role: z.nativeEnum(MemberRole).refine((arg) => arg !== MemberRole.ADMIN),
});

export type SignInDto = z.infer<typeof signInSchema>;

export type SignUpDto = z.infer<typeof signUpSchema>;
