// game.js - main entry point: game loop, rendering, input, and system orchestration

import * as World from './world.js';
import { ITEMS, createInventory, addItem, removeItem, hasItem, countItem } from './inventory.js';
import { CROPS, MUTATIONS, plantSeed, tillTile, waterTile, growCrops, harvestTile, key as plotKey } from './farming.js';
import { WEATHER, rollWeather, getWeatherEffects, WeatherParticles } from './weather.js';
import { ANIMAL_TYPES, PET_TYPES, createAnimal, updateAnimal, feedAnimal, waterAnimal, resetDailyCare, createPet, petTick } from './animals.js';
const PET_COST = 200;
import { VILLAGERS, getDialogue, getSchedulePosition, giftVillager, getHearts, unlocksForHearts } from './villagers.js';
import { generateDailyQuests, updateQuestProgress, claimReward } from './quests.js';
import { RECIPES, canCraft, craftItem, updateAutomation } from './crafting.js';
import { possibleFish, rollFish, createMinigame, updateMinigame } from './fishing.js';
import { generateMineFloor, mineWallAt, rollEncounter } from './mining.js';
import { dailyMarketUpdate, getCurrentPrice, sellItem, buyPrice } from './economy.js';
import { BOSSES, startBossFight, attackBoss, getBossDef } from './bosses.js';
import { Player, addSkillXp, xpForNextLevel } from './player.js';
import * as Save from './save.js';
import * as MP from './multiplayer.js';
import * as UI from './ui.js';

// ============================================================
// BOOT
// ============================================================
UI.setBootProgress(15);
const { state, isNew } = Save.loadGame();
UI.setBootProgress(45);
const offlineResult = Save.applyOfflineProgress(state);
UI.setBootProgress(70);

// ensure structural fields exist (in case of older saves)
state.placedCraftables = state.placedCraftables || [];
state.mineDepth = state.mineDepth || 0;
state.flags = state.flags || {};
state.mutationsDiscovered = state.mutationsDiscovered || [];
state.bossesDefeated = state.bossesDefeated || [];
state.regionObjectsState = state.regionObjectsState || {};

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const camera = new World.Camera();
const player = new Player(state.player);
const weatherParticles = new WeatherParticles();

// Fixed town fixtures (shops/museum) - not saved, always present
const TOWN_BUILDINGS = [
  { type: 'shop_general', x: 15, y: 10, label: 'General Store' },
  { type: 'shop_blacksmith', x: 19, y: 10, label: 'Blacksmith' },
  { type: 'museum', x: 23, y: 10, label: 'Museum' },
];
const MINE_SHAFT = { x: 10, y: 8 };

const regionCache = {};
function getRegionState(regionId) {
  if (!regionCache[regionId]) {
    regionCache[regionId] = World.generateRegion(regionId);
    const savedObjState = state.regionObjectsState[regionId];
    if (savedObjState) {
      for (const obj of regionCache[regionId].objects) {
        if (savedObjState[obj.id]) Object.assign(obj, savedObjState[obj.id]);
      }
    }
    if (regionId === 'town') regionCache[regionId].buildings = TOWN_BUILDINGS.map(b => ({ ...b, solid: true }));
    if (regionId === 'mine') regionCache[regionId].buildings = [{ type: 'mine_shaft', x: MINE_SHAFT.x, y: MINE_SHAFT.y, solid: false, label: 'Mine Shaft' }];
    if (regionId === 'farm') regionCache[regionId].buildings = state.buildings;
  }
  return regionCache[regionId];
}

function persistRegionObjectState(regionId) {
  const rs = regionCache[regionId];
  if (!rs) return;
  const snap = {};
  for (const obj of rs.objects) {
    if (obj.harvested || obj.hp !== undefined) snap[obj.id] = { harvested: !!obj.harvested, hp: obj.hp, respawnAt: obj.respawnAt };
  }
  state.regionObjectsState[regionId] = snap;
}

// ============================================================
// INPUT
// ============================================================
const keys = {};
const joyVec = { x: 0, y: 0 };
let useHeld = false;

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (UI.isAnyPanelOpen()) {
    if (e.key === 'Escape') UI.closePanel();
    return;
  }
  if (e.key === 'Escape') { UI.closePanel(); return; }
  if (e.key.toLowerCase() === 'e') performInteract();
  if (e.key === ' ' || e.key.toLowerCase() === 'f') { useHeld = true; performUse(); }
  if (e.key.toLowerCase() === 'i') openPanelByName('inventory');
  if (e.key.toLowerCase() === 'c') openPanelByName('crafting');
  if (e.key.toLowerCase() === 'm') openPanelByName('map');
  if (e.key.toLowerCase() === 'q') openPanelByName('quests');
  if (e.key === 'Tab') { e.preventDefault(); openPanelByName('social'); }
  if (['1','2','3','4','5','6'].includes(e.key)) selectHotbar(parseInt(e.key, 10) - 1);
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  if (e.key === ' ' || e.key.toLowerCase() === 'f') useHeld = false;
});

function currentMoveVector() {
  let x = 0, y = 0;
  if (keys['arrowleft'] || keys['a']) x -= 1;
  if (keys['arrowright'] || keys['d']) x += 1;
  if (keys['arrowup'] || keys['w']) y -= 1;
  if (keys['arrowdown'] || keys['s']) y += 1;
  if (x === 0 && y === 0) { x = joyVec.x; y = joyVec.y; }
  return { x, y };
}

