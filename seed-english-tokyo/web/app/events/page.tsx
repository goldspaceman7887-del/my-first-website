import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { events } from "@/lib/mock-data";

export const metadata = { title: "Events — Seed English Tokyo" };

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Events</h1>
          <p className="mt-1 text-forest-900/70">
            English cafes, conversation nights, exchange events, business workshops,
            university meetups, and language picnics across Tokyo.
          </p>
        </div>
        <Button>Host an event</Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          const pctFull = Math.round((e.attending / e.capacity) * 100);
          return (
            <Card key={e.id} className="flex flex-col p-5">
              <Badge variant="sky">{e.type}</Badge>
              <p className="mt-3 font-display font-semibold text-forest-900">{e.title}</p>
              <p className="mt-1 text-sm text-forest-900/60">
                {e.station} · {e.date} · {e.time}
              </p>
              <p className="mt-1 text-xs text-forest-900/50">Hosted by {e.host}</p>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-forest-900/60">
                  <span>{e.attending} attending</span>
                  <span>{e.capacity} spots</span>
                </div>
                <Progress
                  value={pctFull}
                  className="mt-1"
                  fillClassName={pctFull >= 90 ? "bg-sunset-400" : "bg-forest-500"}
                />
              </div>

              <Button className="mt-4" size="sm" variant={pctFull >= 100 ? "secondary" : "primary"}>
                {pctFull >= 100 ? "Join waitlist" : "RSVP"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
