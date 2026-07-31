"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadVolunteerApplications, saveVolunteerApplication, type VolunteerApplication } from "@/lib/volunteer-applications";

const INTEREST_AREAS = [
  { key: "prayer_team", emoji: "🙏", label: "Prayer Team", description: "Read and pray over prayer requests." },
  { key: "connection_team", emoji: "🤝", label: "Connection Team", description: "Chat, video call, or meet with people taking a next step." },
  { key: "events", emoji: "🎓", label: "Events & Bible Studies", description: "Help host or lead a gathering." },
  { key: "translation", emoji: "🌏", label: "Translation", description: "Help translate between Japanese and English." },
  { key: "tech", emoji: "💻", label: "Tech & Content", description: "Help build or maintain the platform itself." },
];

function newId() {
  return `volunteer-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function VolunteerPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setApplications(loadVolunteerApplications());
    setHydrated(true);
  }, []);

  function toggleInterest(key: string) {
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function submit() {
    if (interests.length === 0) return;
    const entry: VolunteerApplication = {
      id: newId(),
      name: name.trim() || null,
      contact: contact.trim() || null,
      interests,
      availability: availability.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    saveVolunteerApplication(entry);
    setApplications(loadVolunteerApplications());
    setInterests([]);
    setAvailability("");
    setName("");
    setContact("");
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Volunteer</h1>
      <p className="text-xs text-forest-900/50">ボランティア</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        Real people are what make prayer, connection, and gatherings actually happen.
        Apply here and a real team reviews it later.
      </p>

      <Card className="mt-6 border-sky-400/30 bg-sky-100/40 p-4 text-sm text-forest-900/70">
        This is a demo application form — it doesn&apos;t assign you to anything yet, and
        no real coordinator has been notified. There&apos;s no vetting, training, or
        matching pipeline behind it yet; that&apos;s real infrastructure the platform
        doesn&apos;t have built yet.
      </Card>

      {submitted ? (
        <Card className="mt-6 p-6 text-center">
          <div className="text-3xl">🧑‍🤝‍🧑</div>
          <h2 className="mt-2 font-display text-xl font-bold text-forest-900">Application saved</h2>
          <p className="mt-2 text-sm text-forest-900/70">
            Saved only in this browser for now. In the full version, a real coordinator
            would review this and follow up.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
            Submit another
          </Button>
        </Card>
      ) : (
        <Card className="mt-6 p-6">
          <p className="text-xs font-semibold text-forest-900/60">What would you like to help with?</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {INTEREST_AREAS.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => toggleInterest(a.key)}
                className={cn(
                  "rounded-card border p-4 text-left transition-colors",
                  interests.includes(a.key) ? "border-forest-700 bg-leaf-100" : "border-forest-900/10 bg-cream-100 hover:border-forest-500"
                )}
              >
                <div className="text-xl">{a.emoji}</div>
                <p className="mt-1 font-display text-sm font-semibold text-forest-900">{a.label}</p>
                <p className="mt-1 text-xs text-forest-900/60">{a.description}</p>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-xs font-semibold text-forest-900/60">
            Availability (optional)
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekday evenings, Sunday afternoons"
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

          <Button className="mt-5" onClick={submit} disabled={interests.length === 0}>
            Submit application
          </Button>
        </Card>
      )}

      {hydrated && applications.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-forest-900">Your applications (saved on this device)</h2>
          <ul className="mt-3 space-y-3">
            {applications.map((a) => (
              <li key={a.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-4 text-sm">
                <p className="text-forest-900/80">{a.interests.map((k) => INTEREST_AREAS.find((i) => i.key === k)?.label).join(", ")}</p>
                <p className="mt-1 text-xs text-forest-900/40">{a.name ?? "Anonymous"} · {a.date}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Not ready to volunteer? <Link href="/partners" className="font-semibold text-forest-700 underline">Connect with someone →</Link> first.
      </p>
    </div>
  );
}
