let cachedVoices = [];

function loadVoices() {
  cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function getJapaneseVoices() {
  return loadVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("ja"));
}

export function speak(text, { rate = 0.85, voiceName = null, onend = null } = {}) {
  if (!window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = rate;
  const voices = getJapaneseVoices();
  const chosen = voiceName ? voices.find((v) => v.name === voiceName) : voices[0];
  if (chosen) utter.voice = chosen;
  if (onend) utter.onend = onend;
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export function speechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// Returns a controller: { stop() } and calls callbacks as recognition proceeds.
export function startRecognition({ onInterim, onFinal, onEnd, onError } = {}) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) {
    onError && onError(new Error("SpeechRecognition not supported in this browser"));
    return { stop() {} };
  }
  const recog = new Ctor();
  recog.lang = "ja-JP";
  recog.continuous = true;
  recog.interimResults = true;

  let finalTranscript = "";

  recog.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interim += result[0].transcript;
      }
    }
    onInterim && onInterim(finalTranscript + interim);
  };
  recog.onerror = (e) => onError && onError(e);
  recog.onend = () => {
    onFinal && onFinal(finalTranscript);
    onEnd && onEnd();
  };

  try {
    recog.start();
  } catch (e) {
    onError && onError(e);
  }

  return {
    stop() {
      try {
        recog.stop();
      } catch {}
    },
  };
}
