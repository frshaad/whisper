import z from 'zod'

import {
  FULLNAME_REGEX_PATTERN,
  MAX_FULLNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REGEX_PATTERN,
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
      PASSWORD_REGEX_PATTERN,
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
      .regex(
        FULLNAME_REGEX_PATTERN,
        'Name can only contain letters and spaces',
      ),
    confirmPassword: z.string().trim(),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

export const updateProfileInputSchema = z
  .object({
    profilePic: z.string().url().optional(),
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
      .regex(FULLNAME_REGEX_PATTERN, 'Name can only contain letters and spaces')
      .optional(),
  })
  .refine(
    ({ fullname, profilePic }) =>
      fullname !== undefined || profilePic !== undefined,
    {
      message: 'At least one of "Full Name" or "Profile Pic" must be provided.',
    },
  )
