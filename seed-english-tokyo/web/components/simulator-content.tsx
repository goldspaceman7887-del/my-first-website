"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrowthStageBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { cn } from "@/lib/utils";
import { seedTiers, seedQuantityStepperRange, seedQuantityBulkPresets, adPlatforms } from "@/lib/mock-data";
import {
  loadSimEvents,
  saveSimEvents,
  clearSimEvents,
  loadCurrentWeek,
  saveCurrentWeek,
  totalsFromEvents,
  weeklyBreakdown,
  estimateSimSeedImpact,
  SIM_EQUIVALENT_SEED_CEILING,
  type SimEvent,
} from "@/lib/simulation";

type SituationType = "seed" | "ad_import";

function newId() {
  return `sim-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

function num(v: string) {
  const n = parseInt(v.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function SimulatorContent() {
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEvents(loadSimEvents());
    setCurrentWeek(loadCurrentWeek());
    setHydrated(true);
  }, []);

  function commit(next: SimEvent[]) {
    setEvents(next);
    saveSimEvents(next);
  }

  function addEvent(event: SimEvent) {
    commit([event, ...events]);
  }

  function removeEvent(id: string) {
    commit(events.filter((e) => e.id !== id));
  }

  function advanceWeek() {
    const next = currentWeek + 1;
    setCurrentWeek(next);
    saveCurrentWeek(next);
  }

  function reset() {
    if (events.length === 0 && currentWeek === 1) return;
    if (typeof window !== "undefined" && !window.confirm("Start this simulation over from zero — week 1, nothing logged? This never touched your real forest.")) {
      return;
    }
    clearSimEvents();
    setEvents([]);
    setCurrentWeek(1);
  }

  const totals = useMemo(() => totalsFromEvents(events), [events]);
  const maxCount = Math.max(SIM_EQUIVALENT_SEED_CEILING, totals.equivalentSeedCount, 1);
  const weeks = useMemo(() => weeklyBreakdown(events, currentWeek), [events, currentWeek]);

  // Unified "log a situation" form — one place for both real and estimated numbers.
  const [situationType, setSituationType] = useState<SituationType>("seed");

  // Estimated seed batch fields
  const [tierKey, setTierKey] = useState(seedTiers[1].key);
  const [quantity, setQuantity] = useState(10);
  const seedEstimate = estimateSimSeedImpact(tierKey, quantity, totals);

  // Real ad result fields
  const [platformKey, setPlatformKey] = useState(adPlatforms[0].key);
  const [campaignLabel, setCampaignLabel] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [adImpressions, setAdImpressions] = useState("");
  const [adVisits, setAdVisits] = useState("");
  const [adRegistrations, setAdRegistrations] = useState("");

  function logSituation() {
    if (situationType === "seed") {
      const tier = seedTiers.find((t) => t.key === tierKey)!;
      addEvent({
        id: newId(),
        type: "seed",
        label: `${quantity.toLocaleString()} ${tier.name}${quantity === 1 ? "" : "s"} planted`,
        date: new Date().toISOString().slice(0, 10),
        week: currentWeek,
        contributionYen: tier.priceYen * quantity,
        impressions: seedEstimate.reach,
        visits: seedEstimate.estimatedVisits,
        registrations: seedEstimate.estimatedRegistrations,
        activeLearners: seedEstimate.estimatedActiveLearners,
      });
      return;
    }

    const platform = adPlatforms.find((p) => p.key === platformKey)!;
    const spentYen = num(amountSpent);
    const impressions = num(adImpressions);
    const visits = num(adVisits);
    const registrations = num(adRegistrations);
    if (spentYen <= 0 && impressions <= 0) return;

    addEvent({
      id: newId(),
      type: "ad_import",
      label: campaignLabel.trim() || `${platform.name} campaign`,
      date: new Date().toISOString().slice(0, 10),
      week: currentWeek,
      contributionYen: spentYen,
      impressions,
      visits,
      registrations,
      activeLearners: 0,
    });
    setCampaignLabel("");
    setAmountSpent("");
    setAdImpressions("");
    setAdVisits("");
    setAdRegistrations("");
  }

  if (!hydrated) {
    return <p className="mt-8 text-sm text-forest-900/50">Loading your simulation…</p>;
  }

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-forest-900/70">
          A sandbox that starts at zero and runs one week at a time — nothing here touches
          your real forest, the live Tokyo map, or citywide totals. Log a situation below
          (a batch of seeds with estimated impact, or the real results from an ad you
          actually ran), then advance to the next week to see it grow over time.
        </p>
        <Button variant="ghost" onClick={reset}>
          ↺ Start over from zero
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-forest-900/10 bg-cream-100 px-4 py-3">
        <p className="font-display font-semibold text-forest-900">📅 Week {currentWeek}</p>
        <Button size="sm" onClick={advanceWeek}>Advance to Week {currentWeek + 1} →</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GrowthStageBadge stage={totals.growthStage} score={totals.growthScore} />
          <span className="font-display text-sm font-semibold text-forest-900 num">{totals.growthScore}/100</span>
        </div>
        <p className="text-xs text-forest-900/50">
          Cumulative through Week {currentWeek}, relative to Shibuya's current scale (= 100).
        </p>
      </div>

      <div className="mt-3">
        <HarvestField slug="simulation" count={totals.equivalentSeedCount} maxCount={maxCount} stage={totals.growthStage} height={220} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Contribution" value={`¥${totals.contributionYen.toLocaleString()}`} />
        <Stat label="Impressions" value={totals.impressions.toLocaleString()} />
        <Stat label="Visits" value={totals.visits.toLocaleString()} />
        <Stat label="Registrations" value={totals.registrations.toLocaleString()} />
        <Stat label="Active learners" value={totals.activeLearners.toLocaleString()} />
        <Stat label="Equivalent seeds" value={totals.equivalentSeedCount.toLocaleString()} />
      </div>

      <Card className="mt-10 p-5">
        <h2 className="font-display font-semibold text-forest-900">Log a situation — Week {currentWeek}</h2>
        <p className="mt-1 text-xs text-forest-900/60">
          One place for both kinds of numbers: an estimated seed batch, or the real results
          from an ad you actually ran (targeting Japan&apos;s 18-30 audience). Everything
          you log here is tagged to the current week.
        </p>

        <div className="mt-4 flex rounded-full bg-cream-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSituationType("seed")}
            className={cn("flex-1 rounded-full px-3 py-2 transition-colors", situationType === "seed" ? "bg-forest-700 text-cream-50" : "text-forest-900/60 hover:text-forest-900")}
          >
            🌱 Estimated seed batch
          </button>
          <button
            type="button"
            onClick={() => setSituationType("ad_import")}
            className={cn("flex-1 rounded-full px-3 py-2 transition-colors", situationType === "ad_import" ? "bg-forest-700 text-cream-50" : "text-forest-900/60 hover:text-forest-900")}
          >
            📣 Real ad result
          </button>
        </div>

        {situationType === "seed" ? (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {seedTiers.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTierKey(t.key)}
                  className={cn(
                    "rounded-lg border p-2 text-left text-xs transition-colors",
                    tierKey === t.key ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
                  )}
                >
                  <div className="text-lg">{t.emoji}</div>
                  <p className="font-display font-semibold text-forest-900">{t.name}</p>
                  <p className="text-forest-900/50 num">¥{t.priceYen.toLocaleString()}</p>
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold text-forest-900/60">
              Quantity
              <div className="mt-1 flex flex-wrap gap-1.5">
                {[...seedQuantityStepperRange.slice(0, 5), ...seedQuantityBulkPresets.slice(0, 4)].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuantity(n)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold num transition-colors",
                      quantity === n ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100"
                    )}
                  >
                    {n.toLocaleString()}
                  </button>
                ))}
              </div>
            </label>

            <p className="mt-4 text-xs text-forest-900/60">
              ¥{(seedTiers.find((t) => t.key === tierKey)!.priceYen * quantity).toLocaleString()} ·{" "}
              ~{seedEstimate.reach.toLocaleString()} impressions · ~{seedEstimate.estimatedVisits.toLocaleString()} visits ·
              ~{seedEstimate.estimatedRegistrations.toLocaleString()} registrations
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-forest-900/60">
              Platform
              <select
                value={platformKey}
                onChange={(e) => setPlatformKey(e.target.value)}
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
              >
                {adPlatforms.map((p) => (
                  <option key={p.key} value={p.key}>{p.emoji} {p.name}</option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-forest-900/60">
              Campaign / audience note
              <input
                type="text"
                value={campaignLabel}
                onChange={(e) => setCampaignLabel(e.target.value)}
                placeholder="e.g. Reels — Japan 18-24 students"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
              />
            </label>

            <label className="text-xs font-semibold text-forest-900/60">
              Amount spent (¥)
              <input
                type="text"
                inputMode="numeric"
                value={amountSpent}
                onChange={(e) => setAmountSpent(e.target.value)}
                placeholder="10000"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 num focus:border-forest-500 focus:outline-none"
              />
            </label>

            <label className="text-xs font-semibold text-forest-900/60">
              Impressions delivered
              <input
                type="text"
                inputMode="numeric"
                value={adImpressions}
                onChange={(e) => setAdImpressions(e.target.value)}
                placeholder="8500"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 num focus:border-forest-500 focus:outline-none"
              />
            </label>

            <label className="text-xs font-semibold text-forest-900/60">
              Link clicks / visits
              <input
                type="text"
                inputMode="numeric"
                value={adVisits}
                onChange={(e) => setAdVisits(e.target.value)}
                placeholder="420"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 num focus:border-forest-500 focus:outline-none"
              />
            </label>

            <label className="text-xs font-semibold text-forest-900/60">
              Registrations (if known)
              <input
                type="text"
                inputMode="numeric"
                value={adRegistrations}
                onChange={(e) => setAdRegistrations(e.target.value)}
                placeholder="35"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 num focus:border-forest-500 focus:outline-none"
              />
            </label>
          </div>
        )}

        <Button className="mt-4" onClick={logSituation}>
          Log to Week {currentWeek} {situationType === "seed" ? "🌱" : "📣"}
        </Button>
      </Card>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Week by week</h2>
        <p className="text-xs text-forest-900/60">Each week's own numbers, plus the running cumulative total through that week.</p>
        <div className="mt-4 space-y-4">
          {[...weeks].reverse().map((w) => (
            <Card key={w.week} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-semibold text-forest-900">
                  Week {w.week} {w.week === currentWeek && <span className="text-xs font-normal text-forest-900/50">(current)</span>}
                </p>
                <div className="flex items-center gap-2">
                  <GrowthStageBadge stage={w.cumulativeTotals.growthStage} score={w.cumulativeTotals.growthScore} />
                  <span className="text-xs text-forest-900/50 num">cumulative {w.cumulativeTotals.growthScore}/100</span>
                </div>
              </div>

              {w.events.length === 0 ? (
                <p className="mt-2 text-xs text-forest-900/50">Nothing logged this week.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {w.events.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-forest-900">
                          {e.type === "seed" ? "🌱" : "📣"} {e.label}{" "}
                          <Badge variant={e.type === "seed" ? "leaf" : "sky"} className="ml-1 align-middle text-[10px]">
                            {e.type === "seed" ? "estimated" : "real"}
                          </Badge>
                        </p>
                        <p className="text-xs text-forest-900/60">
                          ¥{e.contributionYen.toLocaleString()} · {e.impressions.toLocaleString()} impressions ·{" "}
                          {e.visits.toLocaleString()} visits · {e.registrations.toLocaleString()} registrations
                        </p>
                      </div>
                      <button type="button" onClick={() => removeEvent(e.id)} className="flex-none text-xs font-semibold text-forest-900/40 hover:text-error-500">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-forest-900/10 pt-3 text-xs text-forest-900/70 sm:grid-cols-4">
                <span>This week: ¥{w.weekTotals.contributionYen.toLocaleString()}</span>
                <span>{w.weekTotals.impressions.toLocaleString()} impressions</span>
                <span>{w.weekTotals.visits.toLocaleString()} visits</span>
                <span>{w.weekTotals.registrations.toLocaleString()} registrations</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-forest-900/60">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-forest-900 num">{value}</p>
    </Card>
  );
}
