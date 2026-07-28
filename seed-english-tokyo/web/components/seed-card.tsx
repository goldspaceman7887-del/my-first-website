import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { seedTiers, type Seed } from "@/lib/mock-data";
import { seedHref } from "@/lib/local-seeds";

export function SeedCard({ seed }: { seed: Seed }) {
  const tier = seedTiers.find((t) => t.key === seed.tierKey)!;
  const justPlanted = seed.status === "growing" && seed.treeProgressPct < 5;
  return (
    <Link href={seedHref(seed)}>
      <Card className="h-full p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl" aria-hidden="true">{tier.emoji}</p>
            <p className="mt-2 font-display font-semibold text-forest-900">Seed #{seed.seedNumber}</p>
            <p className="text-sm text-forest-900/60">{seed.station} · {seed.datePlanted}</p>
          </div>
          <Badge variant={seed.status === "thriving" ? "forest" : justPlanted ? "sky" : "leaf"}>
            {seed.status === "thriving" ? "Thriving" : justPlanted ? "Just planted" : "Growing"}
          </Badge>
        </div>
        <p className="mt-3 font-display text-lg font-bold text-forest-700">
          ¥{seed.contributionYen.toLocaleString()}
        </p>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-forest-900/60">
            <span>Tree progress</span>
            <span>{seed.treeProgressPct}%</span>
          </div>
          <Progress value={seed.treeProgressPct} className="mt-1" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-forest-900/70">
          <span>{seed.impact.impressions.toLocaleString()} impressions</span>
          <span>{seed.impact.registrations} registered</span>
          <span>{seed.impact.meetupsAttended} meetups attended</span>
          <span>{seed.impact.activeLearners} active learner{seed.impact.activeLearners === 1 ? "" : "s"}</span>
        </div>
        {seed.emotionalImpact && (
          <p className="mt-3 border-t border-forest-900/10 pt-3 text-xs italic text-forest-900/70">
            &ldquo;{seed.emotionalImpact}&rdquo;
          </p>
        )}
      </Card>
    </Link>
  );
}
