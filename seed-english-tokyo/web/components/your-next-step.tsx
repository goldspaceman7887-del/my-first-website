import Link from "next/link";
import { Card } from "@/components/ui/card";

interface NextStepAction {
  emoji: string;
  label: string;
  labelJa: string;
  description: string;
  href: string;
}

const ACTIONS: NextStepAction[] = [
  { emoji: "🙏", label: "Request Prayer", labelJa: "祈りをリクエスト", description: "Share something you'd like prayer for — as openly or anonymously as you want.", href: "/prayer" },
  { emoji: "💬", label: "Talk To Someone", labelJa: "誰かと話す", description: "Get matched with a real person to talk with, whenever you're ready.", href: "/partners" },
  { emoji: "❓", label: "Ask a Question", labelJa: "質問する", description: "No question about Christianity or the Bible is too basic or too hard.", href: "/questions" },
  { emoji: "✝️", label: "Explore Faith", labelJa: "信仰を探る", description: "Who is Jesus, why did he die, what happens after death — start here.", href: "/explore" },
  { emoji: "📖", label: "Read The Bible", labelJa: "聖書を読む", description: "Start with the Gospel of John, in Japanese or English.", href: "/explore" },
  { emoji: "🎓", label: "Join A Bible Study", labelJa: "聖書研究に参加", description: "Find a group meeting near you, in Tokyo or online.", href: "/events" },
  { emoji: "⛪", label: "Find A Gathering", labelJa: "集会を見つける", description: "See where people are gathering to explore faith across Tokyo.", href: "/map" },
  { emoji: "🌱", label: "Plant A Gospel Seed", labelJa: "福音の種を植える", description: "Fund outreach that helps someone else take their own next step.", href: "/seeds/plant" },
];

export function YourNextStep({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "bg-cream-100 py-16"}>
      <div className={compact ? "" : "mx-auto max-w-7xl px-4 sm:px-6"}>
        <h2 className="text-center font-display text-3xl font-bold text-forest-900">Your Next Step</h2>
        <p className="mt-1 text-center text-sm text-forest-900/50">次の一歩</p>
        <p className="mx-auto mt-2 max-w-xl text-center text-forest-900/70">
          Wherever you are in exploring faith, there&apos;s a real next step you can take right now.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a) => (
            <Link key={a.label} href={a.href}>
              <Card className="h-full p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-3xl">{a.emoji}</div>
                <p className="mt-2 font-display font-semibold text-forest-900">{a.label}</p>
                <p className="text-[11px] text-forest-900/50">{a.labelJa}</p>
                <p className="mt-2 text-sm text-forest-900/70">{a.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
