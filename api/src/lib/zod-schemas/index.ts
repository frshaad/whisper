import z from 'zod'

import {
  FULLNAME_REGEX_PATTERN,
  MAX_FULLNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_REGEX_PATTERN,
} from '@/lib/constants'

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(MIN_USERNAME_LENGTH, {
    message: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
  })
  .max(MAX_USERNAME_LENGTH, {
    message: `Username must be at most ${MAX_USERNAME_LENGTH} characters`,
  })
  .superRefine((val, ctx) => {
    if (!/^[a-z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username must start with a lowercase letter',
      })
    }
    if (!/^[a-z0-9_]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Username can only contain lowercase letters, numbers, and underscores',
      })
    }
    if (/__/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username cannot contain double underscores',
      })
    }
    if (/_$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username cannot end with an underscore',
      })
    }
  })

export const passwordSchema = z
  .string()
  .trim()
  .min(MIN_PASSWORD_LENGTH, {
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  })
  .regex(PASSWORD_REGEX_PATTERN, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })

export const fullnameSchema = z
  .string()
  .trim()
  .min(MIN_FULLNAME_LENGTH, {
    message: `Name must be at least ${MIN_FULLNAME_LENGTH} characters`,
  })
  .max(MAX_FULLNAME_LENGTH, {
    message: `Name must not exceed ${MAX_FULLNAME_LENGTH} characters`,
  })
  .regex(FULLNAME_REGEX_PATTERN, {
    message: 'Name can only contain letters and spaces',
  })
