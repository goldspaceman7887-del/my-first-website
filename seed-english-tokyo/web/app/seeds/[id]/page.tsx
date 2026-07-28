import { notFound } from "next/navigation";
import { SeedDetail } from "@/components/seed-detail";
import { mySeeds } from "@/lib/mock-data";

export function generateStaticParams() {
  return mySeeds.map((s) => ({ id: s.id }));
}

export default function SeedDetailPage({ params }: { params: { id: string } }) {
  const index = mySeeds.findIndex((s) => s.id === params.id);
  if (index === -1) notFound();
  const seed = mySeeds[index];
  const prevSeed = index > 0 ? mySeeds[index - 1] : undefined;
  const nextSeed = index < mySeeds.length - 1 ? mySeeds[index + 1] : undefined;

  return <SeedDetail seed={seed} prevSeed={prevSeed} nextSeed={nextSeed} />;
}
