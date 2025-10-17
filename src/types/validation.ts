import { Timestamp } from 'firebase/firestore';
import type {
  UserProfile,
  Event,
  EventStatus,
  EventVisibility,
  DuoType,
  Gender,
  Vibe,
  ConnectionIntention,
  ReportCategory,
  ValidationResult,
  EventValidationResult
} from './firestore';
import { GENDER } from './firestore';

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION_LIMITS = {
  // User profile limits
  FIRST_NAME_MIN_LENGTH: 2,
  FIRST_NAME_MAX_LENGTH: 50,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 50,
  MIN_AGE: 13,
  MAX_AGE: 120,
  BIO_MAX_LENGTH: 500,
  FUN_FACT_MAX_LENGTH: 200,
  LIKES_MAX_LENGTH: 300,
  DISLIKES_MAX_LENGTH: 300,
  HOBBIES_MAX_LENGTH: 300,
  
  // Event limits
  EVENT_TITLE_MIN_LENGTH: 3,
  EVENT_TITLE_MAX_LENGTH: 100,
  EVENT_DESCRIPTION_MIN_LENGTH: 10,
  EVENT_DESCRIPTION_MAX_LENGTH: 1000,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 30,
  
  // Message limits
  MESSAGE_MAX_LENGTH: 1000,
  NOTIFICATION_MESSAGE_MAX_LENGTH: 200,
  
  // Report limits
  REPORT_DESCRIPTION_MIN_LENGTH: 10,
  REPORT_DESCRIPTION_MAX_LENGTH: 500
} as const;

