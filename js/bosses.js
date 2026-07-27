// bosses.js - encounters that gate regions/recipes/tools

export const BOSSES = [
  { id:'forest_guardian', name:'Forest Guardian', region:'forest', hp:120, damage:6, icon:'🌳', unlocks:{ region:'desert' }, rewardItem:'trophy' },
  { id:'crystal_worm',    name:'Crystal Worm',    region:'crystalcavern', hp:180, damage:9, icon:'🪱', unlocks:{ region:'crystalcavern_deep', recipe:'drone' }, rewardItem:'trophy' },
  { id:'storm_spirit',    name:'Storm Spirit',    region:'beach', hp:150, damage:8, icon:'🌪️', unlocks:{ region:'tropical' }, rewardItem:'trophy' },
  { id:'volcano_titan',   name:'Volcano Titan',   region:'volcano', hp:260, damage:12, icon:'🌋', unlocks:{ region:'volcano_core', tool:'sword' }, rewardItem:'trophy' },
  { id:'ancient_machine', name:'Ancient Machine', region:'ruins', hp:220, damage:10, icon:'⚙️', unlocks:{ region:'floatingisles', recipe:'harvester' }, rewardItem:'trophy' },
  { id:'sky_serpent',     name:'Sky Serpent',     region:'snowmountains', hp:200, damage:9, icon:'🐍', unlocks:{ region:'snowmountains_peak' }, rewardItem:'trophy' },
];

export function startBossFight(bossId, playerAttack) {
  const def = BOSSES.find(b => b.id === bossId);
  if (!def) return null;
  return { bossId, name: def.name, icon: def.icon, hpMax: def.hp, hp: def.hp, damage: def.damage, log: [`A wild ${def.name} appears!`] };
}

export function attackBoss(fight, playerDamage) {
  if (!fight || fight.hp <= 0) return fight;
  fight.hp = Math.max(0, fight.hp - playerDamage);
  fight.log.push(`You hit ${fight.name} for ${playerDamage}.`);
  if (fight.hp <= 0) {
    fight.log.push(`${fight.name} is defeated!`);
    fight.won = true;
    return fight;
  }
  const dmgToPlayer = Math.max(1, Math.round(fight.damage * (0.7 + Math.random() * 0.6)));
  fight.log.push(`${fight.name} strikes back for ${dmgToPlayer}.`);
  fight.lastDamageToPlayer = dmgToPlayer;
  return fight;
}

export function getBossDef(bossId) { return BOSSES.find(b => b.id === bossId); }
