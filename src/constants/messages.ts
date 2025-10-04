export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
    FAKE_DOMAIN: 'Please use a real email address, not a test email',
    DISPOSABLE: 'Please use a permanent email address, not a temporary one',
    TOO_SHORT: 'Email address seems too short to be valid'
  },
  PASSWORD: {
    TOO_SHORT: 'Password must be at least 6 characters long',
    NO_LOWERCASE: 'Password must contain at least one lowercase letter',
    NO_UPPERCASE: 'Password must contain at least one uppercase letter',
    NO_NUMBER: 'Password must contain at least one number'
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Please confirm your password',
    NO_MATCH: 'Passwords do not match'
  }
} as const;
