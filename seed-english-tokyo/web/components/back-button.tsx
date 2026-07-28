"use client";

import { useRouter, usePathname } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  function handleBack() {
    // A direct/first-load visit has no in-app history to go back to —
    // router.back() would leave the site entirely, so fall back to home.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <div className="border-b border-forest-900/5 bg-cream-100/60">
      <div className="mx-auto max-w-7xl px-4 py-1.5 sm:px-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 font-display text-sm font-medium text-forest-900/70 hover:text-forest-700"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
