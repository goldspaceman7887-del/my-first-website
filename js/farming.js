// farming.js - crop database, growth, mutation & crossbreeding system

export const CROPS = {
  carrot:     { id:'carrot', name:'Carrot', seed:'seed_carrot', seedCost:8,  growHours:16, sellPrice:20,  seasons:['spring','fall'], stages:4, colors:['#3a5a2a','#4f7a35','#6fae45','#e08a2e'] },
  potato:     { id:'potato', name:'Potato', seed:'seed_potato', seedCost:10, growHours:20, sellPrice:22,  seasons:['spring','fall'], stages:4, colors:['#3a5a2a','#4f7a35','#6fae45','#c9a15a'] },
  corn:       { id:'corn', name:'Corn', seed:'seed_corn', seedCost:16, growHours:32, sellPrice:35,  seasons:['summer'], stages:4, colors:['#3a5a2a','#4f7a35','#7bbf4a','#e8d24a'] },
  tomato:     { id:'tomato', name:'Tomato', seed:'seed_tomato', seedCost:14, growHours:24, sellPrice:30,  seasons:['summer'], stages:4, colors:['#3a5a2a','#4f7a35','#5f9e3a','#d1402e'] },
  pumpkin:    { id:'pumpkin', name:'Pumpkin', seed:'seed_pumpkin', seedCost:24, growHours:48, sellPrice:90,  seasons:['fall'], stages:4, colors:['#3a5a2a','#4f7a35','#7a8f2e','#e07d1e'] },
  blueberry:  { id:'blueberry', name:'Blueberry', seed:'seed_blueberry', seedCost:12, growHours:20, sellPrice:28,  seasons:['summer'], stages:4, colors:['#3a5a2a','#4f7a35','#5f9e3a','#3f4fae'] },
  strawberry: { id:'strawberry', name:'Strawberry', seed:'seed_strawberry', seedCost:14, growHours:18, sellPrice:36,  seasons:['spring'], stages:4, colors:['#3a5a2a','#4f7a35','#5f9e3a','#d1264f'] },
  rice:       { id:'rice', name:'Rice', seed:'seed_rice', seedCost:9,  growHours:22, sellPrice:18,  seasons:['summer'], stages:4, colors:['#3a5a2a','#4f7a35','#8fae4a','#e8e0a0'] },
  wheat:      { id:'wheat', name:'Wheat', seed:'seed_wheat', seedCost:7,  growHours:16, sellPrice:16,  seasons:['fall'], stages:4, colors:['#3a5a2a','#4f7a35','#c9b25a','#e8d27a'] },
  watermelon: { id:'watermelon', name:'Watermelon', seed:'seed_watermelon', seedCost:28, growHours:44, sellPrice:120, seasons:['summer'], stages:4, colors:['#3a5a2a','#4f7a35','#2f8f4a','#2f6f3a'] },
};

// Crossbreed pairs -> mutation id. Order independent (sorted key).
export const CROSSBREEDS = {
  'corn+strawberry': 'candyberry',
  'tomato+pumpkin':  'crimsongourd',
  'blueberry+wheat': 'midnightgrain',
};

export const MUTATIONS = {
  candyberry:    { id:'candyberry', name:'Candy Berry', sellPrice:150, colors:['#d1264f'] },
  crimsongourd:  { id:'crimsongourd', name:'Crimson Gourd', sellPrice:220, colors:['#8f1f1f'] },
  midnightgrain: { id:'midnightgrain', name:'Midnight Grain', sellPrice:180, colors:['#241a4a'] },
  goldencarrot:  { id:'goldencarrot', name:'Golden Carrot', sellPrice:500, ultra:true, colors:['#ffd95f'] },
  crystalberry:  { id:'crystalberry', name:'Crystal Berry', sellPrice:650, ultra:true, colors:['#7bd6d6'] },
  rainbowpumpkin:{ id:'rainbowpumpkin', name:'Rainbow Pumpkin', sellPrice:800, ultra:true, colors:['#ff7fbf'] },
};

const ULTRA_MUTATION_CHANCE = 0.002; // per adjacent mature-pair check per game hour

export function key(x, y) { return `${x},${y}`; }

export function plantSeed(farmState, x, y, seedId, gameMinutes) {
  const cropId = seedId.replace('seed_', '');
  if (!CROPS[cropId]) return false;
  const k = key(x, y);
  if (farmState.plots[k] && farmState.plots[k].cropId) return false;
  farmState.plots[k] = farmState.plots[k] || { tilled: true };
  farmState.plots[k].cropId = cropId;
  farmState.plots[k].stage = 0;
  farmState.plots[k].plantedAt = gameMinutes;
  farmState.plots[k].watered = false;
  farmState.plots[k].mutation = null;
  return true;
}

