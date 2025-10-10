export const PROFILE_MESSAGES = {
  INVITE_FRIEND: {
    TITLE: 'PairUp Events - Connect & Discover Together',
    MESSAGE: `Hey! I wanted to invite you to check out PairUp Events - it's this amazing new app that helps pairs connect and discover events together! 🎉

Whether you're looking for date night ideas, adventure buddies, or just want to explore new experiences with someone special, this app makes it so easy to find and plan activities as a pair.

I think you'd really love it! Check it out here: {URL}

Let me know what you think! 😊`,
    SUCCESS_COPY: 'Invitation message copied to clipboard! You can now paste it in any messaging app to share with your friends.',
    SUCCESS_SHARE: 'Invitation shared successfully!'
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
  }
} as const;

export const PROFILE_CONFIG = {
  SURVEY_URL: 'https://forms.gle/F6xptEXPLA8wEpTp7',
  DATE_FORMAT_OPTIONS: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } as const
} as const;
