# DESIGN.md

Visual + interaction system for vasteams.com. Source of truth when porting pages from mockups to React.

Canonical visual mockups (outside the repo, treat as design specs):

```
~/Documents/personal/matrix/simulator/mockups/
├─ home-redesign.html
├─ about-redesign.html
├─ research-redesign-with-thumbs.html   ← canonical /research version
├─ research-redesign.html               ← no-thumbs reference (not shipped)
├─ projects-redesign.html
└─ work-redesign.html
```

Anchor reference: https://gainsustain.se/#om (Gustav Stenbeck site). Studied for type scale, weights, spacing, and asymmetry.

---

## Tokens

```css
:root {
  /* Surface */
  --bg:       #0c0c0c;   /* page background, near-black warm */
  --surface:  #141414;   /* cards, elevated surfaces */
  --hairline: rgba(255,255,255,0.07);  /* between rows, dividers */
  --border:   rgba(255,255,255,0.09);  /* card + footer borders */

  /* Text */
  --white:    #ffffff;                  /* primary text */
  --dim:      rgba(255,255,255,0.55);   /* secondary text, body in sections */
  --faint:    rgba(255,255,255,0.30);   /* labels, decorative-only */

  /* Accent */
  --gold:     #D4A017;   /* single accent color across the dark site */
}
```

**Contrast notes (WCAG):**
- `--white` on `--bg` ≈ 18:1 — AAA
- `--dim` on `--bg` ≈ 5.5:1 — AA pass
- `--faint` on `--bg` ≈ 2.5:1 — **fails AA**, use only for decorative labels never as primary text

The home page tightens `--bg` to `#0A0A0A` for the Ω hero composition. Acceptable per-page override.

---

## Typography

Geist Sans for body and display. Geist Mono for labels, eyebrows, nav, dates. Loaded via Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
```

### Scale

| Use | Family | Weight | Size | Tracking | Line height |
|---|---|---|---|---|---|
| H1 (full hero) | Geist Sans | 300 | clamp(3.25rem, 7.5vw, 7rem) | -0.035em | 0.98 |
| H1 (compact hero) | Geist Sans | 300 | clamp(2.5rem, 4.5vw, 4rem) | -0.035em | 1.0 |
| H2 | Geist Sans | 300 | clamp(1.75rem, 3.5vw, 2.75rem) | -0.02em | 1.2 |
| Card title (featured) | Geist Sans | 300 | 1.55–1.65rem | -0.02em | 1.2 |
| Card title (compact) | Geist Sans | 300 | 1.3–1.35rem | -0.02em | 1.2 |
| List item title | Geist Sans | 300 | clamp(1.25rem, 1.7vw, 1.55rem) | -0.015em | 1.25 |
| Work item title | Geist Sans | 300 | clamp(1.6rem, 2.4vw, 2.15rem) | -0.02em | 1.15 |
| Body — default | Geist Sans | 300 | 17px | none | 1.7 |
| Body — long-form | Geist Sans | 300 | 18–19px | none | 1.85 |
| Sub-copy (hero) | Geist Sans | 300 | clamp(1.05rem, 1.5vw, 1.35rem) | none | 1.65 |
| Eyebrow / label | Geist Mono | 500 | 11–12px | 0.22–0.24em | 1.7 |
| Nav link | Geist Mono | 400 | 11–12px | 0.16em | 1.7 |
| Footer meta | Geist Mono | 400 | 11px | 0.16em | 1.7 |
| Brand mark (VAST //) | Geist Mono | 700 | 0.95–1.6rem | 0.18–0.22em | 1 |

**Three rules that define the feel:**
1. Big type = **light weight (300)**. The size carries the weight, not the boldness.
2. Big type = **negative letter-spacing** (-0.02 to -0.035em). Refined, tight.
3. Small labels = **wide tracking** (0.14–0.24em). Quiet, deliberate.

---

## Layout

```
container:       max-width 1160px, centered (margin: 0 auto)
horizontal pad:  4rem (64px) desktop, 1.5rem (24px) mobile
section pad:     5–7rem vertical between major sections
column gap:      6–7rem (96–112px) — generous
grids:           prefer asymmetric (1fr / 1.4fr) over 50/50 — slight off-balance
imagery:         full-bleed or fill column edge-to-edge
                 no rounded corners, no borders, no drop shadows
                 the viewport edge IS the frame
