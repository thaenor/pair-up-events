# Configuration Inventory

This document provides a comprehensive overview of all configurable values, constants, and hardcoded strings throughout the PairUp Events codebase. These values can be centralized and made configurable with minimal footprint changes.

## Table of Contents

1. [Constants Files](#constants-files)
2. [Environment Variables](#environment-variables)
3. [Theme & Styling Configuration](#theme--styling-configuration)
4. [Component Configuration](#component-configuration)
5. [External Service Configuration](#external-service-configuration)
6. [Hardcoded Strings & Content](#hardcoded-strings--content)
7. [Validation Rules](#validation-rules)
8. [URLs & Endpoints](#urls--endpoints)

## Constants Files

### `src/constants/messages.ts`
**Purpose**: User-facing validation and error messages
**Configurable Values**:
```typescript
VALIDATION_MESSAGES = {
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
}
```

### `src/constants/profile.ts`
**Purpose**: Profile-related copy, messages, and configuration
**Configurable Values**:
```typescript
PROFILE_COPY = {
  HEADER: {
    LOGO_ALT: 'PairUp Events',
    TITLE: 'Your Profile',
    WELCOME_TITLE: 'Welcome back! 👋',
    WELCOME_BODY: "Thanks for being part of the PairUp Events community...",
  },
  DETAILS: {
    TITLE: 'Profile details',
    DESCRIPTION: 'Update how other duos see you across PairUp.',
    DISPLAY_NAME_LABEL: 'Display name',
    DISPLAY_NAME_PLACEHOLDER: 'Add your name',
    BIRTH_DATE_LABEL: 'Birth date',
    BIRTH_DATE_PLACEHOLDER: 'Select your birth date',
    GENDER_LABEL: 'Gender',
    GENDER_PLACEHOLDER: 'How do you identify?',
    EMAIL_FALLBACK: 'Not available',
    SUBMIT_IDLE: 'Save details',
    SUBMIT_LOADING: 'Saving…',
  },
  PREFERENCES: {
    TITLE: 'Preferences & vibe',
    DESCRIPTION: 'Share your fun facts so we can match you with the right duos.',
    FUN_FACT_LABEL: 'Fun fact about me',
    FUN_FACT_PLACEHOLDER: 'I once built a boat from recycled bottles...',
    LIKES_LABEL: 'I like',
    LIKES_PLACEHOLDER: 'Sunrise hikes, indie concerts, spontaneous road trips...',
    DISLIKES_LABEL: 'I dislike',
    DISLIKES_PLACEHOLDER: 'Crowded tourist traps, last-minute cancellations...',
    HOBBIES_LABEL: 'Hobbies',
    HOBBIES_PLACEHOLDER: 'Climbing, pottery, plant parenting, sci-fi book clubs...',
    SUBMIT_IDLE: 'Save preferences',
    SUBMIT_LOADING: 'Saving…',
  },
  INVITE_FRIEND: {
    TITLE: 'Invite a Friend',
    DESCRIPTION: 'Know someone who would love PairUp Events? Share the app with them!',
    CTA: 'Invite Friend',
  },
  INVITE_DUO: {
    FIELD_LABEL: 'Invite by email',
    LOADING_LABEL: 'Sending…',
  },
  DEVELOPMENT_NOTICE: '🚧 This app is currently in development... ',
  GENERAL: {
    UNKNOWN_VALUE: 'Unknown',
    INVALID_DATE: 'Invalid Date',
    SHARE_FALLBACK_ERROR: 'Unable to share or copy to clipboard',
  }
}
```
```typescript
PROFILE_MESSAGES = {
  INVITE_FRIEND: {
    TITLE: 'PairUp Events - Connect & Discover Together',
    MESSAGE: 'Hey! I wanted to invite you to check out PairUp Events...',
    SUCCESS_COPY: 'Invitation message copied to clipboard!',
    SUCCESS_SHARE: 'Invitation shared successfully!'
    ERROR_SHARE: 'We could not share your invite. Please try again.'
  },
  ALERTS: {
    PASSWORD_RESET_SUCCESS: 'Password reset email sent! Check your inbox.',
    PASSWORD_RESET_ERROR: 'Failed to send password reset email. Please try again.',
    ACCOUNT_DELETE_SUCCESS: 'Account deleted successfully.',
    ACCOUNT_DELETE_ERROR: 'Failed to delete account. Please try again.',
    DELETE_CONFIRMATION: 'Are you sure you want to delete your account?',
    PROFILE_SAVE_SUCCESS: 'Profile details updated successfully.',
    PROFILE_SAVE_ERROR: 'We could not update your profile details. Please try again.',
    PREFERENCES_SAVE_SUCCESS: 'Preferences saved! Your vibe is up to date.',
    PREFERENCES_SAVE_ERROR: 'We could not save your preferences. Please try again.'
  }
}

PROFILE_CONFIG = {
  SURVEY_URL: 'https://forms.gle/F6xptEXPLA8wEpTp7',
  DATE_FORMAT_OPTIONS: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
}
```

### `src/constants/navigation.ts`
**Purpose**: Navigation copy and feedback strings
**Configurable Values**:
```typescript
NAVIGATION_COPY = {
  LINKS: {
    HOW_IT_WORKS: 'How It Works',
    HOW_IT_WORKS_ARIA: 'Learn how Pair Up Events works',
    BENEFITS: 'Benefits',
    BENEFITS_ARIA: 'Learn about the benefits of Pair Up Events',
    EARLY_ACCESS: 'Early Access',
    EARLY_ACCESS_ARIA: 'Sign up for early access to Pair Up Events',
  },
  AUTHENTICATED: {
    WELCOME_PREFIX: 'Welcome, ',
    WELCOME_ARIA_LABEL: 'View your profile',
    PROFILE_ROUTE: '/profile',
  },
  CTA: {
    GET_STARTED: 'Get Started',
    GET_STARTED_ARIA_LABEL: 'Get started with Pair Up Events',
  },
  ACTIONS: {
    LOGOUT: 'Logout',
    LOGGING_OUT: 'Logging out...',
  }
}

NAVIGATION_MESSAGES = {
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_ERROR: 'Failed to log out. Please try again.'
}
```

### `src/constants/validation.ts`
**Purpose**: Validation rules and domain lists
**Configurable Values**:
```typescript
EMAIL_VALIDATION = {
  FAKE_DOMAINS: [
    'example.com', 'email.com', 'test.com', 'fake.com', 'dummy.com',
    'sample.com', 'demo.com', 'temp.com', 'temporary.com', 'invalid.com',
    'nonexistent.com', 'placeholder.com', 'example.org', 'example.net',
    'test.org', 'test.net'
  ],
  DISPOSABLE_DOMAINS: [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'yopmail.com', 'maildrop.cc',
    'getnada.com', 'sharklasers.com'
  ],
  REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  MIN_LOCAL_PART_LENGTH: 2
}

PASSWORD_VALIDATION = {
  MIN_LENGTH: 6,
  REQUIREMENTS: {
    lowercase: /(?=.*[a-z])/,
    uppercase: /(?=.*[A-Z])/,
    number: /(?=.*\d)/
  }
}
```

## Environment Variables

### Firebase Configuration (`src/lib/firebase/config.ts`)
**Required Environment Variables**:
```typescript
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
```

### Sentry Configuration (`src/lib/sentry.ts`)
**Required Environment Variables**:
```typescript
VITE_SENTRY_DSN
VITE_APP_VERSION (optional, defaults to '1.0.0')
```

### External Service Configuration (`src/lib/config.ts`)
**Configurable Values**:
```typescript
iframeURL = "https://sibforms.com/serve/MUIFAFLqsAW47gnNrDXUCqzyVXOATXu7PjahHmeb1AqYEwx7SxJMvu3yKUNMqQm9aiODyeTqHUWA7IklRCduPdiy26zsDtyuOczp56P4PpZKrU2kP8i9yHQP8l6cGp8v4xR3Gbujes1E7lAYjg4MCCSGL2EeIElUR64t6PJncqwNlP2cUiShr_0E-jx3FzqHd5rK5u3jXRXM8J_P"
```

## Theme & Styling Configuration

### Tailwind Configuration (`tailwind.config.ts`)
**Custom Color Palette**:
```typescript
pairup: {
  darkBlue: '#1A2A33',
  darkBlueAlt: '#223842',
  cyan: '#27E9F3',
  yellow: '#FECC08',
  cream: '#F5E6C8'
}
```

**Font Configuration**:
```typescript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  display: ['Poppins', 'sans-serif']
}
```

**Animation Configuration**:
```typescript
keyframes: {
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  }
},
animation: {
  'fade-in': 'fade-in 0.5s ease-out forwards'
}
```

## Component Configuration

### Logo Component (`src/components/atoms/Logo.tsx`)
**Size Configuration**:
```typescript
// Size mappings for logo display
const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
  xxl: "h-16 w-16",
  xxxl: "h-24 w-24",
  hero: "h-64 w-64 md:h-80 md:w-80"
}

const textClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
  xxxl: "text-3xl",
  hero: "text-4xl md:text-5xl lg:text-6xl"
}
```

**Logo Asset Path**:
```typescript
logoPath = "/d708028b-2d35-41b1-996e-d0c30bbad73a.png"
```

## Hardcoded Strings & Content

### Navigation Component (`src/components/organisms/Navigation.tsx`)
**Navigation Items**:
```typescript
// Hardcoded navigation links
const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Early Access", href: "#early-access" }
]
```

### Hero Section (`src/components/organisms/HeroSection.tsx`)
**Hero Content**:
```typescript
const heroContent = {
  headline: {
    part1: "Grab your friend",
    part2: "and meet another pair."
  },
  description: "Some activities are better as a group of 4. Create your listing and connect with like-minded duos to meet up for shared experiences.",
  ctaText: "Get Early Access"
}
```

### Benefits Section (`src/components/organisms/BenefitsSection.tsx`)
**Benefits Content**:
```typescript
const benefits = [
  {
    title: "Meaningful Connections",
    description: "Connect with like-minded pairs who share your interests and values.",
    icon: "🎯"
  },
  {
    title: "Safe & Comfortable",
    description: "Meet in groups of 4 for a more comfortable and secure social experience.",
    icon: "🛡️"
  },
  {
    title: "Curated Experiences",
    description: "Discover handpicked events and activities perfect for pairs to enjoy together.",
    icon: "✨"
  },
  {
    title: "Easy Planning",
    description: "Simple tools to coordinate and plan your group activities effortlessly.",
    icon: "📅"
  }
]
```

### Error Messages
**404 Page (`src/pages/NotFound.tsx`)**:
```typescript
const notFoundContent = {
  title: "404",
  heading: "Page Not Found",
  message: "The page you're looking for doesn't exist or has been moved.",
  ctaText: "Return Home"
}
```

**Error Boundary (`src/components/ErrorBoundary.tsx`)**:
```typescript
const errorMessages = {
  title: "Oops! Something went wrong",
  description: "We're sorry for the inconvenience. Our team has been notified and is working to fix this issue.",
  retryText: "Try Again",
  homeText: "Go Home"
}
```

### Development Messages
**Profile Page (`src/pages/profile.tsx`)**:
```typescript
const developmentNotice = "🚧 This app is currently in development. Thank you for your patience as we build something amazing!"
const surveyPrompt = "Help Us Build Something Amazing! 🚀"
const surveyDescription = "Thank you for creating an account! If you're interested in helping us shape the future of PairUp Events, we'd love to hear your thoughts and feedback."
```

**Terms/Privacy Pages**:
```typescript
const underConstructionMessage = "🚧 Under Construction! 🚧"
```

## URLs & Endpoints

### External URLs
```typescript
const externalUrls = {
  survey: "https://forms.gle/F6xptEXPLA8wEpTp7",
  brevoForm: "https://sibforms.com/serve/MUIFAFLqsAW47gnNrDXUCqzyVXOATXu7PjahHmeb1AqYEwx7SxJMvu3yKUNMqQm9aiODyeTqHUWA7IklRCduPdiy26zsDtyuOczp56P4PpZKrU2kP8i9yHQP8l6cGp8v4xR3Gbujes1E7lAYjg4MCCSGL2EeIElUR64t6PJncqwNlP2cUiShr_0E-jx3FzqHd5rK5u3jXRXM8J_P"
}
```

### Asset Paths
```typescript
const assetPaths = {
  logo: "/Logo.png",
  logoMobile: "/Header Logo Mobile.png",
  logoDesktop: "/Header Logo Desktop.png",
  logoUpload: "/d708028b-2d35-41b1-996e-d0c30bbad73a.png",
  placeholder: "/placeholder.svg",
  favicon: "/favicon.ico"
}
```

## Sentry Configuration Values

### Error Filtering (`src/lib/sentry.ts`)
```typescript
const ignoredErrors = [
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
  'Network request failed',
  'Loading chunk',
  'ChunkLoadError'
]

const sentryConfig = {
  tracesSampleRate: 0.1, // production
  replaysSessionSampleRate: 0.1, // production
  replaysOnErrorSampleRate: 1.0, // production
  release: '1.0.0' // default
}
```

## Recommendations for Centralization

### 1. Create a Central Config File
Create `src/config/app.ts` to centralize all configuration:

```typescript
export const APP_CONFIG = {
  // Branding
  BRAND: {
    NAME: 'PairUp Events',
    TAGLINE: 'Grab your friend and meet another pair',
    COLORS: {
      darkBlue: '#1A2A33',
      cyan: '#27E9F3',
      yellow: '#FECC08',
      cream: '#F5E6C8'
    }
  },

  // External Services
  EXTERNAL: {
    SURVEY_URL: 'https://forms.gle/F6xptEXPLA8wEpTp7',
    BREVO_FORM_URL: 'https://sibforms.com/serve/...'
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_MIN_LOCAL_PART: 2
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: '0.5s',
    LOGO_SIZES: { /* ... */ },
    NAVIGATION_ITEMS: [ /* ... */ ]
  }
}
```

### 2. Environment-Based Configuration
Move hardcoded values to environment variables where appropriate:

```typescript
// .env.example
VITE_APP_NAME=PairUp Events
VITE_SURVEY_URL=https://forms.gle/...
VITE_BREVO_FORM_URL=https://sibforms.com/serve/...
VITE_APP_VERSION=1.0.0
```

### 3. Content Management
Consider moving user-facing content to a content management system or JSON files for easier updates without code changes.

### 4. Theme System
Implement a more robust theme system that allows for easy color scheme changes and customization.

This configuration inventory provides a foundation for making the application more maintainable and configurable with minimal code changes.
