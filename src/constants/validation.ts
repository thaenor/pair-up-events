export const EMAIL_VALIDATION = {
  FAKE_DOMAINS: [
    'example.com',
    'email.com',
    'test.com',
    'fake.com',
    'dummy.com',
    'sample.com',
    'demo.com',
    'temp.com',
    'temporary.com',
    'invalid.com',
    'nonexistent.com',
    'placeholder.com',
    'example.org',
    'example.net',
    'test.org',
    'test.net'
  ],
  DISPOSABLE_DOMAINS: [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'sharklasers.com'
  ],
  REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  MIN_LOCAL_PART_LENGTH: 2
} as const;

export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 6,
  REQUIREMENTS: {
    lowercase: /(?=.*[a-z])/,
    uppercase: /(?=.*[A-Z])/,
    number: /(?=.*\d)/
  }
} as const;
