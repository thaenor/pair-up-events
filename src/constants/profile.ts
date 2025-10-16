export const PROFILE_COPY = {
  HEADER: {
    LOGO_ALT: 'PairUp Events',
    TITLE: 'Your Profile',
    WELCOME_TITLE: 'Welcome back! 👋',
    WELCOME_BODY:
      "Thanks for being part of the PairUp Events community. We're excited to have you on this journey as we build something amazing together!",
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

