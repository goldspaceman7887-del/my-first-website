import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SeigaihaStrip } from "@/components/motifs/seigaiha";
import { ToriiIcon } from "@/components/motifs/torii-icon";

export const metadata: Metadata = {
  title: "Seed English Tokyo — Free English practice, funded transparently",
  description:
    "Free English-practice community for Tokyo. Supporters plant trackable Seeds that fund real growth — watch your impact grow on a living map of Tokyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <Nav />
        <main>{children}</main>
        <footer className="mt-24 bg-cream-100">
          <SeigaihaStrip className="text-forest-700/60" height={8} />
          <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-10 text-sm text-forest-900/70 sm:px-6">
            <ToriiIcon className="mt-1 h-7 w-9 flex-none text-torii-500/70" />
            <div>
              <p className="font-display font-semibold text-forest-900">
                🌱 Seed English Tokyo <span className="font-normal text-forest-900/40">シード・イングリッシュ・トーキョー</span>
              </p>
              <p className="mt-2 max-w-xl">
                My English is growing. My seed is growing. Our forest is growing. Free
                English practice for Tokyo, funded transparently by supporters like you.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
