"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  loadConnectionRequests,
  saveConnectionRequest,
  type ConnectionRequest,
} from "@/lib/connection-requests";

const METHODS: { key: ConnectionRequest["method"]; emoji: string; label: string; labelJa: string; description: string }[] = [
  { key: "chat", emoji: "💬", label: "Chat / message", labelJa: "チャット", description: "Start with a low-pressure written conversation." },
  { key: "video", emoji: "📹", label: "Video call", labelJa: "ビデオ通話", description: "Talk face to face without meeting in person yet." },
  { key: "in_person", emoji: "🤝", label: "Meet in person", labelJa: "対面で会う", description: "Meet up at a station or gathering near you in Tokyo." },
];

function newId() {
  return `connect-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function PartnersPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [method, setMethod] = useState<ConnectionRequest["method"]>("chat");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setRequests(loadConnectionRequests());
    setHydrated(true);
  }, []);

  function submit() {
    const request: ConnectionRequest = {
      id: newId(),
      method,
      topic: topic.trim(),
      name: name.trim() || null,
      contact: contact.trim() || null,
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [request, ...requests];
    setRequests(next);
    saveConnectionRequest(request);
    setTopic("");
    setName("");
    setContact("");
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Connect With Someone</h1>
      <p className="text-xs text-forest-900/50">誰かとつながる</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        Whatever you want to talk about — faith, doubts, life, anything — a real
        person can connect with you. Choose how you&apos;d be most comfortable starting.
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
          <div className="text-3xl">🤝</div>
          <h2 className="mt-2 font-display text-xl font-bold text-forest-900">Your request has been saved</h2>
          <p className="mt-2 text-sm text-forest-900/70">
            This is a demo — your request is saved only in this browser, and no real
            person has been notified yet. In the full version, a real volunteer or
            mentor will see and follow up on what you shared.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
            Send another request
          </Button>
        </Card>
      ) : (
        <Card className="mt-6 p-6">
          <p className="text-xs font-semibold text-forest-900/60">How would you like to connect?</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={cn(
                  "rounded-card border p-4 text-left transition-colors",
                  method === m.key ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
                )}
              >
                <div className="text-2xl">{m.emoji}</div>
                <p className="mt-2 font-display font-semibold text-forest-900">{m.label}</p>
                <p className="text-[11px] text-forest-900/50">{m.labelJa}</p>
                <p className="mt-1 text-xs text-forest-900/60">{m.description}</p>
              </button>
            ))}
          </div>

          <label className="mt-5 block text-xs font-semibold text-forest-900/60">
            What would you like to talk about? (optional)
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="Share as much or as little as you'd like..."
              className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-forest-900/60">
              Your name (optional)
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yuki"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
              />
            </label>
            <label className="text-xs font-semibold text-forest-900/60">
              How to reach you (optional)
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email, LINE ID, or phone"
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
              />
            </label>
          </div>

          <Button className="mt-5" onClick={submit}>
            Request a connection 🤝
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
                <p className="font-semibold text-forest-900">
                  {METHODS.find((m) => m.key === r.method)?.emoji} {METHODS.find((m) => m.key === r.method)?.label}
                </p>
                {r.topic && <p className="mt-1 text-forest-900/80">{r.topic}</p>}
                <p className="mt-1 text-xs text-forest-900/40">
                  {r.name ?? "Anonymous"} · {r.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Want to explore on your own first?{" "}
        <Link href="/explore" className="font-semibold text-forest-700 underline">Explore faith →</Link>
      </p>
    </div>
  );
}
