"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  adPlatforms,
  adBudgetPresets,
  adPackages,
  estimateAdImpressions,
  estimatePackageImpressions,
} from "@/lib/mock-data";

export default function AdvertisePage() {
  const [platformKey, setPlatformKey] = useState(adPlatforms[0].key);
  const [budget, setBudget] = useState(10000);
  const [customValue, setCustomValue] = useState("");
  const [funded, setFunded] = useState<string | null>(null);

  const platform = adPlatforms.find((p) => p.key === platformKey)!;
  const estimate = estimateAdImpressions(platformKey, budget);

  function setBudgetAmount(n: number) {
    setBudget(Math.max(100, Math.round(n)));
    setCustomValue("");
  }

  function handleCustomChange(v: string) {
    setCustomValue(v);
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    if (!Number.isNaN(n) && n > 0) setBudget(n);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Advertise the community</h1>
      <p className="text-xs text-forest-900/50">広告で応援する</p>
      <p className="mt-1 max-w-2xl text-forest-900/70">
        Fund a real ad on the platforms Japanese 18–30s actually use — TikTok, Instagram,
        LINE, X, and YouTube — to bring more people to a free event or to Seed English
        Tokyo itself. This is a different kind of seed: instead of growing a field, it
        grows awareness.
      </p>

      {/* Platform picker */}
      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">1. Choose a platform</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {adPlatforms.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPlatformKey(p.key)}
              className={cn(
                "rounded-card border p-4 text-left transition-colors",
                platformKey === p.key ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
              )}
            >
              <div className="text-2xl">{p.emoji}</div>
              <p className="mt-2 font-display font-semibold text-forest-900">{p.name}</p>
              <p className="text-[11px] text-forest-900/50">{p.nameJa}</p>
              <p className="mt-2 text-xs text-forest-900/60">{p.description}</p>
              <p className="mt-2 text-xs font-semibold text-forest-700 num">~{p.impressionsPerThousandYen}/¥1,000</p>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-forest-700">2. Choose a budget</h2>
        <Card className="mt-3 p-5">
          <div className="flex flex-wrap gap-2">
            {adBudgetPresets.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setBudgetAmount(n)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors num",
                  budget === n && !customValue ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100"
                )}
              >
                ¥{n.toLocaleString()}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-forest-900/50">Or enter an exact amount</p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 30000"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="mt-2 w-full max-w-xs rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
          />
        </Card>
      </div>

      {/* Estimate + CTA */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-forest-900/60">Estimated reach on {platform.name}</p>
            <p className="font-display text-2xl font-bold text-forest-900 num">~{estimate.toLocaleString()} impressions</p>
          </div>
          <Button size="lg" onClick={() => setFunded(`${platform.name} — ¥${budget.toLocaleString()}`)}>
            Fund this ad — ¥{budget.toLocaleString()}
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-forest-900/50">
          Impressions are an illustrative estimate, not a rate card from any platform — see docs/12-engagement-and-advertising.md. This demo does not process real payment or buy real ads.
        </p>
        {funded && (
          <p className="mt-3 rounded-lg bg-leaf-100 px-4 py-3 text-sm font-semibold text-forest-700">
            🎉 Thanks — your {funded} ad would be queued for the next campaign run.
          </p>
        )}
      </Card>

      {/* Preset campaigns */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-bold text-forest-900">Or fund a ready-made campaign</h2>
        <p className="text-xs text-forest-900/60">既成キャンペーン — bundles built to promote a specific event or the camp itself</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adPackages.map((pkg) => {
            const platforms = pkg.platformKeys.map((k) => adPlatforms.find((p) => p.key === k)!);
            const impressions = estimatePackageImpressions(pkg);
            return (
              <Card key={pkg.key} className="flex flex-col p-5">
                <div className="flex gap-1 text-xl">
                  {platforms.map((p) => (
                    <span key={p.key} aria-hidden="true">{p.emoji}</span>
                  ))}
                </div>
                <p className="mt-2 font-display font-semibold text-forest-900">{pkg.name}</p>
                <p className="text-[11px] text-forest-900/50">{pkg.nameJa}</p>
                <p className="mt-2 flex-1 text-sm text-forest-900/70">{pkg.description}</p>
                <p className="mt-3 font-display text-lg font-bold text-forest-700 num">¥{pkg.priceYen.toLocaleString()}</p>
                <p className="text-xs text-forest-900/60 num">~{impressions.toLocaleString()} estimated impressions</p>
                <Button size="sm" className="mt-4" onClick={() => setFunded(`${pkg.name} campaign`)}>
                  Fund this campaign
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-forest-900/50">
        Prefer to fund a physical field instead? <Link href="/seeds/plant" className="font-semibold text-forest-700 underline">Plant a seed →</Link>
      </p>
    </div>
  );
}
