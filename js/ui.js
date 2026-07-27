// ui.js - DOM UI: HUD, panels, touch controls, dialogue, toasts

import { ITEMS } from './inventory.js';
import { CROPS, MUTATIONS } from './farming.js';
import { RECIPES } from './crafting.js';
import { REGIONS } from './world.js';
import { VILLAGERS, getHearts, unlocksForHearts } from './villagers.js';
import { ANIMAL_TYPES, PET_TYPES } from './animals.js';
import { SKIN_TONES, HAIR_COLORS, CLOTHES_COLORS, HAT_OPTIONS, BACKPACK_OPTIONS, xpForNextLevel } from './player.js';
import { timeOfDayLabel } from './save.js';
import { WEATHER } from './weather.js';

let H = {}; // handlers supplied by game.js

export function initUI(handlers) {
  H = handlers;
  setupMenuBar();
  setupPanelClose();
  setupTouchControls();
  setupKeyboardHints();
  setupSocialTabs();
  setupChat();
  setupDialogueDismiss();
  setupBossButtons();
}

// ============ TOASTS ============
export function showToast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ============ HUD ============
export function renderHUD(state) {
  document.getElementById('hud-day').textContent = `Day ${state.time.day}`;
  document.getElementById('hud-time').textContent = timeOfDayLabel(state.time.totalGameMinutes);
  document.getElementById('hud-weather').textContent = (WEATHER[state.weather.current] || WEATHER.sunny).icon;
  document.getElementById('hud-gold-amount').textContent = state.player.gold;
  document.getElementById('hud-region-name').textContent = REGIONS[state.player.region]?.name || state.player.region;
  const seasonIcons = { spring: '🌱', summer: '☀️', fall: '🍂', winter: '❄️' };
  document.getElementById('hud-season-icon').textContent = seasonIcons[state.time.season] || '🌱';

  document.querySelectorAll('.skill-chip').forEach(chip => {
    const skill = chip.dataset.skill;
    const lvl = state.player.skills[skill]?.level || 1;
    chip.querySelector('.skill-lvl').textContent = lvl;
  });

  const hpPct = Math.max(0, Math.min(100, state.player.hp));
  document.getElementById('hud-health-fill').style.width = hpPct + '%';
}

export function renderHotbar(state) {
  const bar = document.getElementById('hotbar');
  bar.innerHTML = '';
  state.player.hotbar.forEach((itemId, i) => {
    const def = ITEMS[itemId];
    const slot = document.createElement('div');
    slot.className = 'hotbar-slot' + (i === state.player.hotbarIndex ? ' active' : '');
    slot.innerHTML = `${def ? def.icon : '❔'}`;
    if (def && def.stackable) {
      const qty = state.player.inventory.slots.find(s => s.id === itemId)?.qty || 0;
      slot.innerHTML += `<span class="qty">${qty}</span>`;
    }
    slot.onclick = () => H.onSelectHotbar && H.onSelectHotbar(i);
    bar.appendChild(slot);
  });
}

// ============ PANEL MANAGEMENT ============
const PANEL_IDS = ['inventory', 'crafting', 'map', 'quests', 'museum', 'social', 'character', 'shop', 'boss', 'fishing'];

export function openPanel(name) {
  document.getElementById('panel-overlay').classList.remove('hidden');
  PANEL_IDS.forEach(p => document.getElementById('panel-' + p).classList.toggle('hidden', p !== name));
}
export function closePanel() {
  document.getElementById('panel-overlay').classList.add('hidden');
  H.onPanelClosed && H.onPanelClosed();
}
export function isAnyPanelOpen() { return !document.getElementById('panel-overlay').classList.contains('hidden'); }

function setupMenuBar() {
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      H.onOpenPanel && H.onOpenPanel(panel);
    });
  });
}
function setupPanelClose() {
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closePanel));
  document.getElementById('panel-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'panel-overlay') closePanel();
  });
}

