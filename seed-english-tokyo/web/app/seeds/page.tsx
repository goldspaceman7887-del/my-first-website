import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MyForestContent } from "@/components/my-forest-content";

export const metadata = { title: "My Forest — Seed English Tokyo" };

export default function MyForestPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">My Forest</h1>
          <p className="text-xs text-forest-900/50">私の森</p>
          <p className="mt-1 text-forest-900/70">
            Not a donation history — a forest you planted. Here&apos;s exactly what it has grown into.
          </p>
        </div>
        <Link href="/seeds/plant" className={buttonVariants()}>Plant another seed 🌱</Link>
      </div>

      <MyForestContent />
    </div>
  );
}
