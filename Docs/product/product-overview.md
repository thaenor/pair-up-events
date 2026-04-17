# Product Overview

Pair Up Events connects two pairs of people (4 total) through shared activities. Users create or join events as a duo; a second duo discovers and joins them. No individual participants — every confirmed event is 2 duos.

**Differentiators:** 2-meets-2 matching (not individuals or large groups) · activity-based, non-romantic focus · user-created or platform-template events · pair types include friends, couples, family duos, siblings, roommates.

---

## User Roles

| Label      | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| **User A** | Creates the event; invites User B via unique link                    |
| **User B** | Joins User A to form the first confirmed duo; event goes Live        |
| **User C** | Discovers the live event in Explore; requests to join with their duo |
| **User D** | User C's partner; confirms participation → group of 4 finalised      |

Each confirmed event = **Duo A+B** + **Duo C+D**.

---

## Target Users

| Segment                                                 | Motivation                                      |
| ------------------------------------------------------- | ----------------------------------------------- |
| Young professionals (20–35)                             | Fun, novelty, social discovery                  |
| Friends or couples                                      | Shared adventures with others of similar energy |
| Expats & newcomers                                      | Authentic local experiences                     |
| Families & themed pairs (parent-child, siblings, twins) | Playful learning and shared bonding             |

> Detailed personas → see `principles-and-personas.md`.

---

## Use Cases

**1 — Explore** — Logged-in or logged-out users browse activity cards by city. Logged-out users see blurred dates and locations.

**2 — Create (User A)** — A picks a template or starts from scratch → fills event form → invites B via link → event is Pending until B accepts → goes Live in Explore.

> Full event lifecycle → see `user-flows.md: Event Lifecycle`.

**3 — Join (User C + D)** — C discovers a live event → sends join request → invites D → first D to accept locks the pair → A+B approve → all 4 confirmed.

**4 — Group Chat** — Auto-created when both duos confirm. All 4 can coordinate; includes report feature.

**5 — Post-event** — System prompts ratings after the event date. Users choose to keep or archive the chat.

**6 — Auto-archive** — Chats inactive 30 days are auto-archived; always reopenable.

**7 — Reporting** — Users can report an event or another user from chat, event detail, or profile. Category selection + optional comment → moderation review.

**8 — Notifications** — Invites, join requests, confirmations, 24h reminders, chat messages, feedback prompts, cancellations — via browser push and email.

**9 — Profile & Settings** — Name, age, gender, bio, likes/dislikes, hobbies. Settings: language, location, privacy policy, support, logout.

---

## Platform

- Web (responsive) — desktop and mobile browser
- Logged-out: blurred event details, city visible, all CTAs redirect to sign-up
- Logged-in: full access
- Moderation: self-service creation + admin dashboard for reports
