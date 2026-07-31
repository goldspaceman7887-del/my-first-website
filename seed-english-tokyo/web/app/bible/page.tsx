"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { johnReadingPlan, verseOfTheDay } from "@/lib/bible-data";
import { loadBibleProgress, markDayRead, unmarkDayRead, computeStreak, type BibleProgress } from "@/lib/bible-progress";

export default function BiblePage() {
  const [progress, setProgress] = useState<BibleProgress>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadBibleProgress());
    setHydrated(true);
  }, []);

  const completedCount = Object.keys(progress).length;
  const streak = computeStreak(progress);
  const verse = verseOfTheDay();

  function toggleDay(day: number) {
    const next = progress[day] ? unmarkDayRead(day) : markDayRead(day);
    setProgress({ ...next });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Bible Access</h1>
      <p className="text-xs text-forest-900/50">聖書へのアクセス</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        A reading plan through the Gospel of John, a verse to start your day, and a
        streak to keep you coming back.
      </p>

      <Card className="mt-6 bg-forest-700 p-6 text-cream-50">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-cream-50/70">Verse of the day</p>
        <p className="mt-2 font-display text-lg font-semibold">&ldquo;{verse.text}&rdquo;</p>
        <p className="mt-1 text-sm text-cream-50/70">{verse.reference} (KJV)</p>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Days completed" value={`${completedCount} / 21`} />
        <StatCard label="Current streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
        <StatCard label="Plan" value="Gospel of John" />
      </div>

      <Card className="mt-4 p-5">
        <Progress value={Math.round((completedCount / 21) * 100)} />
      </Card>

      <div className="mt-8 space-y-2">
        {johnReadingPlan.map((d) => {
          const done = hydrated && Boolean(progress[d.day]);
          return (
            <Card key={d.day} className={cn("flex items-center justify-between gap-4 p-4", done && "bg-leaf-100/50")}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDay(d.day)}
                  aria-label={done ? `Mark ${d.reference} unread` : `Mark ${d.reference} read`}
                  className={cn(
                    "flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    done ? "border-forest-700 bg-forest-700 text-cream-50" : "border-forest-900/20 text-forest-900/40 hover:border-forest-500"
                  )}
                >
                  {done ? "✓" : d.day}
                </button>
                <div>
                  <p className="font-display text-sm font-semibold text-forest-900">Day {d.day} — {d.reference}</p>
                  <p className="text-xs text-forest-900/60">{d.summary}</p>
                </div>
              </div>
              <a
                href="https://www.bible.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Read →
              </a>
            </Card>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-forest-900/50">
        This tracks your reading plan progress on this device — full chapter text isn&apos;t
        hosted here, it links out to bible.com.
      </p>

      <p className="mt-8 text-center text-sm text-forest-900/60">
        Have questions about what you&apos;re reading? <Link href="/questions" className="font-semibold text-forest-700 underline">Ask a question →</Link>
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 text-center">
      <p className="font-display text-xl font-bold text-forest-900">{value}</p>
      <p className="text-xs text-forest-900/60">{label}</p>
    </Card>
  );
}