export function tillTile(farmState, x, y) {
  const k = key(x, y);
  if (farmState.plots[k]) return false;
  farmState.plots[k] = { tilled: true };
  return true;
}

export function waterTile(farmState, x, y) {
  const k = key(x, y);
  const plot = farmState.plots[k];
  if (!plot) return false;
  plot.watered = true;
  plot.wateredAt = Date.now();
  return true;
}

// advances all plots given elapsed game-hours; weatherMultiplier & seasonList affect growth
export function growCrops(farmState, elapsedGameHours, opts = {}) {
  const { weatherMultiplier = 1, isRaining = false, currentSeason = 'spring', hasGreenhouse = false } = opts;
  const events = [];
  for (const k of Object.keys(farmState.plots)) {
    const plot = farmState.plots[k];
    if (!plot.cropId) continue;
    const crop = plot.mutation ? MUTATIONS[plot.mutation] : CROPS[plot.cropId];
    if (!crop) continue;
    if (!plot.watered && !isRaining && !plot.hasSprinkler) continue; // no growth without water
    const growHours = (CROPS[plot.cropId] || {}).growHours || 24;
    const stages = (CROPS[plot.cropId] || {}).stages || 4;
    const hoursPerStage = growHours / stages;
    plot.growthAccum = (plot.growthAccum || 0) + elapsedGameHours * weatherMultiplier;
    while (plot.growthAccum >= hoursPerStage && plot.stage < stages - 1) {
      plot.growthAccum -= hoursPerStage;
      plot.stage++;
      if (plot.stage === stages - 1) events.push({ type: 'ready', x: k, cropId: plot.cropId });
    }
    if (!plot.hasSprinkler) plot.watered = false; // reset daily unless auto-watered
  }
  // mutation discovery pass among mature adjacent plots
  tryMutations(farmState, events);
  return events;
}

function neighborsOf(k) {
  const [x, y] = k.split(',').map(Number);
  return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].map(([nx,ny]) => key(nx, ny));
}

export function tryMutations(farmState, events) {
  const readyKeys = Object.keys(farmState.plots).filter(k => {
    const p = farmState.plots[k];
    return p.cropId && !p.mutation && p.stage >= (CROPS[p.cropId]?.stages || 4) - 1;
  });
  for (const k of readyKeys) {
    const plot = farmState.plots[k];
    for (const nk of neighborsOf(k)) {
      const np = farmState.plots[nk];
      if (!np || !np.cropId || np.mutation || np.cropId === plot.cropId) continue;
      if (np.stage < (CROPS[np.cropId]?.stages || 4) - 1) continue;
      const pairKey = [plot.cropId, np.cropId].sort().join('+');
      const mutId = CROSSBREEDS[pairKey];
      if (mutId && Math.random() < 0.05) {
        plot.mutation = mutId;
        events.push({ type: 'mutation', x: k, mutationId: mutId });
      } else if (Math.random() < ULTRA_MUTATION_CHANCE) {
        const ultraPool = ['goldencarrot', 'crystalberry', 'rainbowpumpkin'];
        plot.mutation = ultraPool[Math.floor(Math.random() * ultraPool.length)];
        events.push({ type: 'ultra_mutation', x: k, mutationId: plot.mutation });
      }
    }
  }
}

export function harvestTile(farmState, x, y) {
  const k = key(x, y);
  const plot = farmState.plots[k];
  if (!plot || !plot.cropId) return null;
  const cropId = plot.mutation || plot.cropId;
  const stages = (CROPS[plot.cropId] || {}).stages || 4;
  if (plot.stage < stages - 1) return null;
  const itemId = 'crop_' + cropId;
  const yieldQty = plot.mutation && MUTATIONS[plot.mutation]?.ultra ? 1 : (1 + (Math.random() < 0.2 ? 1 : 0));
  delete plot.cropId; delete plot.stage; delete plot.mutation; delete plot.growthAccum; delete plot.plantedAt;
  return { itemId, qty: yieldQty };
}

export function cropSellPrice(cropOrMutationId) {
  if (MUTATIONS[cropOrMutationId]) return MUTATIONS[cropOrMutationId].sellPrice;
  if (CROPS[cropOrMutationId]) return CROPS[cropOrMutationId].sellPrice;
  return 10;
}
