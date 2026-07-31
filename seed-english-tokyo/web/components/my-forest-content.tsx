"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { MyGrove } from "@/components/my-grove";
import { ForestBrowser } from "@/components/forest-browser";
import { useMySeeds } from "@/lib/use-my-seeds";
import { cn } from "@/lib/utils";

interface Milestone {
  key: string;
  label: string;
  reached: boolean;
}

export function MyForestContent() {
  const seeds = useMySeeds();

  const totalSeeds = seeds.length;
  const totalContributionYen = seeds.reduce((sum, s) => sum + s.contributionYen, 0);
  const totalReachImpressions = seeds.reduce((sum, s) => sum + s.impact.impressions, 0);
  const peopleSupported = seeds.reduce((sum, s) => sum + s.impact.activeLearners, 0);

  const milestones: Milestone[] = [
    { key: "first_seed", label: "Planted your first seed", reached: totalSeeds >= 1 },
    { key: "three_seeds", label: "Planted 3 seeds", reached: totalSeeds >= 3 },
    { key: "5000_yen", label: "¥5,000+ contributed", reached: totalContributionYen >= 5000 },
    { key: "1000_impressions", label: "1,000+ impressions reached", reached: totalReachImpressions >= 1000 },
    { key: "10_people", label: "10+ people reached", reached: peopleSupported >= 10 },
  ];

  function downloadReport() {
    const lines = [
      "Seed Tokyo — Your Impact Report",
      `Generated ${new Date().toISOString().slice(0, 10)}`,
      "",
      `Total seeds planted: ${totalSeeds}`,
      `Total contributed: ¥${totalContributionYen.toLocaleString()}`,
      `Total reach (impressions): ${totalReachImpressions.toLocaleString()}`,
      `People reached: ${peopleSupported}`,
      "",
      "Milestones reached:",
      ...milestones.filter((m) => m.reached).map((m) => `  ✓ ${m.label}`),
      "",
      "Your seeds:",
      ...seeds.map((s) => `  #${s.seedNumber} — ${s.station} — ¥${s.contributionYen.toLocaleString()} — ${s.status}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seed-tokyo-impact-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total seeds" value={totalSeeds.toLocaleString()} />
        <Stat label="Total reach" value={totalReachImpressions.toLocaleString()} sub="impressions" />
        <Stat label="Questions helped" value="7" />
        <Stat label="Conversations generated" value="34" />
        <Stat label="Events created" value="2" />
        <Stat label="People supported" value={peopleSupported.toLocaleString()} />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-forest-900">Your milestones</h2>
            <p className="text-xs text-forest-900/60">Computed from your real local seed data.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={downloadReport}>
            Download impact report
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {milestones.map((m) => (
            <span
              key={m.key}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                m.reached ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900/40"
              )}
            >
              {m.reached ? "✓ " : ""}{m.label}
            </span>
          ))}
        </div>
      </Card>

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
