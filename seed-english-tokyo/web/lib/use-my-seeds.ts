"use client";

import { useEffect, useState } from "react";
import { mySeeds as baseSeeds, type Seed } from "@/lib/mock-data";
import { loadLocalSeeds } from "@/lib/local-seeds";

/** Base mock seeds plus anything planted this session (loaded from localStorage after mount, so the static-exported HTML still matches on first paint). */
export function useMySeeds(): Seed[] {
  const [seeds, setSeeds] = useState<Seed[]>(baseSeeds);

  useEffect(() => {
    const local = loadLocalSeeds();
    if (local.length > 0) setSeeds([...local, ...baseSeeds]);
  }, []);

  return seeds;
}
