// quests.js - procedural quest generation & tracking

const TEMPLATES = [
  { type:'grow', verb:'Grow and harvest', targetPool:['carrot','potato','corn','tomato','pumpkin'], countRange:[3,8], rewardGold:[40,120] },
  { type:'catch', verb:'Catch', targetPool:['fish_bass','fish_salmon','fish_trout','fish_catfish'], countRange:[2,5], rewardGold:[50,140] },
  { type:'donate', verb:'Donate to the museum', targetPool:['fossil','relic','bug_firefly','bug_beetle'], countRange:[1,3], rewardGold:[60,150] },
  { type:'craft', verb:'Craft', targetPool:['sprinkler','scarecrow','chest','furnace'], countRange:[1,2], rewardGold:[70,160] },
  { type:'explore', verb:'Explore', targetPool:['forest','beach','mountains','mine','river'], countRange:[1,1], rewardGold:[30,90] },
  { type:'mine', verb:'Mine', targetPool:['stone','coal','copper','iron'], countRange:[5,15], rewardGold:[40,110] },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

let questIdCounter = 1;

export function generateDailyQuests(count = 3) {
  const quests = [];
  for (let i = 0; i < count; i++) {
    const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const target = t.targetPool[Math.floor(Math.random() * t.targetPool.length)];
    const need = rand(t.countRange[0], t.countRange[1]);
    const gold = rand(t.rewardGold[0], t.rewardGold[1]);
    quests.push({
      id: `q${Date.now()}_${questIdCounter++}`,
      type: t.type,
      title: `${t.verb} ${need > 1 ? need + ' ' : ''}${labelFor(target)}`,
      target, need, progress: 0, rewardGold: gold, rewardXp: rand(10, 30), completed: false, claimed: false,
    });
  }
  return quests;
}

function labelFor(id) {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// event = {type: 'grow'|'catch'|'donate'|'craft'|'explore'|'mine', target, amount}
export function updateQuestProgress(questList, event) {
  const notifications = [];
  for (const q of questList) {
    if (q.completed) continue;
    if (q.type !== event.type) continue;
    if (q.target !== event.target) continue;
    q.progress = Math.min(q.need, q.progress + (event.amount || 1));
    if (q.progress >= q.need) { q.completed = true; notifications.push(q); }
  }
  return notifications;
}

export function claimReward(quest) {
  if (!quest.completed || quest.claimed) return null;
  quest.claimed = true;
  return { gold: quest.rewardGold, xp: quest.rewardXp };
}
