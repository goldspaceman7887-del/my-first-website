# 16 · Growth Simulator

Request: a sandbox to run a simulation — starting genuinely at zero — where you can plant
seeds and, separately, plug in the real results from an English-camp ad actually run for
Japan's 18-30 audience, and see what it does to a neighborhood's growth.

## `/simulate` — a neighborhood that starts at zero

Unlike `/seeds` (which ships with 3 baked-in demo seeds) or the real Tokyo stations (which
all start with real accumulated history), `/simulate` has its own, entirely separate
localStorage namespace (`lib/simulation.ts`) that begins completely empty — no seeds, no
funding, no impressions. Nothing here ever touches your real forest, the live Tokyo map,
or citywide totals; a "Start over from zero" button clears just this sandbox.

### Two ways to grow it

1. **Plant a simulated seed** — the same seed tiers as the real `/seeds/plant` flow.
   Impact is *estimated*, the same way the real plant flow estimates it: from the
   sandbox's own accumulated conversion rate (visits/impressions, registrations/visits),
   falling back to the same default rates the real site uses until the sandbox has data
   of its own.
2. **Import real ad results** — a form for the actual numbers from an ad you ran
   (platform, amount spent, impressions delivered, link clicks, registrations if known).
   Unlike the seed-planting estimate, these numbers are used *exactly as entered* — no
   formula touches them. This is the literal "take real data from an English ad" request:
   a bridge from what really happened on TikTok/Instagram/LINE/X into the same growth
   model the rest of the platform uses, still assuming the platform's stated 18-30 Tokyo
   audience.

### Growth score, without a peer group to compare against

The real growth score (`computeGrowthScores` in `lib/mock-data.ts`) is *percentile-ranked*
against the other 9 stations — meaningless for a single sandbox with no peers. Instead
`totalsFromEvents` in `lib/simulation.ts` scores the sandbox as a percentage of Shibuya's
current scale (the most mature real field) on funding, impressions, registrations, and
active learners — reaching Shibuya's numbers on every metric = 100. The same
`growthStageForScore`/7-stage badge and `HarvestField` visualization the rest of the site
uses render this score, so a fully-grown simulation looks like a fully-grown real station.

### Event log, not just a running total

Every plant and every imported ad result is kept as an entry in a visible timeline
(newest first, removable individually) rather than being collapsed straight into a single
number — so you can see exactly what you added and correct a mistyped ad result without
starting over.

## A clickable map — tried, then reverted

A prior version added a clickable Tokyo map so every situation could be tied to a
neighborhood. Feedback: that made logging a situation two steps (pick a spot, then fill
out the form) when the actual request was to make this *easier*, not spatial. The map and
its `stationSlug` field have been removed entirely — `components/simulator-map.tsx` is
deleted, and `SimEvent` no longer carries a location. Everything now lives in one place.

## Week-at-a-time simulation

The current design runs the sandbox one week at a time instead of as a single undated
pile of numbers:

- **`Log a situation — Week N`** is one unified card with a two-way toggle — 🌱 *Estimated
  seed batch* or 📣 *Real ad result* — instead of two separate side-by-side panels. Whichever
  you pick, the same "Log to Week N" button adds it, tagged with the week you're currently
  on. This is the direct fix for "I want a place where you bring real and estimated numbers
  for different situations" — one form, one button, a type toggle instead of two forms to
  choose between.
- **`Advance to Week N+1 →`** moves the sandbox's clock forward. Nothing is auto-generated
  when you advance — it's a pure bookmark that changes which week new situations get
  tagged with, so "run it for a week" means logging whatever actually happened that week,
  then moving on.
- **Week by week** replaces the flat timeline: one card per week (newest first), each
  showing that week's own situations (with an "estimated" or "real" badge per line) and
  that week's own subtotals, *plus* the running cumulative growth score/stage through the
  end of that week — so you can watch the stage badge advance from bare soil toward a
  forest as you step through weeks, not just see one final number.
- Seed-planting's conversion-rate estimate still derives from the sandbox's own
  accumulated totals so far (visits/impressions, registrations/visits), same fallback
  defaults as before — now just without a location filter.
- "Start over from zero" now also resets the week counter back to 1, alongside clearing
  every logged situation.

Verified: `tsc --noEmit` clean, `next build` produces all 27 static routes, and a
Playwright run confirmed: the sandbox starts at Week 1 with no map section present,
logging an estimated seed batch and a real ad result both tag correctly to the current
week with the right badge, advancing to Week 2 creates a new week card while Week 1's own
data and subtotals stay untouched, and reset clears storage and returns to Week 1 — all
with zero console errors in both `next dev` and the static export.
