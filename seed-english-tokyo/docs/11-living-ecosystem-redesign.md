# 11 · Living Ecosystem Redesign

This doc supersedes the framing (not the mechanics) of `04-seed-tracking-system.md` and
`05-tokyo-impact-map.md`: same underlying data model, but the product is repositioned
from "crowdfunding with a nice visual" to a living ecosystem people return to and watch
grow. Read this alongside those two docs, not instead of them.

## 1. The reframe

> People should not feel like they donated money. People should feel like they planted
> something.

Every visual change on the platform is tied to real activity — no fake growth, no
arbitrary progress bars. A seed becomes, in order: **Impressions → Website Visits →
Registrations → Questions Asked → Conversations → Meetups → Active Learners →
Community.** Each arrow is a real, logged event (see `seed_impact_events` in
`02-database-schema.md`), not a timer or a cosmetic animation.

## 2. Plant a Seed — the 4-step flow

1. **Choose where to plant** — a station, a university, or "Highest Need Area" (the
   lowest-growth-score field, auto-selected).
2. **Choose quantity** — 1 / 5 / 10 / 25 / 50 / 100 / 250 / 500 / 1000 chips, or a custom
   amount. (Implemented in `/seeds/plant`.)
3. **Preview expected impact** — shown with the actual arithmetic, not a black box:
   ```
   10 Seeds (Growth Seed tier)
   Estimated Reach:          250 impressions   (10 × 25/seed)
   Estimated Website Visits:  ~50               (reach × station visit-conversion rate)
   Estimated Registrations:   ~5                (visits × station signup-conversion rate)
   ```
   Visit/registration estimates derive from each station's own historical conversion
   rates (`visits / impressions`, `registrations / visits`), so a high-converting field
   like Shibuya shows a different estimate than a cold one — the preview is honest about
   uncertainty, framed as "estimated," never promised.
4. **Plant** — a seed-drop animation into the chosen field; the field's icon density
   updates immediately client-side (optimistic UI), then reconciles with the server's
   real count once the transaction confirms.

## 3. The growth formula

Every field's (station's or university's) `growth_score` is a weighted composite of five
real signals, not a hand-set number:

```
growth_score = 30% × funding_percentile
             + 20% × impressions_percentile
             + 20% × registrations_percentile
             + 15% × meetups_percentile
             + 15% × active_learners_percentile
```

Each input is expressed as a percentile rank across all fields (0–100) before weighting,
so no single raw metric (e.g. a station with huge historical visit counts but no recent
meetups) can dominate the score just by being a bigger number. Recomputed nightly by the
same job described in `04-seed-tracking-system.md`.

### Growth states (expanded from 4 to 7)

| Stage | Score band | Visual |
|---|---|---|
| Bare Soil | 0–9 | Flat tan soil, no vegetation |
| Seedling | 10–24 | Single sprout, 2 leaves |
| Sprout | 25–39 | Taller stem, 4 leaves, gentle sway |
| Sapling | 40–54 | Thin young tree, no canopy yet |
| Tree | 55–69 | Full canopy, single tree |
| Forest | 70–84 | Cluster of trees, canopy glow |
| Ancient Forest | 85–100 | Dense cluster + particle ambience, the platform's rarest state |

### Field Health Score (separate from growth score)

`field_health_score` reuses the `forest_health_score` definition in
`05-tokyo-impact-map.md` (retention, reviews, trust) and maps to a status label shown
next to every field:

| Health score | Status |
|---|---|
| 0–19 | Needs Water |
| 20–39 | Growing |
| 40–59 | Healthy |
| 60–79 | Thriving |
| 80–100 | Fully Activated |

"Needs Water" is deliberately not "dying" or "failing" — the platform never shames a
field, only invites contribution ("Community Rain," §9.1).

## 4. Tokyo Demand Heatmap — two-layer map

The map now has two switchable layers over the same station positions:

- **Funding/growth layer** (existing, `05-tokyo-impact-map.md`) — what's been built.
- **Demand layer** (new) — `demand_score` per field, banded into
  Blue (low) → Yellow (moderate) → Orange (high) → Red (very high), independent of how
  much has been funded there yet.

Overlaying both is the product's actual discovery mechanic: a donor can see "red demand,
blue funding" — a field lots of people want and almost nobody has funded — and choose to
plant there specifically. This is why `demand_score` was added to `mock-data.ts`
independently of `growth_score` rather than derived from it.

## 5. Seed identity & attribution (extended)

Seed detail now also carries the **owner's display name** and the **impressions**
figure, alongside the existing impact breakdown from `04-seed-tracking-system.md`:

```
Seed #18872
Location: Shibuya
Owner: Alex
Date: July 2026

Impact:
  2,420 impressions
  184 visits
  19 registrations
  5 meetup attendees
  1 active learner
```

## 6. My Forest Dashboard

`/seeds` becomes a full personal dashboard, not just a list:

- Total Seeds, Total Reach (impressions), Questions Helped, Conversations Generated,
  Events Created, Learners Supported — six headline stats, each traceable to real
  attributed events.
- **Emotional Impact** section — real, specific outcome sentences generated from the
  underlying event log ("Your seed helped a university student attend their first
  meetup"), not generic copy. Each sentence links back to the seed that funded it.

## 7. Real-time activity stream

A continuously-updating feed (`🌱 5 seeds planted in Shinjuku`, `🌳 Shibuya reached Tree
Level`, `💬 New English question posted`) on the homepage and map. In production this is
a server-sent-events/WebSocket subscription over the domain events already defined in
`03-api-architecture.md` (`seed.planted`, `event.completed`, `question.answered`, plus a
new `field.stage_changed` event emitted by the nightly growth recompute job when a field
crosses a stage boundary). The scaffold renders the same shape of data from a mock feed.

## 8. Seasonal design system

The platform's decorative layer (not its data) shifts with the real calendar month:
Spring (Mar–May) → cherry blossom accents, Summer (Jun–Aug) → lush deep green, Autumn
(Sep–Nov) → maple red/orange accents, Winter (Dec–Feb) → soft snow-white overlays.
Applied as a thin accent layer on hero/decorative surfaces only — growth-stage colors and
data visuals never change with season, so the two systems never compete for meaning.

## 9. Feature catalog — what's built vs. roadmap

This redesign brief proposes many mechanics. Being explicit about scope: items marked
**Built** exist in the `seed-english-tokyo/web` scaffold against mock data today; **V2**
items are fully specified here and in the roadmap but need real backend/event data to be
honest (they'd be fake without it) and are sequenced into `10-roadmap.md`.

| Feature | Status | Notes |
|---|---|---|
| 4-step Plant a Seed flow | **Built** | `/seeds/plant` |
| 7-stage growth formula + health status | **Built** | `lib/mock-data.ts`, `growth-stage.tsx` |
| Two-layer demand/funding heatmap | **Built** (toggle) | `/map` |
| Extended seed identity (owner, impressions) | **Built** | `/seeds/[id]` |
| My Forest Dashboard | **Built** | `/seeds` |
| Real-time activity stream | **Built** (mock feed) | needs SSE/WebSocket backend for real use |
| University Forests | **Built** | `/universities` |
| Seasonal design accents | **Built** | derived from real current date |
| 9.1 Community Rain (drought → contribute water) | Roadmap V2 | needs a distinct "rain" micro-transaction type in `transactions`; mechanically a Seed purchase with different framing — cheap to add once payments are real |
| 9.2 Forest Guardians (top-contributor district roles) | Roadmap V2 | needs a real leaderboard service + a role/permissions concept beyond `role` enum today |
| 9.3 Conversation Trees / Wisdom Trees / Friendship Forest (milestone-triggered special trees) | Roadmap V2 | needs the achievement-evaluation job (`07-gamification-ai-admin.md`) extended with new milestone types — same engine, new triggers |
| 9.4 Seed Trails (visualize where a user's seeds "spread") | Roadmap V2 | needs the attribution graph to be traversable, not just aggregated — a real data-viz project once `seed_impact_events` has volume |
| Tokyo Forest Time Machine (historical replay/scrubber) | Roadmap V2/V3 | needs `station_metrics_daily` to accumulate real history; a mock version would misrepresent past growth that never happened, so it's deliberately not faked here |
| Growing Stations as full 3D ecosystems | Roadmap V3 | a materially bigger art/engineering investment; 2D field visuals are the right fidelity until the city map itself is real (Mapbox) |
| Multi-city network — **Tokyo first**, then other Japanese cities (Osaka, Kyoto, Fukuoka, Nagoya, Sapporo, Yokohama-as-standalone) | Roadmap V3 | Tokyo is the entire product for the foreseeable future — every station, university, and field in this scaffold is Tokyo-only by design. International expansion (Seoul, Taipei, etc.) is explicitly out of scope; the next map after Tokyo is another Japanese city, not another country. See `09-growth-monetization-strategy.md` §7, updated to match. |

The through-line for every "Roadmap" item above: this platform's core promise is that
growth is never faked. Anything that would require inventing history or numbers to look
finished stays documented, not built, until it can be true.