// ============================================================
// UI HANDLERS
// ============================================================
function openPanelByName(name) {
  if (name === 'inventory') UI.renderInventory(state);
  if (name === 'crafting') UI.renderCrafting(state, (id) => canCraft(state.player.inventory, id, state.player.skills.crafting.level, hasFurnace()));
  if (name === 'map') UI.renderMap(state);
  if (name === 'quests') UI.renderQuests(state);
  if (name === 'museum') UI.renderMuseum(state);
  if (name === 'character') UI.renderCharacterPanel(state, drawCharPreview);
  if (name === 'social') { UI.renderPlayersList(lastPlayers); UI.renderFriendsList(state.flags.friends || []); UI.renderGuildPanel(lastGuild); UI.renderMarket(lastMarket); UI.renderLeaderboard(lastLeaderboard); }
  UI.openPanel(name);
}
function hasFurnace() { return state.placedCraftables.some(c => c.type === 'furnace'); }

let lastPlayers = [], lastGuild = null, lastMarket = [], lastLeaderboard = null;
let giftMode = false;

UI.initUI({
  onOpenPanel: (name) => openPanelByName(name),
  onPanelClosed: () => { giftMode = false; },
  onSelectHotbar: (i) => selectHotbar(i),
  onEquipTool: (id) => { const idx = state.player.hotbar.indexOf(id); if (idx >= 0) selectHotbar(idx); },
  onInventoryItemClick: (itemId) => {
    if (giftMode) { doGiftToVillager(itemId); return; }
    const def = ITEMS[itemId];
    if (def.type === 'seed') { state.flags.activeSeed = itemId; state.flags.activePlaceable = null; UI.showToast(`Selected ${def.name}. Use ⚡ on tilled soil to plant.`); UI.closePanel(); }
    else if (def.type === 'placeable') { state.flags.activePlaceable = itemId; state.flags.activeSeed = null; UI.showToast(`Selected ${def.name}. Use ⚡ to place it.`); UI.closePanel(); }
  },
  onCraft: (recipeId) => { if (craftItem(state.player.inventory, recipeId)) { addSkillXp(state.player.skills, 'crafting', 12); UI.showToast(`Crafted ${RECIPES[recipeId].name}!`); questEvent('craft', RECIPES[recipeId].result, 1); UI.renderCrafting(state, (id) => canCraft(state.player.inventory, id, state.player.skills.crafting.level, hasFurnace())); UI.renderInventory(state); } },
  onTravel: (regionId) => travelTo(regionId),
  onClaimQuest: (questId) => {
    const q = state.quests.active.find(q => q.id === questId);
    const reward = claimReward(q);
    if (reward) { state.player.gold += reward.gold; UI.showToast(`Quest complete! +${reward.gold}g`); UI.renderQuests(state); UI.renderHUD(state); }
  },
  onDonate: (itemId) => { removeItem(state.player.inventory, itemId, 1); state.museum.donated.push(itemId); state.player.gold += 20; questEvent('donate', itemId, 1); UI.showToast('Donated! Museum grows.'); UI.renderMuseum(state); UI.renderHUD(state); },
  onSendChat: (text) => { MP.sendChat(text); UI.appendChatMessage(state.player.name, text, true); },
  onGuildCreate: (name) => name && MP.requestGuildCreate(name),
  onGuildJoin: (name) => name && MP.requestGuildJoin(name),
  onMarketBuy: (listingId) => MP.buyFromMarket(listingId),
  onCustomize: (part, value) => { if (part === 'name') state.player.name = value || 'Farmer'; else state.player.appearance[part] = value; UI.renderCharacterPanel(state, drawCharPreview); },
  onShopTransact: (itemId, mode) => shopTransact(itemId, mode),
  onBossAttack: () => bossAttack(),
  onBossFlee: () => { activeBossFight = null; UI.closePanel(); },
  onJoystick: (x, y) => { joyVec.x = x; joyVec.y = y; },
  onUsePressed: () => { useHeld = true; performUse(); },
  onInteractPressed: () => performInteract(),
  onJumpPressed: () => performInteract(),
});

function selectHotbar(i) {
  if (i < 0 || i >= state.player.hotbar.length) return;
  state.player.hotbarIndex = i;
  state.flags.activeSeed = null;
  state.flags.activePlaceable = null;
  UI.renderHotbar(state);
}

function drawCharPreview() {
  const c = document.getElementById('char-preview');
  const cx = c.getContext('2d');
  cx.imageSmoothingEnabled = false;
  cx.clearRect(0, 0, c.width, c.height);
  cx.fillStyle = '#12261b'; cx.fillRect(0, 0, c.width, c.height);
  const fakePlayer = new Player({ x: 0, y: 0, facing: 'down' });
  fakePlayer.pixelX = 0; fakePlayer.pixelY = 0;
  fakePlayer.draw(cx, c.width / 2, c.height - 20, state.player.appearance);
}

// ============================================================
// ACTIONS
// ============================================================
function facingTile() {
  const off = player.facing === 'up' ? [0,-1] : player.facing === 'down' ? [0,1] : player.facing === 'left' ? [-1,0] : [1,0];
  return { x: player.tileX + off[0], y: player.tileY + off[1] };
}

function performUse() {
  if (UI.isAnyPanelOpen() && !fishing.active) return;
  if (mineMode.active) { mineUse(); return; }
  if (activeBossFight) { return; }
  const region = state.player.region;
  const ft = facingTile();
  const rs = getRegionState(region);

  if (fishing.active) return; // handled by hold loop

  if (state.flags.activePlaceable) { placeObjectAt(ft); return; }
  if (state.flags.activeSeed) { plantAt(ft); return; }

  const toolId = state.player.hotbar[state.player.hotbarIndex];
  const obj = rs.objects.find(o => o.x === ft.x && o.y === ft.y && !o.harvested);

  if (toolId === 'axe' && obj && obj.type === World.OBJECT_TYPES.TREE) { chopObject(obj, region); return; }
  if (toolId === 'pickaxe' && obj && obj.type === World.OBJECT_TYPES.ROCK) { mineSurfaceRock(obj, region); return; }
  if (toolId === 'hoe' && region === 'farm') { if (tillTile(state.farm, ft.x, ft.y)) { UI.showToast('Tilled soil.'); } return; }
  if (toolId === 'wateringcan' && region === 'farm') { if (waterTile(state.farm, ft.x, ft.y)) { UI.showToast('Watered!'); } return; }
  if (toolId === 'fishingrod') {
    const tile = World.tileAt(rs, ft.x, ft.y);
    if (tile === World.TILE.WATER) { startFishing(); return; }
  }
  if (toolId === 'sword' && obj && obj.type === World.OBJECT_TYPES.BUSH) { foragingHarvest(obj, region); return; }
  UI.showToast("Nothing to do here.");
}

