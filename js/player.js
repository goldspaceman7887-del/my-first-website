// player.js - player entity: movement, skills, rendering, tool state

import { TILE_SIZE } from './world.js';

export const SKIN_TONES = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#5a3825'];
export const HAIR_COLORS = ['#3a2a1a', '#7a4a2a', '#c9a227', '#d94f4f', '#333333', '#ffffff', '#5a3aa5'];
export const CLOTHES_COLORS = ['#3a6ea5', '#5a8f4a', '#a53a3a', '#a5883a', '#6a3aa5', '#3a9ea0'];
export const HAT_OPTIONS = ['none', 'strawhat', 'cap', 'crown', 'beanie'];
export const BACKPACK_OPTIONS = ['none', 'brown', 'green', 'purple'];

export function defaultAppearance() {
  return { skin: SKIN_TONES[0], hair: HAIR_COLORS[0], eyes: '#3a2a1a', clothes: CLOTHES_COLORS[0], hat: 'none', backpack: 'none' };
}

export const SKILLS = ['farming', 'mining', 'fishing', 'foraging', 'crafting'];

export function defaultSkills() {
  const s = {};
  for (const k of SKILLS) s[k] = { level: 1, xp: 0 };
  return s;
}

export function xpForNextLevel(level) { return 50 * level + (level - 1) * 20; }

export function addSkillXp(skills, skillName, amount) {
  const s = skills[skillName];
  if (!s) return null;
  s.xp += amount;
  let leveled = false;
  while (s.xp >= xpForNextLevel(s.level) && s.level < 20) {
    s.xp -= xpForNextLevel(s.level);
    s.level++;
    leveled = true;
  }
  return leveled ? s.level : null;
}

export class Player {
  constructor(state) {
    this.state = state; // reference into save data
    this.pixelX = state.x * TILE_SIZE;
    this.pixelY = state.y * TILE_SIZE;
    this.facing = state.facing || 'down';
    this.moving = false;
    this.animTime = 0;
    this.speed = 3.6; // tiles per second
    this.hp = state.hp ?? 100;
    this.maxHp = 100;
  }

  get tileX() { return Math.round(this.pixelX / TILE_SIZE); }
  get tileY() { return Math.round(this.pixelY / TILE_SIZE); }

  facingOffset() {
    switch (this.facing) {
      case 'up': return { x: 0, y: -1 };
      case 'down': return { x: 0, y: 1 };
      case 'left': return { x: -1, y: 0 };
      case 'right': return { x: 1, y: 0 };
    }
    return { x: 0, y: 1 };
  }

  update(dt, moveVec, canMoveTo) {
    this.moving = false;
    if (moveVec.x !== 0 || moveVec.y !== 0) {
      const len = Math.hypot(moveVec.x, moveVec.y) || 1;
      const nx = moveVec.x / len, ny = moveVec.y / len;
      if (Math.abs(moveVec.x) > Math.abs(moveVec.y)) this.facing = moveVec.x > 0 ? 'right' : 'left';
      else if (moveVec.y !== 0) this.facing = moveVec.y > 0 ? 'down' : 'up';

      const dx = nx * this.speed * TILE_SIZE * dt;
      const dy = ny * this.speed * TILE_SIZE * dt;
      const newX = this.pixelX + dx;
      const newY = this.pixelY + dy;
      if (canMoveTo(newX, this.pixelY)) this.pixelX = newX;
      if (canMoveTo(this.pixelX, newY)) this.pixelY = newY;
      this.moving = true;
      this.animTime += dt;
    }
    this.state.x = this.tileX;
    this.state.y = this.tileY;
    this.state.facing = this.facing;
  }

  draw(ctx, screenX, screenY, appearance) {
    const bob = this.moving ? Math.sin(this.animTime * 10) * 2 : 0;
    const w = 20, h = 28;
    const x = screenX - w / 2, y = screenY - h + bob;
    ctx.save();
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(screenX, screenY + 2, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
    // backpack
    if (appearance.backpack !== 'none') {
      const bpColors = { brown:'#6b4a2b', green:'#3a6e3a', purple:'#5a3aa5' };
      ctx.fillStyle = bpColors[appearance.backpack] || '#6b4a2b';
      ctx.fillRect(x - 3, y + 6, 6, 12);
    }
    // legs
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(x + 3, y + 20, 6, 8);
    ctx.fillRect(x + 11, y + 20, 6, 8);
    // body / clothes
    ctx.fillStyle = appearance.clothes;
    ctx.fillRect(x + 2, y + 10, 16, 12);
    // arms
    ctx.fillStyle = appearance.skin;
    ctx.fillRect(x, y + 11, 3, 8);
    ctx.fillRect(x + 17, y + 11, 3, 8);
    // head
    ctx.fillStyle = appearance.skin;
    ctx.fillRect(x + 3, y, 14, 12);
    // eyes (direction-aware)
    ctx.fillStyle = appearance.eyes;
    if (this.facing === 'left') { ctx.fillRect(x + 5, y + 5, 2, 2); }
    else if (this.facing === 'right') { ctx.fillRect(x + 13, y + 5, 2, 2); }
    else { ctx.fillRect(x + 6, y + 5, 2, 2); ctx.fillRect(x + 12, y + 5, 2, 2); }
    // hair
    ctx.fillStyle = appearance.hair;
    ctx.fillRect(x + 2, y - 2, 16, 4);
    // hat
    if (appearance.hat !== 'none') {
      ctx.fillStyle = { strawhat:'#e8d27a', cap:'#a53a3a', crown:'#ffd95f', beanie:'#3a6ea5' }[appearance.hat] || '#fff';
      if (appearance.hat === 'strawhat') { ctx.beginPath(); ctx.ellipse(x+9, y-1, 11, 3, 0, 0, Math.PI*2); ctx.fill(); }
      else ctx.fillRect(x + 1, y - 5, 16, 5);
    }
    ctx.restore();
  }
}
