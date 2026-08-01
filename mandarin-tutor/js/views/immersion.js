// IMMERSION MODE — Chinese only. If you seem confused (you type "?", "不懂",
// or ask for help/English), the bot gives simpler Chinese + pinyin + an
// English hint, then returns immediately to Chinese-only.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";

const CONFUSION_TRIGGERS = /(\?|不懂|不明白|什么意思|help|english|英文|english please)/i;

// Small rule-based responder: keyword → { reply, py, en, hint, hintPy, hintEn }
const RULES = [
  { match: /你好|您好/, reply: "你好！你叫什么名字？", py: "Nǐ hǎo! Nǐ jiào shénme míngzi?", en: "Hello! What's your name?" },
  { match: /我叫|我是/, reply: "很高兴认识你！你是哪国人？", py: "Hěn gāoxìng rènshi nǐ! Nǐ shì nǎ guó rén?", en: "Nice to meet you! What's your nationality?" },
  { match: /美国|中国|英国|法国|日本|德国|加拿大/, reply: "真的吗？你喜欢学中文吗？", py: "Zhēn de ma? Nǐ xǐhuan xué Zhōngwén ma?", en: "Really? Do you like learning Chinese?" },
  { match: /喜欢/, reply: "太好了！你还喜欢什么？", py: "Tài hǎo le! Nǐ hái xǐhuan shénme?", en: "Great! What else do you like?" },
  { match: /天气|下雨|晴天|冷|热/, reply: "是的，今天天气不错。你喜欢什么季节？", py: "Shì de, jīntiān tiānqì búcuò. Nǐ xǐhuan shénme jìjié?", en: "Yeah, the weather's nice today. What season do you like?" },
  { match: /饿|吃|饭|菜/, reply: "我也饿了！你想吃什么中国菜？", py: "Wǒ yě è le! Nǐ xiǎng chī shénme Zhōngguó cài?", en: "I'm hungry too! What Chinese food do you want to eat?" },
  { match: /忙|累/, reply: "辛苦了，要好好休息。周末你做什么？", py: "Xīnkǔ le, yào hǎohāo xiūxi. Zhōumò nǐ zuò shénme?", en: "That's tough, get some rest. What do you do on weekends?" },
  { match: /家人|爸爸|妈妈|哥哥|姐姐|弟弟|妹妹/, reply: "家人很重要。你家有几口人？", py: "Jiārén hěn zhòngyào. Nǐ jiā yǒu jǐ kǒu rén?", en: "Family is important. How many people are in your family?" },
  { match: /再见|拜拜/, reply: "再见！明天见！", py: "Zàijiàn! Míngtiān jiàn!", en: "Goodbye! See you tomorrow!" },
  { match: /谢谢/, reply: "不客气！", py: "Bú kèqi!", en: "You're welcome!" }
];

const FALLBACKS = [
  { reply: "有意思！你能多说一点儿吗？", py: "Yǒu yìsi! Nǐ néng duō shuō yìdiǎnr ma?", en: "Interesting! Can you say a bit more?" },
  { reply: "我明白了。那你呢？", py: "Wǒ míngbai le. Nà nǐ ne?", en: "I see. And you?" },
  { reply: "真的吗？为什么？", py: "Zhēn de ma? Wèishénme?", en: "Really? Why?" }
];

const STARTER = { reply: "你好！我是你的中文朋友。你叫什么名字？", py: "Nǐ hǎo! Wǒ shì nǐ de Zhōngwén péngyou. Nǐ jiào shénme míngzi?", en: "Hello! I'm your Chinese-speaking friend. What's your name?" };

function pickReply(userText) {
  for (const r of RULES) {
    if (r.match.test(userText)) return r;
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export function renderImmersion(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌊 Immersion Mode"),
      el("p", {}, "Chinese only, start to finish. If you get stuck, type \"?\" or \"不懂\" for a simpler line with pinyin and an English hint — then it's straight back to Chinese.")
    ])
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "用中文回答... (type your reply in Chinese, or \"?\" for help)" });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:var(--font-zh);font-size:1.05rem;";
  const sendBtn = el("button", { class: "btn btn-primary", onclick: send }, "Send");
  container.appendChild(el("div", { class: "chat-input-row" }, [input, sendBtn]));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  let turns = 0;
  let lastBotLine = STARTER;
  botSay(STARTER);

  function botSay(line, { asHint = false } = {}) {
    const bubble = el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-zh hanzi" }, line.reply)]);
    const hint = el("div", { class: "cb-py hidden" }, [el("div", {}, line.py), el("div", { class: "cb-en" }, line.en)]);
    const hintBtn = el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint");
    bubble.appendChild(hint);
    bubble.appendChild(hintBtn);
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.reply);
    if (!asHint) lastBotLine = line;
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-zh hanzi" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    input.value = "";
    blurActive();
    turns++;

    if (CONFUSION_TRIGGERS.test(text)) {
      // Simpler Chinese + pinyin + English hint, then return to Chinese immediately.
      const simple = { reply: lastBotLine.reply, py: lastBotLine.py, en: lastBotLine.en };
      const simplerBubble = el("div", { class: "chat-bubble bot" }, [
        el("div", { class: "badge badge-gold" }, "Simplified + hint"),
        el("div", { class: "cb-zh hanzi", style: "margin-top:.3rem" }, simple.reply),
        el("div", { class: "cb-py" }, simple.py),
        el("div", { class: "cb-en" }, simple.en)
      ]);
      log.appendChild(simplerBubble);
      log.scrollTop = log.scrollHeight;
      audioEngine.speakSlow(simple.reply);
      setTimeout(() => botSay(pickReply("")), 900);
      return;
    }

    const reply = pickReply(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.immersionSessions.push({ date: todayISO(), turns });
      addXP(10, "Immersion Mode session");
      store.save();
    }
  }
}