function performInteract() {
  if (UI.isAnyPanelOpen()) return;
  if (activeBossFight) return;
  if (mineMode.active) { mineInteract(); return; }
  const region = state.player.region;
  const ft = facingTile();
  const rs = getRegionState(region);

  // NPC
  const npc = visibleNpcs.find(n => n.region === region && n.x === ft.x && n.y === ft.y);
  if (npc) { talkToVillager(npc.villagerId); return; }

  // Buildings
  const bld = (rs.buildings || []).find(b => b.x === ft.x && b.y === ft.y);
  if (bld) {
    if (bld.type === 'shop_general') { openGeneralStore(); return; }
    if (bld.type === 'shop_blacksmith') { openBlacksmith(); return; }
    if (bld.type === 'museum') { openPanelByName('museum'); return; }
    if (bld.type === 'mine_shaft') { enterMine(); return; }
    if (bld.type === 'coop' || bld.type === 'barn') { tendAnimalsIn(bld.type); return; }
  }

  // Farm: harvest ready crop
  if (region === 'farm') {
    const result = harvestTile(state.farm, ft.x, ft.y);
    if (result) {
      addItem(state.player.inventory, result.itemId, result.qty);
      addSkillXp(state.player.skills, 'farming', 10);
      const cropId = result.itemId.replace('crop_', '');
      questEvent('grow', cropId, result.qty);
      if (MUTATIONS[cropId] && !state.mutationsDiscovered.includes(cropId)) { state.mutationsDiscovered.push(cropId); UI.showToast(`New mutation discovered: ${MUTATIONS[cropId].name}!`); }
      UI.showToast(`Harvested ${ITEMS[result.itemId].name}!`);
      UI.renderHUD(state);
      return;
    }
  }

  // foraging bushes / flowers
  const obj = rs.objects.find(o => o.x === ft.x && o.y === ft.y && !o.harvested);
  if (obj && (obj.type === World.OBJECT_TYPES.FLOWER || obj.type === World.OBJECT_TYPES.BUSH)) { foragingHarvest(obj, region); return; }

  // animals
  const animal = state.animals.find(a => a.x === ft.x && a.y === ft.y);
  if (animal) { interactAnimal(animal); return; }

  UI.showToast('Nothing to interact with.');
}

function plantAt(ft) {
  const plot = state.farm.plots[plotKey(ft.x, ft.y)];
  if (!plot || !plot.tilled) { UI.showToast('You need tilled soil to plant.'); return; }
  const seedId = state.flags.activeSeed;
  if (!hasItem(state.player.inventory, seedId, 1)) { UI.showToast('Out of seeds!'); state.flags.activeSeed = null; return; }
  if (plantSeed(state.farm, ft.x, ft.y, seedId, state.time.totalGameMinutes)) {
    removeItem(state.player.inventory, seedId, 1);
    UI.showToast('Planted!');
    UI.renderHotbar(state);
    if (!hasItem(state.player.inventory, seedId, 1)) state.flags.activeSeed = null;
  } else UI.showToast('Something is already planted there.');
}

function placeObjectAt(ft) {
  const itemId = state.flags.activePlaceable;
  const def = ITEMS[itemId];
  if (!hasItem(state.player.inventory, itemId, 1)) { state.flags.activePlaceable = null; return; }
  if (def.type === 'building_blueprint') {
    if (state.player.region !== 'farm') { UI.showToast('Return to your farm to build this.'); return; }
    state.buildings.push({ id: itemId + '_' + Date.now(), type: itemId, x: ft.x, y: ft.y, level: 1 });
    removeItem(state.player.inventory, itemId, 1);
    UI.showToast(`Built ${def.name}!`);
  } else {
    state.placedCraftables.push({ id: itemId + '_' + Date.now(), type: itemId, x: ft.x, y: ft.y, region: state.player.region, power: 0 });
    removeItem(state.player.inventory, itemId, 1);
    UI.showToast(`Placed ${def.name}!`);
  }
  state.flags.activePlaceable = null;
}

function chopObject(obj, region) {
  obj.hp -= 1;
  addSkillXp(state.player.skills, 'foraging', 3);
  if (obj.hp <= 0) {
    obj.harvested = true;
    obj.respawnAt = state.time.totalGameMinutes + 60 * 24 * 2;
    addItem(state.player.inventory, 'wood', 3 + Math.floor(Math.random() * 3));
    UI.showToast('Chopped down a tree! +wood');
  } else UI.showToast('Chop!');
  persistRegionObjectState(region);
}
function mineSurfaceRock(obj, region) {
  obj.hp -= 1;
  addSkillXp(state.player.skills, 'mining', 3);
  if (obj.hp <= 0) {
    obj.harvested = true;
    obj.respawnAt = state.time.totalGameMinutes + 60 * 24 * 2;
    addItem(state.player.inventory, 'stone', 2 + Math.floor(Math.random() * 3));
    if (Math.random() < 0.15) addItem(state.player.inventory, 'coal', 1);
    UI.showToast('Broke a rock! +stone');
    questEvent('mine', 'stone', 1);
  } else UI.showToast('Mine!');
  persistRegionObjectState(region);
}
function foragingHarvest(obj, region) {
  obj.harvested = true;
  obj.respawnAt = state.time.totalGameMinutes + 60 * 12;
  const night = Save.partOfDay(state.time.totalGameMinutes) === 'night';
  addSkillXp(state.player.skills, 'foraging', 4);
  if (night && Math.random() < 0.3) { addItem(state.player.inventory, Math.random() < 0.5 ? 'bug_firefly' : 'bug_beetle', 1); UI.showToast('Caught a bug for the museum!'); }
  else { addItem(state.player.inventory, 'fiber', 1 + Math.floor(Math.random()*2)); UI.showToast('Foraged fiber.'); }
  persistRegionObjectState(region);
}

