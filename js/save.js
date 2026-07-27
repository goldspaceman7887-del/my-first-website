// save.js - localStorage persistence, defaults, offline-progress simulation

import { createInventory, addItem } from './inventory.js';
import { defaultAppearance, defaultSkills } from './player.js';
import { initEconomy, dailyMarketUpdate } from './economy.js';
import { generateDailyQuests } from './quests.js';
import { growCrops } from './farming.js';
import { rollWeather, getWeatherEffects } from './weather.js';
import { resetDailyCare, updateAnimal } from './animals.js';

export const SAVE_KEY = 'pixelFarmLife_save_v1';
export const TIME_SCALE = 8; // game seconds pass per real second (1 in-game day of 24h = 3 real hours)

export function getDefaultState() {
  const inv = createInventory(30);
  addItem(inv, 'hoe', 1);
  addItem(inv, 'wateringcan', 1);
  addItem(inv, 'axe', 1);
  addItem(inv, 'pickaxe', 1);
  addItem(inv, 'fishingrod', 1);
  addItem(inv, 'seed_carrot', 5);
  addItem(inv, 'seed_potato', 3);

  return {
    version: 1,
    createdAt: Date.now(),
    lastSavedAt: Date.now(),
    player: {
      name: 'Farmer',
      x: 10, y: 10, region: 'farm', facing: 'down',
      appearance: defaultAppearance(),
      gold: 50,
      inventory: inv,
      hotbar: ['hoe', 'wateringcan', 'axe', 'pickaxe', 'fishingrod', 'sword'],
      hotbarIndex: 0,
      skills: defaultSkills(),
      unlockedRegions: ['farm', 'town', 'forest', 'beach', 'river', 'mountains', 'mine'],
      hp: 100,
    },
    time: { totalGameMinutes: 6 * 60, day: 1, season: 'spring', year: 1 },
    weather: { current: 'sunny', forecastKnown: false, tomorrow: null },
    farm: { plots: {} },
    buildings: [
      { id: 'house1', type: 'house', x: 6, y: 6, level: 1 },
      { id: 'barn1', type: 'barn', x: 14, y: 6, level: 1 },
      { id: 'coop1', type: 'coop', x: 18, y: 6, level: 1 },
    ],
    placedCraftables: [],
    animals: [],
    pets: { active: null, owned: [] },
    friendship: {},
    quests: { active: generateDailyQuests(3), completed: [] },
    museum: { donated: [] },
    economy: initEconomy(),
    mutationsDiscovered: [],
    bossesDefeated: [],
    regionObjectsState: {},
    mineDepth: 0,
    flags: {},
  };
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { state: getDefaultState(), isNew: true };
    const state = JSON.parse(raw);
    return { state, isNew: false };
  } catch (e) {
    console.warn('Save corrupted, starting fresh.', e);
    return { state: getDefaultState(), isNew: true };
  }
}

export function saveGame(state) {
  state.lastSavedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Failed to save game', e);
    return false;
  }
}

const SEASONS = ['spring', 'summer', 'fall', 'winter'];
const DAYS_PER_SEASON = 7;

export function advanceCalendar(time) {
  time.day++;
  if (time.day > DAYS_PER_SEASON) {
    time.day = 1;
    const idx = SEASONS.indexOf(time.season);
    time.season = SEASONS[(idx + 1) % SEASONS.length];
    if (time.season === 'spring') time.year++;
  }
}

// Simulates elapsed offline time (capped) so "the world continues while players are offline."
export function applyOfflineProgress(state) {
  const now = Date.now();
  const elapsedRealMs = Math.max(0, now - (state.lastSavedAt || now));
  const cappedRealMs = Math.min(elapsedRealMs, 1000 * 60 * 60 * 24 * 3); // cap at 3 real days
  const gameMinutes = (cappedRealMs / 1000) * (TIME_SCALE / 60); // real-seconds * (game-min per real-sec)
  if (gameMinutes < 1) return { daysPassed: 0, events: [] };

  const startDay = state.time.day;
  let remainingMinutes = gameMinutes;
  const events = [];
  const hoursChunk = 1;
  let totalHoursSimulated = 0;
  const maxHours = 24 * 3;
  while (remainingMinutes > 0 && totalHoursSimulated < maxHours) {
    const stepMinutes = Math.min(60, remainingMinutes);
    state.time.totalGameMinutes += stepMinutes;
    remainingMinutes -= stepMinutes;
    totalHoursSimulated += stepMinutes / 60;

    if (state.time.totalGameMinutes >= 24 * 60) {
      state.time.totalGameMinutes -= 24 * 60;
      advanceCalendar(state.time);
      state.weather.current = rollWeather(state.time.season);
      dailyMarketUpdate(state.economy, state.time.day, state.time.season);
      for (const a of state.animals) resetDailyCare(a);
    }
    const weatherFx = getWeatherEffects(state.weather.current);
    growCrops(state.farm, stepMinutes / 60, {
      weatherMultiplier: weatherFx.growthMultiplier,
      isRaining: ['rain', 'storm', 'rainbowrain'].includes(state.weather.current),
      currentSeason: state.time.season,
    });
    for (const a of state.animals) updateAnimal(a, state.time.totalGameMinutes);
  }
  const daysPassed = totalHoursSimulated / 24;
  if (daysPassed > 0.5) events.push(`While you were away, ${Math.floor(daysPassed)} day(s) passed on the farm.`);
  return { daysPassed, events };
}

export function timeOfDayLabel(totalGameMinutes) {
  const hours = Math.floor(totalGameMinutes / 60) % 24;
  const minutes = Math.floor(totalGameMinutes % 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  let h12 = hours % 12; if (h12 === 0) h12 = 12;
  return `${h12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function partOfDay(totalGameMinutes) {
  const hours = Math.floor(totalGameMinutes / 60) % 24;
  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 18) return 'midday';
  if (hours >= 18 && hours < 22) return 'evening';
  return 'night';
}
