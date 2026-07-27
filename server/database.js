// database.js - MongoDB connection with a graceful in-memory fallback.
// If MONGODB_URI is set and the `mongodb` package is installed, real persistence is used.
// Otherwise the server runs fully functional with an in-memory store, so the game is
// playable immediately without any database setup.

let client = null;
let db = null;
let usingMongo = false;

const memory = {
  players: new Map(),      // name -> player doc
  guilds: new Map(),       // name -> guild doc
  marketListings: new Map(), // id -> listing
  worldState: { day: 1, season: 'spring', totalGameMinutes: 360, weather: 'sunny' },
};

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[database] No MONGODB_URI set — using in-memory store (fully functional, non-persistent).');
    return false;
  }
  try {
    const { MongoClient } = await import('mongodb');
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'pixel_farm_life');
    usingMongo = true;
    console.log('[database] Connected to MongoDB.');
    return true;
  } catch (e) {
    console.warn('[database] Could not connect to MongoDB, falling back to in-memory store:', e.message);
    usingMongo = false;
    return false;
  }
}

async function savePlayer(name, doc) {
  if (usingMongo) {
    await db.collection('players').updateOne({ name }, { $set: doc }, { upsert: true });
  } else {
    memory.players.set(name, doc);
  }
}

async function getPlayer(name) {
  if (usingMongo) return db.collection('players').findOne({ name });
  return memory.players.get(name) || null;
}

async function getAllPlayers() {
  if (usingMongo) return db.collection('players').find({}).toArray();
  return Array.from(memory.players.values());
}

async function saveGuild(name, doc) {
  if (usingMongo) await db.collection('guilds').updateOne({ name }, { $set: doc }, { upsert: true });
  else memory.guilds.set(name, doc);
}
async function getGuild(name) {
  if (usingMongo) return db.collection('guilds').findOne({ name });
  return memory.guilds.get(name) || null;
}
async function getAllGuilds() {
  if (usingMongo) return db.collection('guilds').find({}).toArray();
  return Array.from(memory.guilds.values());
}

async function upsertMarketListing(listing) {
  if (usingMongo) await db.collection('market').updateOne({ id: listing.id }, { $set: listing }, { upsert: true });
  else memory.marketListings.set(listing.id, listing);
}
async function removeMarketListing(id) {
  if (usingMongo) await db.collection('market').deleteOne({ id });
  else memory.marketListings.delete(id);
}
async function getAllMarketListings() {
  if (usingMongo) return db.collection('market').find({}).toArray();
  return Array.from(memory.marketListings.values());
}

async function saveWorldState(worldState) {
  if (usingMongo) await db.collection('world').updateOne({ _id: 'singleton' }, { $set: worldState }, { upsert: true });
  else Object.assign(memory.worldState, worldState);
}
async function getWorldState() {
  if (usingMongo) return db.collection('world').findOne({ _id: 'singleton' });
  return memory.worldState;
}

function isUsingMongo() { return usingMongo; }

export default {
  connect, savePlayer, getPlayer, getAllPlayers,
  saveGuild, getGuild, getAllGuilds,
  upsertMarketListing, removeMarketListing, getAllMarketListings,
  saveWorldState, getWorldState, isUsingMongo,
};
