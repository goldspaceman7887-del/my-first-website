"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  adPlatforms,
  adFormats,
  seedTiers,
  estimateAdImpressions,
} from "@/lib/mock-data";

interface TestScenario {
  id: number;
  label: string;
  platformKey: string;
  formatKey: string;
  tierKey: string;
  quantity: number;
}

let nextId = 1;

function newScenario(): TestScenario {
  return {
    id: nextId++,
    label: `Test ${nextId - 1}`,
    platformKey: adPlatforms[0].key,
    formatKey: adFormats[0].key,
    tierKey: seedTiers[1].key,
    quantity: 10,
  };
}

export default function AdReachLabPage() {
  const [tests, setTests] = useState<TestScenario[]>([newScenario(), newScenario()]);

  function updateTest(id: number, patch: Partial<TestScenario>) {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTest() {
    setTests((prev) => [...prev, newScenario()]);
  }

  function removeTest(id: number) {
    setTests((prev) => prev.filter((t) => t.id !== id));
  }

  const results = tests.map((t) => {
    const tier = seedTiers.find((s) => s.key === t.tierKey)!;
    const budgetYen = tier.priceYen * t.quantity;
    const impressions = estimateAdImpressions(t.platformKey, budgetYen, t.formatKey);
    return { ...t, budgetYen, impressions };
  });

  const totalBudget = results.reduce((sum, r) => sum + r.budgetYen, 0);
  const totalImpressions = results.reduce((sum, r) => sum + r.impressions, 0);
  const avgImpressionsPerThousandYen = totalBudget > 0 ? Math.round((totalImpressions / totalBudget) * 1000) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Ad Reach Testing Lab</h1>
      <p className="text-xs text-forest-900/50">広告リーチ・テストラボ</p>
      <p className="mt-1 max-w-2xl text-forest-900/70">
        Plug in numbers before committing to anything. Choose a seed tier and quantity —
        the same units used everywhere else on the platform — pick a platform and format,
        and see the estimated reach. Add a few tests side by side to compare, and see the
        average across all of them. Nothing here is funded; it&apos;s a calculator, not a
        purchase.
      </p>

      <div className="mt-8 space-y-5">
        {tests.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-forest-900">{t.label}</p>
              {tests.length > 1 && (
                <button type="button" onClick={() => removeTest(t.id)} className="text-xs font-semibold text-forest-900/40 hover:text-error-500">
                  Remove
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-semibold text-forest-900/60">
                Seed tier
                <select
                  value={t.tierKey}
                  onChange={(e) => updateTest(t.id, { tierKey: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
                >
                  {seedTiers.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.emoji} {s.name} (¥{s.priceYen.toLocaleString()})
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-forest-900/60">
                Quantity
                <input
                  type="number"
                  min={1}
                  value={t.quantity}
                  onChange={(e) => updateTest(t.id, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 num focus:border-forest-500 focus:outline-none"
                />
              </label>

              <label className="text-xs font-semibold text-forest-900/60">
                Platform
                <select
                  value={t.platformKey}
                  onChange={(e) => updateTest(t.id, { platformKey: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
                >
                  {adPlatforms.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.emoji} {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-forest-900/60">
                Format
                <select
                  value={t.formatKey}
                  onChange={(e) => updateTest(t.id, { formatKey: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
                >
                  {adFormats.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.emoji} {f.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-forest-900/10 pt-4 text-sm">
              <span className="text-forest-900/60">
                Budget: <span className="font-display font-semibold text-forest-900 num">¥{(results.find((r) => r.id === t.id)?.budgetYen ?? 0).toLocaleString()}</span>
              </span>
              <span className="text-forest-900/60">
                Estimated reach: <span className="font-display font-semibold text-forest-700 num">~{(results.find((r) => r.id === t.id)?.impressions ?? 0).toLocaleString()} impressions</span>
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <Button variant="secondary" onClick={addTest}>
          + Add another test
        </Button>
      </div>

      <Card className="mt-8 bg-forest-700 p-6 text-cream-50">
        <h2 className="font-display font-semibold">Comparison summary</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-cream-50/70">Total budget across tests</p>
            <p className="font-display text-2xl font-bold num">¥{totalBudget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/70">Total estimated reach</p>
            <p className="font-display text-2xl font-bold num">{totalImpressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/70">Average impressions per ¥1,000</p>
            <p className="font-display text-2xl font-bold num">{avgImpressionsPerThousandYen.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <p className="mt-8 text-center text-xs text-forest-900/50">
        Ready to commit? <Link href="/advertise" className="font-semibold text-forest-700 underline">Fund a real ad →</Link>
      </p>
    </div>
  );
}
