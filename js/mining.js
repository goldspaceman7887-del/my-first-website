// mining.js - underground layers, procedural mine grid, ore resources

export const MINE_LAYERS = [
  { id:'surface',  name:'Surface',        depthStart:0,  depthEnd:1,  minPickTier:1, ores:{ stone:60, coal:25, copper:15 } },
  { id:'dirt',     name:'Dirt Layer',     depthStart:1,  depthEnd:3,  minPickTier:1, ores:{ stone:55, coal:25, copper:20 } },
  { id:'stone',    name:'Stone Layer',    depthStart:3,  depthEnd:6,  minPickTier:2, ores:{ stone:45, coal:20, copper:20, iron:15 } },
  { id:'iron',     name:'Iron Layer',     depthStart:6,  depthEnd:10, minPickTier:2, ores:{ stone:35, iron:30, coal:15, gold_ore:10, copper:10 } },
  { id:'crystal',  name:'Crystal Layer',  depthStart:10, depthEnd:14, minPickTier:3, ores:{ stone:25, crystalore:30, gold_ore:20, iron:15, diamond:10 } },
  { id:'ancient',  name:'Ancient Depths', depthStart:14, depthEnd:20, minPickTier:4, ores:{ stone:20, diamond:25, crystalore:20, relic:15, gold_ore:20 } },
];

export const PICKAXE_TIERS = { copper:1, iron:2, gold:3, crystal:4 };

function mulberry32(seed) {
  return function() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed>>>15), 1|seed); t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0) / 4294967296; };
}

export function layerForDepth(depth) {
  return MINE_LAYERS.find(l => depth >= l.depthStart && depth < l.depthEnd) || MINE_LAYERS[MINE_LAYERS.length - 1];
}

// generates a w x h grid for given depth level; 'wall' tiles hide ore, 'floor' is walkable, 'ladder' descends
export function generateMineFloor(depth, w = 18, h = 14) {
  const layer = layerForDepth(depth);
  const rand = mulberry32((depth + 1) * 7919 + 13);
  const grid = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1;
      row.push(edge ? { type: 'wall', ore: null } : { type: 'wall', ore: rollOre(layer, rand) });
    }
    grid.push(row);
  }
  // carve a random walk path so it's not solid
  let cx = Math.floor(w / 2), cy = Math.floor(h / 2);
  grid[cy][cx] = { type: 'floor', ore: null };
  for (let i = 0; i < w * h * 1.5; i++) {
    const dir = Math.floor(rand() * 4);
    if (dir === 0) cx = Math.min(w - 2, cx + 1);
    if (dir === 1) cx = Math.max(1, cx - 1);
    if (dir === 2) cy = Math.min(h - 2, cy + 1);
    if (dir === 3) cy = Math.max(1, cy - 1);
    grid[cy][cx] = { type: 'floor', ore: null };
  }
  // ladder down placed at a random floor tile far from start
  let ladderX = w - 2, ladderY = h - 2;
  grid[ladderY][ladderX] = { type: 'ladder', ore: null };
  grid[Math.floor(h/2)][Math.floor(w/2)].type = 'floor_start';
  return { layer, grid, w, h, ladder: { x: ladderX, y: ladderY }, start: { x: Math.floor(w/2), y: Math.floor(h/2) } };
}

function rollOre(layer, rand) {
  const total = Object.values(layer.ores).reduce((a, b) => a + b, 0);
  let r = rand() * 100;
  if (r > total) return null; // empty rock (just stone-ish rubble)
  let acc = 0;
  for (const [ore, w] of Object.entries(layer.ores)) {
    acc += w;
    if (r <= acc) return ore;
  }
  return null;
}

export function mineWallAt(floorState, x, y, pickaxeTier) {
  const tile = floorState.grid[y]?.[x];
  if (!tile || tile.type !== 'wall') return null;
  if (floorState.layer.minPickTier > pickaxeTier) return { blocked: true };
  tile.type = 'floor';
  const drop = tile.ore || 'stone';
  tile.ore = null;
  return { itemId: drop, qty: drop === 'stone' ? 1 + Math.floor(Math.random()*2) : 1 };
}

// small chance of a slime encounter while mining deeper layers
export function rollEncounter(depth) {
  const chance = Math.min(0.25, 0.02 + depth * 0.01);
  if (Math.random() < chance) {
    return { type: 'slime', hp: 10 + depth * 2, damage: 2 + Math.floor(depth / 3) };
  }
  return null;
}
