export const PROFILE_COPY = {
  HEADER: {
    LOGO_ALT: 'PairUp Events',
    TITLE: 'Your Profile',
    WELCOME_TITLE: 'Welcome back! 👋',
    WELCOME_BODY:
      "Thanks for being part of the PairUp Events community. We're excited to have you on this journey as we build something amazing together!",
  },
  SNAPSHOT: {
    TITLE: 'Account snapshot',
    DISPLAY_NAME_PLACEHOLDER: 'Add your display name',
    EMAIL_PLACEHOLDER: 'Add your email address',
    TIMEZONE_PLACEHOLDER: 'Set your timezone',
    CREATED_PENDING: 'Pending',
    EMAIL_LABEL: 'Email',
    TIMEZONE_LABEL: 'Timezone',
    CREATED_LABEL: 'Joined',
    AVATAR_ALT: 'Profile avatar',
  },
  DETAILS: {
    TITLE: 'Profile details',
    DESCRIPTION: 'Update how other duos see you across PairUp.',
    DISPLAY_NAME_LABEL: 'Display name',
    DISPLAY_NAME_PLACEHOLDER: 'Add your name',
    TIMEZONE_LABEL: 'Timezone',
    TIMEZONE_PLACEHOLDER: 'e.g. America/Los_Angeles',
    BIRTH_DATE_LABEL: 'Birth date',
    BIRTH_DATE_PLACEHOLDER: 'Select your birth date',
    GENDER_LABEL: 'Gender',
    GENDER_PLACEHOLDER: 'How do you identify?',
    PHOTO_LABEL: 'Profile photo URL',
    PHOTO_PLACEHOLDER: 'Paste a link to your photo',
    EMAIL_LABEL: 'Email',
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
    EMAIL_NOTIFICATIONS_LABEL: 'Email notifications',
    EMAIL_NOTIFICATIONS_DESCRIPTION: 'Receive updates about new matches and event confirmations.',
    PUSH_NOTIFICATIONS_LABEL: 'Push notifications',
    PUSH_NOTIFICATIONS_DESCRIPTION: 'Get instant alerts from the mobile or PWA experience.',
    SUBMIT_IDLE: 'Save preferences',
    SUBMIT_LOADING: 'Saving…',
  },
  STATS: {
    TITLE: 'Your PairUp journey',
    EVENTS_CREATED_LABEL: 'Events created',
    EVENTS_JOINED_LABEL: 'Events joined',
    FOOTER: 'Keep exploring! Your story grows every time you connect with another duo.',
  },
  SURVEY: {
    TITLE: 'Help Us Build Something Amazing! 🚀',
    DESCRIPTION:
      "Thank you for creating an account! If you're interested in helping us shape the future of PairUp Events, we'd love to hear your thoughts and feedback.",
    CTA: 'Share Your Feedback',
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
  DEVELOPMENT_NOTICE:
    '🚧 This app is currently in development. Thank you for your patience as we build something amazing!',
  GENERAL: {
    UNKNOWN_VALUE: 'Unknown',
    INVALID_DATE: 'Invalid Date',
    SHARE_FALLBACK_ERROR: 'Unable to share or copy to clipboard',
  },
} as const;

export const PROFILE_MESSAGES = {
  INVITE_FRIEND: {
    TITLE: 'PairUp Events - Connect & Discover Together',
    MESSAGE: `Hey! I wanted to invite you to check out PairUp Events - it's this amazing new app that helps pairs connect and discover events together! 🎉

Whether you're looking for date night ideas, adventure buddies, or just want to explore new experiences with someone special, this app makes it so easy to find and plan activities as a pair.

I think you'd really love it! Check it out here: {URL}

Let me know what you think! 😊`,
    SUCCESS_COPY: 'Invitation message copied to clipboard! You can now paste it in any messaging app to share with your friends.',
    SUCCESS_SHARE: 'Invitation shared successfully!',
    ERROR_SHARE: 'We could not share your invite. Please try again.',
  },
  INVITE_DUO: {
    TITLE: 'Invite your duo to join PairUp Events',
    DESCRIPTION: 'Bring your partner, best friend, or favorite teammate along so you can experience PairUp together.',
    CTA: 'Send invite',
    EMAIL_PLACEHOLDER: 'friend@example.com',
    REQUIRED: 'Please enter an email address.',
    INVALID_EMAIL: 'Enter a valid email so we can draft your invite.',
    SUBJECT: 'Join me on PairUp Events! 💫',
    MESSAGE: `Hey! I just created a PairUp Events account and would love for us to explore duos together. Take a look and sign up with me so we can plan our next outing: {URL}`,
    SUCCESS: 'We opened your email app so you can send the invite.',
    ERROR: 'We could not open your email app. Please try again.',
  },
  ALERTS: {
    PASSWORD_RESET_SUCCESS: 'Password reset email sent! Check your inbox.',
    PASSWORD_RESET_ERROR: 'Failed to send password reset email. Please try again.',
    ACCOUNT_DELETE_SUCCESS: 'Account deleted successfully.',
    ACCOUNT_DELETE_ERROR: 'Failed to delete account. Please try again.',
    DELETE_CONFIRMATION: 'Are you sure you want to delete your account? This action cannot be undone.',
    PROFILE_SAVE_SUCCESS: 'Profile details updated successfully.',
    PROFILE_SAVE_ERROR: 'We could not update your profile details. Please try again.',
    PREFERENCES_SAVE_SUCCESS: 'Preferences saved! Your vibe is up to date.',
    PREFERENCES_SAVE_ERROR: 'We could not save your preferences. Please try again.',
  },
} as const;

export const PROFILE_CONFIG = {
  SURVEY_URL: 'https://forms.gle/F6xptEXPLA8wEpTp7',
  DATE_FORMAT_OPTIONS: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as const,
} as const;
