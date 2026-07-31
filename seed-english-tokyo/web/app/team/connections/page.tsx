"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadConnectionRequests, type ConnectionRequest } from "@/lib/connection-requests";

export default function TeamConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConnections(loadConnectionRequests());
    setHydrated(true);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/team" className="font-display text-sm font-semibold text-forest-700 hover:underline">
        ← Team View
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">Connection Requests</h1>
      <p className="text-xs text-forest-900/50">つながりリクエスト一覧</p>

      <Card className="mt-6 border-sunset-400/30 bg-sunset-50/60 p-4 text-sm text-forest-900/70">
        <strong className="text-forest-900">This isn&apos;t a real admin panel.</strong> No
        login, no real routing — this only shows connection requests (chat, video, or
        in-person) saved in this browser.
      </Card>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-forest-900">{hydrated ? connections.length : "…"} requests</h2>
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
    </div>
  );
}
