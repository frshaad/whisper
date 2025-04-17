import z from 'zod'

import { MIN_PASSWORD_LENGTH } from '@/lib/constants'

export const loginInputsSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .trim()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    ),
})

export const signupInputsSchema = loginInputsSchema
  .extend({
    fullname: z.string().trim(),
    confirmPassword: z.string().trim(),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })
