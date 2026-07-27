// farmManager.js - farm visits and group/guild farm coordination

export class FarmManager {
  constructor(io) {
    this.io = io;
    this.visitors = new Map(); // hostSocketId -> Set(visitorSocketId)
  }

  visitFarm(visitorSocket, targetPlayerId, players) {
    const host = players.get(targetPlayerId);
    if (!host) return null;
    if (!this.visitors.has(targetPlayerId)) this.visitors.set(targetPlayerId, new Set());
    this.visitors.get(targetPlayerId).add(visitorSocket.id);
    this.io.to(targetPlayerId).emit('farm:visitorJoined', { visitorId: visitorSocket.id });
    return host;
  }

  leaveAll(socketId) {
    for (const set of this.visitors.values()) set.delete(socketId);
  }
}
