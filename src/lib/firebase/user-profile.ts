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
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';
import { db } from './index';

const COLLECTION_NAME = 'users';

const removeUndefined = <T extends Record<string, unknown>>(value: T): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));

const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile) => removeUndefined(profile),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<UserProfile, 'id'>) } as UserProfile),
};

const userProfileDoc = (userId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, COLLECTION_NAME, userId).withConverter(userProfileConverter);
};

type CreateUserProfileParams = {
  id: string;
  email: string;
  displayName?: string | null;
  birthDate?: string | null;
};

export const createUserProfile = async ({
  id,
  email,
  displayName,
  birthDate,
}: CreateUserProfileParams): Promise<void> => {
  if (!db) {
    logWarning('Skipped creating user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'createUserProfile:disabled',
      additionalData: { id },
    });
    return;
  }

  const profile: UserProfile = {
    id,
    email,
    displayName: displayName?.trim() || email,
    createdAt: Timestamp.now(),
    birthDate: birthDate?.trim() || undefined,
    settings: {
      emailNotifications: true,
      pushNotifications: false,
    },
  };

  try {
    await setDoc(userProfileDoc(id), profile, { merge: true });
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
  } catch (error) {
    logError('Failed to delete user profile', error, {
      component: 'firebase:user-profile',
      action: 'deleteUserProfile',
      additionalData: { userId },
    });
    throw error;
  }
};
