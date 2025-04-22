import z from 'zod'

import {
  fullnameSchema,
  passwordSchema,
  usernameSchema,
} from '@/lib/zod-schemas'

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

export const changePasswordSchema = z.object({
  password: passwordSchema,
})
