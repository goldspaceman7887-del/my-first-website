"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GrowthStageBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { SimulatorMap } from "@/components/simulator-map";
import { cn } from "@/lib/utils";
import { seedTiers, seedQuantityStepperRange, seedQuantityBulkPresets, adPlatforms, stations } from "@/lib/mock-data";
import {
  loadSimEvents,
  saveSimEvents,
  clearSimEvents,
  totalsFromEvents,
  estimateSimSeedImpact,
  eventsByStation,
  DEFAULT_STATION_SLUG,
  SIM_EQUIVALENT_SEED_CEILING,
  type SimEvent,
} from "@/lib/simulation";

function newId() {
  return `sim-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export function SimulatorContent() {
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEvents(loadSimEvents());
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

  function reset() {
    if (events.length === 0) return;
    if (typeof window !== "undefined" && !window.confirm("Start this simulation over from zero? This clears every simulated seed and imported ad result — it never touched your real forest.")) {
      return;
    }
    clearSimEvents();
    setEvents([]);
  }

  const totals = useMemo(() => totalsFromEvents(events), [events]);
  const maxCount = Math.max(SIM_EQUIVALENT_SEED_CEILING, totals.equivalentSeedCount, 1);

  const eventsBySlug = useMemo(() => eventsByStation(events), [events]);
  const totalsBySlug = useMemo(
    () =>
      Object.fromEntries(
        stations.map((s) => [s.slug, totalsFromEvents(eventsBySlug[s.slug] ?? [])])
      ),
    [eventsBySlug]
  );

  const [locationSlug, setLocationSlug] = useState(DEFAULT_STATION_SLUG);
  const location = stations.find((s) => s.slug === locationSlug)!;
  const locationTotals = totalsBySlug[locationSlug];

  // Plant-a-simulated-seed form state
  const [tierKey, setTierKey] = useState(seedTiers[1].key);
  const [quantity, setQuantity] = useState(10);
  const seedEstimate = estimateSimSeedImpact(tierKey, quantity, locationTotals);

  function plantSimSeed() {
    const tier = seedTiers.find((t) => t.key === tierKey)!;
    addEvent({
      id: newId(),
      type: "seed",
      label: `${quantity.toLocaleString()} ${tier.name}${quantity === 1 ? "" : "s"} planted`,
      date: new Date().toISOString().slice(0, 10),
      stationSlug: locationSlug,
      contributionYen: tier.priceYen * quantity,
      impressions: seedEstimate.reach,
      visits: seedEstimate.estimatedVisits,
      registrations: seedEstimate.estimatedRegistrations,
      activeLearners: seedEstimate.estimatedActiveLearners,
    });
  }

  // Import-real-ad-results form state
  const [platformKey, setPlatformKey] = useState(adPlatforms[0].key);
  const [campaignLabel, setCampaignLabel] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [adImpressions, setAdImpressions] = useState("");
  const [adVisits, setAdVisits] = useState("");
  const [adRegistrations, setAdRegistrations] = useState("");

  function num(v: string) {
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
  }

  function importAdResult() {
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
      stationSlug: locationSlug,
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
          A sandbox neighborhood that starts at zero — nothing here is a real station,
          and none of it touches your real forest, the live Tokyo map, or citywide
          totals. Plant simulated seeds, or plug in the real results from an English-camp
          ad you actually ran (targeting Japan&apos;s 18-30 audience), and watch it grow.
        </p>
        <Button variant="ghost" onClick={reset} disabled={events.length === 0}>
          ↺ Start over from zero
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GrowthStageBadge stage={totals.growthStage} score={totals.growthScore} />
          <span className="font-display text-sm font-semibold text-forest-900 num">{totals.growthScore}/100</span>
        </div>
        <p className="text-xs text-forest-900/50">
          Growth score is relative to Shibuya, the most mature real field — reaching its current scale = 100.
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
      <p className="mt-2 text-[11px] text-forest-900/50">
        Citywide across your whole simulation, added up from every spot below.
      </p>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">📍 Where in Tokyo</h2>
        <p className="text-xs text-forest-900/60">
          Tap a spot to choose where you&apos;re planting or importing ad results — everything
          below applies to whichever spot is selected.
        </p>
        <div className="mt-4">
          <SimulatorMap totalsBySlug={totalsBySlug} selectedSlug={locationSlug} onSelect={setLocationSlug} />
        </div>

        <Card className="mt-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display font-semibold text-forest-900">{location.name}</p>
              <p className="text-xs text-forest-900/50">{location.nameJa}</p>
            </div>
            <div className="flex items-center gap-2">
              <GrowthStageBadge stage={locationTotals.growthStage} score={locationTotals.growthScore} />
              <span className="font-display text-sm font-semibold text-forest-900 num">{locationTotals.growthScore}/100</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-forest-900/70 sm:grid-cols-4">
            <span>¥{locationTotals.contributionYen.toLocaleString()} contributed</span>
            <span>{locationTotals.impressions.toLocaleString()} impressions</span>
            <span>{locationTotals.visits.toLocaleString()} visits</span>
            <span>{locationTotals.registrations.toLocaleString()} registrations</span>
          </div>
          {locationTotals.equivalentSeedCount === 0 && (
            <p className="mt-3 text-xs font-medium text-earth-600">Bare soil here — nothing simulated at this spot yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display font-semibold text-forest-900">🌱 Plant a simulated seed — {location.name}</h2>
          <p className="mt-1 text-xs text-forest-900/60">
            Same tiers as the real site. Impact is estimated the same way the real plant
            flow does — from this spot&apos;s own accumulated conversion rate.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
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

          <Button className="mt-4" onClick={plantSimSeed}>Plant in the simulation 🌱</Button>
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-semibold text-forest-900">📣 Import real ad results — {location.name}</h2>
          <p className="mt-1 text-xs text-forest-900/60">
            Ran a real English-camp ad on TikTok, Instagram, or LINE for the 18-30 Japan
            audience? Enter what it actually delivered — these numbers are used exactly
            as entered, never estimated.
          </p>

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

          <Button className="mt-4" variant="secondary" onClick={importAdResult}>
            Add real results to the simulation
          </Button>
        </Card>
      </div>

      {events.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-forest-900">What&apos;s gone into this simulation</h2>
          <ol className="mt-4 space-y-3 border-l-2 border-leaf-300 pl-4">
            {events.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-semibold text-forest-900">
                    {e.type === "seed" ? "🌱" : "📣"} {e.label}
                    <span className="ml-1.5 font-normal text-forest-900/50">
                      — {stations.find((s) => s.slug === e.stationSlug)?.name ?? e.stationSlug}
                    </span>
                  </p>
                  <p className="text-xs text-forest-900/60">
                    {e.date} · ¥{e.contributionYen.toLocaleString()} · {e.impressions.toLocaleString()} impressions ·{" "}
                    {e.visits.toLocaleString()} visits · {e.registrations.toLocaleString()} registrations
                    {e.type === "seed" ? " (estimated)" : " (as entered)"}
                  </p>
                </div>
                <button type="button" onClick={() => removeEvent(e.id)} className="flex-none text-xs font-semibold text-forest-900/40 hover:text-error-500">
                  Remove
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
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
