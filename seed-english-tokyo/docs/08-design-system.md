# 08 · Design System

## 1. Design principles

Modern, friendly, Japanese-inspired minimalism, nature-inspired growth. Generous
whitespace over dense data walls (even the admin dashboard should feel calm). Every
number that can grow should be shown growing, not just stated.

## 2. Color palette

| Token | Hex | Use |
|---|---|---|
| `forest-900` | `#14432A` | Headlines, primary text on light backgrounds |
| `forest-700` | `#1F6B3B` | Primary brand color, buttons, links |
| `forest-500` | `#3D9A5C` | Secondary actions, active states |
| `leaf-300` | `#8FD19E` | Progress fills, success states |
| `leaf-100` | `#DCF3E1` | Subtle backgrounds, hover states |
| `cream-50` | `#FBF7EE` | Page background |
| `cream-100` | `#F3ECDA` | Card backgrounds, section alternation |
| `sky-400` | `#6FB7DE` | Water/map accents, informational states |
| `sky-100` | `#E3F2FA` | Info banners |
| `earth-600` | `#9C7B4F` | Bare-soil map state, tertiary accents |
| `sunset-400` | `#E8A24B` | Streaks, XP, warm gamification accents |
| `error-500` | `#D64545` | Errors, destructive actions only |

Dark mode: `forest-900`/`cream-50` invert to a deep `#0E1F16` background with `leaf-300`
and `sky-400` retaining near-identical hue but boosted luminance for contrast — nature
palette holds up in both themes rather than defaulting to generic dark-gray.

## 3. Typography

- **Display/headings**: a rounded, friendly geometric sans (e.g. "Cabinet Grotesk" or
  "Plus Jakarta Sans") — warm, not corporate.
- **Body**: Inter (or Noto Sans JP paired for Japanese text) for maximum readability
  across EN/JA bilingual content.
- **Japanese pairing**: Noto Sans JP at matching weights so headlines don't visually
  clash when a page mixes English UI with Japanese content (event titles, user bios).
- Scale: 12/14/16/18/24/32/48/64px, 1.5 line-height for body, 1.2 for display.

## 4. Iconography & motif

- Line icons with slightly rounded terminals (Lucide as the base set, extended with
  custom seed/sprout/tree/forest glyphs for the growth metaphor).
- Recurring motifs: torii-gate silhouette (community/place), origami-fold corner
  accents on cards, subtle woodblock-print-inspired texture on hero sections (very low
  opacity, never competing with content).

## 5. Growth-stage visual language (used across seeds, stations, achievements)

```
🌱 Seed      → single sprout, 2 leaves, leaf-300 on cream-100
🌿 Sprout    → taller stem, 4 leaves, gentle sway animation on hover
🌳 Tree      → full canopy, forest-500, subtle scale-in on load
🌲🌲 Forest  → clustered trees + canopy glow, ambient particle drift (motion-safe only)
```

Progress bars use a filling-stem animation (the fill grows from the base like a plant,
not a flat linear bar) at key moments (seed detail, streak, tree-progress %) — elsewhere
(admin tables, generic %) a standard `Progress` bar is fine; reserve the organic
animation for emotionally significant moments so it doesn't get numbing.

## 6. Core components (shadcn/ui base, restyled)

`Button` (primary=forest-700 fill, secondary=leaf-100 fill + forest-700 text, ghost,
destructive=error-500), `Card` (cream-100 bg, 16px radius, soft shadow), `Badge`
(pill, used for growth stage / CEFR level / role), `Avatar`, `Progress` (organic variant
above), `Tabs`, `Dialog`, `Sheet` (mobile nav + filters), `Toast`, `Input`/`Textarea`
(cream-50 bg, forest-700 focus ring), `Select`, `Skeleton` (shimmer in leaf-100).

## 7. Domain components

- **SeedCard** — icon (tier emoji), seed number, station, contribution, growth-stage
  badge, mini tree-progress bar, "View seed" link.
- **StationCard** — station name (EN + JA), growth-stage illustration, 3-stat row
  (funding / learners / events), Growth Score ring.
- **QuestionCard** — category badge, title, upvote count (chevron-up button), answer
  count, best-answer checkmark if resolved.
- **EventCard** — type badge, date/time, station, capacity bar (filling stem style),
  host avatar.
- **TrustScoreMeter** — circular gauge, forest-500 → sunset-400 → error-500 gradient by
  score band, never shown in raw numeric form below a "new user" grace threshold.
- **StreakFlame** — animated flame/sprout hybrid icon with day count.
- **AchievementBadge** — hexagonal badge frame, locked = grayscale + earth-600 outline,
  unlocked = full color + subtle shine sweep on first view.

## 8. Key page wireframes (described)

### Landing (`/`)
```
[Nav: logo · How it works · Ask English · Events · Map · Sign in · Join free]
[Hero — full-bleed cream-50 bg, illustrated Tokyo skyline turning from soil to forest
 left-to-right as you scroll]
  H1: "Free English practice for Tokyo. Funded by seeds you can watch grow."
  [Join Free]  [Plant a Seed]
  Live ticker: "1,204 learners active · ¥3.2M raised · 84 meetups this month"
[Section: How it works — 4-step icon row: Seed → Sprout → Tree → Forest]
[Section: Live Tokyo map preview (mini, links to /map)]
[Section: Ask English preview — 3 real question cards]
[Section: Pricing tiers — 4 seed cards side by side]
[Section: Testimonials / impact stories]
[Footer: mission statement, university partners logos, social links]
```

### My Seeds (`/seeds`)
```
[Header: "My Seeds" · summary stats row: total seeds / total contributed / people reached]
[Grid of SeedCards, 3-col desktop / 1-col mobile]
[Empty state (no seeds yet): illustration + "Plant your first seed" CTA]
```

### Seed detail (`/seeds/[id]`)
```
[Back to My Seeds]
[Large growth-stage illustration + Seed #78422 header]
[Two-column: left = facts (date, location, contribution, status);
             right = Impact Created stat list]
[Tree Progress bar (organic fill) — 42%]
[Forest Contribution bar — 0.4%]
[Impact timeline — vertical feed]
[Share certificate CTA]
```

### Tokyo Impact Map (`/map`)
```
[City summary bar: total raised / total learners / city forest coverage %]
[Full-width Mapbox canvas with custom growth-stage markers]
[Desktop: hover side panel | Mobile: swipeable StationCard carousel below map]
[Filter chips: Growth stage, Funding tier, Has upcoming events]
```

### Ask English (`/questions`)
```
[Search bar + category filter chips]
[Sort: Top · New]
[List of QuestionCards]
[Floating "Ask a question" button]
```

## 9. Animation language

- Seeds/sprouts/trees use spring-based scale/grow transitions (Framer Motion), never
  linear ease — growth should feel organic, slightly bouncy, never mechanical.
- Page-level: soft fade+slide-up on route entry (150ms), no jarring hard cuts.
- Numbers that increment (impact stats, live ticker) count up rather than snapping.
- All decorative motion respects `prefers-reduced-motion: reduce` by freezing on the
  final frame instead of disabling the element entirely (content stays identical, only
  the animation is skipped).
