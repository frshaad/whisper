import z from 'zod'

import {
  MAX_FULLNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/lib/constants'

export const loginInputsSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email format'),
  password: z
    .string()
    .trim()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character',
    ),
})

export const signupInputsSchema = loginInputsSchema
  .extend({
    fullname: z
      .string()
      .trim()
      .min(
        MIN_FULLNAME_LENGTH,
        `Name must be at least ${MIN_FULLNAME_LENGTH} characters`,
      )
      .max(
        MAX_FULLNAME_LENGTH,
        `Name must not exceed ${MAX_FULLNAME_LENGTH} characters`,
      )
      .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    confirmPassword: z.string().trim(),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })
