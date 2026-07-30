"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadPrayerRequests, savePrayerRequest, type PrayerRequest } from "@/lib/prayer-requests";

function newId() {
  return `prayer-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function PrayerPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setRequests(loadPrayerRequests());
    setHydrated(true);
  }, []);

  function submit() {
    if (!text.trim()) return;
    const request: PrayerRequest = {
      id: newId(),
      text: text.trim(),
      name: anonymous ? null : name.trim() || null,
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [request, ...requests];
    setRequests(next);
    savePrayerRequest(request);
    setText("");
    setName("");
    setAnonymous(false);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Request Prayer</h1>
      <p className="text-xs text-forest-900/50">祈りをリクエスト</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        Share whatever&apos;s on your heart — as much or as little detail as you want.
        You can stay anonymous.
      </p>

      <Card className="mt-6 border-sky-400/30 bg-sky-100/40 p-5">
        <p className="font-display text-sm font-semibold text-forest-900">
          If you need to talk to someone right now
        </p>
        <p className="mt-1 text-sm text-forest-900/70">
          This page is a prototype and doesn&apos;t connect to a real person yet. If you&apos;re
          in crisis or need to talk to someone immediately, please reach out directly:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-forest-900/80">
          <li>
            <strong>TELL Japan Lifeline</strong> (English, Tokyo) —{" "}
            <a href="tel:0357740992" className="font-semibold text-forest-700 underline">03-5774-0992</a>
          </li>
          <li>
            <strong>よりそいホットライン</strong> (Japanese, nationwide, 24/7) —{" "}
            <a href="tel:0120279338" className="font-semibold text-forest-700 underline">0120-279-338</a>
          </li>
        </ul>
      </Card>

      {submitted ? (
        <Card className="mt-6 p-6 text-center">
          <div className="text-3xl">🙏</div>
          <h2 className="mt-2 font-display text-xl font-bold text-forest-900">Your request has been saved</h2>
          <p className="mt-2 text-sm text-forest-900/70">
            This is a demo — your request is saved only in this browser, and no real person
            has been notified yet. In the full version, a real prayer team will see and
            respond to what you shared.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
            Share another request
          </Button>
        </Card>
      ) : (
        <Card className="mt-6 p-6">
          <label className="block text-xs font-semibold text-forest-900/60">
            What would you like prayer for?
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Share as much or as little as you'd like..."
              className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-forest-900/60">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              Stay anonymous
            </label>
            {!anonymous && (
              <label className="flex-1 text-xs font-semibold text-forest-900/60">
                Your name (optional)
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yuki"
                  className="mt-1 w-full max-w-xs rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
                />
              </label>
            )}
          </div>

          <Button className="mt-5" onClick={submit} disabled={!text.trim()}>
            Submit prayer request 🙏
          </Button>
          <p className="mt-3 text-[11px] text-forest-900/40">
            This is a demo — nothing is sent to a real person yet.
          </p>
        </Card>
      )}

      {hydrated && requests.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-forest-900">Your requests (saved on this device)</h2>
          <ul className="mt-3 space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
                <p className="text-forest-900/80">{r.text}</p>
                <p className="mt-1 text-xs text-forest-900/40">
                  {r.name ?? "Anonymous"} · {r.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Want to talk instead? <Link href="/partners" className="font-semibold text-forest-700 underline">Connect with someone →</Link>
      </p>
    </div>
  );
}