// ============ INVENTORY ============
export function renderInventory(state) {
  const tools = document.getElementById('inventory-tools');
  tools.innerHTML = '';
  const toolIds = ['hoe', 'wateringcan', 'axe', 'pickaxe', 'fishingrod', 'sword'];
  toolIds.forEach(id => {
    if (!state.player.inventory.slots.some(s => s.id === id) && !['hoe','wateringcan','axe','pickaxe','fishingrod'].includes(id)) return;
    const def = ITEMS[id];
    const el = document.createElement('div');
    el.className = 'inv-slot';
    el.innerHTML = `<span class="icon">${def.icon}</span>${def.name}`;
    el.onclick = () => H.onEquipTool && H.onEquipTool(id);
    tools.appendChild(el);
  });

  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';
  state.player.inventory.slots.forEach(slot => {
    const def = ITEMS[slot.id];
    if (!def) return;
    const el = document.createElement('div');
    el.className = 'inv-slot';
    el.innerHTML = `<span class="icon">${def.icon}</span>${def.name}${def.stackable ? ` x${slot.qty}` : ''}`;
    el.onclick = () => H.onInventoryItemClick && H.onInventoryItemClick(slot.id);
    grid.appendChild(el);
  });
}

// ============ CRAFTING ============
export function renderCrafting(state, craftableCheck) {
  const list = document.getElementById('crafting-list');
  list.innerHTML = '';
  Object.values(RECIPES).forEach(r => {
    const ok = craftableCheck(r.id);
    const el = document.createElement('div');
    el.className = 'craft-item' + (ok ? '' : ' disabled');
    const reqText = Object.entries(r.requires).map(([id, qty]) => `${ITEMS[id]?.icon || ''}${qty}`).join(' ');
    el.innerHTML = `<span class="icon">${r.icon}</span><div>${r.name}</div><div style="font-size:10px;opacity:.8">${reqText}</div><div style="font-size:9px;opacity:.6">Lv${r.craftingLevel}${r.needsFurnace ? ' 🔥' : ''}</div>`;
    el.onclick = () => ok && H.onCraft && H.onCraft(r.id);
    list.appendChild(el);
  });
}

// ============ MAP ============
export function renderMap(state) {
  const grid = document.getElementById('map-regions');
  grid.innerHTML = '';
  Object.values(REGIONS).forEach(r => {
    const unlocked = state.player.unlockedRegions.includes(r.id);
    const el = document.createElement('div');
    el.className = 'map-region' + (unlocked ? '' : ' locked');
    el.innerHTML = `<div class="r-name">${r.name}</div><div style="font-size:11px">${unlocked ? (state.player.region === r.id ? '📍 Here' : 'Travel') : '🔒 Locked'}</div>`;
    el.onclick = () => unlocked && H.onTravel && H.onTravel(r.id);
    grid.appendChild(el);
  });
}

// ============ QUESTS ============
export function renderQuests(state) {
  const list = document.getElementById('quests-list');
  list.innerHTML = '';
  state.quests.active.forEach(q => {
    const el = document.createElement('div');
    el.className = 'quest-item';
    el.innerHTML = `<div class="q-title">${q.title}</div><div class="q-progress">${q.progress}/${q.need} · Reward: ${q.rewardGold}g, ${q.rewardXp}xp</div>`;
    if (q.completed && !q.claimed) {
      const btn = document.createElement('button');
      btn.textContent = 'Claim Reward';
      btn.onclick = () => H.onClaimQuest && H.onClaimQuest(q.id);
      el.appendChild(btn);
    } else if (q.claimed) {
      el.innerHTML += `<div style="color:#7cd35f;font-size:11px">✔ Completed</div>`;
    }
    list.appendChild(el);
  });
  if (state.quests.active.length === 0) list.innerHTML = '<div style="opacity:.7">No active quests. Check back tomorrow!</div>';
}

