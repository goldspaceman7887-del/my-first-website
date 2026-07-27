// multiplayer.js - real-time multiplayer client (optional; degrades gracefully to singleplayer
// if no backend server is reachable). Loads socket.io-client dynamically from the same origin
// that serves this game (the Express server in /server exposes /socket.io/socket.io.js).

let socket = null;
let connected = false;
const listeners = {};

export function isConnected() { return connected; }

function emit(event, payload) {
  (listeners[event] || []).forEach(fn => fn(payload));
}

export function on(event, fn) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(fn);
}

function loadSocketIoScript() {
  return new Promise((resolve, reject) => {
    if (window.io) return resolve(window.io);
    const script = document.createElement('script');
    script.src = '/socket.io/socket.io.js';
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error('socket.io client not available (server offline)'));
    document.head.appendChild(script);
    setTimeout(() => reject(new Error('socket.io load timeout')), 4000);
  });
}

export async function connectMultiplayer(playerState, callbacks = {}) {
  try {
    const io = await loadSocketIoScript();
    socket = io({ transports: ['websocket', 'polling'], reconnectionAttempts: 3, timeout: 4000 });

    socket.on('connect', () => {
      connected = true;
      socket.emit('player:join', {
        id: socket.id, name: playerState.name, region: playerState.region,
        x: playerState.x, y: playerState.y, appearance: playerState.appearance,
      });
      emit('connected', socket.id);
      callbacks.onConnect && callbacks.onConnect(socket.id);
    });

    socket.on('disconnect', () => { connected = false; emit('disconnected'); callbacks.onDisconnect && callbacks.onDisconnect(); });
    socket.on('connect_error', () => { connected = false; });

    socket.on('players:update', (players) => { emit('playersUpdate', players); callbacks.onPlayersUpdate && callbacks.onPlayersUpdate(players); });
    socket.on('chat:message', (msg) => { emit('chatMessage', msg); callbacks.onChatMessage && callbacks.onChatMessage(msg); });
    socket.on('world:time', (time) => { emit('worldTime', time); callbacks.onWorldTime && callbacks.onWorldTime(time); });
    socket.on('world:event', (evt) => { emit('worldEvent', evt); callbacks.onWorldEvent && callbacks.onWorldEvent(evt); });
    socket.on('market:update', (listings) => { emit('marketUpdate', listings); callbacks.onMarketUpdate && callbacks.onMarketUpdate(listings); });
    socket.on('guild:update', (guild) => { emit('guildUpdate', guild); callbacks.onGuildUpdate && callbacks.onGuildUpdate(guild); });
    socket.on('trade:offer', (offer) => { emit('tradeOffer', offer); callbacks.onTradeOffer && callbacks.onTradeOffer(offer); });
    socket.on('leaderboard:update', (data) => { emit('leaderboardUpdate', data); callbacks.onLeaderboard && callbacks.onLeaderboard(data); });
    socket.on('farm:visitorJoined', (data) => { emit('visitorJoined', data); });

    return true;
  } catch (e) {
    connected = false;
    return false;
  }
}

export function sendPosition(region, x, y, facing) {
  if (!connected) return;
  socket.emit('player:move', { region, x, y, facing });
}

export function sendChat(text) {
  if (!connected) return;
  socket.emit('chat:message', { text });
}

export function sendGuildChat(text) {
  if (!connected) return;
  socket.emit('guild:chat', { text });
}

export function requestGuildJoin(guildName) { if (connected) socket.emit('guild:join', { guildName }); }
export function requestGuildCreate(guildName) { if (connected) socket.emit('guild:create', { guildName }); }

export function listOnMarket(item, qty, price) { if (connected) socket.emit('market:list', { item, qty, price }); }
export function buyFromMarket(listingId) { if (connected) socket.emit('market:buy', { listingId }); }

export function sendTradeOffer(toId, offerItems, requestItems) {
  if (connected) socket.emit('trade:offer', { toId, offerItems, requestItems });
}
export function respondTrade(tradeId, accept) { if (connected) socket.emit('trade:respond', { tradeId, accept }); }

export function visitFarm(targetPlayerId) { if (connected) socket.emit('farm:visit', { targetPlayerId }); }

export function sendFriendRequest(toName) { if (connected) socket.emit('friend:request', { toName }); }

export function reportGoldForLeaderboard(stats) { if (connected) socket.emit('player:stats', stats); }

export function disconnectMultiplayer() {
  if (socket) { socket.disconnect(); socket = null; connected = false; }
}
