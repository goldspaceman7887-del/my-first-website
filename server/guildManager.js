// guildManager.js - guild chat, storage, projects, events

export class GuildManager {
  constructor(io, database) {
    this.io = io;
    this.database = database;
    this.guilds = new Map(); // name -> { name, members: [socketId...], memberNames: [], storage: [], projects: [], chat: [] }
    this.memberOf = new Map(); // socketId -> guildName
  }

  async init() {
    const saved = await this.database.getAllGuilds();
    for (const g of saved) this.guilds.set(g.name, g);
  }

  createGuild(socket, name, playerName) {
    if (!name || this.guilds.has(name)) return null;
    const guild = { name, members: [socket.id], memberNames: [playerName], storage: [], projects: [], chat: [] };
    this.guilds.set(name, guild);
    this.memberOf.set(socket.id, name);
    this.database.saveGuild(name, guild);
    return guild;
  }

  joinGuild(socket, name, playerName) {
    const guild = this.guilds.get(name);
    if (!guild) return null;
    if (!guild.members.includes(socket.id)) guild.members.push(socket.id);
    if (!guild.memberNames.includes(playerName)) guild.memberNames.push(playerName);
    this.memberOf.set(socket.id, name);
    this.database.saveGuild(name, guild);
    return guild;
  }

  leaveGuild(socketId) {
    const name = this.memberOf.get(socketId);
    if (!name) return;
    const guild = this.guilds.get(name);
    if (guild) {
      guild.members = guild.members.filter(id => id !== socketId);
      this.database.saveGuild(name, guild);
    }
    this.memberOf.delete(socketId);
  }

  guildChat(socket, text, playerName) {
    const name = this.memberOf.get(socket.id);
    if (!name) return;
    const guild = this.guilds.get(name);
    const msg = { name: playerName, text: String(text).slice(0, 200), at: Date.now() };
    guild.chat.push(msg);
    guild.chat = guild.chat.slice(-100);
    for (const id of guild.members) this.io.to(id).emit('guild:update', this.publicGuild(guild));
  }

  publicGuild(guild) {
    return { name: guild.name, members: guild.memberNames, storage: guild.storage, projects: guild.projects, chatLog: guild.chat.slice(-30) };
  }

  broadcastGuildState(socketId) {
    const name = this.memberOf.get(socketId);
    if (!name) return;
    const guild = this.guilds.get(name);
    if (guild) this.io.to(socketId).emit('guild:update', this.publicGuild(guild));
  }
}
