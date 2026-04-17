# Accessibility & Responsive Design

## Accessibility Rules

**Conformance:** WCAG 2.2 AA.

**Colour & contrast**

- Minimum 4.5:1 contrast ratio for all text and interactive elements.
- Use `pairup.*` tokens and shadcn semantic colours — never raw hex. See `visual-design.md: Design Tokens`.

**Typography**

- 16px minimum font size at all breakpoints.
- 1.5× line spacing.
- Text must reflow up to 200% zoom without breaking layout.

**Touch targets**

- 44×44px minimum size for all interactive elements.
- 8px minimum spacing between adjacent targets.

**Focus**

- Visible focus state on every interactive element: 1px outline, 4px offset, `pairup.cyan` glow.
- Tab order must follow visual reading order.

**Semantic HTML**

- Use native HTML5 landmarks (`<nav>`, `<main>`, `<section>`, etc.) — don't div-soup.
- Key interactive elements must have ARIA labels. Full coverage is a work in progress.

**Not yet implemented**

- `prefers-reduced-motion` handling (only a `fade-in` keyframe exists in `tailwind.config.ts`).
- High-contrast mode toggle.
- Skip links.

---

## Responsive Design

**Breakpoints:** Tailwind defaults — `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px (container capped at 1400px). Source of truth: `tailwind.config.ts`.

**Layout principles**

- Mobile-first behaviour; web-first current implementation.
- Single column below `md`; components span full width unless noted.
- Vertical stack on narrow screens; horizontal layouts reflow to stack at `md`.

---

## Component Responsive Rules

| Component                       | Mobile (xs/sm)                                                        | Desktop (md+)                                 |
| ------------------------------- | --------------------------------------------------------------------- | --------------------------------------------- |
| **Button**                      | Full width; multiple CTAs stack vertically                            | Normal width                                  |
| **Card**                        | 1-column grid; tap to expand (no hover reveals)                       | 2-col on md, 3-col on lg+                     |
| **Navbar**                      | Collapsed hamburger; primary CTAs in bottom bar                       | Sticky top nav with visible CTAs              |
| **Modal**                       | Full-screen for complex forms                                         | Centred overlay                               |
| **Forms**                       | Single-column; larger inputs and touch targets                        | Two-column only on lg+ where it aids scanning |
| **EventCard / PairProfileCard** | Condensed metadata; grouped avatar with `+n`                          | Full details; avatars stacked horizontally    |
| **Chat**                        | Full-width; sticky composer above keyboard                            | Split-pane (feed + chat side by side)         |
| **Images**                      | Collapse hero collage to carousel; focal-point crop to preserve faces | Full collage layout                           |
| **Search**                      | Full-screen overlay                                                   | Inline in nav                                 |
