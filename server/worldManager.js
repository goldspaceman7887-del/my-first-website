// worldManager.js - authoritative shared game clock, weather, and world events

const SEASONS = ['spring', 'summer', 'fall', 'winter'];
const DAYS_PER_SEASON = 7;
const TIME_SCALE = 8; // game seconds per real second (1 game day of 24h = 3 real hours)

const WEATHER_IDS = ['sunny', 'rain', 'storm', 'snow', 'fog', 'drought', 'rainbowrain', 'meteorshower'];

const WORLD_EVENTS = [
  { id: 'harvest_festival', name: 'Harvest Festival', chance: 0.001 },
  { id: 'fishing_tournament', name: 'Fishing Tournament', chance: 0.001 },
  { id: 'traveling_merchant', name: 'Traveling Merchant', chance: 0.0015 },
  { id: 'meteor_impact', name: 'Meteor Impact', chance: 0.0005 },
  { id: 'treasure_hunt', name: 'Treasure Hunt', chance: 0.001 },
  { id: 'rare_crop_week', name: 'Rare Crop Week', chance: 0.0008 },
  { id: 'market_boom', name: 'Market Boom', chance: 0.001 },
];

export class WorldManager {
  constructor(io, database) {
    this.io = io;
    this.database = database;
    this.state = { day: 1, season: 'spring', totalGameMinutes: 360, weather: 'sunny' };
  }

  async init() {
    const saved = await this.database.getWorldState();
    if (saved) this.state = { day: saved.day, season: saved.season, totalGameMinutes: saved.totalGameMinutes, weather: saved.weather };
    this.lastTick = Date.now();
    setInterval(() => this.tick(), 1000);
    setInterval(() => this.database.saveWorldState(this.state), 15000);
  }

  tick() {
    const now = Date.now();
    const dtSeconds = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.state.totalGameMinutes += dtSeconds * (TIME_SCALE / 60);
    if (this.state.totalGameMinutes >= 24 * 60) {
      this.state.totalGameMinutes -= 24 * 60;
      this.state.day++;
      if (this.state.day > DAYS_PER_SEASON) {
        this.state.day = 1;
        const idx = SEASONS.indexOf(this.state.season);
        this.state.season = SEASONS[(idx + 1) % SEASONS.length];
      }
      this.state.weather = WEATHER_IDS[Math.floor(Math.random() * WEATHER_IDS.length)];
      this.io.emit('world:time', this.state);
    }
    for (const evt of WORLD_EVENTS) {
      if (Math.random() < evt.chance) {
        this.io.emit('world:event', { id: evt.id, name: evt.name, startedAt: Date.now() });
      }
    }
    this.io.volatile.emit('world:time', this.state);
  }

  getState() { return this.state; }
}
