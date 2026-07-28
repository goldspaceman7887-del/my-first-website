# 05 · Tokyo Impact Map

## 1. Purpose

Turn abstract fundraising into a literal, watchable transformation of Tokyo — from bare
soil to a living forest — so every visitor immediately understands the mission without
reading a paragraph of copy.

## 2. Stations at launch

Shibuya, Shinjuku, Ikebukuro, Tokyo Station, Ueno, Akihabara, Shinagawa, Kichijoji,
Nakano, Yokohama — seeded as rows in `stations` with real lat/lng. Designed to expand to
more stations (and eventually other cities) without a schema change.

## 3. Per-station data (shown on hover/tap and on `/map/[slug]`)

- Funding Raised (¥)
- Active Seed Count
- Website Visits
- Registrations
- Learners Active
- Upcoming Events (count + list)
- Growth Score (0–100)
- Forest Health Score (0–100)

**Growth Score** = weighted composite of registrations velocity, meetup attendance, and
event frequency over the trailing 30 days — "is this station actively growing right now."

**Forest Health Score** = weighted composite of retention (active learners / total
registrations), review ratings, and trust-score average of local users — "is this
community healthy, not just big."

## 4. Visual states

| Stage | Trigger (growth_score) | Visual |
|---|---|---|
| Bare soil | 0–9 | Flat cream/tan station marker, no vegetation |
| Seedling | 10–34 | Small sprout icon, light green pulse animation |
| Tree | 35–69 | Full tree icon, size scales with `forest_health_score` |
| Forest | 70–100 | Cluster of trees + a subtle canopy glow; at 90+, birds/particle
  ambience (respects `prefers-reduced-motion`) |

Stage transitions animate in real time when a station crosses a threshold (e.g. a station
visited while sitting at growth_score 33 that ticks to 35 visibly sprouts into a tree
without a page reload) via the realtime channel described in `01-architecture-and-sitemap.md`.

## 5. Implementation

- **Mapbox GL JS** custom style: cream/light-green terrain base matching the design
  system, no default Mapbox road clutter — Tokyo rendered as a stylized, minimal
  "growing landscape" rather than a literal street map.
- Stations are custom `Marker`s with an HTML/React element (not default pins) so the
  growth-stage icon can be a small animated SVG/Lottie.
- Desktop: hovering a station opens a side panel with the full stat block above; clicking
  navigates to `/map/[slug]`.
- Mobile: map on top (60vh), swipeable station-card carousel below driven by the same
  data, tapping a card centers the map on that station.
- A **city-wide summary bar** above the map shows aggregate totals (total raised, total
  learners, total forest coverage %) and updates live.
- Data source: `GET /api/v1/stations` (list + summary) and `GET
  /api/v1/stations/:slug/metrics?range=30d` (detail sparkline charts) — see
  `03-api-architecture.md`.

## 6. Empty/low-activity state handling

Bare-soil stations are never hidden or deprioritized — they're framed as opportunity
("Shinagawa needs its first seeds — be the first to plant one here"), with a direct CTA
into `/seeds/plant?station=shinagawa`. This turns the map into a funding-allocation tool,
not just a vanity dashboard.

## 7. Accessibility & fallback

- Every visual growth stage has an equivalent text label and numeric score exposed to
  screen readers (`aria-label="Shibuya — Forest stage, growth score 82 of 100"`).
- If Mapbox fails to load (or the user has data-saver / JS-map-disabled preferences), the
  page degrades to the same `StationCard` grid used in the mobile carousel — the map is a
  progressive enhancement over a fully functional list.
