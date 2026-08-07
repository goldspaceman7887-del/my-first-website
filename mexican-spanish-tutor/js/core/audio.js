// Audio immersion engine: Web Speech API (es-MX synthesis) + optional
// speech recognition for pronunciation/speaking assessment.
// No audio files are shipped — everything is synthesized live, which keeps
// the app fully offline-capable and avoids stale/inauthentic recordings.

import { store } from "./storage.js";

class AudioEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this._ready = false;
    this._readyCallbacks = [];
    this._currentUtterance = null;
    if (this.synth) {
      this._loadVoices();
      this.synth.onvoiceschanged = () => this._loadVoices();
    }
  }

  _loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length && !this._ready) {
      this._ready = true;
      this._readyCallbacks.forEach((cb) => cb());
      this._readyCallbacks = [];
    }
  }

  onReady(cb) {
    if (this._ready) cb();
    else this._readyCallbacks.push(cb);
  }

  isSupported() {
    return !!this.synth;
  }

  // Mexican Spanish voices first (es-MX), then any other Latin American
  // Spanish, then any Spanish at all as a last resort — never es-ES-only
  // unless nothing else exists, since this app targets Mexican Spanish.
  mexicanVoices() {
    const mx = this.voices.filter((v) => v.lang && /^es-mx/i.test(v.lang));
    if (mx.length) return mx;
    const latam = this.voices.filter((v) => v.lang && /^es-(us|419|ar|co|cl|pe|ve)/i.test(v.lang));
    if (latam.length) return latam;
    return this.voices.filter((v) => v.lang && /^es/i.test(v.lang));
  }

  pickVoice(genderPref = "any") {
    const pool = this.mexicanVoices();
    if (!pool.length) return null;
    const femaleHints = /female|paulina|mónica|monica|luciana|isabela|sabina/i;
    const maleHints = /male|jorge|carlos|diego|juan/i;
    if (genderPref === "female") {
      const f = pool.find((v) => femaleHints.test(v.name));
      if (f) return f;
    }
    if (genderPref === "male") {
      const m = pool.find((v) => maleHints.test(v.name));
      if (m) return m;
    }
    const preferredName = store.state.settings.preferredVoiceName;
    if (preferredName) {
      const named = pool.find((v) => v.name === preferredName);
      if (named) return named;
    }
    return pool[0];
  }

  stop() {
    if (this.synth) this.synth.cancel();
  }

  /**
   * Speak Mexican Spanish text.
   * @param {string} text
   * @param {object} opts { rate, pitch, voiceName, gender, onend, onstart }
   */
  speak(text, opts = {}) {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve({ skipped: true, reason: "unsupported" });
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-MX";
      utter.rate = opts.rate ?? store.state.settings.voiceRate ?? 0.95;
      utter.pitch = opts.pitch ?? 1;
      const voice = opts.voiceName
        ? this.voices.find((v) => v.name === opts.voiceName)
        : this.pickVoice(opts.gender || store.state.settings.preferredVoiceGender);
      if (voice) utter.voice = voice;
      utter.onstart = () => opts.onstart && opts.onstart();
      utter.onend = () => {
        opts.onend && opts.onend();
        resolve({ skipped: false });
      };
      utter.onerror = () => resolve({ skipped: true, reason: "error" });
      this._currentUtterance = utter;
      this.synth.speak(utter);
    });
  }

  speakSlow(text, opts = {}) {
    return this.speak(text, { ...opts, rate: store.state.settings.slowVoiceRate ?? 0.6 });
  }

  /**
   * Shadowing mode: plays a phrase, pauses for the learner to repeat, loops N times.
   * Returns a controller with .cancel().
   */
  shadow(text, { repeats = 3, gapMs = 2400, rate, onRound, onDone } = {}) {
    let cancelled = false;
    let round = 0;
    const controller = {
      cancel() {
        cancelled = true;
        audioEngine.stop();
      }
    };
    const step = async () => {
      if (cancelled || round >= repeats) {
        if (!cancelled && onDone) onDone();
        return;
      }
      round++;
      onRound && onRound(round);
      await this.speak(text, { rate });
      if (cancelled) return;
      setTimeout(step, gapMs);
    };
    step();
    return controller;
  }
}

export const audioEngine = new AudioEngine();

// --- Speech recognition (best-effort; Chrome/Edge only) ---------------
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition || null;

export function speechRecognitionSupported() {
  return !!SpeechRecognitionImpl;
}

/**
 * Listen for a single utterance in Spanish and resolve with the transcript.
 * Resolves { supported:false } gracefully if unavailable.
 */
