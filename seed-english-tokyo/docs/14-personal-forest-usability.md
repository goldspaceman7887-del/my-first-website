# 14 · Making "My Forest" More User-Friendly

Feedback: the individual/personal forest at `/seeds` didn't feel like a forest at all — it
was two redundant lists of the same three seeds (an "emotional impact" card grid, then a
full `SeedCard` grid right below it), no visual identity, and no way to browse by station
or find your most-grown seed once you own more than a handful.

## 1. `components/my-grove.tsx` — a real visual grove

`/seeds` gets its own scatter visualization, same deterministic-seed-position approach as
`HarvestField` (`components/harvest-field.tsx`), but keyed per-seed and scaled by
`treeProgressPct` instead of station density. Every tree is one of your real seeds, sized
by how grown it is, and links straight to `/seeds/[id]`. A hover tooltip (CSS-only, no JS
state) shows the seed number, station, and progress percentage without needing a click —
this page is meant to be scanned quickly, not drilled into one item at a time.

## 2. Removed the duplicate list

The old "Your seeds helped" section and "Every seed you've planted" section rendered the
same three seeds twice in different card styles. The emotional-impact quote now lives
directly on `SeedCard` (a quoted line under the impact stats), so there's one canonical
list, not two.

## 3. `components/forest-browser.tsx` — filter, sort, group by station

The seed list is now a client component that:
- Groups seeds by station, each group headed with a count and a **"View this forest →"**
  link straight to that station's `/map/[slug]` page — ties the personal forest back to
  the citywide map instead of leaving station names as plain text.
- Filters to a single station via a dropdown.
- Sorts by newest, most grown (`treeProgressPct`), or highest impact (impressions).

An empty state ("You haven't planted a seed yet") replaces what used to be a silently
blank page if `mySeeds` were ever empty.

## 4. `/seeds/[id]` — station link + prev/next

Each seed detail page now shows a **"View {station} forest →"** link next to the back
link, and a prev/next footer nav (`Seed #X ← / → Seed #Y`) ordered the same way as
`mySeeds`, so browsing your whole forest doesn't mean bouncing back to `/seeds` after
every single seed.
