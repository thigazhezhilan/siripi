import { z } from 'zod';

const phoneField = z
  .string()
  .trim()
  .regex(/^\+?\d{10,13}$/, 'auth.phoneInvalid');

export const registerSchema = z
  .object({
    phoneNumber: phoneField,
    password: z.string().min(6, 'auth.passwordTooShort'),
    confirmPassword: z.string().min(6, 'auth.passwordTooShort'),
    language: z.enum(['en', 'ta'], { message: 'auth.languageRequired' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phoneNumber: phoneField,
  password: z.string().min(1, 'auth.passwordRequired'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
