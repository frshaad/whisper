import rateLimit from 'express-rate-limit'

import { RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW } from '@/lib/constants'

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_COUNT,
  message: {
    status: 'failed',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
