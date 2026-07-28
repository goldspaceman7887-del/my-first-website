import { cityImpactSummary } from "@/lib/mock-data";

export function SeedGoalBar({ className }: { className?: string }) {
  const { totalSeeds, seedGoal, totalSupporters } = cityImpactSummary;
  const pct = Math.min(100, Math.round((totalSeeds / seedGoal) * 100));

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-display text-sm font-semibold text-forest-900">Tokyo&apos;s seed goal</p>
          <p className="text-xs text-forest-900/50">東京の目標 — every seed planted across every field, city-wide</p>
        </div>
        <p className="font-display text-lg font-bold text-forest-900 num">
          {totalSeeds.toLocaleString()} <span className="text-sm font-normal text-forest-900/50">/ {seedGoal.toLocaleString()} seeds</span>
        </p>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-leaf-100">
        <div className="h-full rounded-full bg-forest-500 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-forest-900/60">
        <span>{pct}% of the way there</span>
        <span className="num">{totalSupporters.toLocaleString()} people have supported so far</span>
      </div>
    </div>
  );
}
