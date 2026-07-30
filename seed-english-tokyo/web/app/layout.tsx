import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SeigaihaStrip } from "@/components/motifs/seigaiha";
import { ToriiIcon } from "@/components/motifs/torii-icon";
import { YourNextStep } from "@/components/your-next-step";

export const metadata: Metadata = {
  title: "Seed Tokyo — Planting the Gospel across Tokyo, funded transparently",
  description:
    "A gospel outreach community for Tokyo. Supporters plant trackable Seeds that fund real outreach, prayer, and discipleship — watch your impact grow on a living map of Tokyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <Nav />
        <main>{children}</main>
        <div className="border-t border-forest-900/10 bg-cream-100 py-14">
          <YourNextStep compact />
        </div>
        <footer className="bg-cream-100">
          <SeigaihaStrip className="text-forest-700/60" height={8} />
          <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-10 text-sm text-forest-900/70 sm:px-6">
            <ToriiIcon className="mt-1 h-7 w-9 flex-none text-torii-500/70" />
            <div>
              <p className="font-display font-semibold text-forest-900">
                🌱 Seed Tokyo <span className="font-normal text-forest-900/40">シード・トーキョー</span>
              </p>
              <p className="mt-2 max-w-xl">
                My faith is growing. My seed is growing. Our forest is growing. Planting
                the gospel across Tokyo, funded transparently by supporters like you.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