export function listenOnce({ timeoutMs = 8000 } = {}) {
  return new Promise((resolve) => {
    if (!SpeechRecognitionImpl) {
      resolve({ supported: false });
      return;
    }
    const rec = new SpeechRecognitionImpl();
    rec.lang = "es-MX";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      try {
        rec.stop();
      } catch (e) {}
      resolve(result);
    };
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((r) => ({
        transcript: r.transcript,
        confidence: r.confidence
      }));
      finish({ supported: true, alternatives: alts, transcript: alts[0]?.transcript || "" });
    };
    rec.onerror = (e) => finish({ supported: true, error: e.error, transcript: "" });
    rec.onend = () => finish({ supported: true, transcript: "", timedOut: true });
    setTimeout(() => finish({ supported: true, transcript: "", timedOut: true }), timeoutMs);
    try {
      rec.start();
    } catch (e) {
      resolve({ supported: false });
    }
  });
}

/**
 * Continuous Spanish dictation for long, paragraph-length answers.
 *
 * listenOnce() is single-utterance and gives up after a short silence, which
 * cuts people off mid-thought. This keeps the mic open, streams interim text
 * as you speak, and auto-restarts when the engine stops on its own (Chrome
 * ends a session after a pause even in continuous mode) — so the transcript
 * keeps growing until you explicitly stop.
 *
 * Returns a controller with .stop(). Resolves nothing; use the callbacks.
 */
export function startDictation({ onInterim, onFinal, onStateChange, onError } = {}) {
  if (!SpeechRecognitionImpl) {
    onError && onError("unsupported");
    return { stop() {}, supported: false };
  }
  let stopped = false;
  let finalText = "";
  let rec = null;

  const emitState = (s) => onStateChange && onStateChange(s);

  function begin() {
    if (stopped) return;
    rec = new SpeechRecognitionImpl();
    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += (finalText ? " " : "") + chunk.trim();
        else interim += chunk;
      }
      onInterim && onInterim(finalText, interim.trim());
    };
    rec.onerror = (e) => {
      // "no-speech"/"aborted" are routine while waiting; only surface real faults.
      if (e.error && !["no-speech", "aborted"].includes(e.error)) onError && onError(e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        stopped = true;
        emitState("denied");
      }
    };
    rec.onend = () => {
      if (stopped) { emitState("stopped"); return; }
      begin(); // keep the mic alive through natural pauses
    };
    try {
      rec.start();
      emitState("listening");
    } catch (err) {
      onError && onError(String(err));
    }
  }

  begin();

  return {
    supported: true,
    stop() {
      stopped = true;
      try { rec && rec.stop(); } catch (e) {}
      emitState("stopped");
      onFinal && onFinal(finalText.trim());
      return finalText.trim();
    }
  };
}

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // strip accents (escaped range: safe under any source encoding)
    .replace(/[¿?¡!.,;:"'()]/g, "")
    .trim();
}

// Word-overlap similarity — a rough but useful self-assessment signal for
// comparing a learner's typed/spoken Spanish against a reference sentence.
export function textSimilarity(a, b) {
  const wa = normalize(a).split(/\s+/).filter(Boolean);
  const wb = normalize(b).split(/\s+/).filter(Boolean);
  if (!wa.length || !wb.length) return 0;
  const pool = wb.slice();
  let matches = 0;
  wa.forEach((w) => {
    const idx = pool.indexOf(w);
    if (idx !== -1) {
      pool.splice(idx, 1);
      matches++;
    }
  });
  return Math.round((matches / Math.max(wa.length, wb.length)) * 100);
}

// Points at specific words in an attempt (typed or transcribed from speech)
// that didn't match the expected sentence, so feedback can say "X didn't
// quite land — it sounded like Y" instead of just a bare percentage. Reuses
// textSimilarity()'s normalization so the two stay consistent. Returns null
// when there's nothing specific to flag.
export function pronunciationTip(expected, attempt) {
  const we = normalize(expected).split(/\s+/).filter(Boolean);
  const wa = normalize(attempt).split(/\s+/).filter(Boolean);
  if (!we.length) return null;
  const pool = wa.slice();
  const missed = [];
  we.forEach((w, i) => {
    const idx = pool.indexOf(w);
    if (idx !== -1) { pool.splice(idx, 1); return; }
    missed.push({ expected: w, insteadHeard: wa[i] || null });
  });
  if (!missed.length) return null;
  // First couple of misses only — a wall of word-by-word notes stops being
  // useful feedback.
  return missed.slice(0, 3).map((m) => m.insteadHeard
    ? `"${m.expected}" didn't quite land — it came out more like "${m.insteadHeard}". Try it again a little slower and more deliberately.`
    : `"${m.expected}" didn't come through at all — try that word again, a bit louder or slower.`);
}
