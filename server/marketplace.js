// marketplace.js - global real-time player marketplace (buy / sell / auction / trade listings)

export class Marketplace {
  constructor(io, database) {
    this.io = io;
    this.database = database;
    this.listings = new Map(); // id -> { id, sellerId, sellerName, item, qty, price, createdAt }
    this.counter = 1;
  }

  async init() {
    const saved = await this.database.getAllMarketListings();
    for (const l of saved) this.listings.set(l.id, l);
  }

  list(sellerSocket, sellerName, item, qty, price) {
    const id = 'listing_' + (this.counter++);
    const listing = { id, sellerId: sellerSocket.id, sellerName, item, qty: Math.max(1, qty | 0), price: Math.max(1, price | 0), createdAt: Date.now() };
    this.listings.set(id, listing);
    this.database.upsertMarketListing(listing);
    this.broadcast();
    return listing;
  }

  buy(listingId, buyerSocketId) {
    const listing = this.listings.get(listingId);
    if (!listing) return null;
    if (listing.sellerId === buyerSocketId) return null;
    this.listings.delete(listingId);
    this.database.removeMarketListing(listingId);
    this.broadcast();
    return listing;
  }

  getAll() { return Array.from(this.listings.values()); }

  broadcast() {
    this.io.emit('market:update', this.getAll());
  }
}
