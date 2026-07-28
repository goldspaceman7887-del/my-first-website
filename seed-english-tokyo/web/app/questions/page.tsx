import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionCategories, questions } from "@/lib/mock-data";

export const metadata = { title: "Ask English — Seed English Tokyo" };

export default function QuestionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Ask English</h1>
          <p className="mt-1 text-forest-900/70">
            Grammar, pronunciation, vocabulary, business, travel, conversation — ask
            anything, get answers from native speakers, mentors, and advanced learners.
          </p>
        </div>
        <Button>Ask a question</Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="forest">All</Badge>
        {questionCategories.map((c) => (
          <Badge key={c} variant="leaf">
            {c}
          </Badge>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {questions.map((q) => (
          <Card key={q.id} className="p-5">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 pt-1 text-forest-700">
                <span aria-hidden="true" className="text-lg">▲</span>
                <span className="font-display text-sm font-bold">{q.upvotes}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="sky">{q.category}</Badge>
                  {q.hasBestAnswer && <Badge variant="forest">✓ Solved</Badge>}
                </div>
                <p className="mt-2 font-display text-lg font-semibold text-forest-900">{q.title}</p>
                <p className="mt-1 text-sm text-forest-900/70">{q.body}</p>
                <p className="mt-3 text-xs text-forest-900/50">
                  Asked by {q.author} · {q.askedAt} · {q.answerCount} answers
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
