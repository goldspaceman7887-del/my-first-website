import { seedTiers, growthStageForScore, type GrowthStage } from "@/lib/mock-data";

// A sandbox that starts genuinely at zero — its own localStorage namespace,
// entirely separate from the real planted-seeds store (lib/local-seeds.ts).
// Resetting this never touches your real forest, the live map, or citywide
// totals.
const STORAGE_KEY = "seed-english-tokyo:simulation:v1";
const WEEK_STORAGE_KEY = "seed-english-tokyo:simulation:week:v1";

export interface SimEvent {
  id: string;
  type: "seed" | "ad_import";
  label: string;
  date: string;
  /** Which simulated week (1, 2, 3…) this was logged in — see advanceWeek(). */
  week: number;
  /** For ad imports these are the real numbers you entered — never estimated. */
  contributionYen: number;
  impressions: number;
  visits: number;
  registrations: number;
  activeLearners: number;
}

export function loadSimEvents(): SimEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Events saved before weeks existed have no week — treat them as week 1.
    return (parsed as SimEvent[]).map((e) => ({ ...e, week: e.week ?? 1 }));
  } catch {
    return [];
  }
}

export function saveSimEvents(events: SimEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function clearSimEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(WEEK_STORAGE_KEY);
}

export function loadCurrentWeek(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(WEEK_STORAGE_KEY);
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function saveCurrentWeek(week: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WEEK_STORAGE_KEY, String(week));
}

// Shibuya — the most mature real field — used as the "fully grown" reference
// point (100%) for this sandbox's own growth score. See lib/mock-data.ts
// stationSeeds for the source numbers.
const SIM_CEILING = {
  fundingRaisedYen: 842000,
  impressions: 92100,
  registrations: 2310,
  activeLearners: 640,
};

// Same weighting shape as GROWTH_WEIGHTS in mock-data.ts, with the 0.15
// meetups weight folded into learners since the sandbox has no events concept.
const SIM_WEIGHTS = {
  funding: 0.35,
  impressions: 0.25,
  registrations: 0.25,
  activeLearners: 0.15,
};

/** Reaching Shibuya's current scale on every metric = a fully-grown ancient forest. */
export const SIM_EQUIVALENT_SEED_CEILING = Math.round(SIM_CEILING.fundingRaisedYen / seedTiers[0].priceYen);

export interface SimTotals {
  contributionYen: number;
  impressions: number;
  visits: number;
  registrations: number;
  activeLearners: number;
  equivalentSeedCount: number;
  growthScore: number;
  growthStage: GrowthStage;
}

export function totalsFromEvents(events: SimEvent[]): SimTotals {
  const contributionYen = events.reduce((sum, e) => sum + e.contributionYen, 0);
  const impressions = events.reduce((sum, e) => sum + e.impressions, 0);
  const visits = events.reduce((sum, e) => sum + e.visits, 0);
  const registrations = events.reduce((sum, e) => sum + e.registrations, 0);
  const activeLearners = events.reduce((sum, e) => sum + e.activeLearners, 0);
  const equivalentSeedCount = Math.round(contributionYen / seedTiers[0].priceYen);

  const pct = (value: number, ceiling: number) => Math.min(100, (value / ceiling) * 100);
  const growthScore = Math.round(
    SIM_WEIGHTS.funding * pct(contributionYen, SIM_CEILING.fundingRaisedYen) +
      SIM_WEIGHTS.impressions * pct(impressions, SIM_CEILING.impressions) +
      SIM_WEIGHTS.registrations * pct(registrations, SIM_CEILING.registrations) +
      SIM_WEIGHTS.activeLearners * pct(activeLearners, SIM_CEILING.activeLearners)
  );

  return {
    contributionYen,
    impressions,
    visits,
    registrations,
    activeLearners,
    equivalentSeedCount,
    growthScore,
    growthStage: growthStageForScore(growthScore),
  };
}

export interface WeekSummary {
  week: number;
  events: SimEvent[];
  weekTotals: SimTotals;
  cumulativeTotals: SimTotals;
}

/** Breaks the simulation into one summary per week, 1..currentWeek, each with that week's own numbers and the running cumulative total through the end of that week. */
export function weeklyBreakdown(events: SimEvent[], currentWeek: number): WeekSummary[] {
  const summaries: WeekSummary[] = [];
  for (let week = 1; week <= currentWeek; week++) {
    const weekEvents = events.filter((e) => e.week === week);
    const cumulativeEvents = events.filter((e) => e.week <= week);
    summaries.push({
      week,
      events: weekEvents,
      weekTotals: totalsFromEvents(weekEvents),
      cumulativeTotals: totalsFromEvents(cumulativeEvents),
    });
  }
  return summaries;
}

/**
 * Estimate for planting a *simulated* seed — same shape as estimateSeedImpact
 * in mock-data.ts, but derives its conversion rate from the sandbox's own
 * accumulated totals so far instead of a named real station (falls back to
 * the same default rates once the sandbox has data of its own).
 */
export function estimateSimSeedImpact(tierKey: string, quantity: number, priorTotals: SimTotals) {
  const tier = seedTiers.find((t) => t.key === tierKey) ?? seedTiers[0];
  const reach = tier.impressionsPerUnit * quantity;
  const visitRate = priorTotals.impressions > 0 ? priorTotals.visits / priorTotals.impressions : 0.12;
  const regRate = priorTotals.visits > 0 ? priorTotals.registrations / priorTotals.visits : 0.1;
  const estimatedVisits = Math.max(1, Math.round(reach * visitRate));
  const estimatedRegistrations = Math.max(0, Math.round(estimatedVisits * regRate));
  const estimatedActiveLearners = Math.round(estimatedRegistrations * 0.15);
  return { reach, estimatedVisits, estimatedRegistrations, estimatedActiveLearners };
}
