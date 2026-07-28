# 15 · Real Persistence for Planting, Map Usability, a Real Hydration Fix

Feedback: planting a seed on `/seeds/plant` didn't visibly change anything anywhere else on
the site, the homepage felt unfinished, and the Tokyo map couldn't be panned/zoomed or
show which seeds were yours before committing to a station.

## 1. Planting a seed now actually persists

This is a static export with no backend/database — a "planted" seed can't be written to a
server. Previously `/seeds/plant`'s confirmation screen was pure local component state:
it animated a harvest field and then discarded everything on the next page load, which is
exactly the "not updating" bug reported.

`lib/local-seeds.ts` now saves a real `Seed` record to this browser's `localStorage` at
the moment you plant. It shows up:
- In **My Forest** (`/seeds`) — grove visual, station groups, stats.
- On its own detail page — since static export can't pre-build a page for an id that
  didn't exist at build time, newly-planted seeds route through `/seeds/view?id=...`
  instead of `/seeds/[id]` (same "read the query string client-side" pattern already used
  by `/seeds/plant`'s `?tier=&station=`). `components/seed-detail.tsx` is the shared
  presentational component both routes render.
- On the **Tokyo map** — as a small ringed marker near its station (see §3).
- In the **citywide seed goal bar** — `SeedGoalBar` now adds this browser's planted-seed
  count on top of the citywide mock total, so the goal bar and supporter count visibly
  move after you plant, on both `/map` and the homepage.

A freshly-planted seed is honest about being new: `treeProgressPct: 2`, zero impact
numbers, and copy that says impact "will show up here as it actually happens" — nothing
is estimated in advance, consistent with the no-fabricated-data principle used
everywhere else. It's saved to this browser only — the confirmation screen says so
explicitly, since there's no account system yet to sync it anywhere else.

## 2. Homepage fix

The homepage's "Live from Shibuya" card actually listed four *different* stations
(Shibuya, Shinjuku, Ikebukuro, Tokyo Station) under a label naming only one of them —
renamed to "Live across Tokyo" to match what it actually shows.

## 3. Tokyo map: pan/zoom, owned-seed markers, click-to-preview

`components/tokyo-heatmap.tsx`:
- **Pan and zoom** — the map now renders at a fixed pixel size (default 640px, +/− 160px
  per step, up to 1100px) inside a scrollable container, so you can scroll or drag to pan
  around and zoom into a neighborhood, instead of a fixed-size SVG that only ever showed
  the whole city at once.
- **Your seeds, on the citywide map** — every seed you own now renders as a small orange
  ringed marker near its station's dot (deterministic jittered position, same seeded-PRNG
  approach as `HarvestField`), linking straight to that seed. Previously "your seeds" only
  appeared once you'd already drilled into a specific station.
- **Click a station to preview it, without leaving the map** — station markers used to
  navigate straight to `/map/[slug]`. They now open an inline panel with seed count,
  demand, growth, active learners, and both a "Plant a seed here" and "View full field"
  link — so you can see what's there before committing to navigate away.

## 4. A real, pre-existing hydration bug, fixed

While building the click-to-preview panel, headless-browser testing (not just `curl`,
which only checks static HTML and can't catch this) turned up a genuine bug that predates
this round entirely: each station marker's SVG `<title>` tooltip, nested inside a Next
`<Link>`, caused a hydration mismatch on `/map` on every load — confirmed by reverting to
the previously-deployed component and reproducing the identical error. The fix removes
the SVG `<title>` tooltips (redundant now that clicking shows the full stats panel) in
favor of `aria-label` for accessibility. This is unrelated to this round's features but
was a real, live bug on the deployed site.

Verified: `tsc --noEmit` clean, `next build` produces all 26 static routes, and — beyond
the usual served-and-curled checks — a full Playwright run against both the static export
and `next dev` confirmed: planting persists and is visible on `/seeds`, `/seeds/view`,
and `/map`; the map's click-to-preview and zoom controls work; and `/map` now hydrates
with zero console errors (previously it silently fell back to full client-side
re-rendering on every load).
