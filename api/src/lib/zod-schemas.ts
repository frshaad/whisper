import sanitizeHtml from 'sanitize-html'
import z from 'zod'

import {
  FULLNAME_REGEX_PATTERN,
  MAX_FULLNAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_REGEX_PATTERN,
} from '@/lib/constants'

const usernameSchema = z
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

const passwordSchema = z
  .string()
  .trim()
  .min(MIN_PASSWORD_LENGTH, {
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  })
  .regex(PASSWORD_REGEX_PATTERN, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })

const fullnameSchema = z
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

export const loginInputsSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export const signupInputsSchema = loginInputsSchema
  .extend({
    fullname: fullnameSchema,
    confirmPassword: z.string().trim(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

export const updateProfileInputSchema = z
  .object({
    fullname: fullnameSchema.optional(),
    profilePic: z
      .string()
      .url({ message: 'Profile picture must be a valid URL' })
      .optional(),
  })
  .refine((data) => data.fullname || data.profilePic, {
    message: 'At least one of fullname or profilePic must be provided',
  })

export const messageSchema = z
  .object({
    text: z
      .string()
      .trim()
      .max(MAX_MESSAGE_LENGTH, {
        message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      })
      .optional()
      .transform((val) =>
        val
          ? sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
          : undefined,
      ),
    image: z.string().url('Invalid image URL').optional(),
  })
  .refine(({ image, text }) => Boolean(text || image), {
    message: 'Either text or image is required',
  })
