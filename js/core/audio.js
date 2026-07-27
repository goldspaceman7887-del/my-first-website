// Audio immersion engine: Web Speech API (es-ES synthesis) + optional
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

  spainVoices() {
    const es = this.voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es-es"));
    if (es.length) return es;
    // Fallback: any Spanish voice if the browser lacks a dedicated es-ES voice.
    return this.voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  }

  pickVoice(genderPref = "any") {
    const pool = this.spainVoices();
    if (!pool.length) return null;
    const femaleHints = /female|mujer|monica|helena|lucia|elvira|paloma/i;
    const maleHints = /male|hombre|jorge|diego|pablo|enrique/i;
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
   * Speak Spanish text.
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
      utter.lang = "es-ES";
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
  shadow(text, { repeats = 3, gapMs = 2200, rate, onRound, onDone } = {}) {
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
    rec.lang = "es-ES";
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

// Simple normalized similarity score for pronunciation self-assessment.
export function textSimilarity(a, b) {
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ñ\s]/gi, "")
      .trim();
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return 0;
  const wa = na.split(/\s+/);
  const wb = new Set(nb.split(/\s+/));
  let matches = 0;
  wa.forEach((w) => {
    if (wb.has(w)) matches++;
  });
  return Math.round((matches / Math.max(wa.length, wb.size)) * 100);
}
