// economy.js - supply/demand market simulation, daily & seasonal price changes

import { ITEMS } from './inventory.js';

export function initEconomy() {
  const prices = {};
  for (const [id, def] of Object.entries(ITEMS)) {
    if (def.sell) prices[id] = { base: def.sell, current: def.sell, demand: 1.0 };
  }
  return { prices, lastUpdateDay: 0 };
}

const SEASON_MODIFIERS = {
  spring: { crop: 1.1, fish: 1.0, resource: 1.0 },
  summer: { crop: 1.0, fish: 1.15, resource: 1.0 },
  fall:   { crop: 1.2, fish: 1.05, resource: 1.05 },
  winter: { crop: 0.8, fish: 0.9, resource: 1.2 },
};

export function dailyMarketUpdate(economy, day, season) {
  economy.lastUpdateDay = day;
  const seasonMods = SEASON_MODIFIERS[season] || SEASON_MODIFIERS.spring;
  for (const [id, entry] of Object.entries(economy.prices)) {
    const def = ITEMS[id];
    const mod = seasonMods[def.type] || 1.0;
    const randomFactor = 0.85 + Math.random() * 0.3; // supply/demand noise
    entry.demand = Math.max(0.6, Math.min(1.6, entry.demand + (Math.random() - 0.5) * 0.2));
    entry.current = Math.max(1, Math.round(entry.base * mod * randomFactor * entry.demand));
  }
}

export function getCurrentPrice(economy, itemId) {
  const entry = economy.prices[itemId];
  return entry ? entry.current : (ITEMS[itemId]?.sell || 5);
}

export function sellItem(economy, itemId, qty) {
  const price = getCurrentPrice(economy, itemId);
  const entry = economy.prices[itemId];
  if (entry) entry.demand = Math.max(0.6, entry.demand - 0.01 * qty); // selling lowers future price slightly
  return price * qty;
}

export function buyPrice(economy, itemId) {
  return Math.round(getCurrentPrice(economy, itemId) * 1.8) + 5;
}
