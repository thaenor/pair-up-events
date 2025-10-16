import { FirebaseError } from 'firebase/app';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  type FirestoreDataConverter,
} from 'firebase/firestore';

import { logError, logWarning } from '@/utils/logger';
import type { 
  UserProfile, 
  UserProfileUpdate, 
  PublicProfile,
  Gender,
  Theme,
  ColorScheme,
  Language
} from '@/types';
import { validateUserProfile, calculateAge } from '@/types';
import { db } from './index';

const COLLECTION_NAME = 'users';
const PUBLIC_PROFILE_COLLECTION = 'public_profiles';

const removeUndefined = <T extends Record<string, unknown>>(value: T): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));

const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile) => removeUndefined(profile as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<UserProfile, 'id'>) } as UserProfile),
};

const publicProfileConverter: FirestoreDataConverter<PublicProfile> = {
  toFirestore: (profile: PublicProfile) => removeUndefined(profile as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<PublicProfile, 'id'>) } as PublicProfile),
};

const userProfileDoc = (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, COLLECTION_NAME, userId).withConverter(userProfileConverter);
};

const publicProfileDoc = (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, PUBLIC_PROFILE_COLLECTION, userId).withConverter(publicProfileConverter);
};

type CreateUserProfileParams = {
  id: string;
  email: string;
  firstName: string;
  displayName: string;
  birthDate: string;
  gender: Gender;
};

export const createUserProfile = async ({
  id,
  email,
  firstName,
  displayName,
  birthDate,
  gender,
}: CreateUserProfileParams): Promise<void> => {
  if (!db) {
    logWarning('Skipped creating user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'createUserProfile:disabled',
      additionalData: { id },
    });
    return;
  }

  // Validate required fields
  const validation = validateUserProfile({
    email,
    firstName,
    displayName,
    birthDate,
    gender,
  });

  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const profile: UserProfile = {
    email: email.trim(),
    firstName: firstName.trim(),
    displayName: displayName.trim(),
    birthDate: birthDate.trim(),
    gender,
    createdAt: Timestamp.now(),
    settings: {
      emailNotifications: true,
      pushNotifications: false,
      language: 'en' as Language,
      theme: 'light' as Theme,
      colorScheme: 'default' as ColorScheme,
    },
    preferences: {
      ageRange: { min: 18, max: 65 },
      preferredGenders: [],
      preferredVibes: [],
    },
  };

  try {
    await setDoc(userProfileDoc(id), profile, { merge: true });
    
    // Also create public profile
    await createPublicProfile(id, {
      firstName: profile.firstName,
      displayName: profile.displayName,
      age: calculateAge(profile.birthDate),
      gender: profile.gender,
    });
  } catch (error) {
    logError('Failed to create user profile', error, {
      component: 'firebase:user-profile',
      action: 'createUserProfile',
      additionalData: { id },
    });
    throw error;
  }
};

export const subscribeToUserProfile = (
  userId: string,
  onNext: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
) =>
  db
    ? onSnapshot(
      userProfileDoc(userId),
      snapshot => {
        if (snapshot.exists()) {
          onNext(snapshot.data());
          return;
        }
        onNext(null);
      },
      error => {
        logError('Failed to subscribe to user profile', error, {
          component: 'firebase:user-profile',
          action: 'subscribeToUserProfile',
          additionalData: { userId },
        });
        onError?.(error);
      },
    )
    : (() => {
        const error = new Error('Profile storage is not configured.');

        logWarning('Firestore is not configured; returning empty profile subscription.', {
          component: 'firebase:user-profile',
          action: 'subscribeToUserProfile:disabled',
          additionalData: { userId },
        });

        queueMicrotask(() => {
          onNext(null);
          onError?.(error);
        });

        return () => undefined;
      })();

export const updateUserProfile = async (userId: string, updates: UserProfileUpdate): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'updateUserProfile:disabled',
      additionalData: { userId, updates },
    });
    throw new Error('Profile storage is not configured.');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(userProfileDoc(userId), sanitizedUpdates);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'not-found') {
      try {
        await setDoc(
          userProfileDoc(userId),
          {
            createdAt: Timestamp.now(),
            ...sanitizedUpdates,
          },
          { merge: true },
        );
        return;
      } catch (setDocError) {
        logError('Failed to create user profile during update fallback', setDocError, {
          component: 'firebase:user-profile',
          action: 'updateUserProfile:fallback',
          additionalData: { userId, updates },
        });
        throw setDocError;
      }
    }

    logError('Failed to update user profile', error, {
      component: 'firebase:user-profile',
      action: 'updateUserProfile',
      additionalData: { userId, updates },
    });
    throw error;
  }
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped deleting user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'deleteUserProfile:disabled',
      additionalData: { userId },
    });
    return;
  }

  try {
    await deleteDoc(userProfileDoc(userId));
    // Also delete public profile
    await deleteDoc(publicProfileDoc(userId));
  } catch (error) {
    logError('Failed to delete user profile', error, {
      component: 'firebase:user-profile',
      action: 'deleteUserProfile',
      additionalData: { userId },
    });
    throw error;
  }
};

// ============================================================================
// PUBLIC PROFILE FUNCTIONS
// ============================================================================

export const createPublicProfile = async (userId: string, profileData: PublicProfile): Promise<void> => {
  if (!db) {
    logWarning('Skipped creating public profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'createPublicProfile:disabled',
      additionalData: { userId },
    });
    return;
  }

  try {
    await setDoc(publicProfileDoc(userId), profileData, { merge: true });
  } catch (error) {
    logError('Failed to create public profile', error, {
      component: 'firebase:user-profile',
      action: 'createPublicProfile',
      additionalData: { userId },
    });
    throw error;
  }
};

export const updatePublicProfile = async (userId: string, updates: Partial<PublicProfile>): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating public profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'updatePublicProfile:disabled',
      additionalData: { userId, updates },
    });
    throw new Error('Profile storage is not configured.');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(publicProfileDoc(userId), sanitizedUpdates);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'not-found') {
      try {
        await setDoc(
          publicProfileDoc(userId),
          {
            ...sanitizedUpdates,
          },
          { merge: true },
        );
        return;
      } catch (setDocError) {
        logError('Failed to create public profile during update fallback', setDocError, {
          component: 'firebase:user-profile',
          action: 'updatePublicProfile:fallback',
          additionalData: { userId, updates },
        });
        throw setDocError;
      }
    }

    logError('Failed to update public profile', error, {
      component: 'firebase:user-profile',
      action: 'updatePublicProfile',
      additionalData: { userId, updates },
    });
    throw error;
  }
};

export const subscribeToPublicProfile = (
  userId: string,
  onNext: (profile: PublicProfile | null) => void,
  onError?: (error: Error) => void,
) =>
  db
    ? onSnapshot(
      publicProfileDoc(userId),
      snapshot => {
        if (snapshot.exists()) {
          onNext(snapshot.data());
          return;
        }
        onNext(null);
      },
      error => {
        logError('Failed to subscribe to public profile', error, {
          component: 'firebase:user-profile',
          action: 'subscribeToPublicProfile',
          additionalData: { userId },
        });
        onError?.(error);
      },
    )
    : (() => {
        const error = new Error('Profile storage is not configured.');

        logWarning('Firestore is not configured; returning empty public profile subscription.', {
          component: 'firebase:user-profile',
          action: 'subscribeToPublicProfile:disabled',
          additionalData: { userId },
        });

        queueMicrotask(() => {
          onNext(null);
          onError?.(error);
        });

        return () => undefined;
      })();