// ============================================================
// VILLAGERS
// ============================================================
let visibleNpcs = [];
function updateNpcSchedules() {
  const hour = Math.floor(state.time.totalGameMinutes / 60) % 24;
  visibleNpcs = VILLAGERS.map(v => {
    const pos = getSchedulePosition(v, hour);
    return { villagerId: v.id, name: v.name, region: pos.region, x: pos.x, y: pos.y, activity: pos.activity };
  });
}
function talkToVillager(villagerId) {
  const v = VILLAGERS.find(v => v.id === villagerId);
  const hearts = getHearts(state.friendship, villagerId);
  const line = getDialogue(villagerId);
  UI.showDialogue(`${v.name} (${'♥'.repeat(hearts)}${'♡'.repeat(Math.max(0,5-hearts))})`, line, [
    { label: '🎁 Give Gift', action: () => { giftMode = true; UI.hideDialogue(); openPanelByName('inventory'); UI.showToast('Choose an item to gift.'); } },
  ]);
}
function doGiftToVillager(itemId) {
  const lastTalked = state.flags.lastTalkedVillager;
  if (!lastTalked) { giftMode = false; return; }
  const result = giftVillager(state.friendship, lastTalked, itemId);
  removeItem(state.player.inventory, itemId, 1);
  const reactions = { loved: 'loves this!', liked: 'likes this.', disliked: "isn't a fan of this...", neutral: 'accepts it politely.', already_gifted: 'You already gave a gift today.' };
  UI.showToast(`They ${reactions[result.reaction] || 'accept it.'}`);
  giftMode = false;
  UI.closePanel();
}

// ============================================================
// ANIMALS
// ============================================================
function tendAnimalsIn(buildingType) {
  const targetSpecies = buildingType === 'coop' ? ['chicken', 'duck'] : ['cow', 'sheep', 'goat'];
  const relevant = state.animals.filter(a => targetSpecies.includes(a.type));
  if (relevant.length === 0) { UI.showToast(`No animals in the ${buildingType} yet. Buy some at the General Store!`); return; }
  relevant.forEach(a => { feedAnimal(a); waterAnimal(a); });
  UI.showToast(`Fed and watered ${relevant.length} animal(s).`);
}
function interactAnimal(animal) {
  feedAnimal(animal); waterAnimal(animal);
  UI.showToast(`${ANIMAL_TYPES[animal.type].name} happiness: ${animal.happiness}%`);
}

// ============================================================
// SHOPS
// ============================================================
function openGeneralStore() {
  const seedItems = Object.values(CROPS).map(c => ({ id: c.seed, price: c.seedCost }));
  const blueprintItems = ['greenhouse','workshop','warehouse','marketstall','windmill'].map(id => ({ id, price: ITEMS[id].buy }));
  const animalItems = Object.entries(ANIMAL_TYPES).map(([id, def]) => ({ id: 'animal_' + id, price: def.cost }));
  const petItems = state.pets.active ? [] : ['pet_dog','pet_cat','pet_fox','pet_crow','pet_robot'].map(id => ({ id, price: ITEMS[id].buy }));
  UI.openShop('General Store', [...seedItems, ...blueprintItems, ...animalItems, ...petItems], state, 'buy_general');
  state.flags.shopMode = 'general';
}
function openBlacksmith() {
  const toolUpgrades = [{ id: 'sword', price: 250 }];
  const sellables = ['stone','coal','copper','iron','gold_ore','diamond','crystalore'].map(id => ({ id, price: buyPrice(state.economy, id) }));
  UI.openShop('Blacksmith', [...toolUpgrades, ...sellables], state, 'buy_blacksmith');
  state.flags.shopMode = 'blacksmith';
}
function shopTransact(itemId, mode) {
  if (itemId.startsWith('pet_')) {
    const type = itemId.replace('pet_', '');
    const cost = ITEMS[itemId].buy;
    if (state.pets.active) { UI.showToast('You already have a pet!'); return; }
    if (state.player.gold < cost) { UI.showToast('Not enough gold.'); return; }
    state.player.gold -= cost;
    state.pets.active = createPet(type);
    state.pets.owned.push(type);
    UI.showToast(`Adopted a ${PET_TYPES[type].name}! Ability: ${PET_TYPES[type].ability}`);
    UI.renderHUD(state);
    return;
  }
  if (itemId.startsWith('animal_')) {
    const type = itemId.replace('animal_', '');
    const cost = ANIMAL_TYPES[type].cost;
    if (state.player.gold < cost) { UI.showToast('Not enough gold.'); return; }
    state.player.gold -= cost;
    state.animals.push(createAnimal(type, type + '_' + Date.now(), 15 + state.animals.length % 4, 6));
    UI.showToast(`Bought a ${ANIMAL_TYPES[type].name}!`);
    UI.renderHUD(state);
    return;
  }
  const def = ITEMS[itemId];
  const price = def.buy || (CROPS[def.crop]?.seedCost) || buyPrice(state.economy, itemId);
  if (state.player.gold < price) { UI.showToast('Not enough gold.'); return; }
  state.player.gold -= price;
  addItem(state.player.inventory, itemId, 1);
  UI.showToast(`Bought ${def.name}!`);
  UI.renderHUD(state);
  UI.renderInventory(state);
}

