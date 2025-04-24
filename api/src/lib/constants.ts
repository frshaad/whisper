// User
export const MIN_PASSWORD_LENGTH = 8
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 20
export const MIN_FULLNAME_LENGTH = 2
export const MAX_FULLNAME_LENGTH = 50
export const FULLNAME_REGEX_PATTERN = /^[a-zA-Z\s]*$/
export const USERNAME_REGEX_PATTERN = /^[a-z][a-z0-9_]*$/
export const PASSWORD_REGEX_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/
export const PROFILE_PICTURE_REGEX_PATTERN = /^https?:\/\/.+\..+/

// Auth rate limiter
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
export const RATE_LIMIT_COUNT = 25 // Limit each IP to 5 requests per window

// Chat
export const MAX_MESSAGE_LENGTH = 1000
export const MAX_BIO_LENGTH = 70

// Search
export const SEARCH_QUERY_REGEX = /^[a-zA-Z0-9_ ]*$/
export const SEARCH_MIN_LIMIT = 3
export const SEARCH_MAX_LIMIT = 20
export const SEARCH_DEFAULT_LIMIT = 5
