// weather.js - weather system: types, daily roll, gameplay effects, particle rendering

export const WEATHER = {
  sunny:   { id:'sunny', name:'Sunny', icon:'☀️', growthMultiplier:1.0, fishingMultiplier:1.0, visibility:1.0 },
  rain:    { id:'rain', name:'Rain', icon:'🌧️', growthMultiplier:1.3, fishingMultiplier:1.3, visibility:0.9 },
  storm:   { id:'storm', name:'Storm', icon:'⛈️', growthMultiplier:1.1, fishingMultiplier:0.6, visibility:0.6 },
  snow:    { id:'snow', name:'Snow', icon:'❄️', growthMultiplier:0.5, fishingMultiplier:0.8, visibility:0.85 },
  fog:     { id:'fog', name:'Fog', icon:'🌫️', growthMultiplier:0.9, fishingMultiplier:1.1, visibility:0.45 },
  drought: { id:'drought', name:'Drought', icon:'🔥', growthMultiplier:0.4, fishingMultiplier:0.7, visibility:1.0 },
  rainbowrain: { id:'rainbowrain', name:'Rainbow Rain', icon:'🌈', growthMultiplier:1.6, fishingMultiplier:1.4, visibility:0.9, mutationBoost:true },
  meteorshower: { id:'meteorshower', name:'Meteor Shower', icon:'☄️', growthMultiplier:1.0, fishingMultiplier:0.9, visibility:0.7, meteor:true },
};

const SEASON_WEIGHTS = {
  spring: { sunny:45, rain:30, storm:8, fog:10, drought:2, rainbowrain:4, meteorshower:1 },
  summer: { sunny:50, rain:15, storm:12, fog:5, drought:14, rainbowrain:3, meteorshower:1 },
  fall:   { sunny:40, rain:28, storm:10, fog:14, drought:4, rainbowrain:3, meteorshower:1 },
  winter: { sunny:25, snow:45, storm:8, fog:15, drought:0, rainbowrain:2, meteorshower:5 },
};

export function rollWeather(season) {
  const weights = SEASON_WEIGHTS[season] || SEASON_WEIGHTS.spring;
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [id, w] of Object.entries(weights)) {
    if (r < w) return id;
    r -= w;
  }
  return 'sunny';
}

export function getWeatherEffects(weatherId) {
  return WEATHER[weatherId] || WEATHER.sunny;
}

// simple particle system for canvas rendering
export class WeatherParticles {
  constructor() { this.particles = []; this.type = 'sunny'; }
  setType(type, viewW, viewH) {
    if (this.type === type) return;
    this.type = type;
    this.particles = [];
    const count = { rain: 120, storm: 180, snow: 90, meteorshower: 6, rainbowrain: 120 }[type] || 0;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * viewW, y: Math.random() * viewH,
        speed: 200 + Math.random() * 200, len: 8 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 40, hue: Math.random() * 360
      });
    }
  }
  update(dt, viewW, viewH) {
    if (this.type === 'meteorshower' && Math.random() < 0.02) {
      this.particles.push({ x: Math.random() * viewW, y: -20, speed: 500, len: 26, drift: -120, meteor: true, hue: 20 });
    }
    for (const p of this.particles) {
      p.y += p.speed * dt;
      p.x += (p.drift || 0) * dt;
      if (p.y > viewH + 20) { p.y = -20; p.x = Math.random() * viewW; }
    }
  }
  render(ctx, viewW, viewH) {
    if (this.type === 'sunny' || this.type === 'drought') return;
    ctx.save();
    if (this.type === 'fog') {
      ctx.fillStyle = 'rgba(220,220,230,0.35)';
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.restore();
      return;
    }
    if (this.type === 'rain' || this.type === 'storm') {
      ctx.strokeStyle = 'rgba(180,210,255,0.55)';
      ctx.lineWidth = 2;
      for (const p of this.particles) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 3, p.y + p.len); ctx.stroke();
      }
      if (this.type === 'storm') {
        ctx.fillStyle = 'rgba(20,10,30,0.15)'; ctx.fillRect(0,0,viewW,viewH);
      }
    } else if (this.type === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (const p of this.particles) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI*2); ctx.fill(); }
    } else if (this.type === 'rainbowrain') {
      for (const p of this.particles) {
        ctx.strokeStyle = `hsla(${p.hue},90%,65%,0.7)`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 2, p.y + p.len); ctx.stroke();
      }
    } else if (this.type === 'meteorshower') {
      ctx.strokeStyle = 'rgba(255,140,60,0.9)'; ctx.lineWidth = 3;
      for (const p of this.particles) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 14, p.y - 26); ctx.stroke();
      }
    }
    ctx.restore();
  }
}
