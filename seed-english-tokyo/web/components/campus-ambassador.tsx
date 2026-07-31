"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { groupsForUniversity } from "@/lib/campus-groups";
import { loadAmbassadorApplications, saveAmbassadorApplication, type AmbassadorApplication } from "@/lib/ambassador-applications";
import type { University } from "@/lib/mock-data";

function newId() {
  return `ambassador-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export function SmallGroupFinder({ universities }: { universities: University[] }) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-xl font-bold text-forest-900">Small group finder</h2>
      <p className="text-xs text-forest-900/60">小グループを探す — example listings, not real registered groups</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => {
          const groups = groupsForUniversity(u.slug);
          if (groups.length === 0) return null;
          return (
            <Card key={u.slug} className="p-5">
              <p className="font-display font-semibold text-forest-900">{u.name}</p>
              <ul className="mt-2 space-y-2">
                {groups.map((g) => (
                  <li key={g.name} className="text-sm text-forest-900/70">
                    <p className="font-medium text-forest-900">{g.name}</p>
                    <p className="text-xs text-forest-900/50">{g.meetingTime} · {g.location} · {g.language}</p>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function AmbassadorApplicationForm({ universities }: { universities: University[] }) {
  const [applications, setApplications] = useState<AmbassadorApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [universitySlug, setUniversitySlug] = useState(universities[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setApplications(loadAmbassadorApplications());
    setHydrated(true);
  }, []);

  function submit() {
    const university = universities.find((u) => u.slug === universitySlug);
    if (!university) return;
    const entry: AmbassadorApplication = {
      id: newId(),
      universitySlug,
      universityName: university.name,
      name: name.trim() || null,
      contact: contact.trim() || null,
      date: new Date().toISOString().slice(0, 10),
    };
    saveAmbassadorApplication(entry);
    setApplications(loadAmbassadorApplications());
    setName("");
    setContact("");
    setSubmitted(true);
  }

  return (
    <div className="mt-12">
      <h2 className="font-display text-xl font-bold text-forest-900">Become a campus ambassador</h2>
      <p className="text-xs text-forest-900/60">キャンパスアンバサダーになる</p>
      <Card className="mt-4 p-6">
        {submitted ? (
          <div className="text-center">
            <div className="text-3xl">🎓</div>
            <p className="mt-2 font-display font-semibold text-forest-900">Application saved</p>
            <p className="mt-2 text-sm text-forest-900/70">
              Saved only in this browser for now — no real campus ministry team has been
              notified yet.
            </p>
            <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
              Apply for another campus
            </Button>
          </div>
        ) : (
          <>
            <label className="block text-xs font-semibold text-forest-900/60">
              University
              <select
                value={universitySlug}
                onChange={(e) => setUniversitySlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-forest-900/15 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-500 focus:outline-none"
              >
                {universities.map((u) => (
                  <option key={u.slug} value={u.slug}>{u.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
            <Button className="mt-4" onClick={submit}>Apply to be an ambassador</Button>
            <p className="mt-2 text-[11px] text-forest-900/40">This is a demo — nothing is sent to a real person yet.</p>
          </>
        )}
      </Card>
      {hydrated && applications.length > 0 && (
        <ul className="mt-4 space-y-2">
          {applications.map((a) => (
            <li key={a.id} className="rounded-card border border-forest-900/10 bg-cream-100 p-3 text-sm text-forest-900/70">
              {a.universityName} · {a.name ?? "Anonymous"} · {a.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
