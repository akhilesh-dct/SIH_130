import { z } from 'zod';

/**
 * Login form validation schema.
 * Validates business email format and password requirements.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Enter a valid email address')
    .max(254, 'Email address is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  role: z.enum(['business_user', 'officer', 'department_admin', 'super_admin']),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginFormDefaults: LoginFormValues = {
  email: '',
  password: '',
  role: 'business_user',
  rememberMe: false,
};