```

Home is an exception: max-width 1400px (the Ω needs room to sprawl). Content pages stay at 1160px.

---

## Hero patterns

### Full-bleed hero (for `/about`)

100vh, photo as `object-fit: cover`, dark gradient overlay top → bottom, content stacked at bottom-left in a ≤960px max-width container, 4rem padding.

```css
.hero {
  position: relative;
  height: 100vh;
  min-height: 640px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  /* loading placeholder shown until <img> paints */
  background: linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #0c0c0c 100%);
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(12,12,12,0.55) 0%,
    rgba(12,12,12,0.15) 28%,
    rgba(12,12,12,0.40) 60%,
    rgba(12,12,12,0.95) 100%
  );
}
```

Content order in hero: eyebrow → giant H1 → light sub-copy.

### Compact hero (for `/research`, `/work`, `/projects`)

A single horizontal band, 6.5rem top padding, 2.5–3rem bottom, hairline border-bottom. Two-column grid `1fr / auto`: H1 (eyebrow + title) on the left, sub-copy right-aligned beside it.

```css
.hero { padding: 6.5rem 4rem 2.5rem; border-bottom: 1px solid var(--hairline); }
.hero-inner {
  max-width: 1160px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto;
  align-items: end; gap: 4rem;
}
.hero-sub { text-align: right; max-width: 38ch; padding-bottom: 0.4rem; }
```

---

## Components

### Editorial list row (used by `/research`, `/work`)

Three-column grid: meta column | content column | arrow column.

| Page | Grid | Notes |
|---|---|---|
| `/research` (with thumbs) | `180px / 1fr / 200px` | Right column holds thumbnail + arrow stacked |
| `/research` (no thumbs) | `200px / 1fr / 80px` | Right column = arrow only |
| `/work` | `220px / 1fr / 100px` | Larger meta column for two-line role labels |

Hover: 1.5% white background wash, title shifts to gold, arrow translates +4px right, thumbnail returns from grayscale to color.

Hairline border-bottom on each row (`var(--hairline)`).

Thumbnails: 5:3 aspect ratio, `object-fit: cover`, grayscale + 70% opacity default, full color on row hover. Always have the striped-placeholder background underneath so failed/missing images fall through cleanly. Add `onerror="this.style.display='none'"` to img tags so 404'd external images hide and reveal the placeholder pattern.

### Project card with glyph watermark (for `/projects`)

`min-height: 280px` (featured) / `240px` (compact). Padding 1.75rem (featured) / 1.5rem (compact). The project's glyph (`↗ ◉ ◔ ◈ //`) lives twice on the card: small (1.2rem) in the top-right of the head row, and large (8–11rem) as a faint watermark in the bottom-right corner of the card. Each card gets its OWN accent via `--accent` CSS variable on the element.

```html
<a class="card featured-card" href="..." style="--accent: #D4A017;">
  <span class="card-bg">↗</span>
  <div class="card-head">
    <p class="card-tag">AI / Economics / Data story</p>
    <span class="card-glyph-small">↗</span>
  </div>
  <h2 class="card-title">The Economics of Enterprise AI</h2>
  <p class="card-desc">...</p>
  <span class="card-open">Open <span class="arrow">→</span></span>
</a>
```

Hover state: card lifts 2px (`transform: translateY(-2px)`), border picks up `--accent` at 55% opacity, title shifts to `--accent`, watermark intensifies (opacity 0.10 → 0.22) and slides slightly.

**Coming Soon variant:** add `.coming-soon` class. Sets `opacity: 0.45`, `cursor: default`, `pointer-events: none`, adds a diagonal stripe overlay. Tag becomes "Coming Soon"; open link reads "In progress". Use `<div>` not `<a>` (non-interactive).

### Footer

Hairline top border, 2.5–3rem padding, two-column flex (copy left, meta right). All text in Geist Mono, 11px, 0.16em tracking, uppercase.

---

## Accessibility minimums

All these are non-negotiable when porting to React.

### Focus

Every interactive element gets a visible focus state. Already baked into all 5 mockups:

```css
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 2px;
}
```

### Reduced motion

Honor `prefers-reduced-motion`. Already baked into all 5 mockups:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Required when porting to React (not yet in mockups)

- **Skip-to-content link** at the top of every page, visible on focus.
- **ARIA landmarks:** `<header role="banner">`, `<nav aria-label="Main">`, `<main>`, `<footer role="contentinfo">`.
- **Card list items** as `<a>` elements get descriptive `aria-label` if title text would be ambiguous out of context.
- **Touch targets** minimum 44×44px on mobile. Audit nav links and mono arrows specifically.
- **Tab order** matches visual order. No `tabindex` games.
- **Image alt text** mandatory and descriptive (e.g., "Vas on stage, waving to the audience" — not "image" or "photo").
- **Color contrast** auditor passes WCAG AA on all body text. `--faint` is for decorative labels only.

---

## Standalone HTML tools (`/public/*.html`)

These keep their own palettes (warm cream/ink for Marketing Embeddings tools is intentional). When porting the type system:

- Body up to 17–18px from current 14–15px
- Section padding to 7rem
- Headlines in light weight (300), not bold
- Eyebrow → big H2 → sub pattern at the opening of each major section
- Keep their fonts (Geist + Geist Mono in both light and warm palette tools)

Currently only `ai-economics.html` exists. When the next tool ships, port the type scale at the same time.

---

## Hard rules

- No serif fonts anywhere
- No em-dashes in any prose
- No rounded chip/pill labels (border-radius 999px). Use gold vertical bar + bold text, or mono uppercase eyebrow
- Brand mark "VAST //" stays in Geist Mono. The engineer's signature, intentional counter-note to the editorial body
- Gold `#D4A017` is the ONLY accent on the dark pages; project cards override with per-card `--accent` (cyan, red, amber, emerald) via CSS var
- Don't reflow or rewrite copy without explicit ask. Type and layout pass, not content pass
- Headlines that are long: split at natural pauses into two rows via `<br/>`; don't cram
- Standalone HTML in `/public/` keeps its own palette

---

## Open decisions

- `/research`: shipping the with-thumbs variant. No-thumbs version retained as reference.
- `/about` mobile: photo above bio (default). Reverse if the photo dominates too much on small screens.
- `/home` hero eyebrow with hairline rules: in mockup. Strip to plain mono "Vas Bakopoulos" if it feels overworked.
- `/work`: only 3 items. Acceptable as punchy curation; can add historical items later without breaking the pattern.
