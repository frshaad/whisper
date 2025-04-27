import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

export function validateEnvironment(): z.infer<typeof environmentSchema> {
  // eslint-disable-next-line n/no-process-env
  const parsed = environmentSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

export const env = validateEnvironment()
