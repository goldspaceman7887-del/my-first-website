"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { churches, churchLanguages, churchDenominations } from "@/lib/churches-data";
import { loadChurchInterest, saveChurchInterest, type ChurchInterest } from "@/lib/church-interest";

function newId() {
  return `church-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function ChurchesPage() {
  const [language, setLanguage] = useState<string | null>(null);
  const [denomination, setDenomination] = useState<string | null>(null);
  const [interest, setInterest] = useState<ChurchInterest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInterest(loadChurchInterest());
    setHydrated(true);
  }, []);

  function markInterested(church: (typeof churches)[number]) {
    const entry: ChurchInterest = {
      id: newId(),
      churchSlug: church.slug,
      churchName: church.name,
      date: new Date().toISOString().slice(0, 10),
    };
    saveChurchInterest(entry);
    setInterest(loadChurchInterest());
  }

  const filtered = churches.filter((c) => {
    if (language && !c.languages.includes(language)) return false;
    if (denomination && c.denomination !== denomination) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Find A Church</h1>
      <p className="text-xs text-forest-900/50">教会を探す</p>
      <p className="mt-2 max-w-2xl text-forest-900/70">
        Browse churches near Tokyo stations you already know.
      </p>

      <Card className="mt-6 border-sunset-400/30 bg-sunset-50/60 p-4 text-sm text-forest-900/70">
        <strong className="text-forest-900">These are example listings for this prototype</strong> —
        names, denominations, and service times shown here are illustrative, not real
        churches. Always verify a real church&apos;s details independently before visiting,
        or ask a real person via <Link href="/partners" className="font-semibold text-forest-700 underline">Connect With Someone</Link>.
      </Card>

      <div className="mt-6 flex flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold text-forest-900/60">Language</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLanguage(null)}
              className={cn("rounded-full px-3 py-1 text-xs font-semibold", !language ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100")}
            >
              All
            </button>
            {churchLanguages.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={cn("rounded-full px-3 py-1 text-xs font-semibold", language === l ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-forest-900/60">Denomination</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDenomination(null)}
              className={cn("rounded-full px-3 py-1 text-xs font-semibold", !denomination ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100")}
            >
              All
            </button>
            {churchDenominations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDenomination(d)}
                className={cn("rounded-full px-3 py-1 text-xs font-semibold", denomination === d ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-forest-900 hover:bg-leaf-100")}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const marked = hydrated && interest.some((i) => i.churchSlug === c.slug);
          return (
            <Card key={c.slug} className="flex flex-col p-5">
              <p className="font-display font-semibold text-forest-900">{c.name}</p>
              <p className="text-[11px] text-forest-900/50">{c.nameJa}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="leaf">{c.station}</Badge>
                <Badge variant="sky">{c.denomination}</Badge>
              </div>
              <p className="mt-2 flex-1 text-sm text-forest-900/70">{c.description}</p>
              <p className="mt-3 text-xs text-forest-900/60">
                <strong>Languages:</strong> {c.languages.join(", ")}
              </p>
              <p className="text-xs text-forest-900/60">
                <strong>Services:</strong> {c.serviceTimes.join(" · ")}
              </p>
              <p className="text-xs text-forest-900/60">{c.sizeDescription}</p>
              <Button
                size="sm"
                variant={marked ? "secondary" : "primary"}
                className="mt-4"
                disabled={marked}
                onClick={() => markInterested(c)}
              >
                {marked ? "Marked interested ✓" : "I'm interested"}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Want a real person to help you find one that fits?{" "}
        <Link href="/partners" className="font-semibold text-forest-700 underline">Connect with someone →</Link>
      </p>
    </div>
  );
}
