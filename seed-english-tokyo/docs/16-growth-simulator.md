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

Verified: `tsc --noEmit` clean, `next build` produces all 27 static routes, and a
Playwright run confirmed the sandbox starts at zero, planting and ad-import both update
totals and the timeline correctly, ad-imported numbers are labeled "(as entered)" versus
seeds' "(estimated)", reset actually clears storage, and the page hydrates with zero
console errors in both `next dev` and the static export.
