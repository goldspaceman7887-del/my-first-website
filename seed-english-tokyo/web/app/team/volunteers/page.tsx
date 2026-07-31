"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { loadVolunteerApplications, type VolunteerApplication } from "@/lib/volunteer-applications";

export default function TeamVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setVolunteers(loadVolunteerApplications());
    setHydrated(true);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/team" className="font-display text-sm font-semibold text-forest-700 hover:underline">
        ← Team View
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">Volunteer Applications</h1>
      <p className="text-xs text-forest-900/50">ボランティア申請一覧</p>

      <Card className="mt-6 border-sunset-400/30 bg-sunset-50/60 p-4 text-sm text-forest-900/70">
        <strong className="text-forest-900">This isn&apos;t a real admin panel.</strong> No
        login, no real vetting pipeline — this only shows applications saved in this
        browser.
      </Card>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-forest-900">{hydrated ? volunteers.length : "…"} applications</h2>
        {hydrated && volunteers.length === 0 && (
          <p className="mt-2 text-sm text-forest-900/60">
            None saved on this device yet — <Link href="/volunteer" className="font-semibold text-forest-700 underline">apply</Link> to see it appear here.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {volunteers.map((v) => (
            <li key={v.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
              <p className="text-forest-900/80">{v.interests.join(", ")}</p>
              {v.availability && <p className="mt-1 text-xs text-forest-900/60">Available: {v.availability}</p>}
              <p className="mt-1 text-xs text-forest-900/40">{v.name ?? "Anonymous"} · {v.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
