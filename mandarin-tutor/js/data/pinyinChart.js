// Pinyin building blocks: the 5 tones, the ~21 initials, and the common
// finals, each paired with a real single-character example so audio
// playback (via the Web Speech API zh-CN voice) is always a genuine,
// correctly-pronounced word rather than a raw romanized letter the voice
// might read as English.

export const TONES = [
  { tone: 1, mark: "ˉ", label: "Tone 1 — high and flat", desc: "Held level and high, like sustaining a note while singing.", example: { char: "妈", pinyin: "mā", meaning: "mom" } },
  { tone: 2, mark: "ˊ", label: "Tone 2 — rising", desc: "Rises from mid to high, like asking \"huh?\" in English.", example: { char: "麻", pinyin: "má", meaning: "hemp; numb" } },
  { tone: 3, mark: "ˇ", label: "Tone 3 — dips then rises", desc: "Falls low, then rises back up. English speakers often flatten this into tone 1 — the single most common tone mistake.", example: { char: "马", pinyin: "mǎ", meaning: "horse" } },
  { tone: 4, mark: "ˋ", label: "Tone 4 — sharp and falling", desc: "Drops fast from high to low, like giving a firm command.", example: { char: "骂", pinyin: "mà", meaning: "to scold" } },
  { tone: 5, mark: "·", label: "Neutral tone — short and unstressed", desc: "No real pitch contour — light and quick, often on grammatical particles.", example: { char: "吗", pinyin: "ma", meaning: "question particle" } }
];

export const INITIALS = [
  { id: "b", example: { char: "八", pinyin: "bā", meaning: "eight" } },
  { id: "p", example: { char: "朋", pinyin: "péng", meaning: "friend" } },
  { id: "m", example: { char: "妈", pinyin: "mā", meaning: "mom" } },
  { id: "f", example: { char: "飞", pinyin: "fēi", meaning: "to fly" } },
  { id: "d", example: { char: "都", pinyin: "dōu", meaning: "all; both" } },
  { id: "t", example: { char: "天", pinyin: "tiān", meaning: "sky; day" } },
  { id: "n", example: { char: "男", pinyin: "nán", meaning: "male" } },
  { id: "l", example: { char: "来", pinyin: "lái", meaning: "to come" } },
  { id: "g", example: { char: "狗", pinyin: "gǒu", meaning: "dog" } },
  { id: "k", example: { char: "看", pinyin: "kàn", meaning: "to look; to see" } },
  { id: "h", example: { char: "喝", pinyin: "hē", meaning: "to drink" } },
  { id: "j", example: { char: "九", pinyin: "jiǔ", meaning: "nine" } },
  { id: "q", example: { char: "七", pinyin: "qī", meaning: "seven" } },
  { id: "x", example: { char: "想", pinyin: "xiǎng", meaning: "to think; to want" } },
  { id: "zh", example: { char: "这", pinyin: "zhè", meaning: "this" } },
  { id: "ch", example: { char: "吃", pinyin: "chī", meaning: "to eat" } },
  { id: "sh", example: { char: "是", pinyin: "shì", meaning: "to be" } },
  { id: "r", example: { char: "人", pinyin: "rén", meaning: "person" } },
  { id: "z", example: { char: "再", pinyin: "zài", meaning: "again" } },
  { id: "c", example: { char: "菜", pinyin: "cài", meaning: "dish; vegetable" } },
  { id: "s", example: { char: "送", pinyin: "sòng", meaning: "to give; to send" } },
  { id: "y", example: { char: "一", pinyin: "yī", meaning: "one" } },
  { id: "w", example: { char: "我", pinyin: "wǒ", meaning: "I; me" } }
];

export const FINALS = [
  { id: "a", example: { char: "大", pinyin: "dà", meaning: "big" } },
  { id: "o", example: { char: "波", pinyin: "bō", meaning: "wave" } },
  { id: "e", example: { char: "饿", pinyin: "è", meaning: "hungry" } },
  { id: "i", example: { char: "你", pinyin: "nǐ", meaning: "you" } },
  { id: "u", example: { char: "五", pinyin: "wǔ", meaning: "five" } },
  { id: "ü", example: { char: "女", pinyin: "nǚ", meaning: "woman; female" } },
  { id: "ai", example: { char: "爱", pinyin: "ài", meaning: "love" } },
  { id: "ei", example: { char: "累", pinyin: "lèi", meaning: "tired" } },
  { id: "ao", example: { char: "好", pinyin: "hǎo", meaning: "good" } },
  { id: "ou", example: { char: "走", pinyin: "zǒu", meaning: "to walk; to leave" } },
  { id: "an", example: { char: "三", pinyin: "sān", meaning: "three" } },
  { id: "en", example: { char: "很", pinyin: "hěn", meaning: "very" } },
  { id: "ang", example: { char: "忙", pinyin: "máng", meaning: "busy" } },
  { id: "eng", example: { char: "冷", pinyin: "lěng", meaning: "cold" } },
  { id: "ong", example: { char: "中", pinyin: "zhōng", meaning: "middle; China" } },
  { id: "ia", example: { char: "家", pinyin: "jiā", meaning: "home; family" } },
  { id: "ie", example: { char: "谢", pinyin: "xiè", meaning: "thanks" } },
  { id: "iao", example: { char: "小", pinyin: "xiǎo", meaning: "small" } },
  { id: "iu", example: { char: "六", pinyin: "liù", meaning: "six" } },
  { id: "ua", example: { char: "花", pinyin: "huā", meaning: "flower" } },
  { id: "uo", example: { char: "说", pinyin: "shuō", meaning: "to speak" } },
  { id: "ui", example: { char: "对", pinyin: "duì", meaning: "correct; right" } },
  { id: "uan", example: { char: "短", pinyin: "duǎn", meaning: "short" } },
  { id: "un", example: { char: "困", pinyin: "kùn", meaning: "sleepy" } },
  { id: "üe", example: { char: "月", pinyin: "yuè", meaning: "moon; month" } }
];
