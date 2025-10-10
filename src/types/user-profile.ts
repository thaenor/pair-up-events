import { Timestamp } from 'firebase/firestore';

export type UserProfileSettings = {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
};

export type UserProfileStats = {
  eventsCreated?: number;
  eventsJoined?: number;
};

export interface UserProfile {
  /** UID of the user — same as document ID */
  id: string;

  /** User’s email (private field) */
  email: string;

  /** Full name or preferred display name */
  displayName: string;

  /** URL to profile photo (optional) */
  photoUrl?: string | null;

  /** Account creation timestamp */
  createdAt: Timestamp;

  /** Optional time zone (useful for event scheduling) */
  timezone?: string | null;

  /** Notification preferences */
  settings?: UserProfileSettings | null;

  /** App usage or engagement stats */
  stats?: UserProfileStats;

  /** Additional profile metadata */
  birthDate?: string | null;
  gender?: string | null;
  funFact?: string | null;
  likes?: string | null;
  dislikes?: string | null;
  hobbies?: string | null;
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>;
