import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { seedTiers, type Seed } from "@/lib/mock-data";

export function SeedCard({ seed }: { seed: Seed }) {
  const tier = seedTiers.find((t) => t.key === seed.tierKey)!;
  return (
    <Link href={`/seeds/${seed.id}`}>
      <Card className="h-full p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl" aria-hidden="true">{tier.emoji}</p>
            <p className="mt-2 font-display font-semibold text-forest-900">Seed #{seed.seedNumber}</p>
            <p className="text-sm text-forest-900/60">{seed.station} · {seed.datePlanted}</p>
          </div>
          <Badge variant={seed.status === "thriving" ? "forest" : "leaf"}>
            {seed.status === "thriving" ? "Thriving" : "Growing"}
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
      </Card>
    </Link>
  );
}
