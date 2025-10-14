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

The helper in `src/lib/firebase/user-profile.ts` keeps invite updates inside a single profile document when the inviter is applying the write. When an invitee accepts we try to run the full transaction, but if Firestore rules block the cross-profile write we fall back to a queued acceptance flow:

1. The partner updates **their own** profile with the new duo summary and increments their stats so they immediately see the connection.
2. A lightweight document is written to the `duoInviteAcceptances` collection (`{ inviterId, partnerId, tokenHash, partnerName }`).
3. The inviter's profile screen subscribes to pending acceptance docs. When one arrives, the inviter finalizes it locally—updating their `activeDuoInvite`, appending the duo summary, and incrementing their stats—before marking the acceptance as processed.

## Client responsibilities

- Invite generation happens from the profile screen by calling `generateDuoInviteToken()` (crypto-random slug + SHA-256 hash) and persisting it with `setActiveDuoInvite()`.
- Visitors land on `/invite/:inviterId/:token`. The page validates the invite with a one-off `getUserProfileOnce` call and only proceeds when the hash matches.
- Pending invites are cached in `sessionStorage` so unauthenticated visitors can return after sign-in. `PendingInviteRedirector` reads this cache once auth completes and routes the user back to the invite URL.
- Accepting an invite calls `acceptDuoInvite`, surfaces success or failure via toasts, and clears the cached metadata. If Firestore rejects the cross-profile write, we fall back to the queued flow so the partner still sees immediate success while the inviter finalizes from their profile.
- `InviteDuoSection` listens for new entries in `duoInviteAcceptances` for the authenticated user and quietly finalizes them, so the inviter never has to handle the queue manually.

## Configuration knobs

- Invite TTL is seven days (`INVITE_TTL_MS` in `InviteDuoSection`). Adjusting the constant updates both the UI copy and the stored `expiresAt` timestamp.
- The session storage key for pending invites lives in `src/constants/invites.ts` (`pairup.pendingDuoInvite`).
- Security rules must allow invitees to create documents in `duoInviteAcceptances` and allow inviters to mark them processed. See `Docs/data-model.md` for the recommended rule shape.

## Testing

- Component coverage for the profile invite controls lives in `src/components/molecules/__tests__/invite-duo-section.test.tsx`.
- Landing page logic is validated manually; transaction helpers can be exercised by extending unit tests around `acceptDuoInvite` if more coverage is required.
