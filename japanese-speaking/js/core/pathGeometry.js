// Shared math for the Duolingo-style winding node paths (Roadmap, Vocabulary lessons, ...).
// Pure functions only — callers own their own layout constants (row height, amplitude, etc.)
// since different paths reasonably want different spacing/scale.

// Alternates each node left/right of center in a gentle sine wave; checkpoints sit dead-center
// so they read as a milestone regardless of where the wave would otherwise put them.
export function waveOffset(i, amplitude, isCheckpoint) {
  if (isCheckpoint) return 0;
  return Math.round(Math.sin(i * (Math.PI / 3)) * amplitude);
}

// Smooth vertical S-curve through a list of {x,y} points, using a horizontal-tangent control
// point at the midpoint height between each consecutive pair.
export function buildPathD(points) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}
