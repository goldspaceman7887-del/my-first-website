"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  seedTiers,
  seedQuantityStepperRange,
  seedQuantityBulkPresets,
  stations,
} from "@/lib/mock-data";

export default function PlantSeedsPage() {
  const [tierKey, setTierKey] = useState(seedTiers[1].key);
  const [quantity, setQuantity] = useState(1);
  const [customValue, setCustomValue] = useState("");
  const [stationSlug, setStationSlug] = useState("auto");

  // Static export can't read query params server-side (no request to render
  // against) — parse ?tier=&station= from the browser URL once mounted so
  // deep links from /map/[slug] and the pricing cards still preselect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tier");
    const st = params.get("station");
    if (t && seedTiers.some((x) => x.key === t)) setTierKey(t);
    if (st && stations.some((x) => x.slug === st)) setStationSlug(st);
  }, []);

  const tier = seedTiers.find((t) => t.key === tierKey)!;
  const totalYen = tier.priceYen * quantity;
  const totalImpressions = tier.impressionsPerUnit * quantity;
  const station = stations.find((s) => s.slug === stationSlug);

  function setQty(n: number) {
    setQuantity(Math.max(1, Math.round(n)));
    setCustomValue("");
  }

  function handleCustomChange(v: string) {
    setCustomValue(v);
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    if (!Number.isNaN(n) && n > 0) setQuantity(n);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Plant seeds</h1>
      <p className="mt-1 text-forest-900/70">種を植える — choose a tier, choose how many, watch the impact grow.</p>

      {/* Tier picker */}
      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">1. Choose a seed</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seedTiers.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTierKey(t.key)}
              className={cn(
                "rounded-card border p-4 text-left transition-colors",
                tierKey === t.key
                  ? "border-forest-700 bg-leaf-100"
                  : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
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
      </div>

      {/* Quantity picker */}
      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">2. Choose how many</h2>

        <Card className="mt-3 p-5">
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
      </div>

      {/* Station picker */}
      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">3. Choose a field</h2>
        <Card className="mt-3 p-5">
          <select
            value={stationSlug}
            onChange={(e) => setStationSlug(e.target.value)}
            className="w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
          >
            <option value="auto">🌱 Plant where it&apos;s needed most</option>
            {stations.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} ({s.nameJa}) — {s.activeSeedCount} seeds planted
              </option>
            ))}
          </select>
          {station && (
            <p className="mt-2 text-xs text-forest-900/60">
              {station.name}&apos;s field is currently {station.growthStage.replace("_", " ")}, with demand at {station.demandScore}/100.
            </p>
          )}
        </Card>
      </div>

      {/* Summary */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-forest-900/60">Total contribution</p>
            <p className="font-display text-2xl font-bold text-forest-900 num">¥{totalYen.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-forest-900/60">Estimated impressions</p>
            <p className="font-display text-2xl font-bold text-forest-700 num">~{totalImpressions.toLocaleString()}</p>
          </div>
          <Button size="lg">
            Plant {quantity.toLocaleString()} {tier.emoji} — ¥{totalYen.toLocaleString()}
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-forest-900/50">
          Impressions are an estimate of website reach per seed (see the attribution model in docs/04-seed-tracking-system.md) —
          your seed&apos;s real, tracked impact appears on <Link href="/seeds" className="font-semibold text-forest-700 underline">My Seeds</Link> once planted. This demo does not process real payment.
        </p>
      </Card>
    </div>
  );
}
