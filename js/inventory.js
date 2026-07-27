// inventory.js - item database + inventory operations

export const ITEMS = {
  // tools
  hoe:          { id:'hoe', name:'Hoe', icon:'⛏️', type:'tool', stackable:false },
  wateringcan:  { id:'wateringcan', name:'Watering Can', icon:'🚿', type:'tool', stackable:false },
  axe:          { id:'axe', name:'Axe', icon:'🪓', type:'tool', stackable:false },
  pickaxe:      { id:'pickaxe', name:'Pickaxe', icon:'⛏️', type:'tool', stackable:false },
  fishingrod:   { id:'fishingrod', name:'Fishing Rod', icon:'🎣', type:'tool', stackable:false },
  sword:        { id:'sword', name:'Sword', icon:'⚔️', type:'tool', stackable:false },

  // resources
  wood:      { id:'wood', name:'Wood', icon:'🪵', type:'resource', stackable:true, sell:4 },
  stone:     { id:'stone', name:'Stone', icon:'🪨', type:'resource', stackable:true, sell:3 },
  fiber:     { id:'fiber', name:'Fiber', icon:'🌾', type:'resource', stackable:true, sell:2 },
  coal:      { id:'coal', name:'Coal', icon:'⚫', type:'resource', stackable:true, sell:10 },
  copper:    { id:'copper', name:'Copper Ore', icon:'🟠', type:'resource', stackable:true, sell:16 },
  iron:      { id:'iron', name:'Iron Ore', icon:'⚙️', type:'resource', stackable:true, sell:28 },
  gold_ore:  { id:'gold_ore', name:'Gold Ore', icon:'🟡', type:'resource', stackable:true, sell:60 },
  diamond:   { id:'diamond', name:'Diamond', icon:'💎', type:'resource', stackable:true, sell:220 },
  crystalore:{ id:'crystalore', name:'Crystal Ore', icon:'🔷', type:'resource', stackable:true, sell:140 },
  relic:     { id:'relic', name:'Ancient Relic', icon:'🏺', type:'collectible', stackable:true, sell:180 },

  // seeds
  seed_carrot: { id:'seed_carrot', name:'Carrot Seed', icon:'🥕', type:'seed', stackable:true, crop:'carrot' },
  seed_potato: { id:'seed_potato', name:'Potato Seed', icon:'🥔', type:'seed', stackable:true, crop:'potato' },
  seed_corn:   { id:'seed_corn', name:'Corn Seed', icon:'🌽', type:'seed', stackable:true, crop:'corn' },
  seed_tomato: { id:'seed_tomato', name:'Tomato Seed', icon:'🍅', type:'seed', stackable:true, crop:'tomato' },
  seed_pumpkin:{ id:'seed_pumpkin', name:'Pumpkin Seed', icon:'🎃', type:'seed', stackable:true, crop:'pumpkin' },
  seed_blueberry:{ id:'seed_blueberry', name:'Blueberry Seed', icon:'🫐', type:'seed', stackable:true, crop:'blueberry' },
  seed_strawberry:{ id:'seed_strawberry', name:'Strawberry Seed', icon:'🍓', type:'seed', stackable:true, crop:'strawberry' },
  seed_rice:   { id:'seed_rice', name:'Rice Seed', icon:'🌾', type:'seed', stackable:true, crop:'rice' },
  seed_wheat:  { id:'seed_wheat', name:'Wheat Seed', icon:'🌾', type:'seed', stackable:true, crop:'wheat' },
  seed_watermelon:{ id:'seed_watermelon', name:'Watermelon Seed', icon:'🍉', type:'seed', stackable:true, crop:'watermelon' },

  // crops (harvested produce) - filled in by farming.js CROPS but referenced here for icons
  crop_carrot: { id:'crop_carrot', name:'Carrot', icon:'🥕', type:'crop', stackable:true, sell:20 },
  crop_potato: { id:'crop_potato', name:'Potato', icon:'🥔', type:'crop', stackable:true, sell:22 },
  crop_corn:   { id:'crop_corn', name:'Corn', icon:'🌽', type:'crop', stackable:true, sell:35 },
  crop_tomato: { id:'crop_tomato', name:'Tomato', icon:'🍅', type:'crop', stackable:true, sell:30 },
  crop_pumpkin:{ id:'crop_pumpkin', name:'Pumpkin', icon:'🎃', type:'crop', stackable:true, sell:90 },
  crop_blueberry:{ id:'crop_blueberry', name:'Blueberry', icon:'🫐', type:'crop', stackable:true, sell:28 },
  crop_strawberry:{ id:'crop_strawberry', name:'Strawberry', icon:'🍓', type:'crop', stackable:true, sell:36 },
  crop_rice:   { id:'crop_rice', name:'Rice', icon:'🌾', type:'crop', stackable:true, sell:18 },
  crop_wheat:  { id:'crop_wheat', name:'Wheat', icon:'🌾', type:'crop', stackable:true, sell:16 },
  crop_watermelon:{ id:'crop_watermelon', name:'Watermelon', icon:'🍉', type:'crop', stackable:true, sell:120 },

  // mutations
  crop_candyberry:   { id:'crop_candyberry', name:'Candy Berry', icon:'🍬', type:'crop', stackable:true, sell:150, mutation:true },
  crop_crimsongourd: { id:'crop_crimsongourd', name:'Crimson Gourd', icon:'🎃', type:'crop', stackable:true, sell:220, mutation:true },
  crop_midnightgrain:{ id:'crop_midnightgrain', name:'Midnight Grain', icon:'🌌', type:'crop', stackable:true, sell:180, mutation:true },
  crop_goldencarrot: { id:'crop_goldencarrot', name:'Golden Carrot', icon:'✨', type:'crop', stackable:true, sell:500, mutation:true, ultra:true },
  crop_crystalberry: { id:'crop_crystalberry', name:'Crystal Berry', icon:'💠', type:'crop', stackable:true, sell:650, mutation:true, ultra:true },
  crop_rainbowpumpkin:{ id:'crop_rainbowpumpkin', name:'Rainbow Pumpkin', icon:'🌈', type:'crop', stackable:true, sell:800, mutation:true, ultra:true },

  // animal products
  egg:     { id:'egg', name:'Egg', icon:'🥚', type:'product', stackable:true, sell:15 },
  milk:    { id:'milk', name:'Milk', icon:'🥛', type:'product', stackable:true, sell:20 },
  wool:    { id:'wool', name:'Wool', icon:'🧶', type:'product', stackable:true, sell:25 },
  feather: { id:'feather', name:'Feather', icon:'🪶', type:'product', stackable:true, sell:8 },

  // fish
  fish_bass: { id:'fish_bass', name:'Bass', icon:'🐟', type:'fish', stackable:true, sell:24 },
  fish_salmon: { id:'fish_salmon', name:'Salmon', icon:'🐠', type:'fish', stackable:true, sell:40 },
  fish_catfish: { id:'fish_catfish', name:'Catfish', icon:'🐡', type:'fish', stackable:true, sell:35 },
  fish_trout: { id:'fish_trout', name:'Trout', icon:'🐟', type:'fish', stackable:true, sell:32 },
  fish_tuna: { id:'fish_tuna', name:'Tuna', icon:'🐟', type:'fish', stackable:true, sell:70 },
  fish_swordfish: { id:'fish_swordfish', name:'Swordfish', icon:'🗡️', type:'fish', stackable:true, sell:150 },
  fish_legendary: { id:'fish_legendary', name:'Legendary Fish', icon:'🐉', type:'fish', stackable:true, sell:1000 },

  // crafted / buildings items
  sprinkler: { id:'sprinkler', name:'Sprinkler', icon:'💧', type:'placeable', stackable:true },
  scarecrow: { id:'scarecrow', name:'Scarecrow', icon:'🎌', type:'placeable', stackable:true },
  chest:     { id:'chest', name:'Storage Chest', icon:'📦', type:'placeable', stackable:true },
  furnace:   { id:'furnace', name:'Furnace', icon:'🔥', type:'placeable', stackable:true },
  generator: { id:'generator', name:'Generator', icon:'🔋', type:'placeable', stackable:true },
  drone:     { id:'drone', name:'Farm Drone', icon:'🛸', type:'placeable', stackable:true },
  harvester: { id:'harvester', name:'Auto Harvester', icon:'🤖', type:'placeable', stackable:true },

  bar_copper: { id:'bar_copper', name:'Copper Bar', icon:'🟧', type:'resource', stackable:true, sell:40 },
  bar_iron:   { id:'bar_iron', name:'Iron Bar', icon:'⬜', type:'resource', stackable:true, sell:70 },
  bar_gold:   { id:'bar_gold', name:'Gold Bar', icon:'🟨', type:'resource', stackable:true, sell:140 },

  // pet adoption
  pet_dog:   { id:'pet_dog', name:'Adopt Dog', icon:'🐕', type:'pet_adopt', stackable:false, buy:200 },
  pet_cat:   { id:'pet_cat', name:'Adopt Cat', icon:'🐈', type:'pet_adopt', stackable:false, buy:200 },
  pet_fox:   { id:'pet_fox', name:'Adopt Fox', icon:'🦊', type:'pet_adopt', stackable:false, buy:300 },
  pet_crow:  { id:'pet_crow', name:'Adopt Crow', icon:'🐦‍⬛', type:'pet_adopt', stackable:false, buy:300 },
  pet_robot: { id:'pet_robot', name:'Adopt Robot Pet', icon:'🤖', type:'pet_adopt', stackable:false, buy:500 },

  // building blueprints (purchased then placed on the farm)
  greenhouse: { id:'greenhouse', name:'Greenhouse', icon:'🏡', type:'building_blueprint', stackable:false, buy:800 },
  workshop:   { id:'workshop', name:'Workshop', icon:'🛠️', type:'building_blueprint', stackable:false, buy:500 },
  warehouse:  { id:'warehouse', name:'Warehouse', icon:'🏬', type:'building_blueprint', stackable:false, buy:600 },
  marketstall:{ id:'marketstall', name:'Market Stall', icon:'🏪', type:'building_blueprint', stackable:false, buy:400 },
  windmill:   { id:'windmill', name:'Windmill', icon:'🎡', type:'building_blueprint', stackable:false, buy:700 },

  // museum collectibles
  bug_firefly: { id:'bug_firefly', name:'Firefly', icon:'✨', type:'collectible', stackable:true, sell:30 },
  bug_beetle:  { id:'bug_beetle', name:'Jewel Beetle', icon:'🪲', type:'collectible', stackable:true, sell:45 },
  fossil:      { id:'fossil', name:'Fossil', icon:'🦴', type:'collectible', stackable:true, sell:60 },
  trophy:      { id:'trophy', name:'Boss Trophy', icon:'🏆', type:'collectible', stackable:true, sell:300 },
};

