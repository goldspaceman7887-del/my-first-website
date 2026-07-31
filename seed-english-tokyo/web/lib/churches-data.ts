export interface Church {
  slug: string;
  name: string;
  nameJa: string;
  stationSlug: string;
  station: string;
  denomination: string;
  languages: string[];
  serviceTimes: string[];
  sizeDescription: string;
  description: string;
}

/**
 * Example listings for the prototype — these are illustrative, not real churches.
 * Always verify a church's real name, address, and service times independently
 * before visiting. See /churches for the disclaimer shown alongside this data.
 */
export const churches: Church[] = [
  {
    slug: "shibuya-international",
    name: "Shibuya International Church (example)",
    nameJa: "渋谷インターナショナル教会（例）",
    stationSlug: "shibuya",
    station: "Shibuya",
    denomination: "Non-denominational",
    languages: ["English", "Japanese"],
    serviceTimes: ["Sun 10:30 AM", "Sun 6:00 PM"],
    sizeDescription: "Medium (100–300 people)",
    description: "A bilingual congregation with a large number of first-time visitors and young professionals.",
  },
  {
    slug: "shinjuku-grace-chapel",
    name: "Shinjuku Grace Chapel (example)",
    nameJa: "新宿グレース・チャペル（例）",
    stationSlug: "shinjuku",
    station: "Shinjuku",
    denomination: "Baptist",
    languages: ["Japanese"],
    serviceTimes: ["Sun 9:00 AM", "Sun 11:00 AM"],
    sizeDescription: "Large (300+ people)",
    description: "A long-established Japanese-language congregation with strong small-group ministry.",
  },
  {
    slug: "ikebukuro-hope-fellowship",
    name: "Ikebukuro Hope Fellowship (example)",
    nameJa: "池袋ホープ・フェローシップ（例）",
    stationSlug: "ikebukuro",
    station: "Ikebukuro",
    denomination: "Non-denominational",
    languages: ["Japanese", "Chinese"],
    serviceTimes: ["Sun 10:00 AM"],
    sizeDescription: "Small (under 100 people)",
    description: "A close-knit multilingual community known for welcoming total newcomers.",
  },
  {
    slug: "tokyo-station-anglican",
    name: "Tokyo Station Anglican Church (example)",
    nameJa: "東京駅聖公会（例）",
    stationSlug: "tokyo-station",
    station: "Tokyo Station",
    denomination: "Anglican",
    languages: ["English", "Japanese"],
    serviceTimes: ["Sun 8:00 AM", "Sun 10:00 AM"],
    sizeDescription: "Medium (100–300 people)",
    description: "Liturgical services with an English-language congregation alongside the Japanese one.",
  },
  {
    slug: "ueno-living-water",
    name: "Ueno Living Water Church (example)",
    nameJa: "上野リビング・ウォーター教会（例）",
    stationSlug: "ueno",
    station: "Ueno",
    denomination: "Pentecostal",
    languages: ["Japanese"],
    serviceTimes: ["Sun 10:30 AM"],
    sizeDescription: "Small (under 100 people)",
    description: "An expressive, music-forward worship style with an active youth ministry.",
  },
  {
    slug: "akihabara-crossroads",
    name: "Akihabara Crossroads Church (example)",
    nameJa: "秋葉原クロスロード教会（例）",
    stationSlug: "akihabara",
    station: "Akihabara",
    denomination: "Non-denominational",
    languages: ["Japanese", "English"],
    serviceTimes: ["Sun 2:00 PM"],
    sizeDescription: "Small (under 100 people)",
    description: "A newer church plant that meets in a rented hall, popular with students and young adults.",
  },
];

export const churchLanguages = ["English", "Japanese", "Chinese"];
export const churchDenominations = [
  "Non-denominational",
  "Baptist",
  "Anglican",
  "Pentecostal",
];
