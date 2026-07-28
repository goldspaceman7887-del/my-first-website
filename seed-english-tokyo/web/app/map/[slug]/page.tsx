import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { GrowthStageBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { stations } from "@/lib/mock-data";

export function generateStaticParams() {
  return stations.map((s) => ({ slug: s.slug }));
}

export default function HarvestFieldDetailPage({ params }: { params: { slug: string } }) {
  const station = stations.find((s) => s.slug === params.slug);
  if (!station) notFound();
  const maxCount = Math.max(...stations.map((s) => s.activeSeedCount));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/map" className="font-display text-sm font-semibold text-forest-700 hover:underline">
        ← Back to Tokyo Impact Map
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">{station.name} harvest field</h1>
          <p className="mt-1 text-sm text-forest-900/60">{station.nameJa} の収穫フィールド — precisely how much has been planted here</p>
        </div>
        <GrowthStageBadge stage={station.growthStage} score={station.growthScore} />
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <HarvestField slug={station.slug} count={station.activeSeedCount} maxCount={maxCount} stage={station.growthStage} height={280} className="rounded-none border-0" />
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs text-forest-900/60">Seeds planted here</p>
            <p className="font-display text-2xl font-bold text-forest-900">{station.activeSeedCount.toLocaleString()}</p>
          </div>
          <Link href={`/seeds/plant?station=${station.slug}`} className={buttonVariants({ size: "sm" })}>
            Plant a seed here 🌱
          </Link>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Funding raised</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">¥{station.fundingRaisedYen.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Website visits</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">{station.visits.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Registrations</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">{station.registrations.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Active learners</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">{station.activeLearners.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Upcoming events</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">{station.upcomingEvents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-forest-900/60">Demand to practice</p>
          <p className="mt-1 font-display text-xl font-bold text-forest-900 num">{station.demandScore}/100</p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-semibold text-forest-900">Growth &amp; forest health</h2>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-forest-900/60"><span>Growth score</span><span className="num">{station.growthScore}/100</span></div>
            <div className="mt-1 h-2 rounded-full bg-leaf-100"><div className="h-full rounded-full bg-forest-500" style={{ width: `${station.growthScore}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-forest-900/60"><span>Forest health score</span><span className="num">{station.forestHealthScore}/100</span></div>
            <div className="mt-1 h-2 rounded-full bg-leaf-100"><div className="h-full rounded-full bg-sky-400" style={{ width: `${station.forestHealthScore}%` }} /></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
