import bcrypt from 'bcryptjs'

import { env } from '@/lib/env'

export async function hashPassword(password: string): Promise<string> {
  const saltFactor = env.HASH_SALT_FACTOR
  const salt = await bcrypt.genSalt(saltFactor)
  return await bcrypt.hash(password, salt)
}
