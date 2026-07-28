import { SimulatorContent } from "@/components/simulator-content";

export const metadata = { title: "Growth Simulator — Seed English Tokyo" };

export default function SimulatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Growth Simulator</h1>
      <p className="text-xs text-forest-900/50">成長シミュレーター</p>
      <SimulatorContent />
    </div>
  );
}
