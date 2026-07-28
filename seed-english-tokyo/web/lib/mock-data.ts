export type GrowthStage = "bare_soil" | "seedling" | "tree" | "forest";

export interface Station {
  slug: string;
  name: string;
  nameJa: string;
  fundingRaisedYen: number;
  activeSeedCount: number;
  visits: number;
  registrations: number;
  activeLearners: number;
  upcomingEvents: number;
  growthScore: number;
  forestHealthScore: number;
  growthStage: GrowthStage;
  /** 0-100: how many people want to practice English here right now — drives heat-map intensity independent of how built-out the field already is. */
  demandScore: number;
  /** Relative position (0-100, 0-100) on the stylized Tokyo map — approximate layout, not a real projection. */
  mapX: number;
  mapY: number;
}

export const stations: Station[] = [
  {
    slug: "shibuya",
    name: "Shibuya",
    nameJa: "渋谷",
    fundingRaisedYen: 842000,
    activeSeedCount: 412,
    visits: 18420,
    registrations: 2310,
    activeLearners: 640,
    upcomingEvents: 6,
    growthScore: 82,
    forestHealthScore: 76,
    growthStage: "forest",
    demandScore: 91,
    mapX: 35,
    mapY: 58,
  },
  {
    slug: "shinjuku",
    name: "Shinjuku",
    nameJa: "新宿",
    fundingRaisedYen: 510000,
    activeSeedCount: 260,
    visits: 12100,
    registrations: 1480,
    activeLearners: 390,
    upcomingEvents: 4,
    growthScore: 61,
    forestHealthScore: 58,
    growthStage: "tree",
    demandScore: 78,
    mapX: 30,
    mapY: 43,
  },
  {
    slug: "ikebukuro",
    name: "Ikebukuro",
    nameJa: "池袋",
    fundingRaisedYen: 298000,
    activeSeedCount: 151,
    visits: 8300,
    registrations: 940,
    activeLearners: 210,
    upcomingEvents: 3,
    growthScore: 47,
    forestHealthScore: 51,
    growthStage: "tree",
    demandScore: 62,
    mapX: 30,
    mapY: 22,
  },
  {
    slug: "tokyo-station",
    name: "Tokyo Station",
    nameJa: "東京駅",
    fundingRaisedYen: 176000,
    activeSeedCount: 89,
    visits: 6100,
    registrations: 520,
    activeLearners: 110,
    upcomingEvents: 2,
    growthScore: 33,
    forestHealthScore: 40,
    growthStage: "seedling",
    demandScore: 58,
    mapX: 63,
    mapY: 48,
  },
  {
    slug: "ueno",
    name: "Ueno",
    nameJa: "上野",
    fundingRaisedYen: 121000,
    activeSeedCount: 64,
    visits: 4200,
    registrations: 380,
    activeLearners: 76,
    upcomingEvents: 1,
    growthScore: 24,
    forestHealthScore: 33,
    growthStage: "seedling",
    demandScore: 41,
    mapX: 59,
    mapY: 27,
  },
  {
    slug: "akihabara",
    name: "Akihabara",
    nameJa: "秋葉原",
    fundingRaisedYen: 98000,
    activeSeedCount: 51,
    visits: 3600,
    registrations: 290,
    activeLearners: 58,
    upcomingEvents: 1,
    growthScore: 19,
    forestHealthScore: 28,
    growthStage: "seedling",
    demandScore: 47,
    mapX: 61,
    mapY: 38,
  },
  {
    slug: "shinagawa",
    name: "Shinagawa",
    nameJa: "品川",
    fundingRaisedYen: 22000,
    activeSeedCount: 12,
    visits: 900,
    registrations: 54,
    activeLearners: 9,
    upcomingEvents: 0,
    growthScore: 6,
    forestHealthScore: 12,
    growthStage: "bare_soil",
    demandScore: 53,
    mapX: 56,
    mapY: 71,
  },
  {
    slug: "kichijoji",
    name: "Kichijoji",
    nameJa: "吉祥寺",
    fundingRaisedYen: 15000,
    activeSeedCount: 8,
    visits: 620,
    registrations: 31,
    activeLearners: 5,
    upcomingEvents: 0,
    growthScore: 4,
    forestHealthScore: 9,
    growthStage: "bare_soil",
    demandScore: 33,
    mapX: 9,
    mapY: 45,
  },
  {
    slug: "nakano",
    name: "Nakano",
    nameJa: "中野",
    fundingRaisedYen: 9000,
    activeSeedCount: 5,
    visits: 340,
    registrations: 18,
    activeLearners: 3,
    upcomingEvents: 0,
    growthScore: 2,
    forestHealthScore: 6,
    growthStage: "bare_soil",
    demandScore: 28,
    mapX: 20,
    mapY: 48,
  },
  {
    slug: "yokohama",
    name: "Yokohama",
    nameJa: "横浜",
    fundingRaisedYen: 0,
    activeSeedCount: 0,
    visits: 110,
    registrations: 2,
    activeLearners: 0,
    upcomingEvents: 0,
    growthScore: 0,
    forestHealthScore: 0,
    growthStage: "bare_soil",
    demandScore: 39,
    mapX: 48,
    mapY: 94,
  },
];

