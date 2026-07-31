"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ActivityStream } from "@/components/activity-stream";
import { cityImpactSummary } from "@/lib/mock-data";
import { useMySeeds } from "@/lib/use-my-seeds";
import { loadPrayerRequests } from "@/lib/prayer-requests";
import { loadConnectionRequests } from "@/lib/connection-requests";
import { loadTestimonies } from "@/lib/testimonies";
import { loadBibleProgress, computeStreak } from "@/lib/bible-progress";
import { computeBadges } from "@/lib/badges";
import { cn } from "@/lib/utils";

export default function MissionPage() {
  const seeds = useMySeeds();
  const [hydrated, setHydrated] = useState(false);
  const [prayerCount, setPrayerCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);
  const [testimonyCount, setTestimonyCount] = useState(0);
  const [bibleStreak, setBibleStreak] = useState(0);
  const [bibleDaysCompleted, setBibleDaysCompleted] = useState(0);

  useEffect(() => {
    setPrayerCount(loadPrayerRequests().length);
    setConnectionCount(loadConnectionRequests().length);
    setTestimonyCount(loadTestimonies().length);
    const progress = loadBibleProgress();
    setBibleStreak(computeStreak(progress));
    setBibleDaysCompleted(Object.keys(progress).length);
    setHydrated(true);
  }, []);

  const badges = computeBadges({
    seedCount: seeds.length,
    prayerCount,
    connectionCount,
    testimonyCount,
    bibleStreak,
    bibleDaysCompleted,
  });
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Mission Briefing</h1>
      <p className="text-xs text-forest-900/50">ミッション・ブリーフィング</p>
      <p className="mt-2 max-w-2xl text-forest-900/70">
        Where the mission stands citywide, and your own part in it.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Raised citywide" value={`¥${cityImpactSummary.totalRaisedYen.toLocaleString()}`} />
        <StatCard label="People reached" value={cityImpactSummary.totalLearners.toLocaleString()} />
        <StatCard label="Seeds planted" value={cityImpactSummary.totalSeeds.toLocaleString()} />
        <StatCard label="Gatherings this month" value={String(cityImpactSummary.meetupsThisMonth)} />
      </div>
      <p className="mt-2 text-center text-[11px] text-forest-900/40">
        Citywide totals — aggregated across stations, not a literal real-time feed. See{" "}
        <Link href="/map" className="underline">the Tokyo map</Link> for the breakdown per station.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold text-forest-900">Your achievements</h2>
          <p className="text-xs text-forest-900/50">{hydrated ? `${earnedCount} of ${badges.length} earned` : "Loading…"}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {badges.map((b) => (
              <Card
                key={b.key}
                className={cn("p-4 transition-opacity", hydrated && b.earned ? "opacity-100" : "opacity-40")}
              >
                <div className="text-2xl">{b.emoji}</div>
                <p className="mt-1 font-display text-sm font-semibold text-forest-900">{b.label}</p>
                <p className="text-[10px] text-forest-900/50">{b.labelJa}</p>
                <p className="mt-1 text-xs text-forest-900/60">{b.description}</p>
                {hydrated && b.earned && <p className="mt-1 text-[11px] font-semibold text-forest-700">Earned ✓</p>}
              </Card>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-forest-900/40">
            Computed from your own activity saved on this device — seeds planted, prayer
            requests, connection requests, testimonies shared, and Bible plan streak.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-forest-900">Live activity</h2>
          <div className="mt-4">
            <ActivityStream limit={8} />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/seeds/plant" className="block">
          <Card className="p-5 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">🌱</div>
            <p className="mt-1 font-display text-sm font-semibold text-forest-900">Plant a seed</p>
          </Card>
        </Link>
        <Link href="/bible" className="block">
          <Card className="p-5 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">📖</div>
            <p className="mt-1 font-display text-sm font-semibold text-forest-900">Continue reading</p>
          </Card>
        </Link>
        <Link href="/volunteer" className="block">
          <Card className="p-5 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">🧑‍🤝‍🧑</div>
            <p className="mt-1 font-display text-sm font-semibold text-forest-900">Volunteer</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5 text-center">
      <p className="font-display text-2xl font-bold text-forest-900 num">{value}</p>
      <p className="mt-1 text-xs text-forest-900/60">{label}</p>
    </Card>
  );
}
