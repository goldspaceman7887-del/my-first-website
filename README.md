# Pixel Farm Life

A complete pixel-art farming adventure game — farming, mining, fishing,
crafting, animals, pets, villagers, quests, bosses, exploration, and
real-time multiplayer — playable directly in the browser, with full
mobile touch support.

## Play instantly (singleplayer, no setup)

Just open `index.html` in a browser (or serve the folder with any static
file server). The game runs entirely client-side, auto-saves to
`localStorage`, and auto-loads your save on return. No login, no accounts,
no passwords.

```bash
npx serve .
# or simply double-click index.html
```

## Play with multiplayer (guilds, chat, global market, other players)

Run the included Node.js backend. It serves the same frontend *and* powers
real-time multiplayer via Socket.io. MongoDB is optional — without it the
server runs on an in-memory store so it works immediately with zero config.

```bash
npm install
npm start
# open http://localhost:3000
```

To persist players/guilds/market across restarts, set a MongoDB connection
string before starting:

```bash
MONGODB_URI="mongodb://localhost:27017" npm start
```

## Controls

- **Move:** WASD / Arrow keys, or the on-screen joystick on touch devices
- **Use tool / plant / place:** Space or the ⚡ button
- **Interact / talk / harvest / collect:** E or the ✋ button
- **Menus:** I (Inventory), C (Crafting), M (Map), Q (Quests), Tab (Social)
- **Hotbar:** number keys 1-6, or tap a slot

## Systems included

Farming with 10 crops + crossbreed/ultra-rare mutations, day/night cycle
(1 day = 3 real hours, world keeps advancing offline), 4 seasons, 8 weather
types, animals & pets, 15 villagers with schedules/dialogue/friendship,
procedural daily quests, crafting & farm automation, underground mining
across 6 depth layers, a fishing timing minigame, a dynamic economy, 6
bosses that unlock new regions, a museum collection, and a Socket.io
multiplayer layer with chat, guilds, trading, a global marketplace, world
events, and leaderboards.

## File structure

```
index.html
css/style.css
js/
  game.js        main loop, rendering, input, orchestration
  player.js      player entity, skills, appearance
  inventory.js   item database + inventory ops
  farming.js     crops, growth, crossbreeding/mutations
  weather.js     weather types + particle rendering
  animals.js     farm animals + pets
  world.js       regions, tile generation, camera
  villagers.js   NPCs, schedules, dialogue, friendship
  quests.js      procedural quest generation/tracking
  crafting.js    recipes + automation
  fishing.js     fish database + minigame
  mining.js      underground layers + ore generation
  economy.js     dynamic market pricing
  bosses.js      boss encounters
  multiplayer.js Socket.io client (optional, degrades gracefully)
  ui.js          DOM UI: HUD, panels, touch controls
  save.js        localStorage persistence + offline progress
server/
  index.js          Express + Socket.io entry point
  socketManager.js   real-time event handling
  worldManager.js    shared server-side game clock & world events
  farmManager.js     farm visits
  guildManager.js    guild chat/storage/projects
  tradeManager.js    player-to-player trading
  marketplace.js     global real-time marketplace
  database.js        MongoDB (optional) with in-memory fallback
```
