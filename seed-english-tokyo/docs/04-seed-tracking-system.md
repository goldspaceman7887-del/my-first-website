# 04 · Personal Seed Tracking System

This is the emotional core of the product: a supporter gives ¥500–¥10,000 and can watch,
by name, what that specific contribution caused.

## 1. Seed lifecycle

```
Purchase → Mint → Plant (geo-tagged to a station) → Grow (impact accrues) → Mature
```

1. **Purchase** — supporter checks out via Stripe or PayPay for a tier (`seed_tiers`).
2. **Mint** — on payment success (webhook), a row is inserted into `seeds` with a
   sequential `seed_number` (the human-facing "Seed #78422"), owner, tier, and a station.
   Station is either chosen by the supporter or auto-assigned to the highest-need station
   (lowest `growth_score` weighted by population density) if they pick "Plant it where
   it's needed most."
3. **Plant** — the seed appears immediately on `/seeds/[id]` with status `growing` and a
   0% tree progress, 0.000% forest contribution.
4. **Grow** — as real activity happens at that station (visits, registrations, meetup
   attendance), the attribution engine (below) credits a share of it to the seed.
5. **Mature** — once tree progress reaches 100%, status flips to `thriving`; the seed
   keeps accruing forest-contribution % indefinitely (a seed never stops mattering).

## 2. Example (matches the product brief)

```
Seed #78422
Date Planted:     April 12, 2027
Location:         Shibuya
Contribution:     ¥1,000  (Growth Seed 🌿)
Status:           Growing

Impact Created:
  • 12 people visited the website
  • 3 people registered
  • 2 people attended a meetup
  • 1 active learner remains

Tree Progress:    42%
Forest Contribution: 0.4%
```

## 3. Impact attribution model

Attribution has to be honest: we can't claim a seed "caused" a specific person to sign up
in a literal 1:1 sense, since many seeds fund the same station simultaneously. Instead we
use **proportional attribution**, computed nightly per station:

```
seed_share(seed) = seed.contribution_yen * tier.impact_weight
                    ────────────────────────────────────────
                    Σ (all active seeds' contribution_yen * impact_weight) at that station

station_impact_this_period = { visits, registrations, meetups, active_learners }

seed.impact_created = station_impact_this_period * seed_share(seed)
                       (accumulated into seed_impact_events, one row per period per type)
```

- `impact_weight` lets larger tiers (Forest Seed 🌲) be weighted more per yen for
  psychological fairness (a ¥10,000 seed should visibly outperform a ¥500 one), tunable
  independently of raw yen amount — e.g. `seed=1.0, growth=1.05, community=1.15,
  forest=1.3`.
- Numbers are **counts, not fractions** in the UI — `seed.impact_created` accumulates as a
  running integer per type (rounded fairly using a largest-remainder method across all
  seeds at a station so the sum of displayed integers always equals the true station
  total — no supporter sees "0.3 people registered").
- This recomputation runs as a nightly job (`recompute-seed-impact`), reading
  `station_metrics_daily` and writing/upserting `seed_impact_events`. It's fully
  re-runnable and auditable — nothing is mutated destructively, so past attributions can
  always be recomputed if the model improves.

## 4. Growth stage & percentages

- **Tree Progress %** — a seed's individual maturity curve: `min(100, impact_score /
  tier.tree_progress_target * 100)`, where `impact_score` is a weighted sum of the seed's
  accumulated impact events (registrations and meetups weighted higher than raw visits).
  Deliberately front-loaded (visits move the needle fast early) then flattens (meetups are
  rare and valuable) — mirrors real plant growth: fast sprouting, slow maturing.
- **Forest Contribution %** — `seed.contribution_yen / station.total_lifetime_funding_yen
  * 100`, i.e. this seed's durable share of everything ever raised at that station. Small
  numbers by design (a single ¥500 seed among thousands should read as "0.4%," not "1%"
  inflated) — reinforces the "every seed matters, the forest is bigger than any one of
  us" narrative rather than overselling individual impact.

## 5. "My Seeds" dashboard spec

`/seeds` — grid/list of `SeedCard`s, sortable by date planted, growth stage, or impact.
Each card shows: seed name/number, thumbnail growth-stage icon, date purchased, location,
contribution amount, current growth stage, people reached, learners registered, meetups
attended. A summary header aggregates: total seeds owned, total contributed, total
community impact (people reached across all seeds), and a personal "forest" visualization
(mini animated cluster of the user's own trees).

`/seeds/[id]` — full detail: the example layout above, plus an **impact timeline**
(chronological feed of attributed events: "3 days after planting, someone registered
near Shibuya station"), a small map pin showing the station, and a **share card**
generator (`/seeds/certificate/[id]`) producing an OG-image-style PNG for social sharing.

## 6. Larger contributions

- **Multiple seeds** — a supporter can buy any tier repeatedly; `/seeds` simply lists all
  of them.
- **Tree sponsorship** — a lump-sum pledge (`sponsorships.scope = 'tree'`) tied to one
  station, displayed as sponsoring an entire visible tree on the map rather than an
  individual seed; internally still feeds the same attribution ledger, just at higher
  weight and with a distinct "Tree Sponsor" badge/certificate.
- **Forest sponsorship** — city-wide pledge (`station_id = null`), split proportionally
  across all stations by need; earns the "Forest Sponsor" tier, the platform's top
  supporter recognition, and a permanent listing on `/how-it-works`.

## 7. Digital certificate & social share card

Auto-generated (server-side image generation, e.g. `@vercel/og`) on mint and re-rendered
whenever milestones are hit (tree matures, seed crosses a forest-contribution threshold).
Contains: seed number, tier icon, station name + skyline silhouette, contribution amount,
QR code back to `/seeds/[id]`, and the tagline "My seed is growing 🌱."
