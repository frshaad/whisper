import { config } from 'dotenv'
import { z } from 'zod'

const envResult = config()
if (envResult.error) {
  throw new Error('⚠️ Failed to load .env file')
}

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string()
    .min(1, { message: 'Port is required' })
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  HASH_SALT_FACTOR: z
    .string()
    .min(1, { message: 'Hash salt factor is required' })
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  DB_URI: z.string().min(1, { message: 'Database URI is required' }).url(),
  JWT_SECRET: z.string().min(1, { message: 'JWT Secret Key is required' }),
  CLIENT_URL: z.string().url(),
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, { message: 'Cloudinary Cloud Name is required' }),
  CLOUDINARY_API_KEY: z
    .string()
    .min(1, { message: 'Cloudinary Api Key is required' }),
  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, { message: 'Cloudinary Api Secret is required' }),
})

function validateEnvironment(): z.infer<typeof environmentSchema> {
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
