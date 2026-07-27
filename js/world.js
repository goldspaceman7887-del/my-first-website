// world.js - regions, tile maps, procedural generation, camera

export const TILE_SIZE = 32;

export const TILE = {
  GRASS: 'grass', TILLED: 'tilled', TILLED_WET: 'tilled_wet', DIRT: 'dirt',
  WATER: 'water', SAND: 'sand', STONE_FLOOR: 'stone_floor', PATH: 'path',
  SNOW: 'snow', LAVA: 'lava', CRYSTAL_FLOOR: 'crystal_floor', WOOD_FLOOR: 'wood_floor'
};

export const TILE_COLORS = {
  grass: '#5fa851', tilled: '#7a5230', tilled_wet: '#4a3420', dirt: '#8a6a45',
  water: '#3a7ec2', sand: '#e3cf8a', stone_floor: '#8a8a90', path: '#c8a86a',
  snow: '#eef3f7', lava: '#c8461e', crystal_floor: '#7b6fd6', wood_floor: '#a9764e'
};

export const OBJECT_TYPES = {
  TREE: 'tree', ROCK: 'rock', BUSH: 'bush', FLOWER: 'flower', STUMP: 'stump', ORE_ROCK: 'ore_rock'
};

// Regions --------------------------------------------------------------
export const REGIONS = {
  farm:      { id:'farm', name:'Farm', w:32, h:24, locked:false, base:'grass', theme:'farm' },
  town:      { id:'town', name:'Town', w:34, h:26, locked:false, base:'path', theme:'town' },
  forest:    { id:'forest', name:'Forest', w:36, h:28, locked:false, base:'grass', theme:'forest' },
  beach:     { id:'beach', name:'Beach', w:32, h:24, locked:false, base:'sand', theme:'beach' },
  river:     { id:'river', name:'River', w:32, h:24, locked:false, base:'grass', theme:'river' },
  mountains: { id:'mountains', name:'Mountains', w:34, h:26, locked:false, base:'stone_floor', theme:'mountains' },
  mine:      { id:'mine', name:'Mine Entrance', w:20, h:16, locked:false, base:'stone_floor', theme:'mine' },

  desert:        { id:'desert', name:'Desert', w:34, h:26, locked:true, unlock:'boss_forest_guardian', base:'sand', theme:'desert' },
  tropical:      { id:'tropical', name:'Tropical Island', w:30, h:22, locked:true, unlock:'boss_storm_spirit', base:'grass', theme:'tropical' },
  crystalcavern: { id:'crystalcavern', name:'Crystal Caverns', w:28, h:22, locked:true, unlock:'boss_crystal_worm', base:'crystal_floor', theme:'crystal' },
  snowmountains: { id:'snowmountains', name:'Snow Mountains', w:32, h:26, locked:true, unlock:'boss_sky_serpent', base:'snow', theme:'snow' },
  volcano:       { id:'volcano', name:'Volcano', w:30, h:24, locked:true, unlock:'boss_volcano_titan', base:'stone_floor', theme:'volcano' },
  floatingisles: { id:'floatingisles', name:'Floating Islands', w:26, h:20, locked:true, unlock:'boss_ancient_machine', base:'grass', theme:'sky' },
  ruins:         { id:'ruins', name:'Ancient Ruins', w:28, h:22, locked:true, unlock:'artifact_10', base:'stone_floor', theme:'ruins' },
};

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; }
  return h;
}

