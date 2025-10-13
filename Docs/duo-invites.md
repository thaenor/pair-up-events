# Duo Invite Flow

This document summarizes how the duo invite feature is persisted in Firestore and handled in the client.

## Firestore data model

User documents continue to live inside the existing `users` collection. Each profile now stores the invite metadata directly so no additional collections are required.

```ts
interface UserProfile {
  activeDuoInvite?: {
    slug: string;              // shareable token appended to the invite URL
    tokenHash: string;         // base64url encoded SHA-256 hash of the slug
    status: 'pending' | 'accepted' | 'expired' | 'revoked';
    createdAt: Timestamp;
    expiresAt: Timestamp;
    lastSharedAt?: Timestamp;
    acceptedByUserId?: string;
    acceptedAt?: Timestamp;
  } | null;
  duos?: Array<{
    partnerId: string;
    partnerName?: string | null;
    createdAt: Timestamp;
    formedViaInviteTokenHash?: string;
  }>;
  stats?: {
    eventsCreated?: number;
    eventsJoined?: number;
    duosFormed?: number;
  };
}
```

The helper in `src/lib/firebase/user-profile.ts` keeps invite updates inside a single profile document, avoiding extra Firestore reads. Accepting an invite runs inside a transaction that:

1. Validates that the stored hash matches the token embedded in the URL and checks for expiry.
2. Appends a summary entry to both users' `duos` arrays with `arrayUnion`.
3. Increments the `stats.duosFormed` counter for both members.
4. Marks the inviter's `activeDuoInvite` as `accepted` with an `acceptedAt` timestamp.

## Client responsibilities

- Invite generation happens from the profile screen by calling `generateDuoInviteToken()` (crypto-random slug + SHA-256 hash) and persisting it with `setActiveDuoInvite()`.
- Visitors land on `/invite/:inviterId/:token`. The page validates the invite with a one-off `getUserProfileOnce` call and only proceeds when the hash matches.
- Pending invites are cached in `sessionStorage` so unauthenticated visitors can return after sign-in. `PendingInviteRedirector` reads this cache once auth completes and routes the user back to the invite URL.
- Accepting an invite calls `acceptDuoInvite`, surfaces success or failure via toasts, and clears the cached metadata.

## Configuration knobs

- Invite TTL is seven days (`INVITE_TTL_MS` in `InviteDuoSection`). Adjusting the constant updates both the UI copy and the stored `expiresAt` timestamp.
- The session storage key for pending invites lives in `src/constants/invites.ts` (`pairup.pendingDuoInvite`).

## Testing

- Component coverage for the profile invite controls lives in `src/components/molecules/__tests__/invite-duo-section.test.tsx`.
- Landing page logic is validated manually; transaction helpers can be exercised by extending unit tests around `acceptDuoInvite` if more coverage is required.
