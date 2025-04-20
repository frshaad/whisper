// Authentication
export const MIN_PASSWORD_LENGTH = 8
export const MIN_FULLNAME_LENGTH = 2
export const MAX_FULLNAME_LENGTH = 50
export const FULLNAME_REGEX_PATTERN = /^[a-zA-Z\s]*$/
export const PASSWORD_REGEX_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/

// Auth rate limiter
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
export const RATE_LIMIT_COUNT = 15 // Limit each IP to 5 requests per window

// Chat
export const MAX_MESSAGE_LENGTH = 1000
