import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  trackClassName,
  fillClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2.5 w-full rounded-full bg-leaf-100 overflow-hidden", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full bg-forest-500 organic-progress transition-all duration-700 ease-out animate-grow", fillClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