// Generates a deterministic-per-region tile map with scattered features.
export function generateRegion(regionId) {
  const def = REGIONS[regionId];
  const rand = mulberry32(hashStr(regionId) ^ 0x9e3779b9);
  const tiles = [];
  for (let y = 0; y < def.h; y++) {
    const row = [];
    for (let x = 0; x < def.w; x++) row.push(def.base);
    tiles.push(row);
  }
  const objects = [];
  const borderless = (x, y) => x > 1 && y > 1 && x < def.w - 2 && y < def.h - 2;

  // theme-specific features
  if (def.theme === 'farm') {
    // a pond in the corner + patches of dirt
    for (let y = def.h - 6; y < def.h - 2; y++) for (let x = 2; x < 6; x++) tiles[y][x] = TILE.WATER;
  }
  if (def.theme === 'river' || def.theme === 'beach') {
    const bandStart = Math.floor(def.w * 0.4);
    for (let y = 0; y < def.h; y++) for (let x = bandStart; x < bandStart + 5; x++) tiles[y][x] = TILE.WATER;
    if (def.theme === 'beach') {
      for (let y = 0; y < def.h; y++) for (let x = bandStart + 5; x < def.w; x++) tiles[y][x] = TILE.WATER;
    }
  }
  if (def.theme === 'volcano') {
    for (let y = def.h - 5; y < def.h - 1; y++) for (let x = def.w - 8; x < def.w - 2; x++) tiles[y][x] = TILE.LAVA;
  }
  if (def.theme === 'town') {
    for (let y = Math.floor(def.h/2)-1; y <= Math.floor(def.h/2)+1; y++)
      for (let x = 2; x < def.w-2; x++) tiles[y][x] = TILE.PATH;
    for (let x = Math.floor(def.w/2)-1; x <= Math.floor(def.w/2)+1; x++)
      for (let y = 2; y < def.h-2; y++) tiles[y][x] = TILE.PATH;
  }

  const density = { forest: 0.16, mountains: 0.14, desert: 0.06, tropical: 0.14, town: 0.03, farm: 0.04,
    beach: 0.03, river: 0.05, mine: 0.02, crystalcavern: 0.1, snowmountains: 0.12, volcano: 0.1,
    floatingisles: 0.08, ruins: 0.08 }[def.theme] ?? 0.08;

  for (let y = 0; y < def.h; y++) {
    for (let x = 0; x < def.w; x++) {
      if (tiles[y][x] === TILE.WATER || tiles[y][x] === TILE.LAVA || tiles[y][x] === TILE.PATH) continue;
      if (!borderless(x, y)) continue;
      const r = rand();
      if (r < density) {
        let type = OBJECT_TYPES.TREE;
        if (def.theme === 'mountains' || def.theme === 'crystal' || def.theme === 'volcano') type = OBJECT_TYPES.ROCK;
        else if (def.theme === 'desert') type = rand() < 0.5 ? OBJECT_TYPES.ROCK : OBJECT_TYPES.BUSH;
        else if (def.theme === 'snow') type = OBJECT_TYPES.TREE;
        else if (r < density * 0.5) type = OBJECT_TYPES.TREE;
        else if (r < density * 0.8) type = OBJECT_TYPES.ROCK;
        else type = OBJECT_TYPES.BUSH;
        objects.push({ id: `${regionId}_${x}_${y}`, x, y, type, hp: type === OBJECT_TYPES.TREE ? 3 : type === OBJECT_TYPES.ROCK ? 3 : 1, respawnAt: 0 });
      } else if (r < density + 0.03) {
        objects.push({ id: `${regionId}_${x}_${y}`, x, y, type: OBJECT_TYPES.FLOWER, hp: 1, respawnAt: 0 });
      }
    }
  }
  return { def, tiles, objects };
}

// Camera -----------------------------------------------------------------
export class Camera {
  constructor() { this.x = 0; this.y = 0; }
  follow(targetX, targetY, worldW, worldH, viewW, viewH, dt) {
    const desiredX = targetX - viewW / 2;
    const desiredY = targetY - viewH / 2;
    const lerp = Math.min(1, dt * 6);
    this.x += (desiredX - this.x) * lerp;
    this.y += (desiredY - this.y) * lerp;
    const maxX = Math.max(0, worldW - viewW);
    const maxY = Math.max(0, worldH - viewH);
    this.x = Math.max(0, Math.min(maxX, this.x));
    this.y = Math.max(0, Math.min(maxY, this.y));
  }
}

export function tileAt(regionState, x, y) {
  if (y < 0 || x < 0 || y >= regionState.tiles.length || x >= regionState.tiles[0].length) return null;
  return regionState.tiles[y][x];
}

export function isWalkable(regionState, x, y) {
  const t = tileAt(regionState, x, y);
  if (t === null) return false;
  if (t === TILE.WATER || t === TILE.LAVA) return false;
  const obj = regionState.objects.find(o => o.x === x && o.y === y && !o.harvested);
  if (obj && (obj.type === OBJECT_TYPES.TREE || obj.type === OBJECT_TYPES.ROCK)) return false;
  const bld = (regionState.buildings || []).find(b => b.x === x && b.y === y);
  if (bld && bld.solid) return false;
  return true;
}
