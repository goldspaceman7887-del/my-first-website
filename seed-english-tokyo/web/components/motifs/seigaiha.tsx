// Seigaiha (青海波) — the traditional Japanese overlapping-wave motif, used
// here as a thin decorative strip. A handful of short arcs tiled via <pattern>,
// not hand-authored illustration.
export function SeigaihaStrip({ className, height = 14 }: { className?: string; height?: number }) {
  const id = "seigaiha";
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      viewBox="0 0 64 16"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" />
          <circle cx="8" cy="16" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" />
          <circle cx="0" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" />
        </pattern>
      </defs>
      <rect width="64" height="16" fill={`url(#${id})`} />
    </svg>
  );
}
