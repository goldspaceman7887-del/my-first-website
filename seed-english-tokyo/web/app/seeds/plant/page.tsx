"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GrowthStageBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { cn } from "@/lib/utils";
import {
  seedTiers,
  seedQuantityStepperRange,
  seedQuantityBulkPresets,
  stations,
  universities,
  estimateSeedImpact,
  highestNeedStation,
  type GrowthStage,
  type Seed,
} from "@/lib/mock-data";
import { saveLocalSeed, seedHref } from "@/lib/local-seeds";

type LocationOption = {
  id: string;
  kind: "station" | "university" | "auto";
  name: string;
  nameJa: string;
  activeSeedCount: number;
  growthStage: GrowthStage;
  slugForEstimate: string;
};

const STEPS = ["Choose a field", "Choose quantity", "Preview impact", "Plant"] as const;

export default function PlantSeedsPage() {
  const [step, setStep] = useState(1);
  const [tierKey, setTierKey] = useState(seedTiers[1].key);
  const [quantity, setQuantity] = useState(10);
  const [customValue, setCustomValue] = useState("");
  const [locationId, setLocationId] = useState("auto");
  const [planted, setPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(0);
  const [newSeedId, setNewSeedId] = useState<string | null>(null);

  const locations: LocationOption[] = useMemo(() => {
    const auto: LocationOption = {
      id: "auto",
      kind: "auto",
      name: "Highest Need Area",
      nameJa: "最も必要な地域",
      activeSeedCount: highestNeedStation().activeSeedCount,
      growthStage: highestNeedStation().growthStage,
      slugForEstimate: highestNeedStation().slug,
    };
    const stationOpts: LocationOption[] = stations.map((s) => ({
      id: `station:${s.slug}`,
      kind: "station",
      name: s.name,
      nameJa: s.nameJa,
      activeSeedCount: s.activeSeedCount,
      growthStage: s.growthStage,
      slugForEstimate: s.slug,
    }));
    const universityOpts: LocationOption[] = universities.map((u) => ({
      id: `university:${u.slug}`,
      kind: "university",
      name: u.name,
      nameJa: u.nameJa,
      activeSeedCount: u.activeSeedCount,
      growthStage: u.growthStage,
      slugForEstimate: stations[0].slug, // universities reuse citywide-style estimate via a representative station
    }));
    return [auto, ...stationOpts, ...universityOpts];
  }, []);

  // Static export can't read query params server-side — parse ?tier=&station=
  // from the browser URL once mounted so deep links still preselect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tier");
    const st = params.get("station");
    if (t && seedTiers.some((x) => x.key === t)) setTierKey(t);
    if (st && stations.some((x) => x.slug === st)) setLocationId(`station:${st}`);
  }, []);

  const tier = seedTiers.find((t) => t.key === tierKey)!;
  const location = locations.find((l) => l.id === locationId) ?? locations[0];
  const totalYen = tier.priceYen * quantity;
  const estimate = estimateSeedImpact(tierKey, quantity, location.slugForEstimate);

  function setQty(n: number) {
    setQuantity(Math.max(1, Math.round(n)));
    setCustomValue("");
  }

  function handleCustomChange(v: string) {
    setCustomValue(v);
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    if (!Number.isNaN(n) && n > 0) setQuantity(n);
  }

  function plant() {
    const id = `local-${Date.now()}`;
    const newSeed: Seed = {
      id,
      seedNumber: Math.floor(10000 + Math.random() * 89999),
      tierKey,
      station: location.kind === "auto" ? highestNeedStation().name : location.name,
      owner: "You",
      contributionYen: totalYen,
      datePlanted: new Date().toISOString().slice(0, 10),
      status: "growing",
      treeProgressPct: 2,
      forestContributionPct: 0,
      impact: { impressions: 0, visits: 0, registrations: 0, meetupsAttended: 0, activeLearners: 0 },
      emotionalImpact: "Just planted — check back soon to see the real difference it makes.",
    };
    saveLocalSeed(newSeed);
    setNewSeedId(id);
    setPlantedCount(location.activeSeedCount + quantity);
    setPlanted(true);
    setStep(4);
  }

  function goToStep(n: number) {
    setStep(n);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Plant a seed</h1>
      <p className="mt-1 text-forest-900/70">種を植える — this doesn&apos;t feel like a donation. It feels like planting.</p>

      {/* Step indicator */}
      <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  active ? "bg-forest-700 text-cream-50" : done ? "bg-leaf-300 text-forest-900" : "bg-cream-100 text-forest-900/50"
                )}
              >
                {done ? "✓" : n}
              </span>
              <span className={active ? "text-forest-900" : "text-forest-900/50"}>{label}</span>
              {n < STEPS.length && <span className="mx-1 text-forest-900/20">—</span>}
            </li>
          );
        })}
      </ol>

      {/* Step 1: location */}
      {step === 1 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">1. Choose where to plant</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locations.slice(0, 9).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLocationId(l.id)}
                className={cn(
                  "rounded-card border p-4 text-left transition-colors",
                  locationId === l.id ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-forest-900">{l.name}</p>
                    <p className="text-[11px] text-forest-900/50">{l.nameJa}</p>
                  </div>
                  {l.kind === "auto" && <span aria-hidden="true">🌱</span>}
                  {l.kind === "university" && <span aria-hidden="true">🎓</span>}
                </div>
                <div className="mt-2">
                  <GrowthStageBadge stage={l.growthStage} />
                </div>
                <p className="mt-2 text-xs text-forest-900/60 num">{l.activeSeedCount.toLocaleString()} seeds planted</p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-forest-900/50">
            Showing stations and the highest-need field. Universities and more stations are also selectable — see{" "}
            <Link href="/map" className="font-semibold text-forest-700 underline">the full map</Link> or{" "}
            <Link href="/universities" className="font-semibold text-forest-700 underline">university forests</Link>.
          </p>
          <div className="mt-6 flex justify-end">
            <Button size="lg" onClick={() => goToStep(2)}>Next: choose quantity →</Button>
          </div>
        </div>
      )}

      {/* Step 2: quantity */}
      {step === 2 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">2. Choose a seed and quantity</h2>

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seedTiers.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTierKey(t.key)}
                className={cn(
                  "rounded-card border p-4 text-left transition-colors",
                  tierKey === t.key ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
                )}
              >
                <div className="text-2xl">{t.emoji}</div>
                <p className="mt-2 font-display font-semibold text-forest-900">{t.name}</p>
                <p className="text-[11px] text-forest-900/50">{t.nameJa}</p>
                <p className="mt-1 font-display text-lg font-bold text-forest-700 num">¥{t.priceYen.toLocaleString()}</p>
                <p className="mt-1 text-xs text-forest-900/60 num">~{t.impressionsPerUnit} impressions each</p>
              </button>
            ))}
          </div>

          <Card className="mt-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty(quantity - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-lg font-bold text-forest-700 hover:bg-leaf-300"
              >
                −
              </button>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-forest-900 num">{quantity.toLocaleString()}</p>
                <p className="text-xs text-forest-900/50">seed{quantity === 1 ? "" : "s"}</p>
              </div>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-lg font-bold text-forest-700 hover:bg-leaf-300"
              >
                +
              </button>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-forest-900/50">Individually</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {seedQuantityStepperRange.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  className={cn(
                    "h-9 w-9 rounded-full text-sm font-semibold transition-colors num",
                    quantity === n && !customValue ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-forest-900/50">In bulk</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {seedQuantityBulkPresets.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors num",
                    quantity === n && !customValue ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100"
                  )}
                >
                  {n.toLocaleString()}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-forest-900/50">Or enter an exact amount (1,000+)</p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2500"
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="mt-2 w-full max-w-xs rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
            />
          </Card>

          <div className="mt-6 flex justify-between">
            <Button size="lg" variant="ghost" onClick={() => goToStep(1)}>← Back</Button>
            <Button size="lg" onClick={() => goToStep(3)}>Next: preview impact →</Button>
          </div>
        </div>
      )}

      {/* Step 3: preview */}
      {step === 3 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">3. Preview expected impact</h2>
          <Card className="mt-3 p-6">
            <p className="font-display text-lg font-semibold text-forest-900">
              {quantity.toLocaleString()} {tier.name}{quantity === 1 ? "" : "s"} → {location.name}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-forest-900/60">Estimated reach</p>
                <p className="font-display text-2xl font-bold text-forest-900 num">{estimate.reach.toLocaleString()}</p>
                <p className="text-[11px] text-forest-900/50">impressions</p>
              </div>
              <div>
                <p className="text-xs text-forest-900/60">Estimated website visits</p>
                <p className="font-display text-2xl font-bold text-forest-900 num">~{estimate.estimatedVisits.toLocaleString()}</p>
                <p className="text-[11px] text-forest-900/50">{location.name}&apos;s own conversion rate</p>
              </div>
              <div>
                <p className="text-xs text-forest-900/60">Estimated registrations</p>
                <p className="font-display text-2xl font-bold text-forest-900 num">~{estimate.estimatedRegistrations.toLocaleString()}</p>
                <p className="text-[11px] text-forest-900/50">real signups, not guaranteed</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-cream-50 p-4 text-xs text-forest-900/60">
              <p className="font-semibold text-forest-900/80">How this is calculated:</p>
              <p className="mt-1 num">
                {quantity} seeds × ~{tier.impressionsPerUnit} impressions = {estimate.reach.toLocaleString()} reach.
                {" "}Reach × {location.name}&apos;s visit rate ({(estimate.visitRate * 100).toFixed(1)}%) ≈ {estimate.estimatedVisits.toLocaleString()} visits.
                {" "}Visits × its registration rate ({(estimate.regRate * 100).toFixed(1)}%) ≈ {estimate.estimatedRegistrations.toLocaleString()} registrations.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-forest-900/10 pt-4">
              <span className="text-sm text-forest-900/60">Total contribution</span>
              <span className="font-display text-xl font-bold text-forest-700 num">¥{totalYen.toLocaleString()}</span>
            </div>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button size="lg" variant="ghost" onClick={() => goToStep(2)}>← Back</Button>
            <Button size="lg" onClick={plant}>
              Plant {quantity.toLocaleString()} {tier.emoji} — ¥{totalYen.toLocaleString()}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: plant confirmation */}
      {step === 4 && (
        <div className="mt-8">
          <Card className="overflow-hidden p-0">
            <HarvestField
              slug={`${location.id}-planted`}
              count={planted ? plantedCount : location.activeSeedCount}
              maxCount={Math.max(...stations.map((s) => s.activeSeedCount), plantedCount)}
              stage={location.growthStage}
              height={220}
              className={cn("rounded-none border-0 transition-opacity duration-700", planted ? "opacity-100" : "opacity-0")}
            />
            <div className="p-6 text-center">
              <div className="text-4xl">{tier.emoji}</div>
              <h2 className="mt-3 font-display text-2xl font-bold text-forest-900">
                {quantity.toLocaleString()} seed{quantity === 1 ? "" : "s"} planted in {location.name}
              </h2>
              <p className="mt-1 text-sm text-forest-900/60">
                {location.name}&apos;s field now has {plantedCount.toLocaleString()} seeds — you can watch it grow.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {newSeedId && (
                  <Link href={seedHref({ id: newSeedId })} className="inline-flex h-11 items-center justify-center rounded-full bg-forest-700 px-6 font-display font-semibold text-cream-50 hover:bg-forest-900">
                    View my seed
                  </Link>
                )}
                <Link href="/seeds" className="inline-flex h-11 items-center justify-center rounded-full bg-leaf-100 px-6 font-display font-semibold text-forest-700 hover:bg-leaf-300">
                  View in My Forest
                </Link>
                <Link href={location.kind === "university" ? "/universities" : "/map"} className="inline-flex h-11 items-center justify-center rounded-full bg-leaf-100 px-6 font-display font-semibold text-forest-700 hover:bg-leaf-300">
                  Watch this field grow
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-forest-900/40">
                Saved to this browser (no backend yet) — it&apos;ll show up in My Forest and on the map here, but not on other devices.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
