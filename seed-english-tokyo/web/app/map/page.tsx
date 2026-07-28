import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GrowthStageBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { TokyoHeatMap } from "@/components/tokyo-heatmap";
import { cityImpactSummary, stations } from "@/lib/mock-data";

export const metadata = { title: "Tokyo Impact Map — Seed English Tokyo" };

export default function MapPage() {
  const maxCount = Math.max(...stations.map((s) => s.activeSeedCount));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Tokyo Impact Map</h1>
      <p className="mt-1 max-w-2xl text-forest-900/70">
        Watch Tokyo transform, station by station, as seeds turn into visits,
        registrations, and real meetups. Bare soil becomes a seedling, a tree, then a
        forest.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-card bg-forest-700 p-6 text-cream-50 sm:grid-cols-4">
        <SummaryStat label="Total raised" value={`¥${cityImpactSummary.totalRaisedYen.toLocaleString()}`} />
        <SummaryStat label="Active learners" value={cityImpactSummary.totalLearners.toLocaleString()} />
        <SummaryStat label="Active seeds" value={cityImpactSummary.totalSeeds.toLocaleString()} />
        <SummaryStat label="Meetups this month" value={String(cityImpactSummary.meetupsThisMonth)} />
      </div>

      <div className="mt-8">
        <TokyoHeatMap />
      </div>

      {/*
        In production the heat map above is a Mapbox GL canvas with custom growth-stage
        markers (see docs/05-tokyo-impact-map.md). This scaffold renders the same
        underlying data as a stylized SVG heat map plus an accessible harvest-field
        grid below — the documented no-JS/no-map fallback — so the page is fully
        functional without a Mapbox token.
      */}
      <div className="mt-10 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-forest-900">Harvest fields</h2>
          <p className="text-xs text-forest-900/60">収穫フィールド — exactly how many seeds have been planted at each station</p>
        </div>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((s) => (
          <Link key={s.slug} href={`/map/${s.slug}`}>
            <Card className="h-full overflow-hidden p-0 transition-transform hover:-translate-y-0.5 hover:shadow-md">
              <HarvestField slug={s.slug} count={s.activeSeedCount} maxCount={maxCount} stage={s.growthStage} height={110} className="rounded-none border-0" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-semibold text-forest-900">{s.name}</p>
                    <p className="text-xs text-forest-900/60">{s.nameJa}</p>
                  </div>
                  <GrowthStageBadge stage={s.growthStage} score={s.growthScore} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-forest-900/70">
                  <span>Funding: ¥{s.fundingRaisedYen.toLocaleString()}</span>
                  <span>Seeds planted: {s.activeSeedCount}</span>
                  <span>Visits: {s.visits.toLocaleString()}</span>
                  <span>Registrations: {s.registrations.toLocaleString()}</span>
                  <span>Learners active: {s.activeLearners}</span>
                  <span>Upcoming events: {s.upcomingEvents}</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-forest-900/60">Growth score</span>
                  <span className="font-display font-semibold text-forest-900 num">{s.growthScore}/100</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-leaf-100">
                  <div className="h-full rounded-full bg-forest-500" style={{ width: `${s.growthScore}%` }} />
                </div>

                {s.activeSeedCount === 0 ? (
                  <p className="mt-3 text-xs font-medium text-earth-600">
                    Bare field — be the first to plant a seed here.
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-medium text-forest-700">
                    Demand to practice: {s.demandScore}/100
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold num">{value}</p>
      <p className="text-sm text-cream-50/80">{label}</p>
    </div>
  );
}
