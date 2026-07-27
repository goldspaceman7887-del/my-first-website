// animals.js - farm animals: feeding, housing, happiness, products

export const ANIMAL_TYPES = {
  chicken: { id:'chicken', name:'Chicken', icon:'🐔', cost:120, product:'egg', productTime:16, building:'coop', color:'#f4f0e0' },
  cow:     { id:'cow', name:'Cow', icon:'🐄', cost:300, product:'milk', productTime:20, building:'barn', color:'#e8e8e8' },
  duck:    { id:'duck', name:'Duck', icon:'🦆', cost:150, product:'feather', productTime:14, building:'coop', color:'#f0e070' },
  sheep:   { id:'sheep', name:'Sheep', icon:'🐑', cost:250, product:'wool', productTime:36, building:'barn', color:'#f8f8f0' },
  goat:    { id:'goat', name:'Goat', icon:'🐐', cost:220, product:'milk', productTime:18, building:'barn', color:'#d8d0c0' },
};

export function createAnimal(type, id, x, y) {
  return { id, type, x, y, happiness:50, fed:false, watered:false, lastProductAt:0, age:0 };
}

// call once per game-hour tick
export function updateAnimal(animal, gameMinutesNow) {
  const def = ANIMAL_TYPES[animal.type];
  if (!def) return null;
  if (!animal.fed) animal.happiness = Math.max(0, animal.happiness - 2);
  if (!animal.watered) animal.happiness = Math.max(0, animal.happiness - 1);
  if (animal.fed && animal.watered) animal.happiness = Math.min(100, animal.happiness + 3);

  let produced = null;
  const hoursSinceProduct = (gameMinutesNow - animal.lastProductAt) / 60;
  if (hoursSinceProduct >= def.productTime && animal.happiness >= 20) {
    animal.lastProductAt = gameMinutesNow;
    const qualityBonus = animal.happiness >= 80 ? 1 : 0;
    produced = { itemId: def.product, qty: 1 + qualityBonus };
  }
  return produced;
}

export function feedAnimal(animal) { animal.fed = true; }
export function waterAnimal(animal) { animal.watered = true; }
export function resetDailyCare(animal) { animal.fed = false; animal.watered = false; }

// Pets ---------------------------------------------------------------
export const PET_TYPES = {
  dog:   { id:'dog', name:'Dog', icon:'🐕', ability:'Treasure digging', desc:'Occasionally digs up gold or items while exploring.' },
  cat:   { id:'cat', name:'Cat', icon:'🐈', ability:'Protect crops', desc:'Scares off pests, reducing crop damage.' },
  fox:   { id:'fox', name:'Fox', icon:'🦊', ability:'Find rare seeds', desc:'Occasionally finds rare seeds while foraging.' },
  crow:  { id:'crow', name:'Crow', icon:'🐦‍⬛', ability:'Weather prediction', desc:'Reveals tomorrow\'s weather.' },
  robot: { id:'robot', name:'Robot Pet', icon:'🤖', ability:'Auto gathering', desc:'Automatically gathers nearby resources over time.' },
};

export function createPet(type) { return { type, xp: 0, level: 1 }; }

// returns an event object or null; called on a periodic tick (e.g. every game hour)
export function petTick(pet, ctx) {
  if (!pet) return null;
  const roll = Math.random();
  switch (pet.type) {
    case 'dog':
      if (roll < 0.15) { const gold = 5 + Math.floor(Math.random() * 40); return { type: 'gold', amount: gold, message: `Your dog dug up ${gold}g!` }; }
      break;
    case 'cat':
      return { type: 'protect', message: 'Your cat is watching over the crops.' };
    case 'fox':
      if (roll < 0.12) { const seeds = Object.keys({seed_carrot:1,seed_potato:1,seed_corn:1,seed_tomato:1}); const s = seeds[Math.floor(Math.random()*seeds.length)]; return { type:'item', itemId: s, qty: 2, message: 'Your fox found rare seeds!' }; }
      break;
    case 'crow':
      return { type: 'forecast', message: 'Your crow senses tomorrow\'s weather.' };
    case 'robot':
      if (roll < 0.25) return { type: 'gather', message: 'Your robot pet auto-gathered nearby resources.' };
      break;
  }
  return null;
}
