# 17 · Gospel Pivot — Seed Tokyo

Request: take the entire English-learning platform and pivot it into a gospel outreach
and discipleship platform for Japanese people interested in the Bible or Christianity,
followed by an extensive 19-section specification covering a "Your Next Step" action
center, Prayer Request Center, Human Connection Center, Bible Access Center, Explore
Jesus Center, Local Church Connection, University Connection Platform, donor/community/
gamification expansions, and more — explicitly framed as "not only a donor platform, but
also a complete gospel response, prayer, discipleship, and connection ecosystem."

That full spec is enormous — each of its 19 sections describes its own workflows,
database tables, notification systems, and follow-up logic. This round intentionally
scopes to the highest-priority, most explicitly-flagged pieces, and this doc records
what's actually built versus what remains as a roadmap.

## A safety decision made before building

The spec's Prayer Request Center and Human Connection Center, as literally written,
describe real-time "urgent need" escalation and volunteer routing — appropriate for a
platform with a real backend and a real on-call team, but risky as pure front-end on a
static demo site: someone in genuine crisis could submit a request and receive silence,
mistaking a demo for real support.

This was raised directly rather than silently built or silently dropped. The answer:
**"A human will respond on the other end. I'll build that section and platform later."**
So the front end is built now, using this project's established honest-demo conventions
(nothing claims to notify a real person; every submission is explicit about being
saved only in the browser), on the understanding that real backend/volunteer
infrastructure comes later. As a low-cost safety net that doesn't contradict that
answer, both `/prayer` and `/partners` always show real, verifiable crisis resources
(TELL Japan Lifeline, よりそいホットライン) regardless of form state.

## What's built this round

**Rebrand.** "Seed English Tokyo" → "Seed Tokyo", tagline "東京に福音の種を". The
existing seed → sprout → tree → forest metaphor is untouched — it maps directly onto
the Parable of the Sower. `app/layout.tsx` metadata/footer, `components/nav.tsx`, and
every page's metadata title were updated. The repo directory, deployment base path, and
`GH_PAGES_BASE_PATH` were deliberately left alone — this is a content/branding pivot,
not an infrastructure change.

**`components/your-next-step.tsx` — "Your Next Step."** The single most emphasized
requirement in the spec ("the MOST IMPORTANT REQUIREMENT"). Originally shipped with
seed-buying mixed into the same grid as prayer/connect actions; per direct feedback
("the seeds should be a total separate page, not together"), buying/funding a seed was
removed from this grid entirely — it's a different kind of action from prayer/connect
and stays on its own dedicated `/seeds/plant` page and homepage pricing section. It
renders in two places site-wide: prominently (full, non-compact) on the homepage right
after the hero, and compact in `app/layout.tsx` so it appears above the footer on every
single page in the app. See docs/18 for the full current action list.

**`/prayer` — Prayer Request Center (lite).** Share a prayer request, optionally
anonymous, saved to `lib/prayer-requests.ts` (localStorage). Always shows the crisis
resource box described above. Honest confirmation copy — no claim that a real person
has seen it yet.

**`/partners` — Human Connection Center (lite).** This route was already linked from
the nav and from Your Next Step but didn't exist before this round — building it was
load-bearing, not optional. Pick a way to connect (chat, video call, in-person),
optional topic and contact info, saved to `lib/connection-requests.ts`. Same crisis
resource box and same honest confirmation copy as `/prayer`.

**`/explore` — Explore Jesus Center (lite).** 14 topic cards (Who is Jesus?, why He
died, the resurrection, forgiveness, salvation, death, suffering, real life change, the
Bible, prayer, becoming a Christian, following Jesus, spiritual growth, finding a
church), each linking to `/questions` to actually ask about it. A featured "Start here"
banner links out to bible.com to begin reading the Gospel of John — a real link, not a
fabricated deep link.

**Content recopy.** `lib/mock-data.ts` questions/categories, events, seed tier
descriptions, ad package names, and ad campaign history titles were rewritten from
English-learning framing to gospel-outreach framing (Bible studies instead of English
cafes, faith Q&A instead of grammar questions, etc.) — data shapes and keys are
untouched, only display text changed. Visible labels referencing "active learners"
were reworded to "people reached" across the homepage, map, university, and simulator
views without renaming the underlying data fields (renaming those would ripple through
the growth-score formula and several components for no user-visible benefit).

## Roadmap

Everything named in the original spec that this round didn't reach — Bible Access
Center, Local Church Connection Center, University Connection Platform depth, Stories &
Testimony Engine, Volunteer Platform, Donor Engagement Expansion, Mission Achievements,
Mission Briefing Center, and Live Counters — was built in the following round. See
**docs/18-mission-and-community-expansion.md** for what each of those actually is and
where its honest limits are.

What's permanently out of scope for this platform as a static, backend-less site — not
"not built yet," but structurally impossible to build honestly here — is also detailed
in docs/18: real-time video calling to an actual human, real multi-user auth/roles, and
real routing of urgent requests to a real on-call team. Building convincing UI for any
of those without the real infrastructure behind them would repeat the exact risk this
doc's safety section describes — implying real-time human response where none exists.