export function itemDef(id) { return ITEMS[id]; }

export function createInventory(capacity = 30) {
  return { capacity, slots: [] };
}

export function addItem(inv, id, qty = 1) {
  const def = ITEMS[id];
  if (!def) return false;
  if (def.stackable) {
    const slot = inv.slots.find(s => s.id === id);
    if (slot) { slot.qty += qty; return true; }
  }
  if (inv.slots.length >= inv.capacity) return false;
  inv.slots.push({ id, qty });
  return true;
}

export function removeItem(inv, id, qty = 1) {
  const slot = inv.slots.find(s => s.id === id);
  if (!slot || slot.qty < qty) return false;
  slot.qty -= qty;
  if (slot.qty <= 0) inv.slots = inv.slots.filter(s => s !== slot);
  return true;
}

export function countItem(inv, id) {
  const slot = inv.slots.find(s => s.id === id);
  return slot ? slot.qty : 0;
}

export function hasItem(inv, id, qty = 1) { return countItem(inv, id) >= qty; }

export function hasItems(inv, requirements) {
  return Object.entries(requirements).every(([id, qty]) => hasItem(inv, id, qty));
}

export function removeItems(inv, requirements) {
  Object.entries(requirements).forEach(([id, qty]) => removeItem(inv, id, qty));
}
