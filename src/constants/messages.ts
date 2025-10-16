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
  },
  DISPLAY_NAME: {
    REQUIRED: 'Display name is required',
    TOO_SHORT: 'Display name must be at least 2 characters long',
    TOO_LONG: 'Display name must be less than 50 characters',
    INVALID: 'Display name can only contain letters, spaces, hyphens, apostrophes, and periods'
  },
  BIRTHDATE: {
    REQUIRED: 'Birthdate is required',
    TOO_YOUNG: 'You must be at least 13 years old to create an account',
    TOO_OLD: 'Please enter a valid birthdate',
    INVALID: 'Please enter a valid birthdate'
  }
} as const;
