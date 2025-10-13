export const NAVIGATION_COPY = {
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
  },
} as const;

export const NAVIGATION_MESSAGES = {
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_ERROR: 'Failed to log out. Please try again.',
} as const;
