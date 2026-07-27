// tradeManager.js - direct player-to-player trade offers

export class TradeManager {
  constructor(io) {
    this.io = io;
    this.pendingTrades = new Map(); // tradeId -> { fromId, toId, offerItems, requestItems }
    this.counter = 1;
  }

  offerTrade(fromSocket, toId, offerItems, requestItems) {
    const tradeId = 'trade_' + (this.counter++);
    const trade = { tradeId, fromId: fromSocket.id, toId, offerItems, requestItems, status: 'pending' };
    this.pendingTrades.set(tradeId, trade);
    this.io.to(toId).emit('trade:offer', trade);
    return trade;
  }

  respondTrade(tradeId, accept, respondingSocketId) {
    const trade = this.pendingTrades.get(tradeId);
    if (!trade || trade.toId !== respondingSocketId) return null;
    trade.status = accept ? 'accepted' : 'declined';
    this.io.to(trade.fromId).emit('trade:result', trade);
    this.io.to(trade.toId).emit('trade:result', trade);
    this.pendingTrades.delete(tradeId);
    return trade;
  }
}