// ============================================================
// MINING
// ============================================================
const mineMode = { active: false, floorState: null };
function enterMine() {
  state.mineDepth = Math.max(1, state.mineDepth);
  mineMode.floorState = generateMineFloor(state.mineDepth);
  mineMode.active = true;
  player.pixelX = mineMode.floorState.start.x * World.TILE_SIZE;
  player.pixelY = mineMode.floorState.start.y * World.TILE_SIZE;
  ensureMineExitButton(true);
  UI.showToast(`Descending to depth ${state.mineDepth} (${mineMode.floorState.layer.name})`);
}
function exitMine() {
  mineMode.active = false;
  player.pixelX = MINE_SHAFT.x * World.TILE_SIZE;
  player.pixelY = (MINE_SHAFT.y + 1) * World.TILE_SIZE;
  ensureMineExitButton(false);
}
function ensureMineExitButton(show) {
  let btn = document.getElementById('mine-exit-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'mine-exit-btn';
    btn.className = 'hud-panel';
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    btn.textContent = '⬆ Exit Mine';
    btn.onclick = exitMine;
    document.getElementById('hud-top').appendChild(btn);
  }
  btn.classList.toggle('hidden', !show);
}
function mineUse() {
  const toolId = state.player.hotbar[state.player.hotbarIndex];
  if (toolId !== 'pickaxe') { UI.showToast('Equip your pickaxe.'); return; }
  const ft = facingTile();
  const tier = 4; // base pickaxe can mine all tiers in this simplified model
  const result = mineWallAt(mineMode.floorState, ft.x, ft.y, tier);
  if (!result) { UI.showToast('Nothing to mine there.'); return; }
  if (result.blocked) { UI.showToast('Too tough for your pickaxe!'); return; }
  addItem(state.player.inventory, result.itemId, result.qty);
  addSkillXp(state.player.skills, 'mining', 5);
  questEvent('mine', result.itemId, result.qty);
  UI.showToast(`Mined ${ITEMS[result.itemId]?.name || result.itemId}!`);
  const encounter = rollEncounter(state.mineDepth);
  if (encounter) startSlimeFight(encounter);
}
function mineInteract() {
  const ft = facingTile();
  if (ft.x === mineMode.floorState.ladder.x && ft.y === mineMode.floorState.ladder.y) {
    state.mineDepth++;
    mineMode.floorState = generateMineFloor(state.mineDepth);
    player.pixelX = mineMode.floorState.start.x * World.TILE_SIZE;
    player.pixelY = mineMode.floorState.start.y * World.TILE_SIZE;
    UI.showToast(`Descending to depth ${state.mineDepth} (${mineMode.floorState.layer.name})`);
  } else if (player.tileX === mineMode.floorState.start.x && player.tileY === mineMode.floorState.start.y) {
    exitMine();
  }
}
function startSlimeFight(encounter) {
  activeBossFight = { bossId: 'slime', name: 'Slime', icon: '🟢', hpMax: encounter.hp, hp: encounter.hp, damage: encounter.damage, log: ['A slime blocks your path!'] };
  UI.renderBossFight(activeBossFight);
}

// ============================================================
// FISHING
// ============================================================
const fishing = { active: false, game: null };
function startFishing() {
  const fish = rollFish(state.player.region, state.time.season, state.weather.current, state.player.skills.fishing.level);
  const weatherFx = getWeatherEffects(state.weather.current);
  fishing.game = createMinigame(fish, weatherFx.fishingMultiplier);
  fishing.active = true;
  UI.openPanel('fishing');
}
function updateFishing(dt) {
  if (!fishing.active) return;
  updateMinigame(fishing.game, dt, useHeld);
  UI.renderFishingMinigame(fishing.game);
  if (fishing.game.done) {
    fishing.active = false;
    if (fishing.game.success) {
      addItem(state.player.inventory, fishing.game.fish.id, 1);
      addSkillXp(state.player.skills, 'fishing', 8 + fishing.game.fish.rarity * 4);
      questEvent('catch', fishing.game.fish.id, 1);
      UI.showToast(`Caught a ${fishing.game.fish.name}!`);
    } else {
      UI.showToast('It got away...');
    }
    UI.closePanel();
  }
}

// ============================================================
// BOSSES
// ============================================================
let activeBossFight = null;
function checkBossTrigger() {
  const region = state.player.region;
  const bossDef = BOSSES.find(b => b.region === region && !state.bossesDefeated.includes(b.id));
  if (bossDef && !activeBossFight && Math.random() < 0.0006) {
    activeBossFight = startBossFight(bossDef.id, 0);
    UI.renderBossFight(activeBossFight);
  }
}
function bossAttack() {
  if (!activeBossFight) return;
  const toolId = state.player.hotbar[state.player.hotbarIndex];
  const dmg = toolId === 'sword' ? 14 + Math.floor(Math.random()*8) : 6 + Math.floor(Math.random()*5);
  attackBoss(activeBossFight, dmg);
  UI.renderBossFight(activeBossFight);
  if (activeBossFight.won) {
    handleBossVictory(activeBossFight.bossId);
    activeBossFight = null;
    UI.closePanel();
    return;
  }
  if (activeBossFight.lastDamageToPlayer) {
    state.player.hp = Math.max(0, state.player.hp - activeBossFight.lastDamageToPlayer);
    UI.renderHUD(state);
    if (state.player.hp <= 0) {
      UI.showToast('You were defeated and retreated home to recover.');
      activeBossFight = null;
      UI.closePanel();
      travelTo('farm');
      state.player.hp = 50;
    }
  }
}
function handleBossVictory(bossId) {
  if (bossId === 'slime') { addItem(state.player.inventory, Math.random() < 0.3 ? 'diamond' : 'stone', 1); UI.showToast('Slime defeated!'); return; }
  const def = getBossDef(bossId);
  if (!def) return;
  state.bossesDefeated.push(bossId);
  addItem(state.player.inventory, def.rewardItem, 1);
  if (def.unlocks.region && !state.player.unlockedRegions.includes(def.unlocks.region)) state.player.unlockedRegions.push(def.unlocks.region);
  UI.showToast(`${def.name} defeated! New area unlocked!`);
}