export interface SeedTier {
  key: string;
  name: string;
  nameJa: string;
  emoji: string;
  priceYen: number;
  description: string;
  /** Estimated impressions (website visits + reach) one unit of this tier generates. See docs/04-seed-tracking-system.md attribution model — this is the marketing-facing estimate shown before purchase. */
  impressionsPerUnit: number;
}

export const seedTiers: SeedTier[] = [
  {
    key: "seed",
    name: "Seed",
    nameJa: "シード",
    emoji: "🌱",
    priceYen: 500,
    description: "Plants the first seed of someone's confidence.",
    impressionsPerUnit: 12,
  },
  {
    key: "growth_seed",
    name: "Growth Seed",
    nameJa: "グロースシード",
    emoji: "🌿",
    priceYen: 1000,
    description: "Funds a week of practice sessions for a learner.",
    impressionsPerUnit: 25,
  },
  {
    key: "community_seed",
    name: "Community Seed",
    nameJa: "コミュニティシード",
    emoji: "🌳",
    priceYen: 5000,
    description: "Funds a full conversation-night event.",
    impressionsPerUnit: 130,
  },
  {
    key: "forest_seed",
    name: "Forest Seed",
    nameJa: "フォレストシード",
    emoji: "🌲",
    priceYen: 10000,
    description: "Funds outreach that brings a new station to life.",
    impressionsPerUnit: 270,
  },
];

/** Individual stepper range for small quantities. */
export const seedQuantityStepperRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** Quick-pick bulk quantities — beyond 10, jumps to round bulk sizes up to 1000+. */
export const seedQuantityBulkPresets = [10, 25, 50, 100, 250, 500, 1000];

export interface Seed {
  id: string;
  seedNumber: number;
  tierKey: string;
  station: string;
  contributionYen: number;
  datePlanted: string;
  status: "growing" | "thriving" | "dormant";
  treeProgressPct: number;
  forestContributionPct: number;
  impact: {
    visits: number;
    registrations: number;
    meetupsAttended: number;
    activeLearners: number;
  };
}

export const mySeeds: Seed[] = [
  {
    id: "78422",
    seedNumber: 78422,
    tierKey: "growth_seed",
    station: "Shibuya",
    contributionYen: 1000,
    datePlanted: "2027-04-12",
    status: "growing",
    treeProgressPct: 42,
    forestContributionPct: 0.4,
    impact: { visits: 12, registrations: 3, meetupsAttended: 2, activeLearners: 1 },
  },
  {
    id: "78931",
    seedNumber: 78931,
    tierKey: "seed",
    station: "Shinjuku",
    contributionYen: 500,
    datePlanted: "2027-05-02",
    status: "growing",
    treeProgressPct: 18,
    forestContributionPct: 0.1,
    impact: { visits: 5, registrations: 1, meetupsAttended: 0, activeLearners: 1 },
  },
  {
    id: "65210",
    seedNumber: 65210,
    tierKey: "community_seed",
    station: "Shibuya",
    contributionYen: 5000,
    datePlanted: "2027-02-20",
    status: "thriving",
    treeProgressPct: 100,
    forestContributionPct: 2.1,
    impact: { visits: 64, registrations: 14, meetupsAttended: 9, activeLearners: 6 },
  },
];

export interface Question {
  id: string;
  category: string;
  title: string;
  body: string;
  author: string;
  authorBadge?: string;
  upvotes: number;
  answerCount: number;
  hasBestAnswer: boolean;
  askedAt: string;
}

