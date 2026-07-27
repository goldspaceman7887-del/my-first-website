// crafting.js - recipes, crafted-object placement, automation ticking

export const RECIPES = {
  sprinkler: { id:'sprinkler', name:'Sprinkler', icon:'💧', requires:{ wood:5, iron:2 }, craftingLevel:1, result:'sprinkler' },
  scarecrow: { id:'scarecrow', name:'Scarecrow', icon:'🎌', requires:{ wood:8, fiber:4 }, craftingLevel:1, result:'scarecrow' },
  chest:     { id:'chest', name:'Storage Chest', icon:'📦', requires:{ wood:20 }, craftingLevel:1, result:'chest' },
  furnace:   { id:'furnace', name:'Furnace', icon:'🔥', requires:{ stone:25, copper:5 }, craftingLevel:2, result:'furnace' },
  generator: { id:'generator', name:'Generator', icon:'🔋', requires:{ iron:10, coal:15 }, craftingLevel:4, result:'generator' },
  drone:     { id:'drone', name:'Farm Drone', icon:'🛸', requires:{ iron:15, gold_ore:5, crystalore:3 }, craftingLevel:6, result:'drone' },
  harvester: { id:'harvester', name:'Auto Harvester', icon:'🤖', requires:{ bar_iron:10, bar_gold:5, diamond:2 }, craftingLevel:8, result:'harvester' },
  bar_copper:{ id:'bar_copper', name:'Smelt Copper Bar', icon:'🟧', requires:{ copper:3, coal:1 }, craftingLevel:1, result:'bar_copper', needsFurnace:true },
  bar_iron:  { id:'bar_iron', name:'Smelt Iron Bar', icon:'⬜', requires:{ iron:3, coal:1 }, craftingLevel:2, result:'bar_iron', needsFurnace:true },
  bar_gold:  { id:'bar_gold', name:'Smelt Gold Bar', icon:'🟨', requires:{ gold_ore:3, coal:2 }, craftingLevel:3, result:'bar_gold', needsFurnace:true },
};

import { hasItems, removeItems, addItem } from './inventory.js';

export function canCraft(inv, recipeId, craftingLevel, hasFurnace) {
  const r = RECIPES[recipeId];
  if (!r) return false;
  if (craftingLevel < r.craftingLevel) return false;
  if (r.needsFurnace && !hasFurnace) return false;
  return hasItems(inv, r.requires);
}

export function craftItem(inv, recipeId) {
  const r = RECIPES[recipeId];
  if (!r) return false;
  if (!hasItems(inv, r.requires)) return false;
  removeItems(inv, r.requires);
  addItem(inv, r.result, 1);
  return true;
}

// Automation ticking - called once per game-hour with list of placed objects on farm
export function updateAutomation(placedObjects, farmState, gameHourNow) {
  const events = [];
  for (const obj of placedObjects) {
    if (obj.type === 'sprinkler') {
      // auto-water 3x3 area around sprinkler each morning tick
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const k = `${obj.x+dx},${obj.y+dy}`;
        if (farmState.plots[k]) { farmState.plots[k].watered = true; farmState.plots[k].hasSprinkler = true; }
      }
    }
    if (obj.type === 'harvester') {
      for (const k of Object.keys(farmState.plots)) {
        const plot = farmState.plots[k];
        if (plot.cropId && plot.stage >= 3) events.push({ type: 'auto_harvest', key: k });
      }
    }
    if (obj.type === 'generator') {
      obj.power = (obj.power || 0) + 1;
    }
  }
  return events;
}
