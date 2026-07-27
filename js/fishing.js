// fishing.js - fish database + timing minigame

export const FISH_TABLE = [
  { id:'fish_bass', name:'Bass', regions:['river','farm'], seasons:['spring','summer','fall','winter'], rarity:1, difficulty:0.35 },
  { id:'fish_salmon', name:'Salmon', regions:['river'], seasons:['fall'], rarity:2, difficulty:0.45 },
  { id:'fish_catfish', name:'Catfish', regions:['river'], seasons:['summer','fall'], rarity:2, difficulty:0.5 },
  { id:'fish_trout', name:'Trout', regions:['river','mountains'], seasons:['spring','summer'], rarity:2, difficulty:0.45 },
  { id:'fish_tuna', name:'Tuna', regions:['beach'], seasons:['summer','fall','winter'], rarity:3, difficulty:0.6 },
  { id:'fish_swordfish', name:'Swordfish', regions:['beach'], seasons:['summer'], rarity:4, difficulty:0.75 },
  { id:'fish_legendary', name:'Legendary Fish', regions:['beach','river'], seasons:['spring','summer','fall','winter'], rarity:5, difficulty:0.9 },
];

export function possibleFish(region, season, weatherId) {
  let pool = FISH_TABLE.filter(f => f.regions.includes(region) && f.seasons.includes(season));
  if (pool.length === 0) pool = FISH_TABLE.filter(f => f.regions.includes(region));
  if (pool.length === 0) pool = [FISH_TABLE[0]];
  return pool;
}

export function rollFish(region, season, weatherId, fishingSkillLevel) {
  const pool = possibleFish(region, season, weatherId);
  // weight rarer fish more likely at higher fishing skill; legendary needs skill>=8 and rare luck
  const weighted = [];
  for (const f of pool) {
    let w = Math.max(1, 12 - f.rarity * 2 + Math.floor(fishingSkillLevel / 2));
    if (f.rarity === 5 && fishingSkillLevel < 8) w = 0;
    if (f.rarity === 5) w = Math.max(0, w - 8); // still rare
    if (w > 0) weighted.push({ f, w });
  }
  const total = weighted.reduce((a, b) => a + b.w, 0) || 1;
  let r = Math.random() * total;
  for (const { f, w } of weighted) { if (r < w) return f; r -= w; }
  return pool[0];
}

// Minigame state machine: cursor bounces, target zone sized by (1-difficulty), player must keep cursor in zone
export function createMinigame(fish, weatherMultiplier = 1) {
  const zoneSize = Math.max(0.12, 0.35 - fish.difficulty * 0.25);
  return {
    fish,
    cursorPos: 0.5,
    cursorVel: 0,
    zoneStart: Math.random() * (1 - zoneSize),
    zoneSize,
    progress: 0.5,
    speedFactor: (0.6 + fish.difficulty) * weatherMultiplier,
    done: false,
    success: null,
  };
}

export function updateMinigame(state, dt, holding) {
  if (state.done) return state;
  const gravity = 0.9 * state.speedFactor;
  const boost = 2.2 * state.speedFactor;
  state.cursorVel += (holding ? boost : -gravity) * dt;
  state.cursorVel = Math.max(-1.6, Math.min(1.6, state.cursorVel));
  state.cursorPos += state.cursorVel * dt;
  state.cursorPos = Math.max(0, Math.min(1, state.cursorPos));

  // slowly move the zone to keep tension
  state.zoneStart += (Math.random() - 0.5) * 0.15 * dt;
  state.zoneStart = Math.max(0, Math.min(1 - state.zoneSize, state.zoneStart));

  const inZone = state.cursorPos >= state.zoneStart && state.cursorPos <= state.zoneStart + state.zoneSize;
  state.progress += (inZone ? 0.35 : -0.22) * dt;
  state.progress = Math.max(0, Math.min(1, state.progress));

  if (state.progress >= 1) { state.done = true; state.success = true; }
  if (state.progress <= 0) { state.done = true; state.success = false; }
  return state;
}
