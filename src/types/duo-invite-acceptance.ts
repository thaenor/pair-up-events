import { Timestamp } from 'firebase/firestore';

export type DuoInviteAcceptanceStatus = 'pending' | 'processed' | 'failed';

export type DuoInviteAcceptance = {
  id: string;
  inviterId: string;
  partnerId: string;
  tokenHash: string;
  status: DuoInviteAcceptanceStatus;
  partnerName?: string | null;
  partnerEmail?: string | null;
  inviterName?: string | null;
  createdAt: Timestamp;
  processedAt?: Timestamp;
  errorMessage?: string;
};

export type DuoInviteAcceptanceCreateParams = {
  inviterId: string;
  partnerId: string;
  tokenHash: string;
  partnerName?: string | null;
  partnerEmail?: string | null;
  inviterName?: string | null;
};

