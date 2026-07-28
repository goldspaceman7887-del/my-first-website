"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SeedDetail } from "@/components/seed-detail";
import { useMySeeds } from "@/lib/use-my-seeds";

// A newly-planted seed has no pre-built static page (static export can only
// build pages for ids known at build time), so it's looked up here by
// ?id=... instead — same "read the query string client-side" pattern
// /seeds/plant already uses for ?tier=&station=.
export default function SeedViewPage() {
  const seeds = useMySeeds();
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-sm text-forest-900/60 sm:px-6">Loading your seed…</div>;
  }

  const index = seeds.findIndex((s) => s.id === id);
  if (index === -1) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <p className="text-forest-900/70">
          We couldn&apos;t find that seed on this device — planted seeds are stored in this browser, not a server.
        </p>
        <Link href="/seeds" className="mt-4 inline-block font-display font-semibold text-forest-700 hover:underline">
          ← Back to My Forest
        </Link>
      </div>
    );
  }

  const seed = seeds[index];
  const prevSeed = index > 0 ? seeds[index - 1] : undefined;
  const nextSeed = index < seeds.length - 1 ? seeds[index + 1] : undefined;

  return <SeedDetail seed={seed} prevSeed={prevSeed} nextSeed={nextSeed} />;
}
