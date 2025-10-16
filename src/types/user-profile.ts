// Re-export types from the main firestore types file for backward compatibility
export type {
  UserProfile,
  UserProfileUpdate,
  UserSettings as UserProfileSettings,
  PublicProfile,
  UserPreferences,
  Gender,
  Theme,
  ColorScheme,
  Language
} from './firestore';