// ============================================================
// QUESTS / EVENTS
// ============================================================
function questEvent(type, target, amount) {
  const done = updateQuestProgress(state.quests.active, { type, target, amount });
  done.forEach(q => UI.showToast(`Quest ready to claim: ${q.title}`));
}

// ============================================================
// TRAVEL
// ============================================================
const REGION_SPAWN = {
  farm: {x:10,y:10}, town: {x:5,y:12}, forest: {x:4,y:4}, beach: {x:3,y:3}, river: {x:3,y:3},
  mountains: {x:4,y:4}, mine: {x:MINE_SHAFT.x, y:MINE_SHAFT.y+1}, desert:{x:3,y:3}, tropical:{x:3,y:3},
  crystalcavern:{x:3,y:3}, snowmountains:{x:3,y:3}, volcano:{x:3,y:3}, floatingisles:{x:3,y:3}, ruins:{x:3,y:3},
};
function travelTo(regionId) {
  if (!state.player.unlockedRegions.includes(regionId)) { UI.showToast('That region is locked.'); return; }
  if (mineMode.active) exitMine();
  persistRegionObjectState(state.player.region);
  state.player.region = regionId;
  const spawn = REGION_SPAWN[regionId] || { x: 5, y: 5 };
  player.pixelX = spawn.x * World.TILE_SIZE;
  player.pixelY = spawn.y * World.TILE_SIZE;
  UI.closePanel();
  UI.showToast(`Welcome to ${World.REGIONS[regionId].name}!`);
}

// ============================================================
// MULTIPLAYER
// ============================================================
MP.connectMultiplayer(state.player, {
  onConnect: () => UI.showToast('Connected to multiplayer server!'),
  onPlayersUpdate: (players) => { lastPlayers = players.filter(p => p.id !== state.flags.socketId); },
  onChatMessage: (msg) => UI.appendChatMessage(msg.name, msg.text, false),
  onWorldEvent: (evt) => UI.showToast(`🌍 World Event: ${evt.name}`),
  onMarketUpdate: (listings) => { lastMarket = listings; },
  onGuildUpdate: (guild) => { lastGuild = guild; },
  onLeaderboard: (data) => { lastLeaderboard = data; },
});
let posSendAccum = 0;

// ============================================================
// PET TICK
// ============================================================
let lastPetHour = -1;
function maybeTickPet(hour) {
  if (hour === lastPetHour) return;
  lastPetHour = hour;
  if (!state.pets.active) return;
  const evt = petTick(state.pets.active);
  if (!evt) return;
  if (evt.type === 'gold') state.player.gold += evt.amount;
  if (evt.type === 'item') addItem(state.player.inventory, evt.itemId, evt.qty);
  if (evt.type === 'forecast') state.weather.forecastKnown = true;
  UI.showToast(evt.message);
}

// ============================================================
// MAIN LOOP
// ============================================================
let lastTime = performance.now();
let lastSaveTime = 0;
let lastDay = state.time.day;

function gameLoop(now) {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;

  // time progression
  const region = state.player.region;
  const rs = mineMode.active ? null : getRegionState(region);

  if (!UI.isAnyPanelOpen() || fishing.active) {
    state.time.totalGameMinutes += dt * Save.TIME_SCALE / 60;
    if (state.time.totalGameMinutes >= 24 * 60) {
      state.time.totalGameMinutes -= 24 * 60;
      Save.advanceCalendar(state.time);
      state.weather.current = state.weather.forecastKnown ? state.weather.tomorrow || state.weather.current : rollWeather(state.time.season);
      state.weather.tomorrow = rollWeather(state.time.season);
      state.weather.forecastKnown = false;
      dailyMarketUpdate(state.economy, state.time.day, state.time.season);
      state.animals.forEach(resetDailyCare);
      Object.values(state.friendship).forEach(f => f.giftsToday = 0);
      if (lastDay !== state.time.day) {
        state.quests.active = state.quests.active.filter(q => !q.claimed);
        while (state.quests.active.length < 3) state.quests.active.push(...generateDailyQuests(1));
        lastDay = state.time.day;
      }
    }

    const weatherFx = getWeatherEffects(state.weather.current);
    const hasGreenhouse = state.buildings.some(b => b.type === 'greenhouse');
    growCrops(state.farm, dt * Save.TIME_SCALE, {
      weatherMultiplier: hasGreenhouse ? Math.max(1, weatherFx.growthMultiplier) : weatherFx.growthMultiplier,
      isRaining: ['rain','storm','rainbowrain'].includes(state.weather.current),
      currentSeason: state.time.season,
      hasGreenhouse,
    });
    state.animals.forEach(a => {
      const product = updateAnimal(a, state.time.totalGameMinutes);
      if (product) { addItem(state.player.inventory, product.itemId, product.qty); }
    });
    const automationEvents = updateAutomation(state.placedCraftables.filter(c => c.region === 'farm'), state.farm, state.time.totalGameMinutes);
    automationEvents.forEach(e => {
      if (e.type === 'auto_harvest') {
        const [x, y] = e.key.split(',').map(Number);
        const result = harvestTile(state.farm, x, y);
        if (result) addItem(state.player.inventory, result.itemId, result.qty);
      }
    });

    updateNpcSchedules();
    maybeTickPet(Math.floor(state.time.totalGameMinutes / 60) % 24);
    checkBossTrigger();

    // player movement
    if (!fishing.active && !activeBossFight) {
      const moveVec = currentMoveVector();
      const canMoveTo = mineMode.active
        ? (px, py) => mineCanMoveTo(px, py)
        : (px, py) => surfaceCanMoveTo(rs, px, py);
      player.update(dt, moveVec, canMoveTo);
    }
  }

  if (fishing.active) updateFishing(dt);

  // camera
  const worldPixelW = mineMode.active ? mineMode.floorState.w * World.TILE_SIZE : rs.def.w * World.TILE_SIZE;
  const worldPixelH = mineMode.active ? mineMode.floorState.h * World.TILE_SIZE : rs.def.h * World.TILE_SIZE;
  camera.follow(player.pixelX, player.pixelY, worldPixelW, worldPixelH, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1), dt);

  weatherParticles.setType(mineMode.active ? 'sunny' : state.weather.current, window.innerWidth, window.innerHeight);
  weatherParticles.update(dt, window.innerWidth, window.innerHeight);

  render(rs, dt);

  // multiplayer position sync
  posSendAccum += dt;
  if (posSendAccum > 0.15) { posSendAccum = 0; MP.sendPosition(state.player.region, player.tileX, player.tileY, player.facing); }

  // autosave every 20s
  lastSaveTime += dt;
  if (lastSaveTime > 20) { lastSaveTime = 0; persistRegionObjectState(state.player.region); Save.saveGame(state); }

  UI.renderHUD(state);
  if (!document.getElementById('hotbar').children.length) UI.renderHotbar(state);

  requestAnimationFrame(gameLoop);
}

