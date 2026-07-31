"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadPrayerRequests, type PrayerRequest } from "@/lib/prayer-requests";
import { loadConnectionRequests, type ConnectionRequest } from "@/lib/connection-requests";
import { loadVolunteerApplications, type VolunteerApplication } from "@/lib/volunteer-applications";

export default function TeamViewPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrayers(loadPrayerRequests());
    setConnections(loadConnectionRequests());
    setVolunteers(loadVolunteerApplications());
    setHydrated(true);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Volunteer Team View</h1>
      <p className="text-xs text-forest-900/50">ボランティア・チームビュー</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        A preview of what a volunteer&apos;s triage dashboard would look like once the
        platform has one.
      </p>

      <Card className="mt-6 border-sunset-400/30 bg-sunset-50/60 p-4 text-sm text-forest-900/70">
        <strong className="text-forest-900">This isn&apos;t a real admin panel.</strong> There&apos;s
        no login here — anyone can see this page, and it only shows requests saved in{" "}
        <em>this browser</em>, not real submissions from real visitors across the site.
        A real version needs real accounts, real roles (visitor/volunteer/leader/admin),
        and a real backend to route requests to real people — none of that exists yet.
      </Card>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-forest-900">Prayer requests ({hydrated ? prayers.length : "…"})</h2>
        {hydrated && prayers.length === 0 && (
          <p className="mt-2 text-sm text-forest-900/60">
            None saved on this device yet — <Link href="/prayer" className="font-semibold text-forest-700 underline">submit one</Link> to see it appear here.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {prayers.map((r) => (
            <li key={r.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-forest-900/80">{r.text}</p>
                <Badge variant="sky">New</Badge>
              </div>
              <p className="mt-1 text-xs text-forest-900/40">{r.name ?? "Anonymous"} · {r.date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-forest-900">Connection requests ({hydrated ? connections.length : "…"})</h2>
        {hydrated && connections.length === 0 && (
          <p className="mt-2 text-sm text-forest-900/60">
            None saved on this device yet — <Link href="/partners" className="font-semibold text-forest-700 underline">submit one</Link> to see it appear here.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {connections.map((r) => (
            <li key={r.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-forest-900">{r.method.replace("_", " ")}</p>
                <Badge variant="sky">New</Badge>
              </div>
              {r.topic && <p className="mt-1 text-forest-900/70">{r.topic}</p>}
              <p className="mt-1 text-xs text-forest-900/40">{r.name ?? "Anonymous"} · {r.date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-forest-900">Volunteer applications ({hydrated ? volunteers.length : "…"})</h2>
        {hydrated && volunteers.length === 0 && (
          <p className="mt-2 text-sm text-forest-900/60">
            None saved on this device yet — <Link href="/volunteer" className="font-semibold text-forest-700 underline">apply</Link> to see it appear here.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {volunteers.map((v) => (
            <li key={v.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
              <p className="text-forest-900/80">{v.interests.join(", ")}</p>
              <p className="mt-1 text-xs text-forest-900/40">{v.name ?? "Anonymous"} · {v.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