export const VALIDATION_REGEX = {
  FIRST_NAME: /^[a-zA-Z\s\-'.]+$/,
  DISPLAY_NAME: /^[a-zA-Z\s\-'.]+$/,
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  TAG: /^[a-zA-Z0-9\s\-_]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s\-()]+$/
} as const;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateFirstName(firstName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!firstName || firstName.trim().length === 0) {
    errors.push('First name is required');
  } else {
    if (firstName.length < VALIDATION_LIMITS.FIRST_NAME_MIN_LENGTH) {
      errors.push(`First name must be at least ${VALIDATION_LIMITS.FIRST_NAME_MIN_LENGTH} characters`);
    }
    if (firstName.length > VALIDATION_LIMITS.FIRST_NAME_MAX_LENGTH) {
      errors.push(`First name must be no more than ${VALIDATION_LIMITS.FIRST_NAME_MAX_LENGTH} characters`);
    }
    if (!VALIDATION_REGEX.FIRST_NAME.test(firstName)) {
      errors.push('First name can only contain letters, spaces, hyphens, apostrophes, and periods');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDisplayName(displayName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display name is required');
  } else {
    if (displayName.length < VALIDATION_LIMITS.DISPLAY_NAME_MIN_LENGTH) {
      errors.push(`Display name must be at least ${VALIDATION_LIMITS.DISPLAY_NAME_MIN_LENGTH} characters`);
    }
    if (displayName.length > VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH) {
      errors.push(`Display name must be no more than ${VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH} characters`);
    }
    if (!VALIDATION_REGEX.DISPLAY_NAME.test(displayName)) {
      errors.push('Display name can only contain letters, spaces, hyphens, apostrophes, and periods');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    if (!VALIDATION_REGEX.EMAIL.test(email)) {
      errors.push('Please enter a valid email address');
    } else {
      // Check for fake/test domains
      const fakeDomains = ['example.com', 'test.com', 'fake.com', 'demo.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain && fakeDomains.includes(domain)) {
        errors.push('Please use a real email address, not a test email');
      }
      
      // Check for disposable email domains
      const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
      if (domain && disposableDomains.includes(domain)) {
        errors.push('Please use a permanent email address, not a temporary one');
      }
      
      // Check for very short local parts
      const localPart = email.split('@')[0];
      if (localPart && localPart.length < 2) {
        errors.push('Email address seems too short to be valid');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateBirthDate(birthDate: string): ValidationResult {
  const errors: string[] = [];
  
  if (!birthDate) {
    errors.push('Birth date is required');
  } else {
    const birth = new Date(birthDate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    
    if (isNaN(birth.getTime())) {
      errors.push('Please enter a valid birth date');
    } else if (age < VALIDATION_LIMITS.MIN_AGE) {
      errors.push(`You must be at least ${VALIDATION_LIMITS.MIN_AGE} years old`);
    } else if (age > VALIDATION_LIMITS.MAX_AGE) {
      errors.push(`Age must be no more than ${VALIDATION_LIMITS.MAX_AGE} years`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateGender(gender: Gender): ValidationResult {
  const validGenders: Gender[] = [GENDER.MALE, GENDER.FEMALE, GENDER.NON_BINARY, GENDER.PREFER_NOT_TO_SAY];
  
  return {
    isValid: validGenders.includes(gender),
    errors: validGenders.includes(gender) ? [] : ['Please select a valid gender']
  };
}

// Type guard to check if a string is a valid Gender
export function isGender(value: string | null): value is Gender {
  if (!value) return false;
  const validGenders: Gender[] = [GENDER.MALE, GENDER.FEMALE, GENDER.NON_BINARY, GENDER.PREFER_NOT_TO_SAY];
  return validGenders.includes(value as Gender);
}

export function validateEventTitle(title: string): ValidationResult {
  const errors: string[] = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Event title is required');
  } else {
    if (title.length < VALIDATION_LIMITS.EVENT_TITLE_MIN_LENGTH) {
      errors.push(`Event title must be at least ${VALIDATION_LIMITS.EVENT_TITLE_MIN_LENGTH} characters`);
    }
    if (title.length > VALIDATION_LIMITS.EVENT_TITLE_MAX_LENGTH) {
      errors.push(`Event title must be no more than ${VALIDATION_LIMITS.EVENT_TITLE_MAX_LENGTH} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEventDescription(description: string): ValidationResult {
  const errors: string[] = [];
  
  if (!description || description.trim().length === 0) {
    errors.push('Event description is required');
  } else {
    if (description.length < VALIDATION_LIMITS.EVENT_DESCRIPTION_MIN_LENGTH) {
      errors.push(`Event description must be at least ${VALIDATION_LIMITS.EVENT_DESCRIPTION_MIN_LENGTH} characters`);
    }
    if (description.length > VALIDATION_LIMITS.EVENT_DESCRIPTION_MAX_LENGTH) {
      errors.push(`Event description must be no more than ${VALIDATION_LIMITS.EVENT_DESCRIPTION_MAX_LENGTH} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEventTags(tags: string[]): ValidationResult {
  const errors: string[] = [];
  
  if (tags.length > VALIDATION_LIMITS.MAX_TAGS) {
    errors.push(`Maximum ${VALIDATION_LIMITS.MAX_TAGS} tags allowed`);
  }
  
  for (const tag of tags) {
    if (tag.length === 0) {
      errors.push('Tags cannot be empty');
    } else if (tag.length > VALIDATION_LIMITS.TAG_MAX_LENGTH) {
      errors.push(`Each tag must be no more than ${VALIDATION_LIMITS.TAG_MAX_LENGTH} characters`);
    } else if (!VALIDATION_REGEX.TAG.test(tag)) {
      errors.push('Tags can only contain letters, numbers, spaces, hyphens, and underscores');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEventCapacity(capacity: number): ValidationResult {
  return {
    isValid: capacity === 4,
    errors: capacity !== 4 ? ['Event capacity must be exactly 4 participants (2 pairs of 2)'] : []
  };
}

export function validateEventPairs(pairs: Event['pairs']): ValidationResult {
  const errors: string[] = [];
  
  if (!pairs.pair1.userA || !pairs.pair1.userB) {
    errors.push('Pair 1 must have both User A and User B');
  }
  
  if (!pairs.pair2.userC || !pairs.pair2.userD) {
    errors.push('Pair 2 must have both User C and User D');
  }
  
  // Check for duplicate users
  const allUsers = [pairs.pair1.userA, pairs.pair1.userB, pairs.pair2.userC, pairs.pair2.userD];
  const uniqueUsers = new Set(allUsers);
  if (uniqueUsers.size !== 4) {
    errors.push('All four participants must be unique users');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEventStatus(status: EventStatus): ValidationResult {
  const validStatuses: EventStatus[] = ['pending', 'live', 'confirmed', 'completed', 'cancelled'];
  
  return {
    isValid: validStatuses.includes(status),
    errors: validStatuses.includes(status) ? [] : ['Invalid event status']
  };
}

export function validateEventVisibility(visibility: EventVisibility): ValidationResult {
  const validVisibilities: EventVisibility[] = ['public', 'private', 'friends'];
  
  return {
    isValid: validVisibilities.includes(visibility),
    errors: validVisibilities.includes(visibility) ? [] : ['Invalid event visibility']
  };
}

export function validateDuoType(duoType: DuoType): ValidationResult {
  const validTypes: DuoType[] = ['friends', 'couples', 'family', 'roommates', 'colleagues'];
  
  return {
    isValid: validTypes.includes(duoType),
    errors: validTypes.includes(duoType) ? [] : ['Invalid duo type']
  };
}

export function validateVibes(vibes: Vibe[]): ValidationResult {
  const validVibes: Vibe[] = [
    'adventurous', 'chill', 'funny', 'curious', 'outgoing', 'creative',
    'foodies', 'active', 'culture', 'family-friendly', 'organizers',
    'nightlife', 'mindful'
  ];
  
  const errors: string[] = [];
  
  for (const vibe of vibes) {
    if (!validVibes.includes(vibe)) {
      errors.push(`Invalid vibe: ${vibe}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateConnectionIntention(intention: ConnectionIntention): ValidationResult {
  const validIntentions: ConnectionIntention[] = ['friends', 'experience', 'networking', 'romantic', 'curious'];
  
  return {
    isValid: validIntentions.includes(intention),
    errors: validIntentions.includes(intention) ? [] : ['Invalid connection intention']
  };
}

export function validateReportCategory(category: ReportCategory): ValidationResult {
  const validCategories: ReportCategory[] = [
    'harassment', 'spam', 'inappropriate_content', 'fake_profile',
    'safety_concern', 'other'
  ];
  
  return {
    isValid: validCategories.includes(category),
    errors: validCategories.includes(category) ? [] : ['Invalid report category']
  };
}

export function validateMessageContent(content: string): ValidationResult {
  const errors: string[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push('Message content is required');
  } else if (content.length > VALIDATION_LIMITS.MESSAGE_MAX_LENGTH) {
    errors.push(`Message must be no more than ${VALIDATION_LIMITS.MESSAGE_MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateReportDescription(description: string): ValidationResult {
  const errors: string[] = [];
  
  if (!description || description.trim().length === 0) {
    errors.push('Report description is required');
  } else {
    if (description.length < VALIDATION_LIMITS.REPORT_DESCRIPTION_MIN_LENGTH) {
      errors.push(`Report description must be at least ${VALIDATION_LIMITS.REPORT_DESCRIPTION_MIN_LENGTH} characters`);
    }
    if (description.length > VALIDATION_LIMITS.REPORT_DESCRIPTION_MAX_LENGTH) {
      errors.push(`Report description must be no more than ${VALIDATION_LIMITS.REPORT_DESCRIPTION_MAX_LENGTH} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// COMPOSITE VALIDATION FUNCTIONS
// ============================================================================

export function validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
  const errors: string[] = [];
  
  // Validate required fields
  if (profile.firstName) {
    const firstNameResult = validateFirstName(profile.firstName);
    errors.push(...firstNameResult.errors);
  }
  
  if (profile.displayName) {
    const displayNameResult = validateDisplayName(profile.displayName);
    errors.push(...displayNameResult.errors);
  }
  
  if (profile.email) {
    const emailResult = validateEmail(profile.email);
    errors.push(...emailResult.errors);
  }
  
  if (profile.birthDate) {
    const birthDateResult = validateBirthDate(profile.birthDate);
    errors.push(...birthDateResult.errors);
  }
  
  if (profile.gender) {
    const genderResult = validateGender(profile.gender);
    errors.push(...genderResult.errors);
  }
  
  // Validate optional fields
  if (profile.funFact && profile.funFact.length > VALIDATION_LIMITS.FUN_FACT_MAX_LENGTH) {
    errors.push(`Fun fact must be no more than ${VALIDATION_LIMITS.FUN_FACT_MAX_LENGTH} characters`);
  }
  
  if (profile.likes && profile.likes.length > VALIDATION_LIMITS.LIKES_MAX_LENGTH) {
    errors.push(`Likes must be no more than ${VALIDATION_LIMITS.LIKES_MAX_LENGTH} characters`);
  }
  
  if (profile.dislikes && profile.dislikes.length > VALIDATION_LIMITS.DISLIKES_MAX_LENGTH) {
    errors.push(`Dislikes must be no more than ${VALIDATION_LIMITS.DISLIKES_MAX_LENGTH} characters`);
  }
  
  if (profile.hobbies && profile.hobbies.length > VALIDATION_LIMITS.HOBBIES_MAX_LENGTH) {
    errors.push(`Hobbies must be no more than ${VALIDATION_LIMITS.HOBBIES_MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEvent(event: Partial<Event>): EventValidationResult {
  const errors: string[] = [];
  let capacityValid = true;
  let pairsValid = true;
  let preferencesValid = true;
  
  // Validate basic fields
  if (event.title) {
    const titleResult = validateEventTitle(event.title);
    errors.push(...titleResult.errors);
  }
  
  if (event.description) {
    const descriptionResult = validateEventDescription(event.description);
    errors.push(...descriptionResult.errors);
  }
  
  if (event.tags) {
    const tagsResult = validateEventTags(event.tags);
    errors.push(...tagsResult.errors);
  }
  
  if (event.capacity !== undefined) {
    const capacityResult = validateEventCapacity(event.capacity);
    capacityValid = capacityResult.isValid;
    errors.push(...capacityResult.errors);
  }
  
  if (event.pairs) {
    const pairsResult = validateEventPairs(event.pairs);
    pairsValid = pairsResult.isValid;
    errors.push(...pairsResult.errors);
  }
  
  if (event.status) {
    const statusResult = validateEventStatus(event.status);
    errors.push(...statusResult.errors);
  }
  
  if (event.visibility) {
    const visibilityResult = validateEventVisibility(event.visibility);
    errors.push(...visibilityResult.errors);
  }
  
  // Validate preferences
  if (event.preferences) {
    if (event.preferences.duoType) {
      const duoTypeResult = validateDuoType(event.preferences.duoType);
      if (!duoTypeResult.isValid) {
        preferencesValid = false;
        errors.push(...duoTypeResult.errors);
      }
    }
    
    if (event.preferences.desiredVibes) {
      const vibesResult = validateVibes(event.preferences.desiredVibes);
      if (!vibesResult.isValid) {
        preferencesValid = false;
        errors.push(...vibesResult.errors);
      }
    }
    
    if (event.preferences.connectionIntention) {
      const intentionResult = validateConnectionIntention(event.preferences.connectionIntention);
      if (!intentionResult.isValid) {
        preferencesValid = false;
        errors.push(...intentionResult.errors);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    capacityValid,
    pairsValid,
    preferencesValid
  };
}

// ============================================================================
// UTILITY VALIDATION FUNCTIONS
// ============================================================================

export function validateUrl(url: string): ValidationResult {
  return {
    isValid: VALIDATION_REGEX.URL.test(url),
    errors: VALIDATION_REGEX.URL.test(url) ? [] : ['Please enter a valid URL']
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  return {
    isValid: VALIDATION_REGEX.PHONE.test(phone),
    errors: VALIDATION_REGEX.PHONE.test(phone) ? [] : ['Please enter a valid phone number']
  };
}

export function validateAgeRange(ageRange: { min: number; max: number }): ValidationResult {
  const errors: string[] = [];
  
  if (ageRange.min < VALIDATION_LIMITS.MIN_AGE) {
    errors.push(`Minimum age must be at least ${VALIDATION_LIMITS.MIN_AGE}`);
  }
  
  if (ageRange.max > VALIDATION_LIMITS.MAX_AGE) {
    errors.push(`Maximum age must be no more than ${VALIDATION_LIMITS.MAX_AGE}`);
  }
  
  if (ageRange.min > ageRange.max) {
    errors.push('Minimum age cannot be greater than maximum age');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTimestamp(timestamp: Timestamp): ValidationResult {
  const now = Timestamp.now();
  const eventTime = timestamp;
  
  return {
    isValid: eventTime.seconds > now.seconds,
    errors: eventTime.seconds <= now.seconds ? ['Event time must be in the future'] : []
  };
}
