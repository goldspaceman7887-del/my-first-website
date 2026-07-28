import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SeigaihaStrip } from "@/components/motifs/seigaiha";
import { SeasonalBadge } from "@/components/motifs/seasonal-badge";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/questions", label: "Ask English" },
  { href: "/partners", label: "Find a Partner" },
  { href: "/events", label: "Events" },
  { href: "/map", label: "Tokyo Map" },
  { href: "/seeds", label: "My Forest" },
  { href: "/universities", label: "Universities" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-forest-900">
          <span aria-hidden="true">🌱</span>
          Seed English Tokyo
          <span className="hidden text-xs font-normal text-forest-900/40 sm:inline">東京</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-sm font-medium text-forest-900/80 hover:text-forest-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SeasonalBadge className="hidden text-xs font-semibold lg:inline" />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm">Join free</Button>
        </div>
      </div>
      <SeigaihaStrip className="text-forest-700/70" height={6} />
    </header>
  );
}
