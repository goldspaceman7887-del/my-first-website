import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

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
        <footer className="mt-24 border-t border-forest-900/10 bg-cream-100 py-10">
          <div className="mx-auto max-w-7xl px-4 text-sm text-forest-900/70 sm:px-6">
            <p className="font-display font-semibold text-forest-900">
              🌱 Seed English Tokyo
            </p>
            <p className="mt-2 max-w-xl">
              My English is growing. My seed is growing. Our forest is growing. Free
              English practice for Tokyo, funded transparently by supporters like you.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
