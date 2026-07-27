// socketManager.js - handles all real-time socket.io connections and events

import { GuildManager } from './guildManager.js';
import { TradeManager } from './tradeManager.js';
import { Marketplace } from './marketplace.js';
import { FarmManager } from './farmManager.js';

export function setupSocketManager(io, database, worldManager) {
  const players = new Map(); // socketId -> player public state
  const guildManager = new GuildManager(io, database);
  const tradeManager = new TradeManager(io);
  const marketplace = new Marketplace(io, database);
  const farmManager = new FarmManager(io);

  guildManager.init();
  marketplace.init();

  function broadcastPlayers() {
    const list = Array.from(players.values());
    io.emit('players:update', list);
  }

  async function broadcastLeaderboard() {
    const all = await database.getAllPlayers();
    const richest = [...all].sort((a, b) => (b.gold || 0) - (a.gold || 0)).slice(0, 5).map(p => ({ name: p.name, value: p.gold || 0 }));
    const fishers = [...all].sort((a, b) => (b.fishingLevel || 0) - (a.fishingLevel || 0)).slice(0, 5).map(p => ({ name: p.name, value: p.fishingLevel || 0 }));
    const miners = [...all].sort((a, b) => (b.miningLevel || 0) - (a.miningLevel || 0)).slice(0, 5).map(p => ({ name: p.name, value: p.miningLevel || 0 }));
    io.emit('leaderboard:update', { 'Richest Farmer': richest, 'Best Fisher': fishers, 'Best Miner': miners });
  }

  io.on('connection', (socket) => {
    socket.on('player:join', (data) => {
      const player = {
        id: socket.id, name: (data.name || 'Farmer').slice(0, 20),
        region: data.region || 'farm', x: data.x || 10, y: data.y || 10,
        facing: 'down', appearance: data.appearance || {},
      };
      players.set(socket.id, player);
      socket.join('region:' + player.region);
      socket.emit('world:time', worldManager.getState());
      socket.emit('market:update', marketplace.getAll());
      guildManager.broadcastGuildState(socket.id);
      broadcastPlayers();
      broadcastLeaderboard();
    });

    socket.on('player:move', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      if (data.region && data.region !== player.region) {
        socket.leave('region:' + player.region);
        socket.join('region:' + data.region);
      }
      player.region = data.region ?? player.region;
      player.x = data.x ?? player.x;
      player.y = data.y ?? player.y;
      player.facing = data.facing ?? player.facing;
    });

    // throttled broadcast of positions
    const broadcastInterval = setInterval(broadcastPlayers, 200);

    socket.on('player:stats', (stats) => {
      const player = players.get(socket.id);
      if (!player) return;
      database.savePlayer(player.name, { name: player.name, gold: stats.gold, fishingLevel: stats.fishingLevel, miningLevel: stats.miningLevel, farmingLevel: stats.farmingLevel, updatedAt: Date.now() });
    });

    socket.on('chat:message', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      const msg = { name: player.name, text: String(data.text || '').slice(0, 140), at: Date.now() };
      io.to('region:' + player.region).emit('chat:message', msg);
    });

    socket.on('guild:create', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      const guild = guildManager.createGuild(socket, String(data.guildName || '').slice(0, 24), player.name);
      if (guild) io.to(socket.id).emit('guild:update', guildManager.publicGuild(guild));
    });
    socket.on('guild:join', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      const guild = guildManager.joinGuild(socket, data.guildName, player.name);
      if (guild) {
        for (const id of guild.members) io.to(id).emit('guild:update', guildManager.publicGuild(guild));
      }
    });
    socket.on('guild:chat', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      guildManager.guildChat(socket, data.text, player.name);
    });

    socket.on('market:list', (data) => {
      const player = players.get(socket.id);
      if (!player) return;
      marketplace.list(socket, player.name, data.item, data.qty, data.price);
    });
    socket.on('market:buy', (data) => {
      const listing = marketplace.buy(data.listingId, socket.id);
      if (listing) {
        io.to(socket.id).emit('market:purchaseResult', { success: true, listing });
        io.to(listing.sellerId).emit('market:sold', listing);
      }
    });

    socket.on('trade:offer', (data) => {
      const trade = tradeManager.offerTrade(socket, data.toId, data.offerItems, data.requestItems);
      io.to(socket.id).emit('trade:sent', trade);
    });
    socket.on('trade:respond', (data) => {
      tradeManager.respondTrade(data.tradeId, !!data.accept, socket.id);
    });

    socket.on('farm:visit', (data) => {
      farmManager.visitFarm(socket, data.targetPlayerId, players);
    });

    socket.on('friend:request', (data) => {
      const target = Array.from(players.values()).find(p => p.name === data.toName);
      if (target) io.to(target.id).emit('friend:incoming', { fromName: players.get(socket.id)?.name });
    });

    socket.on('disconnect', () => {
      clearInterval(broadcastInterval);
      players.delete(socket.id);
      guildManager.leaveGuild(socket.id);
      farmManager.leaveAll(socket.id);
      broadcastPlayers();
    });
  });
}