export const questions: Question[] = [
  {
    id: "q1",
    category: "Grammar",
    title: "What's the difference between \"will\" and \"going to\"?",
    body: "I hear both used for the future but I don't understand when to use each one.",
    author: "haruto_k",
    upvotes: 42,
    answerCount: 6,
    hasBestAnswer: true,
    askedAt: "2 days ago",
  },
  {
    id: "q2",
    category: "Pronunciation",
    title: "Why do native speakers say \"gonna\" instead of \"going to\"?",
    body: "Is it okay for me to say this in a business meeting or is it too casual?",
    author: "mei.suzuki",
    upvotes: 31,
    answerCount: 9,
    hasBestAnswer: true,
    askedAt: "5 days ago",
  },
  {
    id: "q3",
    category: "Business English",
    title: "How do I politely disagree with my manager in English?",
    body: "In Japanese I'd use very indirect language. What's the English equivalent?",
    author: "kenji_t",
    upvotes: 58,
    answerCount: 11,
    hasBestAnswer: true,
    askedAt: "1 week ago",
  },
  {
    id: "q4",
    category: "Travel English",
    title: "What should I say if I miss my connecting flight?",
    body: "Practicing for a trip to Australia next month, want to sound natural at the airport.",
    author: "yuki.a",
    upvotes: 19,
    answerCount: 4,
    hasBestAnswer: false,
    askedAt: "3 days ago",
  },
  {
    id: "q5",
    category: "Vocabulary",
    title: "\"Big\" vs \"large\" vs \"huge\" — when do I use each?",
    body: "My textbook says they're synonyms but native speakers seem to pick one on purpose.",
    author: "sora_n",
    upvotes: 27,
    answerCount: 7,
    hasBestAnswer: true,
    askedAt: "6 days ago",
  },
  {
    id: "q6",
    category: "Conversation Practice",
    title: "How do I keep a conversation going instead of one-word answers?",
    body: "I always answer 'yes' or 'no' and then there's silence. What do people actually say?",
    author: "aoi_m",
    upvotes: 65,
    answerCount: 14,
    hasBestAnswer: true,
    askedAt: "2 weeks ago",
  },
];

export const questionCategories = [
  "Grammar",
  "Pronunciation",
  "Vocabulary",
  "Business English",
  "Travel English",
  "Conversation Practice",
];

export interface EventItem {
  id: string;
  type: string;
  title: string;
  station: string;
  date: string;
  time: string;
  capacity: number;
  attending: number;
  host: string;
}

export const events: EventItem[] = [
  {
    id: "e1",
    type: "English Cafe",
    title: "Shibuya Sunday English Cafe",
    station: "Shibuya",
    date: "Aug 2, 2026",
    time: "2:00 PM",
    capacity: 20,
    attending: 17,
    host: "Emma R.",
  },
  {
    id: "e2",
    type: "Conversation Night",
    title: "Shinjuku Conversation Night — Travel Stories",
    station: "Shinjuku",
    date: "Aug 5, 2026",
    time: "7:00 PM",
    capacity: 30,
    attending: 22,
    host: "Daichi M.",
  },
  {
    id: "e3",
    type: "Business English Workshop",
    title: "Negotiation English for Business Professionals",
    station: "Tokyo Station",
    date: "Aug 8, 2026",
    time: "6:30 PM",
    capacity: 15,
    attending: 9,
    host: "James P.",
  },
  {
    id: "e4",
    type: "University Meetup",
    title: "Waseda x Seed English Language Exchange",
    station: "Ikebukuro",
    date: "Aug 10, 2026",
    time: "5:00 PM",
    capacity: 40,
    attending: 35,
    host: "Waseda Ambassadors",
  },
  {
    id: "e5",
    type: "English Walk",
    title: "Ueno Park English Walk & Talk",
    station: "Ueno",
    date: "Aug 12, 2026",
    time: "10:00 AM",
    capacity: 12,
    attending: 6,
    host: "Sana K.",
  },
  {
    id: "e6",
    type: "Interview Practice",
    title: "Mock Job Interview Practice Circle",
    station: "Shibuya",
    date: "Aug 15, 2026",
    time: "6:00 PM",
    capacity: 10,
    attending: 8,
    host: "Marcus L.",
  },
];

export const cityImpactSummary = {
  totalRaisedYen: stations.reduce((sum, s) => sum + s.fundingRaisedYen, 0),
  totalLearners: stations.reduce((sum, s) => sum + s.activeLearners, 0),
  totalSeeds: stations.reduce((sum, s) => sum + s.activeSeedCount, 0),
  meetupsThisMonth: 84,
};
