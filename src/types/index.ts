
export interface PairProfile {
  id: string;
  userId: string;
  pairName: string;
  description: string;
  pairType: 'couple' | 'friends' | 'siblings' | 'other';
  interests: string[];
  profilePhoto?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  hostPairId: string;
  title: string;
  activityType: string;
  dateTime: Date;
  location: string;
  description: string;
  status: 'pending_host_confirmation' | 'live' | 'matched' | 'confirmed' | 'expired';
  hostConfirmationToken?: string;
  guestPairId?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface JoinRequest {
  id: string;
  eventId: string;
  guestPairId: string;
  status: 'pending_guest_confirmation' | 'sent' | 'accepted' | 'rejected' | 'expired';
  guestConfirmationToken?: string;
  hostAcceptanceToken?: string;
  guestFinalToken?: string;
  confirmations: {
    hostLead: boolean;
    hostPartner: boolean;
    guestLead: boolean;
    guestPartner: boolean;
  };
  createdAt: Date;
  expiresAt: Date;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  senderId: string;
  senderRole: 'host' | 'guest';
  message: string;
  timestamp: Date;
}