function surfaceCanMoveTo(rs, px, py) {
  const tx = Math.round(px / World.TILE_SIZE), ty = Math.round(py / World.TILE_SIZE);
  return World.isWalkable(rs, tx, ty);
}
function mineCanMoveTo(px, py) {
  const tx = Math.floor(px / World.TILE_SIZE + 0.5), ty = Math.floor(py / World.TILE_SIZE + 0.5);
  const tile = mineMode.floorState.grid[ty]?.[tx];
  return tile && tile.type !== 'wall';
}

// ============================================================
// RENDERING
// ============================================================
function render(rs, dt) {
  const vw = window.innerWidth, vh = window.innerHeight;
  ctx.clearRect(0, 0, vw, vh);

  if (mineMode.active) renderMine(vw, vh);
  else renderSurface(rs, vw, vh);

  weatherParticles.render(ctx, vw, vh);
  renderDayNightOverlay(vw, vh);
}

function renderSurface(rs, vw, vh) {
  const T = World.TILE_SIZE;
  ctx.fillStyle = World.TILE_COLORS[rs.def.base] || '#5fa851';
  ctx.fillRect(0, 0, vw, vh);
  const startX = Math.floor(camera.x / T), startY = Math.floor(camera.y / T);
  const endX = Math.ceil((camera.x + vw) / T), endY = Math.ceil((camera.y + vh) / T);

  for (let y = Math.max(0, startY); y < Math.min(rs.def.h, endY); y++) {
    for (let x = Math.max(0, startX); x < Math.min(rs.def.w, endX); x++) {
      const tile = rs.tiles[y][x];
      const sx = x * T - camera.x, sy = y * T - camera.y;
      ctx.fillStyle = World.TILE_COLORS[tile] || '#5fa851';
      ctx.fillRect(sx, sy, T, T);
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.strokeRect(sx, sy, T, T);
    }
  }

  // farm plots overlay
  if (rs.def.id === 'farm') {
    for (const [k, plot] of Object.entries(state.farm.plots)) {
      const [x, y] = k.split(',').map(Number);
      if (x < startX-1 || x > endX+1 || y < startY-1 || y > endY+1) continue;
      const sx = x * T - camera.x, sy = y * T - camera.y;
      ctx.fillStyle = plot.watered ? World.TILE_COLORS.tilled_wet : World.TILE_COLORS.tilled;
      ctx.fillRect(sx, sy, T, T);
      if (plot.cropId) drawCrop(plot, sx, sy, T);
    }
  }

  // objects (trees/rocks/bushes/flowers)
  for (const obj of rs.objects) {
    if (obj.harvested) {
      if (state.time.totalGameMinutes >= (obj.respawnAt % (60*24)) && obj.respawnAt !== 0) {
        // simplified respawn check using absolute accumulation isn't tracked across days; skip complexity
      }
      continue;
    }
    const sx = obj.x * T - camera.x, sy = obj.y * T - camera.y;
    if (sx < -T || sy < -T || sx > vw+T || sy > vh+T) continue;
    drawWorldObject(obj, sx, sy, T);
  }

  // buildings
  for (const b of (rs.buildings || [])) {
    const sx = b.x * T - camera.x, sy = b.y * T - camera.y;
    drawBuilding(b, sx, sy, T);
  }

  // animals
  if (rs.def.id === 'farm') {
    for (const a of state.animals) {
      const sx = a.x * T - camera.x, sy = a.y * T - camera.y;
      ctx.font = '22px serif';
      ctx.fillText(ANIMAL_TYPES[a.type].icon, sx, sy + 20);
    }
  }

  // NPCs
  for (const npc of visibleNpcs) {
    if (npc.region !== rs.def.id) continue;
    const sx = npc.x * T - camera.x, sy = npc.y * T - camera.y;
    ctx.font = '20px serif';
    ctx.fillText('🧑', sx, sy + 18);
    ctx.fillStyle = '#fff'; ctx.font = '9px monospace';
    ctx.fillText(npc.name, sx - 6, sy - 4);
  }

  // other multiplayer players
  for (const p of lastPlayers) {
    if (p.region !== rs.def.id) continue;
    const sx = p.x * T - camera.x, sy = p.y * T - camera.y;
    ctx.font = '20px serif';
    ctx.fillText('🧍', sx, sy + 18);
    ctx.fillStyle = '#7cd3ff'; ctx.font = '9px monospace';
    ctx.fillText(p.name || 'Farmer', sx - 8, sy - 4);
  }

  // local player
  player.draw(ctx, player.pixelX - camera.x, player.pixelY - camera.y, state.player.appearance);
  if (state.pets.active) {
    ctx.font = '18px serif';
    ctx.fillText(PET_TYPES[state.pets.active.type].icon, player.pixelX - camera.x - 26, player.pixelY - camera.y);
  }
}

