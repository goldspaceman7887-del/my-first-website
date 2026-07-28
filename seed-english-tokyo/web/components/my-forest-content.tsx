"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MyGrove } from "@/components/my-grove";
import { ForestBrowser } from "@/components/forest-browser";
import { useMySeeds } from "@/lib/use-my-seeds";

export function MyForestContent() {
  const seeds = useMySeeds();

  const totalSeeds = seeds.length;
  const totalReachImpressions = seeds.reduce((sum, s) => sum + s.impact.impressions, 0);
  const learnersSupported = seeds.reduce((sum, s) => sum + s.impact.activeLearners, 0);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total seeds" value={totalSeeds.toLocaleString()} />
        <Stat label="Total reach" value={totalReachImpressions.toLocaleString()} sub="impressions" />
        <Stat label="Questions helped" value="7" />
        <Stat label="Conversations generated" value="34" />
        <Stat label="Events created" value="2" />
        <Stat label="Learners supported" value={learnersSupported.toLocaleString()} />
      </div>

      {totalSeeds > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-forest-900">Your grove</h2>
          <p className="text-xs text-forest-900/60">Every tree here is a real seed you own — bigger trees are further grown. Tap one to see it.</p>
          <div className="mt-4">
            <MyGrove seeds={seeds} />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Every seed you&apos;ve planted</h2>
        <p className="text-xs text-forest-900/60">Grouped by station, with the real outcome each one is attributed to</p>
        <div className="mt-4">
          {totalSeeds > 0 ? (
            <ForestBrowser seeds={seeds} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-forest-900/70">You haven&apos;t planted a seed yet — your forest starts with one.</p>
              <Link href="/seeds/plant" className={`${buttonVariants()} mt-4 inline-flex`}>Plant your first seed 🌱</Link>
            </Card>
          )}
        </div>
      </div>
    </>
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
