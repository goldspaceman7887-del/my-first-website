import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seedTiers, stations, type Seed } from "@/lib/mock-data";
import { seedHref } from "@/lib/local-seeds";

export function SeedDetail({
  seed,
  prevSeed,
  nextSeed,
}: {
  seed: Seed;
  prevSeed?: Seed;
  nextSeed?: Seed;
}) {
  const tier = seedTiers.find((t) => t.key === seed.tierKey)!;
  const station = stations.find((s) => s.name === seed.station);
  const justPlanted = seed.status === "growing" && seed.treeProgressPct < 5;

  const timeline = [
    { label: "Seed planted", detail: `${seed.station} station`, date: seed.datePlanted },
    ...(justPlanted
      ? [{ label: "Waiting for its first real activity", detail: "Impact appears here as it happens — nothing is faked in the meantime", date: "ongoing" }]
      : [
          { label: `${seed.impact.impressions.toLocaleString()} impressions`, detail: "Reach attributed via station funding share", date: "ongoing" },
          { label: `${seed.impact.visits} people visited the website`, detail: "Attributed via station funding share", date: "ongoing" },
          { label: `${seed.impact.registrations} people registered`, detail: "New learners at this station", date: "ongoing" },
          { label: `${seed.impact.meetupsAttended} meetups attended`, detail: "Real in-person practice happened", date: "ongoing" },
        ]),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/seeds" className="font-display text-sm font-semibold text-forest-700 hover:underline">
          ← Back to My Forest
        </Link>
        {station && (
          <Link href={`/map/${station.slug}`} className="text-xs font-semibold text-forest-900/60 hover:text-forest-700 hover:underline">
            View {station.name} forest →
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-3xl" aria-hidden="true">
          {tier.emoji}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Seed #{seed.seedNumber}</h1>
          <Badge variant={seed.status === "thriving" ? "forest" : justPlanted ? "sky" : "leaf"} className="mt-1">
            {seed.status === "thriving" ? "Thriving" : justPlanted ? "Just planted" : "Growing"}
          </Badge>
        </div>
      </div>

      {justPlanted && (
        <p className="mt-3 rounded-lg bg-sky-50 px-4 py-2 text-sm text-forest-900/70">
          You just planted this — real impact (impressions, visits, registrations) will show up here as it actually happens. Nothing below is estimated in advance.
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display font-semibold text-forest-900">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Location" value={seed.station} />
            <Row label="Owner" value={seed.owner} />
            <Row label="Date planted" value={seed.datePlanted} />
            <Row label="Contribution" value={`¥${seed.contributionYen.toLocaleString()} (${tier.name})`} />
            <Row label="Status" value={seed.status === "thriving" ? "Thriving" : justPlanted ? "Just planted" : "Growing"} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-forest-900">Impact</h2>
          <ul className="mt-3 space-y-2 text-sm text-forest-900/80">
            <li>• {seed.impact.impressions.toLocaleString()} impressions</li>
            <li>• {seed.impact.visits} visits</li>
            <li>• {seed.impact.registrations} registrations</li>
            <li>• {seed.impact.meetupsAttended} meetup attendees</li>
            <li>• {seed.impact.activeLearners} active learner{seed.impact.activeLearners === 1 ? "" : "s"}</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-semibold text-forest-900">Your seed helped</h2>
        <p className="mt-2 text-sm text-forest-900/80">{seed.emotionalImpact}</p>
      </Card>

      <Card className="mt-6 p-6">
        <div className="flex justify-between text-sm text-forest-900/70">
          <span className="font-display font-semibold text-forest-900">Tree progress</span>
          <span>{seed.treeProgressPct}%</span>
        </div>
        <Progress value={seed.treeProgressPct} className="mt-2 h-3" />

        <div className="mt-5 flex justify-between text-sm text-forest-900/70">
          <span className="font-display font-semibold text-forest-900">Forest contribution</span>
          <span>{seed.forestContributionPct}%</span>
        </div>
        <Progress value={seed.forestContributionPct * 10} fillClassName="bg-sky-400" className="mt-2 h-3" />
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-semibold text-forest-900">Impact timeline</h2>
        <ol className="mt-4 space-y-4 border-l-2 border-leaf-300 pl-4">
          {timeline.map((t, i) => (
            <li key={i}>
              <p className="font-display text-sm font-semibold text-forest-900">{t.label}</p>
              <p className="text-xs text-forest-900/60">{t.detail} · {t.date}</p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button size="lg" variant="secondary">
          Share my seed&apos;s certificate
        </Button>
      </div>

      {(prevSeed || nextSeed) && (
        <div className="mt-8 flex items-center justify-between border-t border-forest-900/10 pt-6 text-sm">
          {prevSeed ? (
            <Link href={seedHref(prevSeed)} className="font-display font-semibold text-forest-700 hover:underline">
              ← Seed #{prevSeed.seedNumber}
            </Link>
          ) : (
            <span />
          )}
          {nextSeed ? (
            <Link href={seedHref(nextSeed)} className="font-display font-semibold text-forest-700 hover:underline">
              Seed #{nextSeed.seedNumber} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-forest-900/60">{label}</dt>
      <dd className="font-medium text-forest-900">{value}</dd>
    </div>
  );
}
