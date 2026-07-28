import { cn } from "@/lib/utils";
import type { FieldStatus, GrowthStage } from "@/lib/mock-data";

const STAGE_META: Record<GrowthStage, { emoji: string; label: string; className: string; sway?: boolean }> = {
  bare_soil: { emoji: "◦", label: "Bare Soil", className: "bg-earth-600/15 text-earth-600" },
  seedling: { emoji: "🌱", label: "Seedling", className: "bg-leaf-100 text-forest-700", sway: true },
  sprout: { emoji: "🌱", label: "Sprout", className: "bg-leaf-100 text-forest-700", sway: true },
  sapling: { emoji: "🌿", label: "Sapling", className: "bg-leaf-300/40 text-forest-700", sway: true },
  tree: { emoji: "🌳", label: "Tree", className: "bg-leaf-300/40 text-forest-700" },
  forest: { emoji: "🌲", label: "Forest", className: "bg-forest-700 text-cream-50" },
  ancient_forest: { emoji: "🌲🌳", label: "Ancient Forest", className: "bg-forest-900 text-cream-50" },
};

export function GrowthStageBadge({ stage, score }: { stage: GrowthStage; score?: number }) {
  const meta = STAGE_META[stage];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-display", meta.className)}
      aria-label={`${meta.label} stage${score !== undefined ? `, growth score ${score} of 100` : ""}`}
    >
      <span aria-hidden="true" className={meta.sway ? "animate-sway inline-block" : ""}>
        {meta.emoji}
      </span>
      {meta.label}
    </span>
  );
}

const STATUS_META: Record<FieldStatus, { label: string; className: string }> = {
  needs_water: { label: "Needs Water", className: "bg-sky-100 text-sky-400" },
  growing: { label: "Growing", className: "bg-leaf-100 text-forest-700" },
  healthy: { label: "Healthy", className: "bg-leaf-300/40 text-forest-700" },
  thriving: { label: "Thriving", className: "bg-forest-500/20 text-forest-700" },
  fully_activated: { label: "Fully Activated", className: "bg-sunset-400/25 text-earth-600" },
};

export function FieldStatusBadge({ status }: { status: FieldStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", meta.className)}>
      {status === "needs_water" && <span aria-hidden="true">💧</span>}
      {meta.label}
    </span>
  );
}
