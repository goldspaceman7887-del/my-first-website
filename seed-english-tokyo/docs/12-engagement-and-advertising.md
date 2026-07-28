# 12 · Engagement & Advertising Additions

Covers three additions on top of the living-ecosystem redesign (`11`): a citywide seed
goal, an interactive harvest field, and a platform-advertising seed type. Also documents
a growth-formula bug found and fixed during this round.

## 1. Bug fix: growth score could exceed 100

`percentileRank()` computed `(below + equal/2) / (N - 1)`. For a field that is the unique
maximum on a metric (`below = N-1`, `equal = 1`), this evaluates to `(N-1 + 0.5)/(N-1)`,
which is always slightly above 1 — a 10-station Shibuya showed **Growth score 106/100**.
Fixed by dividing by `N` (the full count) instead of `N-1`, with a `Math.min(100, …)`
clamp as defense in depth. A field that's the unique max on every input metric now caps
at 95/100 per metric (never literally 100, since "ranked above every field including
itself" isn't meaningful) — see `lib/mock-data.ts::percentileRank`.

## 2. Citywide seed goal

`CITYWIDE_SEED_GOAL = 10000` in `lib/mock-data.ts`, paired with a deduplicated
`totalSupporters` figure on `cityImpactSummary` (distinct from summing each field's
`donorCount`, which double-counts anyone who supported more than one field — the mock
value assumes modest overlap). Rendered by the new `SeedGoalBar` component: a progress
bar toward 10,000 seeds citywide plus the supporter count, shown prominently on `/` and
`/map`. In production, `totalSupporters` is `COUNT(DISTINCT owner_id) FROM seeds`, and
the goal itself becomes a `settings` row an admin can raise as the map expands beyond
Tokyo's 10 launch stations.

## 3. Interactive harvest field

Previously the field visualization (the scattered tree icons) was purely decorative —
on `/map` and `/universities` the whole card navigates to the detail page when clicked
anywhere, but on the detail page itself (`/map/[slug]`) nothing in the field was
clickable, so there was no way to "go into" the field the way a user expects from seeing
hundreds of individual trees.

**What changed**: `HarvestField` gained an `interactive` prop and an `ownedSeeds` prop.

- On `/map/[slug]`, `interactive` is now `true`. Tapping any tree opens an info panel
  below the field with that field's real aggregate numbers (funding, donor count,
  status) — deliberately **not** a fabricated per-tree identity, since only 3 seeds in
  this scaffold have real backing records. The panel is explicit about this: "individual
  seed records aren't public yet."
- If the signed-in account's own real seeds (from `mySeeds`) are planted at that
  station, those specific trees are rendered with a distinct orange ring and are real
  `<Link>`s straight to `/seeds/[id]` — genuine individual drill-down, using only real
  data. A badge in the corner of the field ("🌟 N of your seeds here") makes them easy to
  spot.
- `interactive` is left `false` on `/map` and `/universities`, where the field is nested
  inside an outer card-level `<Link>` — nesting a `<button>` inside an `<a>` is invalid
  HTML, so per-icon interactivity only applies where the field isn't already the click
  target for something else.

**Production path**: once `seed_impact_events` and `seeds` are real, every tree can map
to an actual seed row (the aggregate popover becomes a real per-seed popover for anyone's
seed, not just the signed-in owner's), at which point the "individual seed records aren't
public yet" framing goes away entirely — the interaction pattern doesn't need to change,
only the data backing it.

## 4. Advertising seeds — platform ad spend

A second seed type, alongside funding a physical field: fund an ad on a platform, or a
preset campaign bundle, to promote an event or Seed English Tokyo itself. Lives at
`/advertise`.

### Platforms (`adPlatforms` in `lib/mock-data.ts`)

TikTok, Instagram, LINE, X, YouTube — chosen because they're the platforms Japanese
18–30s actually use, per the request that drove this feature; LINE in particular is
essential for a Japan-targeted product (it's the dominant messaging app, with its own
ad/timeline product) and would be a mistake to omit in favor of only Western-default
platforms.

Each platform carries an `impressionsPerThousandYen` figure. **This is an illustrative
estimate for the demo, not a real rate card from any ad platform** — flagged as such in
the UI copy, consistent with how seed-tier impressions are already flagged as estimates
elsewhere. Getting real numbers requires actually running ads (or at minimum pulling
each platform's current self-serve ad-manager benchmarks) before this ships for real.

### Flow

1. Choose a platform (`/advertise` step 1) — or skip straight to a **preset campaign**
   (step-3 equivalent): a bundle across multiple platforms priced and described for a
   specific purpose (e.g. "Conversation Night Promo" = LINE + Instagram, ¥8,000).
2. Choose a budget — ¥1,000/5,000/10,000/25,000/50,000 presets or a custom amount, same
   quantity-picker pattern as `/seeds/plant` for consistency.
3. See the estimated reach, computed transparently (`budget / 1000 × rate`), and fund it.

### Data model (for the real build)

Reuses the `seed_tiers` / `seeds` pattern from `02-database-schema.md` with one addition:
a `channel` column on `seeds` (`field` | `ad_platform`) and, for ad seeds, a
`platform_key` and optional `campaign_key` instead of a `station_id`/`university_id`.
The attribution model in `04-seed-tracking-system.md` still applies — an ad seed's
"impact created" becomes click-throughs and registrations attributed via the platform's
own ad-conversion tracking (UTM-tagged links back to the relevant field or event page),
feeding the same `seed_impact_events` ledger as every other seed type. This keeps ad
spend accountable to the same "no fake growth" standard as everything else on the
platform — an ad seed's impact is only ever what real click/registration data says it
was, never the impression estimate restated as if it were outcome data.
