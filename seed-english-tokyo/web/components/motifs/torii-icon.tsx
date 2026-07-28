// Minimal torii gate glyph — two uprights and two crossbars, no illustrative
// detail. Used as a quiet "sacred, waiting ground" marker on bare fields.
export function ToriiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      <rect x="4" y="6" width="40" height="4" rx="1" fill="currentColor" />
      <rect x="0" y="13" width="48" height="3" rx="1" fill="currentColor" />
      <rect x="10" y="16" width="4" height="22" fill="currentColor" />
      <rect x="34" y="16" width="4" height="22" fill="currentColor" />
      <rect x="21" y="13" width="6" height="10" fill="currentColor" />
    </svg>
  );
}
