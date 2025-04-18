export const MIN_PASSWORD_LENGTH = 8
export const MIN_FULLNAME_LENGTH = 2
export const MAX_FULLNAME_LENGTH = 50

// Auth rate limiter
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
export const RATE_LIMIT_COUNT = 5 // Limit each IP to 5 requests per window
