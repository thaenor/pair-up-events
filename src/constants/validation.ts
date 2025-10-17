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

export const FIRST_NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  REGEX: /^[a-zA-Z\s\-'.]+$/
} as const;

export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 6,
  REQUIREMENTS: {
    lowercase: /(?=.*[a-z])/,
    uppercase: /(?=.*[A-Z])/,
    number: /(?=.*\d)/
  }
} as const;

export const DISPLAY_NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  REGEX: /^[a-zA-Z\s\-'.]+$/
} as const;

import { GENDER } from '@/types';

export const BIRTHDATE_VALIDATION = {
  MIN_AGE: 13,
  MAX_AGE: 120
} as const;

export const GENDER_VALIDATION = {
  VALID_VALUES: [GENDER.MALE, GENDER.FEMALE, GENDER.NON_BINARY, GENDER.PREFER_NOT_TO_SAY]
} as const;

export const EVENT_VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  TAGS_MAX_COUNT: 10,
  TAGS_MAX_LENGTH: 20,
  CAPACITY: 4
} as const;

export const MESSAGE_VALIDATION = {
  CONTENT_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 1000
} as const;

export const REPORT_VALIDATION = {
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  CATEGORIES: [
    'harassment',
    'spam',
    'inappropriate_content',
    'fake_profile',
    'safety_concern',
    'other'
  ]
} as const;