// ============ MUSEUM ============
const MUSEUM_ITEMS = ['fossil', 'relic', 'bug_firefly', 'bug_beetle', 'trophy', 'crop_goldencarrot', 'crop_crystalberry', 'crop_rainbowpumpkin'];
export function renderMuseum(state) {
  const grid = document.getElementById('museum-grid');
  grid.innerHTML = '';
  MUSEUM_ITEMS.forEach(id => {
    const def = ITEMS[id];
    const donated = state.museum.donated.includes(id);
    const owned = state.player.inventory.slots.some(s => s.id === id);
    const el = document.createElement('div');
    el.className = 'museum-slot';
    el.innerHTML = `<span class="icon">${donated ? def.icon : '❔'}</span>${donated ? def.name : '???'}`;
    if (owned && !donated) {
      const btn = document.createElement('button');
      btn.textContent = 'Donate';
      btn.style.marginTop = '4px';
      btn.onclick = () => H.onDonate && H.onDonate(id);
      el.appendChild(btn);
    }
    grid.appendChild(el);
  });
}

// ============ SOCIAL ============
function setupSocialTabs() {
  document.querySelectorAll('.social-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.social-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.social-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById('social-' + tab.dataset.tab).classList.remove('hidden');
    });
  });
}
function setupChat() {
  document.getElementById('chat-send').addEventListener('click', sendChatFromInput);
  document.getElementById('chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChatFromInput(); });
}
function sendChatFromInput() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  H.onSendChat && H.onSendChat(text);
  input.value = '';
}
export function appendChatMessage(name, text, isSelf = false) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.innerHTML = `<b style="color:${isSelf ? '#ffd95f' : '#7cd3ff'}">${name}:</b> ${escapeHtml(text)}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

export function renderPlayersList(players) {
  const el = document.getElementById('social-players');
  if (!players || players.length === 0) { el.innerHTML = '<div style="opacity:.7">No other players online. Run the multiplayer server to see other farmers!</div>'; return; }
  el.innerHTML = players.map(p => `<div class="quest-item">${p.name} — ${REGIONS[p.region]?.name || p.region}</div>`).join('');
}
export function renderFriendsList(friends) {
  const el = document.getElementById('social-friends');
  el.innerHTML = friends && friends.length ? friends.map(f => `<div class="quest-item">${f}</div>`).join('') : '<div style="opacity:.7">No friends added yet.</div>';
}
export function renderGuildPanel(guild) {
  const el = document.getElementById('social-guild');
  if (!guild) {
    el.innerHTML = `<div style="opacity:.7">You're not in a guild.</div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <input id="guild-name-input" placeholder="Guild name" style="flex:1;padding:6px;border-radius:4px;border:1px solid #6b4a2b;background:#140d08;color:#fff">
        <button id="guild-create-btn">Create</button>
        <button id="guild-join-btn">Join</button>
      </div>`;
    document.getElementById('guild-create-btn').onclick = () => H.onGuildCreate && H.onGuildCreate(document.getElementById('guild-name-input').value);
    document.getElementById('guild-join-btn').onclick = () => H.onGuildJoin && H.onGuildJoin(document.getElementById('guild-name-input').value);
  } else {
    el.innerHTML = `<div class="quest-item"><b>${guild.name}</b><br>Members: ${guild.members.join(', ')}<br>Guild Storage: ${guild.storage?.length || 0} items</div>`;
  }
}
export function renderMarket(listings, economy) {
  const el = document.getElementById('social-market');
  if (!listings || listings.length === 0) {
    el.innerHTML = '<div style="opacity:.7">No player listings yet. Start the server for a live global marketplace.</div>';
    return;
  }
  el.innerHTML = listings.map(l => `<div class="quest-item">${ITEMS[l.item]?.icon || ''} ${ITEMS[l.item]?.name || l.item} x${l.qty} — ${l.price}g each
    <button data-listing="${l.id}">Buy</button></div>`).join('');
  el.querySelectorAll('button').forEach(btn => btn.onclick = () => H.onMarketBuy && H.onMarketBuy(btn.dataset.listing));
}
export function renderLeaderboard(data) {
  const el = document.getElementById('social-leaderboard');
  if (!data) { el.innerHTML = '<div style="opacity:.7">Leaderboards require the multiplayer server.</div>'; return; }
  el.innerHTML = Object.entries(data).map(([cat, rows]) => `<div class="quest-item"><b>${cat}</b><br>${rows.map((r,i)=>`${i+1}. ${r.name} — ${r.value}`).join('<br>')}</div>`).join('');
}

// ============ CHARACTER ============
export function renderCharacterPanel(state, previewDraw) {
  const opts = document.getElementById('char-options');
  opts.innerHTML = '';
  addSwatchRow(opts, 'Skin', SKIN_TONES, state.player.appearance.skin, (c) => H.onCustomize && H.onCustomize('skin', c));
  addSwatchRow(opts, 'Hair', HAIR_COLORS, state.player.appearance.hair, (c) => H.onCustomize && H.onCustomize('hair', c));
  addSwatchRow(opts, 'Clothes', CLOTHES_COLORS, state.player.appearance.clothes, (c) => H.onCustomize && H.onCustomize('clothes', c));
  addOptionRow(opts, 'Hat', HAT_OPTIONS, state.player.appearance.hat, (v) => H.onCustomize && H.onCustomize('hat', v));
  addOptionRow(opts, 'Backpack', BACKPACK_OPTIONS, state.player.appearance.backpack, (v) => H.onCustomize && H.onCustomize('backpack', v));
  const nameRow = document.createElement('div');
  nameRow.className = 'char-row';
  nameRow.innerHTML = `<span>Name</span><input id="name-input" value="${state.player.name}" style="padding:4px;border-radius:4px;border:1px solid #6b4a2b;background:#140d08;color:#fff;width:140px">`;
  opts.appendChild(nameRow);
  document.getElementById('name-input').addEventListener('change', (e) => H.onCustomize && H.onCustomize('name', e.target.value));
  previewDraw && previewDraw();
}
function addSwatchRow(container, label, colors, current, onPick) {
  const row = document.createElement('div'); row.className = 'char-row';
  const swatches = document.createElement('div'); swatches.className = 'swatch-row';
  colors.forEach(c => {
    const sw = document.createElement('div');
    sw.className = 'swatch' + (c === current ? ' selected' : '');
    sw.style.background = c;
    sw.onclick = () => onPick(c);
    swatches.appendChild(sw);
  });
  row.innerHTML = `<span>${label}</span>`;
  row.appendChild(swatches);
  container.appendChild(row);
}
function addOptionRow(container, label, options, current, onPick) {
  const row = document.createElement('div'); row.className = 'char-row';
  const select = document.createElement('select');
  select.style.cssText = 'background:#140d08;color:#fff;border:1px solid #6b4a2b;padding:4px;border-radius:4px';
  options.forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o; if (o === current) op.selected = true; select.appendChild(op); });
  select.onchange = () => onPick(select.value);
  row.innerHTML = `<span>${label}</span>`;
  row.appendChild(select);
  container.appendChild(row);
}

// ============ SHOP ============
export function openShop(title, items, state, mode) {
  document.getElementById('shop-title').textContent = title;
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  items.forEach(({ id, price }) => {
    const def = ITEMS[id];
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `<span class="icon">${def.icon}</span>${def.name}<div>${price}g</div>`;
    el.onclick = () => H.onShopTransact && H.onShopTransact(id, mode);
    grid.appendChild(el);
  });
  openPanel('shop');
}

// ============ DIALOGUE ============
export function showDialogue(name, text, options = []) {
  const box = document.getElementById('dialogue-box');
  box.classList.remove('hidden');
  document.getElementById('dialogue-name').textContent = name;
  document.getElementById('dialogue-text').textContent = text;
  const optsEl = document.getElementById('dialogue-options');
  optsEl.innerHTML = '';
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.onclick = hideDialogue;
  optsEl.appendChild(closeBtn);
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.textContent = o.label;
    btn.onclick = () => { o.action(); };
    optsEl.appendChild(btn);
  });
}
export function hideDialogue() { document.getElementById('dialogue-box').classList.add('hidden'); }
function setupDialogueDismiss() {}

// ============ BOSS FIGHT ============
export function renderBossFight(fight) {
  document.getElementById('boss-name').textContent = `${fight.icon} ${fight.name}`;
  document.getElementById('boss-health-fill').style.width = Math.max(0, (fight.hp / fight.hpMax) * 100) + '%';
  document.getElementById('boss-log').innerHTML = fight.log.slice(-6).map(l => `<div>${l}</div>`).join('');
  openPanel('boss');
}
function setupBossButtons() {
  document.getElementById('boss-attack-btn').addEventListener('click', () => H.onBossAttack && H.onBossAttack());
  document.getElementById('boss-flee-btn').addEventListener('click', () => H.onBossFlee && H.onBossFlee());
}

// ============ FISHING ============
export function renderFishingMinigame(state) {
  document.getElementById('fishing-target').style.left = (state.zoneStart * 100) + '%';
  document.getElementById('fishing-target').style.width = (state.zoneSize * 100) + '%';
  document.getElementById('fishing-cursor').style.left = (state.cursorPos * 100) + '%';
}

// ============ TOUCH CONTROLS ============
function setupTouchControls() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) document.body.classList.add('is-touch');

  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  const base = document.getElementById('joystick-base');
  let dragging = false;
  let originX = 0, originY = 0;

  function handleStart(e) {
    dragging = true;
    const rect = base.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = rect.top + rect.height / 2;
    handleMove(e);
  }
  function handleMove(e) {
    if (!dragging) return;
    const touch = e.touches ? e.touches[0] : e;
    let dx = touch.clientX - originX;
    let dy = touch.clientY - originY;
    const max = 40;
    const dist = Math.hypot(dx, dy);
    if (dist > max) { dx = (dx / dist) * max; dy = (dy / dist) * max; }
    knob.style.left = 38 + dx + 'px';
    knob.style.top = 38 + dy + 'px';
    H.onJoystick && H.onJoystick(dx / max, dy / max);
    e.preventDefault && e.preventDefault();
  }
  function handleEnd() {
    dragging = false;
    knob.style.left = '38px'; knob.style.top = '38px';
    H.onJoystick && H.onJoystick(0, 0);
  }
  zone.addEventListener('touchstart', handleStart, { passive: false });
  zone.addEventListener('touchmove', handleMove, { passive: false });
  zone.addEventListener('touchend', handleEnd);
  zone.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', (e) => dragging && handleMove(e));
  window.addEventListener('mouseup', handleEnd);

  bindPress('btn-use', () => H.onUsePressed && H.onUsePressed());
  bindPress('btn-interact', () => H.onInteractPressed && H.onInteractPressed());
  bindPress('btn-jump', () => H.onJumpPressed && H.onJumpPressed());
}
function bindPress(id, fn) {
  const el = document.getElementById(id);
  el.addEventListener('touchstart', (e) => { e.preventDefault(); fn(); }, { passive: false });
  el.addEventListener('mousedown', fn);
}

function setupKeyboardHints() {}

export function hideBootScreen() {
  const boot = document.getElementById('boot-screen');
  boot.style.opacity = '0';
  setTimeout(() => boot.classList.add('hidden'), 400);
  document.getElementById('game-root').classList.remove('hidden');
}
export function setBootProgress(pct) {
  document.getElementById('boot-bar-fill').style.width = pct + '%';
}
