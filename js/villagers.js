// villagers.js - 15 NPCs with schedules, dialogue, friendship, gifts

export const VILLAGERS = [
  { id:'maple',   name:'Maple',   personality:'Cheerful',  home:'town',   loves:['crop_strawberry','crop_blueberry'], likes:['crop_carrot'], dislikes:['stone'] },
  { id:'flint',   name:'Flint',   personality:'Gruff',     home:'mountains', loves:['iron','diamond'], likes:['stone','coal'], dislikes:['crop_blueberry'] },
  { id:'willow',  name:'Willow',  personality:'Dreamy',    home:'forest', loves:['bug_firefly','fossil'], likes:['wood'], dislikes:['fish_bass'] },
  { id:'reef',    name:'Reef',    personality:'Laid-back', home:'beach',  loves:['fish_tuna','fish_swordfish'], likes:['fish_bass'], dislikes:['wood'] },
  { id:'sage',    name:'Sage',    personality:'Wise',      home:'town',   loves:['relic','fossil'], likes:['crop_pumpkin'], dislikes:['egg'] },
  { id:'daisy',   name:'Daisy',   personality:'Sweet',     home:'farm',   loves:['egg','milk'], likes:['wool'], dislikes:['coal'] },
  { id:'gus',     name:'Gus',     personality:'Jolly',     home:'town',   loves:['crop_corn','crop_wheat'], likes:['bar_iron'], dislikes:['bug_beetle'] },
  { id:'luna',    name:'Luna',    personality:'Mysterious',home:'ruins',  loves:['crystalore','crop_crystalberry'], likes:['relic'], dislikes:['crop_potato'] },
  { id:'ember',   name:'Ember',   personality:'Fiery',     home:'volcano',loves:['gold_ore','bar_gold'], likes:['coal'], dislikes:['milk'] },
  { id:'pip',     name:'Pip',     personality:'Energetic', home:'town',   loves:['bug_beetle','bug_firefly'], likes:['fiber'], dislikes:['fish_catfish'] },
  { id:'rosa',    name:'Rosa',    personality:'Kind',      home:'farm',   loves:['crop_watermelon','crop_tomato'], likes:['crop_carrot'], dislikes:['stone'] },
  { id:'oak',     name:'Oak',     personality:'Sturdy',    home:'forest', loves:['wood','crop_pumpkin'], likes:['fiber'], dislikes:['fish_tuna'] },
  { id:'brook',   name:'Brook',   personality:'Calm',      home:'river',  loves:['fish_salmon','fish_trout'], likes:['fish_bass'], dislikes:['stone'] },
  { id:'nova',    name:'Nova',    personality:'Curious',   home:'floatingisles', loves:['crop_rainbowpumpkin','crop_goldencarrot'], likes:['relic'], dislikes:['wood'] },
  { id:'clay',    name:'Clay',    personality:'Patient',   home:'mine',   loves:['diamond','crystalore'], likes:['copper','iron'], dislikes:['crop_strawberry'] },
];

const DIALOGUE = {
  Cheerful:  ["What a lovely day!", "I love farm-fresh produce!", "Have you visited the town square today?"],
  Gruff:     ["Hmph. Need something?", "The mine's dangerous these days.", "Don't waste my time... unless you brought ore."],
  Dreamy:    ["I saw the strangest cloud shape today...", "Do you ever wonder what's past the mountains?", "Fireflies are so magical at dusk."],
  'Laid-back':["Tides are good today.", "Caught anything good?", "No rush, friend."],
  Wise:      ["The old ruins hold many secrets.", "Patience yields the rarest crops.", "Every relic tells a story."],
  Sweet:     ["The animals are doing well today!", "Would you like some fresh milk?", "Thank you for stopping by."],
  Jolly:     ["Ho ho! Good harvest today?", "The market's buzzing this morning!", "Life on the farm is grand!"],
  Mysterious:["The crystals whisper strange things...", "Not everyone is ready for the ruins.", "Some doors are better left closed."],
  Fiery:     ["Feel that heat? Volcano's restless.", "Bring me gold and I'll make it shine.", "Careful near the lava fields!"],
  Energetic: ["Race you to the town square!", "I found a beetle this big!", "Let's go exploring!"],
  Kind:      ["The farm looks wonderful today.", "Would you like to trade?", "Your crops are looking great!"],
  Sturdy:    ["Chopped ten logs before breakfast.", "The forest provides.", "Careful of falling branches."],
  Calm:      ["The river's peaceful this morning.", "Good fish come to patient anglers.", "Listen to the water flow."],
  Curious:   ["What's it like down there on the ground?", "I wonder what's beyond the clouds.", "Floating islands are full of secrets."],
  Patient:   ["Deep in the mine, time stands still.", "Ancient depths hide great treasure.", "Slow and steady, friend."],
};

export function getDialogue(villagerId) {
  const v = VILLAGERS.find(v => v.id === villagerId);
  if (!v) return "...";
  const lines = DIALOGUE[v.personality] || ["Hello!"];
  return lines[Math.floor(Math.random() * lines.length)];
}

// schedule: returns {region,x,y,activity} based on game hour (0-23)
export function getSchedulePosition(villager, hour) {
  const homeCoord = { x: 5 + (hashCode(villager.id) % 10), y: 5 + (hashCode(villager.id + 'y') % 8) };
  if (hour >= 6 && hour < 11) return { region: villager.home, x: homeCoord.x, y: homeCoord.y, activity: 'Working' };
  if (hour >= 11 && hour < 14) return { region: 'town', x: 10 + (hashCode(villager.id) % 8), y: 8, activity: 'Shopping' };
  if (hour >= 14 && hour < 18) return { region: villager.home, x: homeCoord.x + 2, y: homeCoord.y, activity: 'Working' };
  if (hour >= 18 && hour < 22) return { region: 'town', x: 12, y: 10 + (hashCode(villager.id) % 6), activity: 'Socializing' };
  return { region: villager.home, x: homeCoord.x, y: homeCoord.y, activity: 'Sleeping' };
}

function hashCode(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

export const FRIENDSHIP_MAX = 10;

export function giftVillager(friendshipState, villagerId, itemId) {
  const v = VILLAGERS.find(v => v.id === villagerId);
  if (!v) return { delta: 0, reaction: 'neutral' };
  const state = friendshipState[villagerId] || { points: 0, giftsToday: 0 };
  if (state.giftsToday >= 1) return { delta: 0, reaction: 'already_gifted' };
  let delta = 2;
  let reaction = 'neutral';
  if (v.loves.includes(itemId)) { delta = 8; reaction = 'loved'; }
  else if (v.likes.includes(itemId)) { delta = 5; reaction = 'liked'; }
  else if (v.dislikes.includes(itemId)) { delta = -5; reaction = 'disliked'; }
  state.points = Math.max(0, Math.min(FRIENDSHIP_MAX * 25, state.points + delta));
  state.giftsToday = 1;
  friendshipState[villagerId] = state;
  return { delta, reaction, hearts: Math.floor(state.points / 25) };
}

export function getHearts(friendshipState, villagerId) {
  const state = friendshipState[villagerId];
  return state ? Math.floor(state.points / 25) : 0;
}

export function unlocksForHearts(hearts) {
  const unlocks = [];
  if (hearts >= 2) unlocks.push('discount');
  if (hearts >= 4) unlocks.push('quest');
  if (hearts >= 6) unlocks.push('recipe');
  if (hearts >= 8) unlocks.push('special_gift');
  return unlocks;
}
