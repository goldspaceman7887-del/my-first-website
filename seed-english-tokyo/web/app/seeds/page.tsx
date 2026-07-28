import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SeedCard } from "@/components/seed-card";
import { mySeeds, myForestStats } from "@/lib/mock-data";

export const metadata = { title: "My Forest — Seed English Tokyo" };

export default function MyForestPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">My Forest</h1>
          <p className="text-xs text-forest-900/50">私の森</p>
          <p className="mt-1 text-forest-900/70">
            Not a donation history — a forest you planted. Here&apos;s exactly what it has grown into.
          </p>
        </div>
        <Link href="/seeds/plant" className={buttonVariants()}>Plant another seed 🌱</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total seeds" value={myForestStats.totalSeeds.toLocaleString()} />
        <Stat label="Total reach" value={myForestStats.totalReachImpressions.toLocaleString()} sub="impressions" />
        <Stat label="Questions helped" value={myForestStats.questionsHelped.toLocaleString()} />
        <Stat label="Conversations generated" value={myForestStats.conversationsGenerated.toLocaleString()} />
        <Stat label="Events created" value={myForestStats.eventsCreated.toLocaleString()} />
        <Stat label="Learners supported" value={myForestStats.learnersSupported.toLocaleString()} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Your seeds helped</h2>
        <p className="text-xs text-forest-900/60">real outcomes, not just numbers</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {mySeeds.map((seed) => (
            <Card key={seed.id} className="p-5">
              <p className="text-sm text-forest-900/80">{seed.emotionalImpact}</p>
              <Link href={`/seeds/${seed.id}`} className="mt-3 inline-block text-xs font-semibold text-forest-700 hover:underline">
                Funded by Seed #{seed.seedNumber} →
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Every seed you&apos;ve planted</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mySeeds.map((seed) => (
            <SeedCard key={seed.id} seed={seed} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs text-forest-900/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-forest-900 num">{value}</p>
      {sub && <p className="text-[11px] text-forest-900/40">{sub}</p>}
    </Card>
  );
}
