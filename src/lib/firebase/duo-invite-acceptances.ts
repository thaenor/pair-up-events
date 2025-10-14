import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
  type FirestoreDataConverter,
} from 'firebase/firestore';

import type {
  DuoInviteAcceptance,
  DuoInviteAcceptanceCreateParams,
} from '@/types/duo-invite-acceptance';
import { db } from './index';
import { logError, logWarning } from '@/utils/logger';

const COLLECTION_NAME = 'duoInviteAcceptances';

const converter: FirestoreDataConverter<DuoInviteAcceptance> = {
  toFirestore: value => ({
    inviterId: value.inviterId,
    partnerId: value.partnerId,
    tokenHash: value.tokenHash,
    status: value.status,
    partnerName: value.partnerName ?? null,
    partnerEmail: value.partnerEmail ?? null,
    inviterName: value.inviterName ?? null,
    createdAt: value.createdAt,
    processedAt: value.processedAt ?? null,
    errorMessage: value.errorMessage ?? null,
  }),
  fromFirestore: snapshot => ({
    id: snapshot.id,
    ...(snapshot.data() as Omit<DuoInviteAcceptance, 'id'>),
  }),
};

const acceptanceCollection = (firestore: Firestore) =>
  collection(firestore, COLLECTION_NAME).withConverter(converter);

export const createDuoInviteAcceptanceRequest = async (
  params: DuoInviteAcceptanceCreateParams,
): Promise<string | null> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped creating duo invite acceptance request because Firestore is not configured.', {
      component: 'firebase:duo-invite-acceptances',
      action: 'create:disabled',
      additionalData: params,
    });
    return null;
  }

  const payload = {
    inviterId: params.inviterId,
    partnerId: params.partnerId,
    tokenHash: params.tokenHash,
    status: 'pending' as const,
    partnerName: params.partnerName ?? null,
    partnerEmail: params.partnerEmail ?? null,
    inviterName: params.inviterName ?? null,
    createdAt: serverTimestamp(),
    processedAt: null,
    errorMessage: null,
  };

  try {
    const deterministicId = `${params.inviterId}_${params.partnerId}_${params.tokenHash}`;
    await setDoc(doc(acceptanceCollection(firestore), deterministicId), payload, { merge: true });
    return deterministicId;
  } catch (error) {
    logError('Failed to create duo invite acceptance request', error, {
      component: 'firebase:duo-invite-acceptances',
      action: 'create',
      additionalData: params,
    });
    throw error;
  }
};

export const subscribeToPendingDuoInviteAcceptances = (
  inviterId: string,
  onNext: (requests: DuoInviteAcceptance[]) => void,
  onError?: (error: Error) => void,
) => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped subscribing to duo invite acceptance requests because Firestore is not configured.', {
      component: 'firebase:duo-invite-acceptances',
      action: 'subscribe:disabled',
      additionalData: { inviterId },
    });
    queueMicrotask(() => onNext([]));
    return () => undefined;
  }

  try {
    const q = query(
      acceptanceCollection(firestore),
      where('inviterId', '==', inviterId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc'),
    );

    return onSnapshot(
      q,
      snapshot => {
        onNext(snapshot.docs.map(docSnapshot => docSnapshot.data()));
      },
      error => {
        logError('Failed to subscribe to duo invite acceptance requests', error, {
          component: 'firebase:duo-invite-acceptances',
          action: 'subscribe',
          additionalData: { inviterId },
        });
        onError?.(error);
      },
    );
  } catch (error) {
    logError('Failed to build duo invite acceptance request query', error, {
      component: 'firebase:duo-invite-acceptances',
      action: 'subscribe:query',
      additionalData: { inviterId },
    });
    onError?.(error as Error);
    return () => undefined;
  }
};

export const markDuoInviteAcceptanceProcessed = async (requestId: string): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped marking duo invite acceptance processed because Firestore is not configured.', {
      component: 'firebase:duo-invite-acceptances',
      action: 'markProcessed:disabled',
      additionalData: { requestId },
    });
    return;
  }

  try {
    await updateDoc(doc(acceptanceCollection(firestore), requestId), {
      status: 'processed',
      processedAt: serverTimestamp(),
      errorMessage: null,
    });
  } catch (error) {
    logError('Failed to mark duo invite acceptance request as processed', error, {
      component: 'firebase:duo-invite-acceptances',
      action: 'markProcessed',
      additionalData: { requestId },
    });
    throw error;
  }
};

export const markDuoInviteAcceptanceFailed = async (
  requestId: string,
  message: string,
): Promise<void> => {
  const firestore = db;

  if (!firestore) {
    logWarning('Skipped marking duo invite acceptance failed because Firestore is not configured.', {
      component: 'firebase:duo-invite-acceptances',
      action: 'markFailed:disabled',
      additionalData: { requestId },
    });
    return;
  }

  try {
    await updateDoc(doc(acceptanceCollection(firestore), requestId), {
      status: 'failed',
      processedAt: serverTimestamp(),
      errorMessage: message,
    });
  } catch (error) {
    logError('Failed to mark duo invite acceptance request as failed', error, {
      component: 'firebase:duo-invite-acceptances',
      action: 'markFailed',
      additionalData: { requestId },
    });
    throw error;
  }
};

