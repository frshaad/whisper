import 'dotenv/config'

import { z } from 'zod'

const environmentSchema = z.object({
  PORT: z.coerce.number(),
})

function validateEnvironment(): z.infer<typeof environmentSchema> {
  // eslint-disable-next-line n/no-process-env
  const parsed = environmentSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

export const env = validateEnvironment()
