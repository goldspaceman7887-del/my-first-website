import Link from "next/link";
import { Card } from "@/components/ui/card";

const SECTIONS = [
  { emoji: "🙏", label: "Prayer Requests", description: "Triage view of prayer requests saved on this device.", href: "/team/prayer" },
  { emoji: "💬", label: "Connection Requests", description: "Triage view of connect/message requests saved on this device.", href: "/team/connections" },
  { emoji: "🧑‍🤝‍🧑", label: "Volunteer Applications", description: "Triage view of volunteer applications saved on this device.", href: "/team/volunteers" },
];

export const metadata = { title: "Volunteer Team View — Seed Tokyo" };

export default function TeamHubPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Volunteer Team View</h1>
      <p className="text-xs text-forest-900/50">ボランティア・チームビュー</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        A preview of what a volunteer&apos;s triage dashboards would look like once the
        platform has real ones — each kind of request gets its own page.
      </p>

      <Card className="mt-6 border-sunset-400/30 bg-sunset-50/60 p-4 text-sm text-forest-900/70">
        <strong className="text-forest-900">These aren&apos;t real admin panels.</strong> There&apos;s
        no login on any of them — anyone can see these pages, and each only shows
        requests saved in <em>this browser</em>, not real submissions from real
        visitors across the site. A real version needs real accounts, real roles
        (visitor/volunteer/leader/admin), and a real backend to route requests to real
        people — none of that exists yet.
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full p-5 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-3xl">{s.emoji}</div>
              <p className="mt-2 font-display font-semibold text-forest-900">{s.label}</p>
              <p className="mt-1 text-xs text-forest-900/60">{s.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
