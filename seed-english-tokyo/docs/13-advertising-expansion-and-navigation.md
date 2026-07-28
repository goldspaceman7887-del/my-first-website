# 13 · Advertising Expansion, Back Navigation, Forest Drill-Down, Testing Lab

Four additions on top of `12-engagement-and-advertising.md`.

## 1. Ad formats and campaign history

`/advertise` previously only let you pick a platform and a budget. It now has a second
dimension — **format** — and a visible record of what's actually run.

### Formats (`adFormats` in `lib/mock-data.ts`)

Video, Image, Story/Reel, Carousel, Creator/influencer post — each carries a `multiplier`
applied on top of the platform's `impressionsPerThousandYen`. Video reaches furthest per
yen (1.25×) but costs the most in production effort; influencer posts reach the least raw
impressions per yen (0.7×) but are flagged in copy as higher-trust/higher-conversion —
illustrative, not a claim backed by real campaign data yet.

### What's been put out (`adCampaignHistory`)

A table on `/advertise` listing every ad seed funded so far — title, platform, format,
budget, **delivered** impressions (deliberately a distinct field from the pre-purchase
estimate, since actuals never match forecasts exactly), funder, date, and status
(running/completed). This is what makes advertising feel like a real, ongoing program
rather than a one-off calculator — the same "living ecosystem, not a form" principle as
the rest of the platform. In production this is a real query over `seeds WHERE channel =
'ad_platform'` (see `12`'s data-model note) joined to actual ad-platform delivery data.

## 2. Global back navigation

Every page previously relied on browser back or a page-specific "← Back to X" link (which
not all pages had). `components/back-button.tsx` adds a persistent, thin bar directly
under the main header (inside the same sticky `<header>`, so it scrolls with it) showing
"← Back" on every page except the homepage.

Behavior: `router.back()` when there's actual in-app history to return to; falls back to
`router.push("/")` when there isn't (e.g., someone opens `/seeds/78422` as a fresh tab —
`router.back()` there would exit the site entirely, which is never what "back" should do
inside a product).

## 3. "Your forest within this forest" — full seed drill-down

Feedback on the interactive harvest field (added in `12`): highlighting a user's own
seeds as ringed markers scattered among hundreds of icons works, but if someone owns
multiple seeds at a station, spotting all of them by eye in the scatter isn't a real way
to browse them.

`/map/[slug]` now also renders a **"Your forest within this forest"** section — every one
of the signed-in account's real seeds at that station, as full `SeedCard`s (the same
component used on `/seeds`), directly below the field visualization. The ringed markers
in the field stay (so the *spatial* connection between "my seeds" and "this specific
forest" is still visible), but the definitive list is the card grid, not eyeballing dots.
Only rendered when `myOwnedSeeds.length > 0` — no empty section for stations where the
user hasn't planted anything.

## 4. Ad Reach Testing Lab

`/advertise/lab` — a calculator, explicitly not a purchase flow, for the "let me plug in
numbers before committing" workflow. Each test row lets you pick a seed tier + quantity
(the same units as the rest of the platform, so "10 Growth Seeds" always means the same
¥10,000 everywhere) plus a platform and format, and shows the computed budget and
estimated reach live.

- **Multiple tests, side by side** — "+ Add another test" appends another row; each is
  independent, so you can compare e.g. "10 Growth Seeds on TikTok video" against "the same
  10 Growth Seeds on LINE story" without losing either configuration.
- **Average testing** — a summary card totals budget and reach across every test on the
  page and computes the average impressions-per-¥1,000 across all of them, directly
  answering "on average, how far does this spend go."
- No "fund this" button here — the CTA at the bottom links to `/advertise` for anyone
  ready to actually commit. Keeping the lab side-effect-free (no `funded` state, no
  campaign-history writes) is deliberate: it should be safe to try wild combinations
  without worrying about accidentally "spending" anything.
