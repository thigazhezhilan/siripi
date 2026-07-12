import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().trim().email('admin.login.emailInvalid'),
  password: z.string().min(1, 'admin.login.passwordRequired'),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
