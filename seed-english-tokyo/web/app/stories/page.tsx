"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { seededTestimonies, loadTestimonies, saveTestimony, type Testimony } from "@/lib/testimonies";

function newId() {
  return `story-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function StoriesPage() {
  const [mine, setMine] = useState<Testimony[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMine(loadTestimonies());
    setHydrated(true);
  }, []);

  function submit() {
    if (!title.trim() || !body.trim()) return;
    const entry: Testimony = {
      id: newId(),
      name: anonymous ? null : name.trim() || null,
      station: null,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toISOString().slice(0, 10),
      seeded: false,
    };
    saveTestimony(entry);
    setMine(loadTestimonies());
    setTitle("");
    setBody("");
    setName("");
    setAnonymous(false);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Stories & Testimonies</h1>
      <p className="text-xs text-forest-900/50">証の物語</p>
      <p className="mt-2 max-w-xl text-forest-900/70">
        Real kinds of stories from people taking their own next step — plus a place
        to share yours.
      </p>

      {submitted && (
        <Card className="mt-6 border-leaf-400/30 bg-leaf-100/60 p-4 text-sm text-forest-900/80">
          Thanks for sharing. This is a demo — your story is saved only in this browser
          under &quot;Shared on this device&quot; below, not published for other visitors to see.
        </Card>
      )}

      <Card className="mt-6 p-6">
        <h2 className="font-display font-semibold text-forest-900">Share your story</h2>
        <label className="mt-3 block text-xs font-semibold text-forest-900/60">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. I didn't expect to find this here"
            className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
          />
        </label>
        <label className="mt-3 block text-xs font-semibold text-forest-900/60">
          Your story
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Share as much or as little as you'd like..."
            className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm font-normal text-forest-900 focus:border-forest-500 focus:outline-none"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-4">
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
        <Button className="mt-4" onClick={submit} disabled={!title.trim() || !body.trim()}>
          Share my story
        </Button>
        <p className="mt-2 text-[11px] text-forest-900/40">
          This is a demo — your story is saved only in this browser, not published site-wide.
        </p>
      </Card>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-900">Example stories</h2>
        <p className="text-xs text-forest-900/50">These are illustrative, not real submissions.</p>
        <div className="mt-4 space-y-4">
          {seededTestimonies.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                {t.station && <Badge variant="leaf">{t.station}</Badge>}
              </div>
              <p className="mt-2 font-display font-semibold text-forest-900">{t.title}</p>
              <p className="mt-2 text-sm text-forest-900/70">{t.body}</p>
              <p className="mt-3 text-xs text-forest-900/40">{t.name ?? "Anonymous"} · {t.date}</p>
            </Card>
          ))}
        </div>
      </div>

      {hydrated && mine.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-forest-900">Shared on this device</h2>
          <div className="mt-4 space-y-4">
            {mine.map((t) => (
              <Card key={t.id} className="p-5">
                <p className="font-display font-semibold text-forest-900">{t.title}</p>
                <p className="mt-2 text-sm text-forest-900/70">{t.body}</p>
                <p className="mt-3 text-xs text-forest-900/40">{t.name ?? "Anonymous"} · {t.date}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Want to talk to someone about your own story? <Link href="/partners" className="font-semibold text-forest-700 underline">Connect with someone →</Link>
      </p>
    </div>
  );
}
