# Component System

Components follow atomic design (`atoms` / `molecules` / `organisms`). All colours reference `pairup.*` tokens or shadcn semantic variables — no raw hex. See `visual-design.md: Design Tokens`.

---

## Button

| Variant         | Background token  | Stroke            | Use                             |
| --------------- | ----------------- | ----------------- | ------------------------------- |
| `PrimaryCreate` | `pairup.cyan`     | `pairup.darkBlue` | Create a new experience         |
| `PrimaryFind`   | `pairup.yellow`   | `pairup.darkBlue` | Search / join experiences       |
| `Neutral`       | `pairup.darkBlue` | —                 | Secondary or navigation actions |

**States:** default · hover (slightly darker) · pressed (90% opacity) · disabled · focus (2px outline, accent colour)  
**Props:** `size` sm/md/lg · `icon` optional · `width` auto/full

---

## Input

**Variants:** default · withIcon · textarea  
**States:** default · hover · focus (primary accent outline) · error (error-colour border + tooltip) · disabled (50% opacity)  
**Props:** `size` sm/md/lg · `placeholder` · `icon` optional · `validationState` none/error/success

---

## Card

Base container for EventCard, PairProfileCard, and other content blocks.

- `16px` border radius · subtle shadow · medium padding
- **Variants:** Basic · Elevated · Interactive
- **Hover:** shadow increases to signal interactivity

---

## Navbar

- Height: `64px` · background: `pairup.darkBlue`
- **Variants:** Default · Sticky (remains visible on scroll)
- Logo: left-aligned · menu items: array of link objects
- Responsive: collapses to hamburger at `md` and below — see `accessibility-and-responsive.md`

---

## Modal

- **Variants:** Small · Medium · Large · FullScreen
- Opens with fade-in overlay + scale; closes reversed
- **Focus trap:** keyboard focus stays inside modal until dismissed
- Dismissible by default; swipe-down on mobile (with confirmation for destructive actions)

---

## Tag

Small label for activity types, event status, or categories.

- **Variants:** Default · Rounded · Outlined
- **Props:** `size` sm/md · `colour` semantic by type · `icon` optional

---

## Avatar

Circular user or pair profile image.

- **Variants:** Small · Medium · Large
- Falls back to initials if no image
- Optional border; hover shows outline or shadow when interactive

---

## EventCard

Displays an event in feeds and search results.

**Fields:** title · activity type (Tag) · participants (Avatars) · dateTime · location · CTA button  
**Behaviour:** hover elevates card and reveals secondary actions · click navigates to event detail

---

## PairProfileCard

Displays a pair's profile in feeds and search results.

**Fields:** pair name · avatars · interest tags · CTA button  
**Behaviour:** hover elevates card and reveals secondary actions · click opens pair detail modal
