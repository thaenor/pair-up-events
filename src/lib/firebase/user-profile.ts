import { FirebaseError } from 'firebase/app';
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc,
  type Firestore,
  type FirestoreDataConverter,
} from 'firebase/firestore';

import { logError, logWarning } from '@/utils/logger';
import type {
  ActiveDuoInvite,
  DuoInviteStatus,
  DuoSummary,
  UserProfile,
  UserProfileUpdate,
} from '@/types/user-profile';
import { db } from './index';

const COLLECTION_NAME = 'users';

const removeUndefined = <T extends Record<string, unknown>>(value: T): Partial<T> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));

const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile) => removeUndefined(profile),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<UserProfile, 'id'>) }),
};

const userProfileDoc = (firestore: Firestore, userId: string) =>
  doc(firestore, COLLECTION_NAME, userId).withConverter(userProfileConverter);

const sanitizeActiveInvite = (invite: ActiveDuoInvite) => removeUndefined(invite);

type CreateUserProfileParams = {
  id: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  timezone?: string | null;
};

export const createUserProfile = async ({
  id,
  email,
  displayName,
  photoUrl,
  timezone,
}: CreateUserProfileParams): Promise<void> => {
  const firestore = db;

  if (!firestore) {
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
    photoUrl: photoUrl?.trim() || undefined,
    createdAt: Timestamp.now(),
    timezone: timezone?.trim() || undefined,
    settings: {
      emailNotifications: true,
      pushNotifications: false,
    },
    stats: {
      eventsCreated: 0,
      eventsJoined: 0,
      duosFormed: 0,
    },
    activeDuoInvite: null,
    duos: [],
  };

  try {
    await setDoc(userProfileDoc(firestore, id), profile, { merge: true });
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
) => {
  const firestore = db;

  if (!firestore) {
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
  }

  return onSnapshot(
    userProfileDoc(firestore, userId),
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
  );
};

export const updateUserProfile = async (userId: string, updates: UserProfileUpdate): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped updating user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'updateUserProfile:disabled',
      additionalData: { userId, updates },
    });
    throw new Error('Profile storage is not configured.');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(userProfileDoc(firestore, userId), sanitizedUpdates);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'not-found') {
      try {
        await setDoc(
          userProfileDoc(firestore, userId),
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
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped deleting user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'deleteUserProfile:disabled',
      additionalData: { userId },
    });
    return;
  }

  try {
    await deleteDoc(userProfileDoc(firestore, userId));
  } catch (error) {
    logError('Failed to delete user profile', error, {
      component: 'firebase:user-profile',
      action: 'deleteUserProfile',
      additionalData: { userId },
    });
    throw error;
  }
};

export const setActiveDuoInvite = async (userId: string, invite: ActiveDuoInvite): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped setting duo invite because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'setActiveDuoInvite:disabled',
      additionalData: { userId },
    });
    throw new Error('Profile storage is not configured.');
  }

  try {
    await updateDoc(userProfileDoc(firestore, userId), {
      activeDuoInvite: sanitizeActiveInvite(invite),
    });
  } catch (error) {
    logError('Failed to set active duo invite', error, {
      component: 'firebase:user-profile',
      action: 'setActiveDuoInvite',
      additionalData: { userId },
    });
    throw error;
  }
};

export const clearActiveDuoInvite = async (userId: string): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped clearing duo invite because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'clearActiveDuoInvite:disabled',
      additionalData: { userId },
    });
    throw new Error('Profile storage is not configured.');
  }

  try {
    await updateDoc(userProfileDoc(firestore, userId), {
      activeDuoInvite: null,
    });
  } catch (error) {
    logError('Failed to clear active duo invite', error, {
      component: 'firebase:user-profile',
      action: 'clearActiveDuoInvite',
      additionalData: { userId },
    });
    throw error;
  }
};

type AcceptDuoInviteParams = {
  inviterId: string;
  partnerId: string;
  tokenHash: string;
  inviterDisplayName?: string | null;
  partnerDisplayName?: string | null;
};

const ACCEPTED_STATUS: DuoInviteStatus = 'accepted';

export const acceptDuoInvite = async ({
  inviterId,
  partnerId,
  tokenHash,
  inviterDisplayName,
  partnerDisplayName,
}: AcceptDuoInviteParams): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped accepting duo invite because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'acceptDuoInvite:disabled',
      additionalData: { inviterId, partnerId },
    });
    throw new Error('Profile storage is not configured.');
  }

  if (inviterId === partnerId) {
    throw new Error('You cannot accept your own invite.');
  }

  const inviterRef = userProfileDoc(firestore, inviterId);
  const partnerRef = userProfileDoc(firestore, partnerId);

  try {
    await runTransaction(firestore, async transaction => {
      const [inviterSnap, partnerSnap] = await Promise.all([
        transaction.get(inviterRef),
        transaction.get(partnerRef),
      ]);

      if (!inviterSnap.exists()) {
        throw new Error('Inviter profile no longer exists.');
      }

      if (!partnerSnap.exists()) {
        throw new Error('Partner profile does not exist.');
      }

      const inviterData = inviterSnap.data();
      const partnerData = partnerSnap.data();
      const activeInvite = inviterData.activeDuoInvite;

      if (!activeInvite || activeInvite.status !== 'pending') {
        throw new Error('This invite is no longer active.');
      }

      if (activeInvite.tokenHash !== tokenHash) {
        throw new Error('Invite token does not match.');
      }

      const now = Timestamp.now();

      if (activeInvite.expiresAt.toMillis() < now.toMillis()) {
        throw new Error('This invite has expired.');
      }

      const inviterDuoEntry: DuoSummary = {
        partnerId,
        partnerName: partnerDisplayName ?? partnerData.displayName ?? partnerData.email,
        createdAt: now,
        formedViaInviteTokenHash: activeInvite.tokenHash,
      };

      const partnerDuoEntry: DuoSummary = {
        partnerId: inviterId,
        partnerName: inviterDisplayName ?? inviterData.displayName ?? inviterData.email,
        createdAt: now,
        formedViaInviteTokenHash: activeInvite.tokenHash,
      };

      transaction.update(inviterRef, {
        activeDuoInvite: {
          ...activeInvite,
          status: ACCEPTED_STATUS,
          acceptedAt: now,
          acceptedByUserId: partnerId,
        },
        duos: arrayUnion(inviterDuoEntry),
        'stats.duosFormed': increment(1),
      });

      transaction.update(partnerRef, {
        duos: arrayUnion(partnerDuoEntry),
        'stats.duosFormed': increment(1),
      });
    });
  } catch (error) {
    logError('Failed to accept duo invite', error, {
      component: 'firebase:user-profile',
      action: 'acceptDuoInvite',
      additionalData: { inviterId, partnerId },
    });
    throw error;
  }
};

export const getUserProfileOnce = async (userId: string): Promise<UserProfile | null> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped fetching user profile because Firestore is not configured.', {
      component: 'firebase:user-profile',
      action: 'getUserProfileOnce:disabled',
      additionalData: { userId },
    });
    throw new Error('Profile storage is not configured.');
  }

  try {
    const snapshot = await getDoc(userProfileDoc(firestore, userId));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    logError('Failed to fetch user profile', error, {
      component: 'firebase:user-profile',
      action: 'getUserProfileOnce',
      additionalData: { userId },
    });
    throw error;
  }
};
