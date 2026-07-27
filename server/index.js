// index.js - Express + Socket.io server for Pixel Farm Life.
// Serves the static frontend and powers real-time multiplayer, the world clock,
// guilds, trading, and the global marketplace. MongoDB is optional (see database.js).

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

import database from './database.js';
import { WorldManager } from './worldManager.js';
import { setupSocketManager } from './socketManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.static(ROOT_DIR));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, usingMongo: database.isUsingMongo(), time: Date.now() });
});

app.get('/api/world', (req, res) => {
  res.json(worldManager.getState());
});

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

const worldManager = new WorldManager(io, database);

async function start() {
  await database.connect();
  await worldManager.init();
  setupSocketManager(io, database, worldManager);
  server.listen(PORT, () => {
    console.log(`Pixel Farm Life server running at http://localhost:${PORT}`);
    console.log(`MongoDB: ${database.isUsingMongo() ? 'connected' : 'not configured (using in-memory store)'}`);
  });
}

start();
