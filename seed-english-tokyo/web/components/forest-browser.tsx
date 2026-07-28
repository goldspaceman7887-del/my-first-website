"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SeedCard } from "@/components/seed-card";
import { stations, type Seed } from "@/lib/mock-data";

type SortKey = "newest" | "progress" | "impact";

const SORT_LABEL: Record<SortKey, string> = {
  newest: "Newest",
  progress: "Most grown",
  impact: "Highest impact",
};

function sortSeeds(seeds: Seed[], sort: SortKey) {
  return [...seeds].sort((a, b) => {
    if (sort === "newest") return b.datePlanted.localeCompare(a.datePlanted);
    if (sort === "progress") return b.treeProgressPct - a.treeProgressPct;
    return b.impact.impressions - a.impact.impressions;
  });
}

export function ForestBrowser({ seeds }: { seeds: Seed[] }) {
  const stationNames = useMemo(
    () => Array.from(new Set(seeds.map((s) => s.station))).sort(),
    [seeds]
  );
  const [stationFilter, setStationFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const visibleStations = stationFilter === "all" ? stationNames : [stationFilter];
  const groups = visibleStations
    .map((name) => ({
      station: name,
      slug: stations.find((s) => s.name === name)?.slug,
      seeds: sortSeeds(seeds.filter((s) => s.station === name), sort),
    }))
    .filter((g) => g.seeds.length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-xs font-semibold text-forest-900/60">
          Station{" "}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="ml-1 rounded-lg border border-forest-900/15 bg-cream-50 px-2 py-1.5 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
          >
            <option value="all">All stations ({seeds.length})</option>
            {stationNames.map((name) => (
              <option key={name} value={name}>
                {name} ({seeds.filter((s) => s.station === name).length})
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-forest-900/60">
          Sort by{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="ml-1 rounded-lg border border-forest-900/15 bg-cream-50 px-2 py-1.5 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
          >
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <div key={g.station}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display font-semibold text-forest-900">
                {g.station} <span className="font-normal text-forest-900/50">· {g.seeds.length} seed{g.seeds.length === 1 ? "" : "s"}</span>
              </h3>
              {g.slug && (
                <Link href={`/map/${g.slug}`} className="text-xs font-semibold text-forest-700 hover:underline">
                  View this forest →
                </Link>
              )}
            </div>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.seeds.map((seed) => (
                <SeedCard key={seed.id} seed={seed} />
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-forest-900/60">No seeds match this filter.</p>
        )}
      </div>
    </div>
  );
}
