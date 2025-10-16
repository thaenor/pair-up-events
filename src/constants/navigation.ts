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
    EXPLORE: 'Explore',
    EXPLORE_ARIA: 'Browse and search events',
    MY_EVENTS: 'My Events',
    MY_EVENTS_ARIA: 'Manage your created and joined events',
    MESSENGER: 'Messenger',
    MESSENGER_ARIA: 'Chat with other duos',
    MY_PROFILE: 'My Profile',
    MY_PROFILE_ARIA: 'Edit your profile and settings',
  },
  CTA: {
    GET_STARTED: 'Get Started',
    GET_STARTED_ARIA_LABEL: 'Get started with Pair Up Events',
    LOGIN: 'Log in',
    LOGIN_ARIA_LABEL: 'Log in to your account',
    SIGN_UP: 'Sign up',
    SIGN_UP_ARIA_LABEL: 'Create a new account',
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
