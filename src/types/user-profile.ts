import { Timestamp } from 'firebase/firestore';

export type UserProfileSettings = {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
};


export interface UserProfile {
  /** UID of the user — same as document ID */
  id: string;

  /** User's email (private field) */
  email: string;

  /** Full name or preferred display name */
  displayName: string;


  /** Account creation timestamp */
  createdAt: Timestamp;


  /** Notification preferences */
  settings?: UserProfileSettings | null;


  /** Additional profile metadata */
  username?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  funFact?: string | null;
  likes?: string | null;
  dislikes?: string | null;
  hobbies?: string | null;

  /** Index signature for additional properties */
  [key: string]: unknown;
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>;
