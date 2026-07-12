import { z } from 'zod';

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?\d{10,13}$/, 'auth.phoneInvalid'),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;
