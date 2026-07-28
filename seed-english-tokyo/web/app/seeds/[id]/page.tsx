import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mySeeds, seedTiers } from "@/lib/mock-data";

export function generateStaticParams() {
  return mySeeds.map((s) => ({ id: s.id }));
}

export default function SeedDetailPage({ params }: { params: { id: string } }) {
  const seed = mySeeds.find((s) => s.id === params.id);
  if (!seed) notFound();
  const tier = seedTiers.find((t) => t.key === seed.tierKey)!;

  const timeline = [
    { label: "Seed planted", detail: `${seed.station} station`, date: seed.datePlanted },
    { label: `${seed.impact.visits} people visited the website`, detail: "Attributed via station funding share", date: "ongoing" },
    { label: `${seed.impact.registrations} people registered`, detail: "New learners at this station", date: "ongoing" },
    { label: `${seed.impact.meetupsAttended} meetups attended`, detail: "Real in-person practice happened", date: "ongoing" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/seeds" className="font-display text-sm font-semibold text-forest-700 hover:underline">
        ← Back to My Seeds
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-3xl" aria-hidden="true">
          {tier.emoji}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Seed #{seed.seedNumber}</h1>
          <Badge variant={seed.status === "thriving" ? "forest" : "leaf"} className="mt-1">
            {seed.status === "thriving" ? "Thriving" : "Growing"}
          </Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display font-semibold text-forest-900">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Date planted" value={seed.datePlanted} />
            <Row label="Location" value={seed.station} />
            <Row label="Contribution" value={`¥${seed.contributionYen.toLocaleString()} (${tier.name})`} />
            <Row label="Status" value={seed.status === "thriving" ? "Thriving" : "Growing"} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-forest-900">Impact created</h2>
          <ul className="mt-3 space-y-2 text-sm text-forest-900/80">
            <li>• {seed.impact.visits} people visited the website</li>
            <li>• {seed.impact.registrations} people registered</li>
            <li>• {seed.impact.meetupsAttended} people attended a meetup</li>
            <li>• {seed.impact.activeLearners} active learner{seed.impact.activeLearners === 1 ? "" : "s"} remains</li>
          </ul>
        </Card>
      </div>

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
