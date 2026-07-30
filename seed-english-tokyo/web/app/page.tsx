import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrowthStageBadge } from "@/components/growth-stage";
import { ActivityStream } from "@/components/activity-stream";
import { SeasonalWash } from "@/components/motifs/seasonal-badge";
import { SeedGoalBar } from "@/components/seed-goal-bar";
import { YourNextStep } from "@/components/your-next-step";
import { cityImpactSummary, questions, seedTiers, stations } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <SeasonalWash className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Badge variant="leaf">For Tokyo, ages 18–30 · 東京への福音コミュニティ</Badge>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-forest-900 sm:text-5xl">
              Planting the gospel across Tokyo.
              <br />
              Funded by seeds you can watch grow.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-forest-900/80">
              Prayer, real conversations, Bible access, and a place to bring every
              honest question about Jesus — always free. Supporters plant trackable
              Seeds that fund every bit of it, and can watch exactly what their seed
              grows into.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">Join free</Button>
              <Link href="/seeds/plant" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Plant a seed 🌱
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-forest-900/70">
              <Stat label="people reached" value={cityImpactSummary.totalLearners.toLocaleString()} />
              <Stat label="raised so far" value={`¥${cityImpactSummary.totalRaisedYen.toLocaleString()}`} />
              <Stat label="gatherings this month" value={String(cityImpactSummary.meetupsThisMonth)} />
            </div>
          </div>
          <Card className="p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">
              Live across Tokyo
            </p>
            <div className="mt-4 space-y-3">
              {stations.slice(0, 4).map((s) => (
                <div key={s.slug} className="flex items-center justify-between rounded-xl bg-cream-50 px-4 py-3">
                  <div>
                    <p className="font-display font-semibold text-forest-900">{s.name}</p>
                    <p className="text-xs text-forest-900/60">{s.activeLearners} people reached</p>
                  </div>
                  <GrowthStageBadge stage={s.growthStage} score={s.growthScore} />
                </div>
              ))}
            </div>
            <Link href="/map" className="mt-4 inline-block font-display text-sm font-semibold text-forest-700 hover:underline">
              See the full Tokyo map →
            </Link>
          </Card>
        </div>

        <Card className="mt-10 p-5">
          <SeedGoalBar />
        </Card>

        <div className="mt-6">
          <ActivityStream limit={5} />
        </div>
      </SeasonalWash>

      <YourNextStep />

      {/* How it works */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-forest-900">
            Seeds → Sprouts → Trees → Forests
          </h2>
          <p className="mt-1 text-center text-sm text-forest-900/50">種 → 芽 → 木 → 森</p>
          <p className="mx-auto mt-2 max-w-xl text-center text-forest-900/70">
            Every seed is trackable. Every supporter sees exactly what their seed grew
            into — real reach, real questions asked, real people who took a next step.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🌱", title: "Plant a seed", desc: "Choose a tier, choose a station (or let it go where it's needed most)." },
              { icon: "🌿", title: "Watch it sprout", desc: "See real reach and questions start accruing to your seed." },
              { icon: "🌳", title: "Grow a tree", desc: "Questions turn into real conversations — your seed's tree fills in." },
              { icon: "🌲", title: "Build the forest", desc: "Thousands of seeds together turn Tokyo into a growing forest." },
            ].map((step) => (
              <Card key={step.title} className="p-6 text-center">
                <div className="text-4xl">{step.icon}</div>
                <h3 className="mt-3 font-display font-semibold text-forest-900">{step.title}</h3>
                <p className="mt-1 text-sm text-forest-900/70">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ask a question preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold text-forest-900">Ask a Question</h2>
          <Link href="/questions" className="font-display text-sm font-semibold text-forest-700 hover:underline">
            Browse all questions →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {questions.slice(0, 3).map((q) => (
            <Card key={q.id} className="p-5">
              <Badge variant="sky">{q.category}</Badge>
              <p className="mt-3 font-display font-semibold text-forest-900">{q.title}</p>
              <p className="mt-2 text-sm text-forest-900/60">
                {q.upvotes} upvotes · {q.answerCount} answers
                {q.hasBestAnswer ? " · ✓ solved" : ""}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing / seed tiers */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-forest-900">
            Plant a seed
          </h2>
          <p className="mt-1 text-center text-sm text-forest-900/50">種を植える</p>
          <p className="mx-auto mt-2 max-w-xl text-center text-forest-900/70">
            Every contribution is tracked. Every supporter gets a certificate and a
            live impact dashboard. Buy one seed or a thousand — quantity is up to you.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seedTiers.map((tier) => (
              <Card key={tier.key} className="flex flex-col p-6">
                <div className="text-4xl">{tier.emoji}</div>
                <h3 className="mt-3 font-display font-semibold text-forest-900">{tier.name}</h3>
                <p className="text-[11px] text-forest-900/50">{tier.nameJa}</p>
                <p className="mt-1 font-display text-2xl font-bold text-forest-700 num">
                  ¥{tier.priceYen.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-forest-900/60 num">~{tier.impressionsPerUnit} impressions</p>
                <p className="mt-2 flex-1 text-sm text-forest-900/70">{tier.description}</p>
                <Link href={`/seeds/plant?tier=${tier.key}`} className={buttonVariants({ size: "sm", className: "mt-4" })}>
                  Plant this seed
                </Link>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-forest-900/50">
            Want more than one? <Link href="/seeds/plant" className="font-semibold text-forest-700 underline">Buy in bulk</Link> — 1 to 10 individually, or jump straight to 25, 100, 1,000 and beyond.
            {" "}Or fund <Link href="/advertise" className="font-semibold text-forest-700 underline">a TikTok, Instagram, or LINE ad</Link> instead of a field.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xl font-bold text-forest-900">{value}</p>
      <p>{label}</p>
    </div>
  );
}
