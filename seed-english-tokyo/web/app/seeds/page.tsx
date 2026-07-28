import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeedCard } from "@/components/seed-card";
import { mySeeds } from "@/lib/mock-data";

export const metadata = { title: "My Seeds — Seed English Tokyo" };

export default function MySeedsPage() {
  const totalContributed = mySeeds.reduce((sum, s) => sum + s.contributionYen, 0);
  const totalPeopleReached = mySeeds.reduce(
    (sum, s) => sum + s.impact.visits + s.impact.registrations,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">My Seeds</h1>
          <p className="mt-1 text-forest-900/70">
            Every seed you&apos;ve planted, and exactly what it has grown into.
          </p>
        </div>
        <Button>Plant another seed 🌱</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-forest-900/60">Total seeds</p>
          <p className="mt-1 font-display text-3xl font-bold text-forest-900">{mySeeds.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-forest-900/60">Total contributed</p>
          <p className="mt-1 font-display text-3xl font-bold text-forest-900">
            ¥{totalContributed.toLocaleString()}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-forest-900/60">People reached</p>
          <p className="mt-1 font-display text-3xl font-bold text-forest-900">
            {totalPeopleReached.toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mySeeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} />
        ))}
      </div>
    </div>
  );
}
