import { cn } from "@/lib/utils";
import type { GrowthStage } from "@/lib/mock-data";

const STAGE_META: Record<GrowthStage, { emoji: string; label: string; className: string }> = {
  bare_soil: { emoji: "◦", label: "Bare soil", className: "bg-earth-600/15 text-earth-600" },
  seedling: { emoji: "🌱", label: "Seedling", className: "bg-leaf-100 text-forest-700" },
  tree: { emoji: "🌳", label: "Tree", className: "bg-leaf-300/40 text-forest-700" },
  forest: { emoji: "🌲", label: "Forest", className: "bg-forest-700 text-cream-50" },
};

export function GrowthStageBadge({ stage, score }: { stage: GrowthStage; score?: number }) {
  const meta = STAGE_META[stage];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-display", meta.className)}
      aria-label={`${meta.label} stage${score !== undefined ? `, growth score ${score} of 100` : ""}`}
    >
      <span aria-hidden="true" className={stage === "seedling" || stage === "tree" ? "animate-sway inline-block" : ""}>
        {meta.emoji}
      </span>
      {meta.label}
    </span>
  );
}