function drawCrop(plot, sx, sy, T) {
  const stages = plot.mutation ? 1 : (CROPS[plot.cropId]?.stages || 4);
  const colors = plot.mutation ? MUTATIONS[plot.mutation].colors : CROPS[plot.cropId].colors;
  const stage = plot.mutation ? 0 : plot.stage;
  const color = colors[Math.min(colors.length - 1, stage)];
  const growthPct = plot.mutation ? 1 : (stage + 1) / stages;
  ctx.fillStyle = color;
  const h = T * 0.7 * growthPct;
  ctx.fillRect(sx + T*0.3, sy + T - h, T*0.4, h);
  if (plot.mutation) { ctx.font = '10px serif'; ctx.fillText('✨', sx+2, sy+10); }
}

function drawWorldObject(obj, sx, sy, T) {
  if (obj.type === World.OBJECT_TYPES.TREE) {
    ctx.fillStyle = '#6b4a2b'; ctx.fillRect(sx + T*0.4, sy + T*0.5, T*0.2, T*0.5);
    ctx.fillStyle = '#2f6f3a'; ctx.beginPath(); ctx.arc(sx + T/2, sy + T*0.35, T*0.42, 0, Math.PI*2); ctx.fill();
  } else if (obj.type === World.OBJECT_TYPES.ROCK) {
    ctx.fillStyle = '#8a8a90'; ctx.beginPath(); ctx.ellipse(sx+T/2, sy+T*0.6, T*0.4, T*0.3, 0, 0, Math.PI*2); ctx.fill();
  } else if (obj.type === World.OBJECT_TYPES.BUSH) {
    ctx.fillStyle = '#3f8f4a'; ctx.beginPath(); ctx.arc(sx+T/2, sy+T*0.6, T*0.32, 0, Math.PI*2); ctx.fill();
  } else if (obj.type === World.OBJECT_TYPES.FLOWER) {
    ctx.font = `${Math.floor(T*0.6)}px serif`; ctx.fillText('🌼', sx+T*0.15, sy+T*0.8);
  }
}

const BUILDING_LABELS = {
  house:'🏠', barn:'🏚️', coop:'🐔', greenhouse:'🏡', workshop:'🛠️', warehouse:'🏬', marketstall:'🏪', windmill:'🎡',
  shop_general:'🛒', shop_blacksmith:'⚒️', museum:'🏛️', mine_shaft:'🕳️',
};
function drawBuilding(b, sx, sy, T) {
  ctx.fillStyle = 'rgba(107,74,43,0.9)';
  ctx.fillRect(sx - T*0.2, sy - T*0.6, T*1.4, T*1.2);
  ctx.font = `${Math.floor(T*0.9)}px serif`;
  ctx.fillText(BUILDING_LABELS[b.type] || '🏗️', sx, sy + T*0.4);
}

function renderMine(vw, vh) {
  const T = World.TILE_SIZE;
  ctx.fillStyle = '#25252d';
  ctx.fillRect(0, 0, vw, vh);
  const fs = mineMode.floorState;
  const startX = Math.max(0, Math.floor(camera.x / T)), startY = Math.max(0, Math.floor(camera.y / T));
  const endX = Math.min(fs.w, Math.ceil((camera.x + vw) / T)), endY = Math.min(fs.h, Math.ceil((camera.y + vh) / T));
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const tile = fs.grid[y][x];
      const sx = x * T - camera.x, sy = y * T - camera.y;
      if (tile.type === 'wall') { ctx.fillStyle = tile.ore ? '#5a4a6a' : '#3a3a42'; ctx.fillRect(sx, sy, T, T); if (tile.ore) { ctx.font='12px serif'; ctx.fillText(ITEMS[tile.ore]?.icon || '?', sx+8, sy+20); } }
      else if (tile.type === 'ladder') { ctx.fillStyle = '#2a2a30'; ctx.fillRect(sx, sy, T, T); ctx.font='20px serif'; ctx.fillText('🪜', sx, sy+22); }
      else { ctx.fillStyle = '#25252d'; ctx.fillRect(sx, sy, T, T); }
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.strokeRect(sx, sy, T, T);
    }
  }
  player.draw(ctx, player.pixelX - camera.x, player.pixelY - camera.y, state.player.appearance);
  ctx.fillStyle = '#ffd95f'; ctx.font = '13px monospace';
  ctx.fillText(`Depth ${state.mineDepth} — ${fs.layer.name}`, 12, vh - 100);
}

function renderDayNightOverlay(vw, vh) {
  const part = Save.partOfDay(state.time.totalGameMinutes);
  const tint = { morning: 'rgba(255,220,180,0.06)', midday: 'rgba(255,255,255,0)', evening: 'rgba(255,140,80,0.16)', night: 'rgba(20,20,60,0.45)' }[part];
  if (tint && tint !== 'rgba(255,255,255,0)') { ctx.fillStyle = tint; ctx.fillRect(0, 0, vw, vh); }
}

// ============================================================
// STARTUP
// ============================================================
updateNpcSchedules();
if (offlineResult.events.length) offlineResult.events.forEach(e => setTimeout(() => UI.showToast(e), 800));
UI.setBootProgress(100);
setTimeout(() => {
  UI.hideBootScreen();
  UI.renderHUD(state);
  UI.renderHotbar(state);
  if (isNew) UI.showToast('Welcome to Pixel Farm Life! Explore, farm, and grow your town.');
}, 350);

window.addEventListener('beforeunload', () => { persistRegionObjectState(state.player.region); Save.saveGame(state); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { persistRegionObjectState(state.player.region); Save.saveGame(state); } });

requestAnimationFrame((t) => { lastTime = t; requestAnimationFrame(gameLoop); });
