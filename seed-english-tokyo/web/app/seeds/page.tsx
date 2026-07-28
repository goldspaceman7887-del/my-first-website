import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MyGrove } from "@/components/my-grove";
import { ForestBrowser } from "@/components/forest-browser";
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

      {mySeeds.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-forest-900">Your grove</h2>
          <p className="text-xs text-forest-900/60">Every tree here is a real seed you own — bigger trees are further grown. Tap one to see it.</p>
          <div className="mt-4">
            <MyGrove seeds={mySeeds} />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Every seed you&apos;ve planted</h2>
        <p className="text-xs text-forest-900/60">Grouped by station, with the real outcome each one is attributed to</p>
        <div className="mt-4">
          {mySeeds.length > 0 ? (
            <ForestBrowser seeds={mySeeds} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-forest-900/70">You haven&apos;t planted a seed yet — your forest starts with one.</p>
              <Link href="/seeds/plant" className={`${buttonVariants()} mt-4 inline-flex`}>Plant your first seed 🌱</Link>
            </Card>
          )}
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
