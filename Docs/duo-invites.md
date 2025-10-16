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

The helper in `src/lib/firebase/user-profile.ts` keeps invite updates inside a single profile document when the inviter is applying the write. When an invitee accepts we run a Firestore transaction that updates both participants. If the write fails with `permission-denied` (because local rules prohibit writing to another user’s document) the client now surfaces a manual follow-up state instead of introducing extra collections.

## Client responsibilities

- Invite generation happens from the profile screen by calling `generateDuoInviteToken()` (crypto-random slug + SHA-256 hash) and persisting it with `setActiveDuoInvite()`.
- Visitors land on `/invite/:inviterId/:token`. The page validates the invite with a one-off `getUserProfileOnce` call and only proceeds when the hash matches.
- Pending invites are cached in `sessionStorage` so unauthenticated visitors can return after sign-in. `PendingInviteRedirector` reads this cache once auth completes and routes the user back to the invite URL.
- Accepting an invite calls `acceptDuoInvite`, surfaces success or failure via toasts, and clears the cached metadata. If Firestore rejects the cross-profile write, the UI reports success with guidance for the invitee to ask the inviter to confirm from their profile.

## Configuration knobs

- Invite TTL is seven days (`INVITE_TTL_MS` in `InviteDuoSection`). Adjusting the constant updates both the UI copy and the stored `expiresAt` timestamp.
- The session storage key for pending invites lives in `src/constants/invites.ts` (`pairup.pendingDuoInvite`).
- Security rules must allow the inviter to update their own `users/{id}` document. If invitees do not have permission to update the inviter’s document, the acceptance flow ends in the manual follow-up state described above.

## Testing

- Component coverage for the profile invite controls lives in `src/components/molecules/__tests__/invite-duo-section.test.tsx`.
- Landing page logic is validated manually; transaction helpers can be exercised by extending unit tests around `acceptDuoInvite` if more coverage is required.
