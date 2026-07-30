import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface Topic {
  question: string;
  questionJa: string;
  teaser: string;
}

const TOPICS: Topic[] = [
  { question: "Who is Jesus?", questionJa: "イエスとは誰ですか？", teaser: "Not just a historical teacher — explore who Christians believe Jesus actually is." },
  { question: "Why did Jesus die?", questionJa: "なぜイエスは死んだのですか？", teaser: "The cross is central to Christianity. Here's why it matters." },
  { question: "The Resurrection", questionJa: "復活について", teaser: "What Christians believe happened three days after the crucifixion, and why it changes everything." },
  { question: "Can I be forgiven?", questionJa: "私は赦されますか？", teaser: "For anything you've done — yes. Here's what that actually means." },
  { question: "What is salvation?", questionJa: "救いとは何ですか？", teaser: "A simple explanation of a word that shows up everywhere in Christianity." },
  { question: "What happens after death?", questionJa: "死後には何がありますか？", teaser: "One of the biggest questions anyone can ask. Here's the Christian answer." },
  { question: "Why does God allow suffering?", questionJa: "なぜ神は苦しみを許すのですか？", teaser: "An honest look at one of the hardest questions in faith." },
  { question: "Can God really change my life?", questionJa: "神は本当に私の人生を変えられますか？", teaser: "Real stories, and what it actually looks like when it happens." },
  { question: "What is the Bible?", questionJa: "聖書とは何ですか？", teaser: "Where it came from, how it's organized, and why people trust it." },
  { question: "How do I pray?", questionJa: "どうやって祈ればいいですか？", teaser: "There's no wrong way to start. A simple guide to praying for the first time." },
  { question: "How do I become a Christian?", questionJa: "どうすればクリスチャンになれますか？", teaser: "What it means, and the actual steps, in plain language." },
  { question: "How do I follow Jesus?", questionJa: "どうやってイエスに従えばいいですか？", teaser: "Faith isn't a one-time decision — here's what day-to-day following looks like." },
  { question: "How can I grow spiritually?", questionJa: "どうすれば霊的に成長できますか？", teaser: "Practical habits for someone who's just getting started." },
  { question: "How do I find a church?", questionJa: "教会はどうやって見つけますか？", teaser: "What to look for, and how to find one near you in Tokyo." },
];

export const metadata = { title: "Explore Faith — Seed Tokyo" };

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-forest-900">Explore Faith</h1>
      <p className="text-xs text-forest-900/50">信仰を探る</p>
      <p className="mt-2 max-w-2xl text-forest-900/70">
        Honest starting points for the biggest questions about Jesus, the Bible, and
        Christianity — wherever you are in exploring, there&apos;s no wrong question.
      </p>

      <Card className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-forest-700 p-6 text-cream-50">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-cream-50/70">Start here</p>
          <p className="mt-1 font-display text-xl font-bold">Read the Gospel of John</p>
          <p className="mt-1 text-sm text-cream-50/80">The most commonly recommended starting point in the Bible — in Japanese or English.</p>
        </div>
        <a
          href="https://www.bible.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Start reading →
        </a>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <Card key={t.question} className="flex h-full flex-col p-5">
            <p className="font-display font-semibold text-forest-900">{t.question}</p>
            <p className="text-[11px] text-forest-900/40">{t.questionJa}</p>
            <p className="mt-2 flex-1 text-sm text-forest-900/70">{t.teaser}</p>
            <Link href="/questions" className="mt-3 text-xs font-semibold text-forest-700 hover:underline">
              Ask a question about this →
            </Link>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-forest-900/60">
        Ready to talk to a real person about any of this?{" "}
        <Link href="/partners" className="font-semibold text-forest-700 underline">Connect with someone →</Link>
      </p>
    </div>
  );
}
