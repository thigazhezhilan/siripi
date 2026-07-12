import { z } from 'zod';

export const phoneAuthSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?\d{10,13}$/, 'auth.phoneInvalid'),
  password: z.string().min(6, 'auth.passwordTooShort'),
});

export type PhoneAuthFormValues = z.infer<typeof phoneAuthSchema>;
