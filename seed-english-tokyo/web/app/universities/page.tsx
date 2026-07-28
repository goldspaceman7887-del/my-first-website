import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GrowthStageBadge, FieldStatusBadge } from "@/components/growth-stage";
import { HarvestField } from "@/components/harvest-field";
import { universities } from "@/lib/mock-data";

export const metadata = { title: "University Forests — Seed English Tokyo" };

export default function UniversitiesPage() {
  const maxCount = Math.max(...universities.map((u) => u.activeSeedCount));
  const ranked = [...universities].sort((a, b) => b.growthScore - a.growthScore);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">University Forests</h1>
      <p className="text-xs text-forest-900/50">大学フォレスト</p>
      <p className="mt-1 max-w-2xl text-forest-900/70">
        Every university has its own forest. Ambassadors and students compete, campus to
        campus, to grow theirs — Waseda, Sophia, Keio, Meiji, Rikkyo, Hosei, and Aoyama
        Gakuin, all in Tokyo.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => (
          <Link key={u.slug} href={`/seeds/plant?tier=growth_seed`}>
            <Card className="h-full overflow-hidden p-0 transition-transform hover:-translate-y-0.5 hover:shadow-md">
              <HarvestField slug={u.slug} count={u.activeSeedCount} maxCount={maxCount} stage={u.growthStage} height={100} className="rounded-none border-0" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-semibold text-forest-900">{u.name}</p>
                    <p className="text-xs text-forest-900/60">{u.nameJa}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <GrowthStageBadge stage={u.growthStage} score={u.growthScore} />
                    <FieldStatusBadge status={u.fieldStatus} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-forest-900/70">
                  <span>Funding: ¥{u.fundingRaisedYen.toLocaleString()}</span>
                  <span>Seeds planted: {u.activeSeedCount}</span>
                  <span>Registrations: {u.registrations.toLocaleString()}</span>
                  <span>Learners active: {u.activeLearners}</span>
                  <span>Ambassadors: {u.ambassadorCount}</span>
                  <span>Upcoming events: {u.upcomingEvents}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl font-bold text-forest-900">Campus leaderboard</h2>
        <p className="text-xs text-forest-900/60">キャンパスリーダーボード — ranked by growth score</p>
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-900/10 text-left text-xs text-forest-900/50">
                  <th className="px-5 py-3 font-semibold">Rank</th>
                  <th className="px-5 py-3 font-semibold">University</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 text-right font-semibold">Growth score</th>
                  <th className="px-5 py-3 text-right font-semibold">Seeds</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((u, i) => (
                  <tr key={u.slug} className="border-b border-forest-900/5 last:border-0">
                    <td className="px-5 py-3 font-display font-bold text-forest-900 num">#{i + 1}</td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-forest-900">{u.name}</span>
                      <span className="ml-2 text-xs text-forest-900/50">{u.nameJa}</span>
                    </td>
                    <td className="px-5 py-3"><GrowthStageBadge stage={u.growthStage} /></td>
                    <td className="px-5 py-3 text-right font-semibold text-forest-900 num">{u.growthScore}/100</td>
                    <td className="px-5 py-3 text-right text-forest-900/70 num">{u.activeSeedCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
