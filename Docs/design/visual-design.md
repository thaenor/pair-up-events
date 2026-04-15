# Visual Design & Branding

## Design Tokens

All tokens live in `tailwind.config.ts`. Use Tailwind utility classes — no raw hex in components. App is **light-mode only**.

**Typography** — use `font-display` and `font-sans` classes:

- Headlines: `font-display` — Poppins 700
- Body: `font-sans` — Inter 400
- CTA: `font-sans` — Inter 600, bold uppercase

**Colour palette** — cool tones for action, warm tones for backgrounds:

| Token                | Hex       | Purpose                              |
| -------------------- | --------- | ------------------------------------ |
| `pairup.darkBlue`    | `#1A2A33` | Primary text, strokes, dark surfaces |
| `pairup.darkBlueAlt` | `#223842` | Alternative dark surface             |
| `pairup.cyan`        | `#27E9F3` | **Create** CTA                       |
| `pairup.yellow`      | `#FECC08` | **Find / Join** CTA                  |
| `pairup.cream`       | `#F5E6C8` | Warm background                      |
| `pairup.lightCream`  | `#FCF7ED` | Subtle warm surface                  |
| `pairup.lightCyan`   | `#DFFBFD` | Subtle cool highlight                |
| `pairup.lightGray`   | `#F2F5F7` | Neutral surface                      |
| `pairup.gray`        | `#E0E0E0` | Borders, dividers                    |
| `pairup.darkGray`    | `#8B9AA2` | Muted text                           |

Shadcn semantic variables (`bg-card`, `text-muted-foreground`, `bg-destructive`, etc.) are used alongside `pairup.*` — do not override shadcn variables with brand hex directly.

**Spacing:** Tailwind 4px scale — `p-4`, `gap-2`, etc.  
**Border radius:** `sm` / `md` / `lg` derived from `--radius` CSS variable.  
**Layout:** card-based floating layers · 3 elevation levels · medium shadow softness · `16px` border radius · `1px solid pairup.darkBlue` stroke.

---

## Animations

> **Not yet fully implemented.** Only a `fade-in` keyframe exists in `tailwind.config.ts`. `framer-motion` is not installed.

- **Hero section:** `animate-fade-in` — implemented
- **Page transitions, button feedback, toasts, error boundaries:** planned via `framer-motion`

Rule: motion reinforces state changes, never decorates. No abrupt or flashing movement. Timing: 150–250ms ease-out.

---

## Photography & Imagery

- Candid, unposed real people in motion — natural daylight or warm interior lighting
- Small social groups, casual gatherings, relatable settings
- Colour harmony with brand primaries; soft environmental backgrounds
- Avoid corporate stock photos or abstract 3D renders
- Illustrations: sparingly — onboarding, empty states, and legal pages only
- Icons: **Lucide** set — 1.5px outline stroke, 16–32px, rounded corners

---

## Voice & Copywriting

Tone: warm, energetic, inclusive — like a helpful friend, not a corporation.

- Short, actionable sentences
- **you/we** language — speak directly to the user
- Prefer verbs: "Join an event" not "Event participation"
- Always confirm destructive actions (delete, logout) with a toast

| Do                                       | Don't                                       |
| ---------------------------------------- | ------------------------------------------- |
| "Let's make something fun happen."       | "Submit your request to organize an event." |
| "Invite your friends — they'll love it." | Corporate, passive, or directive phrasing   |

---

## Logo

- **Primary:** full logotype with icon — top-left of navbar
- **Icon-only:** favicons, compact spaces, app icons
- Clear space: padding equal to logo height on all sides
- Min size: 24px mobile · 40px desktop · SVG preferred, PNG fallback
