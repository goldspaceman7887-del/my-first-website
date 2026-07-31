# 18 · Mission & Community Expansion

Request: "build all of it, every single one" — referring to the full roadmap left
unbuilt at the end of docs/17 (Human Connection Center full, Prayer Request Center
full, Bible Access Center, Local Church Connection Center, University Connection
Platform deepened, Stories & Testimony Engine, Volunteer Platform, Donor Engagement
Expansion, Mission Achievements, Mission Briefing Center, Real-Time Mission Activity +
Live Counters).

## The one hard limit

Most of that list is genuinely buildable as honest frontend/demo work, following the
same conventions used everywhere else on this platform (mock data + localStorage,
clear "this is a demo" disclosure, no claim of functionality that doesn't exist). A
few pieces, as the spec describes them, are not:

- **Real-time video calling to an actual volunteer/pastor/mentor** — this needs a real
  video calling service, real accounts, and a real person on the other end. There is
  no backend here at all; a "start video call" button with nobody listening would be
  actively deceptive, especially for someone reaching out at a vulnerable moment — the
  exact risk already flagged and agreed on for the Prayer Request Center in docs/17.
- **Real multi-user auth with visitor/volunteer/leader/admin roles** — a static export
  has no server, no database, no login. Anything presented as "admin-only" here would
  be either fake or trivially visible to everyone, so it isn't presented as gated.
- **Real routing of urgent requests to a real on-call team** — paging real people
  requires a real backend and a real on-call rotation, neither of which exist.

These weren't silently skipped or silently faked. Where the spec calls for them,
what's built instead is the same honest pattern already established for `/prayer` and
`/partners`: request → saved to this browser only → explicit statement that a real
team reviews it later, once that real infrastructure exists. This is a permanent
scope boundary for a backend-less static site, not a "todo."

## What's built this round

**`/churches` — Local Church Connection Center.** A directory (`lib/churches-data.ts`)
of six example Tokyo churches with denomination/language/service-time filtering. Every
listing is explicitly marked "(example)" in its name and the page opens with a
disclaimer that these are illustrative, not real churches — presenting fabricated
church names as real, tied to real station names, without that disclaimer would risk
sending someone to a real neighborhood looking for a church that doesn't exist.
"I'm interested" saves locally (`lib/church-interest.ts`); real follow-up routes
through `/partners`.

**`/stories` — Stories & Testimony Engine.** Three curated example testimonies
(`lib/testimonies.ts`, clearly fictional like the rest of the platform's demo data)
plus a submission form that saves to this browser only, shown in its own "Shared on
this device" section — never merged with or presented as being alongside other real
visitors' stories, since a static site can't actually publish across visitors.

**`/bible` — Bible Access Center.** A real 21-day reading plan through the Gospel of
John (`lib/bible-data.ts`) — one real chapter per day, John genuinely has 21 chapters.
Progress and streaks (`lib/bible-progress.ts`) are computed from real calendar dates
you mark as read, stored locally. The verse of the day rotates through ten real,
verbatim King James Version verses (public domain) keyed off the real day of the year.
Full chapter text still isn't hosted in-app — it links out to bible.com, same as
`/explore` — hosting complete Bible text is a real licensing/scope decision, not
something to fake with placeholder text.

**`/mission` — Mission Briefing, Achievements, and Live Counters.** Badges
(`lib/badges.ts`) are computed from real local activity — seeds planted, prayer
requests sent, connections requested, testimonies shared, Bible plan streak — never
hand-set. The "live activity" panel reuses the existing `ActivityStream` component,
which was already honest about rotating through mock data rather than a real feed
(see its own code comment); the citywide stats block is explicitly labeled "aggregated
... not a literal real-time feed" rather than implying a live websocket connection
that doesn't exist.

**`/volunteer` — Volunteer Platform (application only).** Pick interest areas (prayer
team, connection team, events, translation, tech), saved locally as an application. It
is explicitly not real assignment or matching — the page states plainly that there's
no vetting, training, or matching pipeline behind it yet, because that's real
infrastructure this platform doesn't have.

**University Connection Platform, deepened.** `/universities` gained a small-group
finder (`lib/campus-groups.ts`, example listings, same "not real registered groups"
disclosure as churches) and a campus ambassador application form
(`lib/ambassador-applications.ts`, same local-save-only pattern as volunteering).

**Donor Engagement Expansion.** `/seeds` (My Forest) gained a milestones panel computed
from your real seed data (seeds planted, yen contributed, impressions reached, people
reached) and a **"Download impact report"** button that generates a real `.txt` file
client-side via `Blob`/`URL.createObjectURL` — this one is not a demo placeholder, it's
a genuinely working download of your real local data.

**`/team` — Volunteer Team View.** A preview of what a volunteer's triage dashboard
would look like, showing prayer requests, connection requests, and volunteer
applications saved on this device. The page states directly that this isn't a real
admin panel: there's no login, anyone can see it, and it only shows this browser's own
locally-saved data — not real submissions from real visitors elsewhere.

**Your Next Step, updated.** "Read The Bible" now points to the real `/bible` plan
instead of `/explore`. Added "Find A Church" (`/churches`) and "Share Your Story"
(`/stories`). Nav updated with links to every new page.

## What's still not built

- Real matching/scheduling/video calling for Human Connection (see the hard limit
  above — permanent, not scheduled).
- Real multi-user auth and role-based admin dashboards (same).
- Real on-call routing for urgent prayer needs (same).
- A real backend for anything above — none of this platform has moved off static
  export + localStorage, by design, for a prototype.

Nothing in this doc or docs/17 should be assumed to exist beyond what's described here.
