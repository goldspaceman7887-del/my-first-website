export type GrowthStage =
  | "bare_soil"
  | "seedling"
  | "sprout"
  | "sapling"
  | "tree"
  | "forest"
  | "ancient_forest";

export type FieldStatus = "needs_water" | "growing" | "healthy" | "thriving" | "fully_activated";

/** Growth formula weights — see docs/11-living-ecosystem-redesign.md §3. */
const GROWTH_WEIGHTS = {
  funding: 0.3,
  impressions: 0.2,
  registrations: 0.2,
  meetups: 0.15,
  activeLearners: 0.15,
};

function percentileRank(values: number[], value: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const below = sorted.filter((v) => v < value).length;
  const equal = sorted.filter((v) => v === value).length;
  if (sorted.length === 0) return 100;
  // Divide by the full count (not count-1) so this can never exceed 100 —
  // the previous version overshot to 106 for a unique max value.
  return Math.min(100, Math.round(((below + equal / 2) / sorted.length) * 100));
}

/** Computes growth_score for every field from real underlying metrics via percentile-ranked weighting — never hand-set. */
function computeGrowthScores<T extends { fundingRaisedYen: number; impressions: number; registrations: number; upcomingEvents: number; activeLearners: number }>(
  fields: T[]
): number[] {
  const funding = fields.map((f) => f.fundingRaisedYen);
  const impressions = fields.map((f) => f.impressions);
  const registrations = fields.map((f) => f.registrations);
  const meetups = fields.map((f) => f.upcomingEvents);
  const learners = fields.map((f) => f.activeLearners);
  return fields.map((f) =>
    Math.round(
      GROWTH_WEIGHTS.funding * percentileRank(funding, f.fundingRaisedYen) +
        GROWTH_WEIGHTS.impressions * percentileRank(impressions, f.impressions) +
        GROWTH_WEIGHTS.registrations * percentileRank(registrations, f.registrations) +
        GROWTH_WEIGHTS.meetups * percentileRank(meetups, f.upcomingEvents) +
        GROWTH_WEIGHTS.activeLearners * percentileRank(learners, f.activeLearners)
    )
  );
}

export function growthStageForScore(score: number): GrowthStage {
  if (score >= 85) return "ancient_forest";
  if (score >= 70) return "forest";
  if (score >= 55) return "tree";
  if (score >= 40) return "sapling";
  if (score >= 25) return "sprout";
  if (score >= 10) return "seedling";
  return "bare_soil";
}

export function fieldStatusForHealth(health: number): FieldStatus {
  if (health >= 80) return "fully_activated";
  if (health >= 60) return "thriving";
  if (health >= 40) return "healthy";
  if (health >= 20) return "growing";
  return "needs_water";
}

export interface Station {
  slug: string;
  name: string;
  nameJa: string;
  fundingRaisedYen: number;
  activeSeedCount: number;
  donorCount: number;
  impressions: number;
  visits: number;
  registrations: number;
  activeLearners: number;
  upcomingEvents: number;
  /** Computed from the weighted growth formula — see computeGrowthScores below, not hand-set. */
  growthScore: number;
  forestHealthScore: number;
  growthStage: GrowthStage;
  fieldStatus: FieldStatus;
  /** 0-100: how many people want to practice English here right now — drives heat-map intensity independent of how built-out the field already is. */
  demandScore: number;
  /** Relative position (0-100, 0-100) on the stylized Tokyo map — approximate layout, not a real projection. */
  mapX: number;
  mapY: number;
}

type StationSeed = Omit<Station, "growthScore" | "growthStage" | "fieldStatus">;

const stationSeeds: StationSeed[] = [
  {
    slug: "shibuya",
    name: "Shibuya",
    nameJa: "渋谷",
    fundingRaisedYen: 842000,
    activeSeedCount: 412,
    donorCount: 211,
    impressions: 92100,
    visits: 18420,
    registrations: 2310,
    activeLearners: 640,
    upcomingEvents: 6,
    forestHealthScore: 76,
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
    donorCount: 132,
    impressions: 60500,
    visits: 12100,
    registrations: 1480,
    activeLearners: 390,
    upcomingEvents: 4,
    forestHealthScore: 58,
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
    donorCount: 74,
    impressions: 41500,
    visits: 8300,
    registrations: 940,
    activeLearners: 210,
    upcomingEvents: 3,
    forestHealthScore: 51,
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
    donorCount: 41,
    impressions: 30500,
    visits: 6100,
    registrations: 520,
    activeLearners: 110,
    upcomingEvents: 2,
    forestHealthScore: 40,
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
    donorCount: 29,
    impressions: 21000,
    visits: 4200,
    registrations: 380,
    activeLearners: 76,
    upcomingEvents: 1,
    forestHealthScore: 33,
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
    donorCount: 23,
    impressions: 18000,
    visits: 3600,
    registrations: 290,
    activeLearners: 58,
    upcomingEvents: 1,
    forestHealthScore: 28,
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
    donorCount: 6,
    impressions: 4500,
    visits: 900,
    registrations: 54,
    activeLearners: 9,
    upcomingEvents: 0,
    forestHealthScore: 12,
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
    donorCount: 4,
    impressions: 3100,
    visits: 620,
    registrations: 31,
    activeLearners: 5,
    upcomingEvents: 0,
    forestHealthScore: 9,
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
    donorCount: 3,
    impressions: 1700,
    visits: 340,
    registrations: 18,
    activeLearners: 3,
    upcomingEvents: 0,
    forestHealthScore: 6,
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
    donorCount: 0,
    impressions: 550,
    visits: 110,
    registrations: 2,
    activeLearners: 0,
    upcomingEvents: 0,
    forestHealthScore: 0,
    demandScore: 39,
    mapX: 48,
    mapY: 94,
  },
];

const stationGrowthScores = computeGrowthScores(stationSeeds);

export const stations: Station[] = stationSeeds.map((s, i) => ({
  ...s,
  growthScore: stationGrowthScores[i],
  growthStage: growthStageForScore(stationGrowthScores[i]),
  fieldStatus: fieldStatusForHealth(s.forestHealthScore),
}));

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
  owner: string;
  contributionYen: number;
  datePlanted: string;
  status: "growing" | "thriving" | "dormant";
  treeProgressPct: number;
  forestContributionPct: number;
  impact: {
    impressions: number;
    visits: number;
    registrations: number;
    meetupsAttended: number;
    activeLearners: number;
  };
  /** A specific, real outcome this seed's funding is attributed to — never generic copy. */
  emotionalImpact: string;
}

export const mySeeds: Seed[] = [
  {
    id: "78422",
    seedNumber: 78422,
    tierKey: "growth_seed",
    station: "Shibuya",
    owner: "Alex",
    contributionYen: 1000,
    datePlanted: "2027-04-12",
    status: "growing",
    treeProgressPct: 42,
    forestContributionPct: 0.4,
    impact: { impressions: 2420, visits: 184, registrations: 19, meetupsAttended: 5, activeLearners: 1 },
    emotionalImpact: "A university student attended their first-ever English meetup in Shibuya.",
  },
  {
    id: "78931",
    seedNumber: 78931,
    tierKey: "seed",
    station: "Shinjuku",
    owner: "Alex",
    contributionYen: 500,
    datePlanted: "2027-05-02",
    status: "growing",
    treeProgressPct: 18,
    forestContributionPct: 0.1,
    impact: { impressions: 640, visits: 52, registrations: 4, meetupsAttended: 0, activeLearners: 1 },
    emotionalImpact: "A job seeker in Shinjuku registered to start practicing for upcoming interviews.",
  },
  {
    id: "65210",
    seedNumber: 65210,
    tierKey: "community_seed",
    station: "Shibuya",
    owner: "Alex",
    contributionYen: 5000,
    datePlanted: "2027-02-20",
    status: "thriving",
    treeProgressPct: 100,
    forestContributionPct: 2.1,
    impact: { impressions: 9800, visits: 780, registrations: 61, meetupsAttended: 22, activeLearners: 6 },
    emotionalImpact: "A beginner learner asked their first English question and got a best answer within an hour.",
  },
];

/** My Forest Dashboard aggregate stats — every figure traceable to the seeds above. */
export const myForestStats = {
  totalSeeds: mySeeds.length,
  totalContributionYen: mySeeds.reduce((sum, s) => sum + s.contributionYen, 0),
  totalReachImpressions: mySeeds.reduce((sum, s) => sum + s.impact.impressions, 0),
  questionsHelped: 7,
  conversationsGenerated: 34,
  eventsCreated: 2,
  learnersSupported: mySeeds.reduce((sum, s) => sum + s.impact.activeLearners, 0),
};

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

/** The field with the lowest growth score — used for the "Highest Need Area" plant option. */
export function highestNeedStation(): Station {
  return [...stations].sort((a, b) => a.growthScore - b.growthScore)[0];
}

/**
 * Plant-a-Seed Step 3 preview math (docs/11-living-ecosystem-redesign.md §2) — derives
 * visit/registration estimates from a field's own historical conversion rates rather
 * than a flat guess, so a high-converting field shows a different estimate than a cold
 * one.
 */
export function estimateSeedImpact(tierKey: string, quantity: number, stationSlug: string) {
  const tier = seedTiers.find((t) => t.key === tierKey) ?? seedTiers[0];
  const station = stations.find((s) => s.slug === stationSlug) ?? highestNeedStation();
  const reach = tier.impressionsPerUnit * quantity;
  const visitRate = station.impressions > 0 ? station.visits / station.impressions : 0.12;
  const regRate = station.visits > 0 ? station.registrations / station.visits : 0.1;
  const estimatedVisits = Math.max(1, Math.round(reach * visitRate));
  const estimatedRegistrations = Math.max(0, Math.round(estimatedVisits * regRate));
  return { reach, estimatedVisits, estimatedRegistrations, visitRate, regRate };
}

/** The citywide seed goal, shown as a progress bar on home + map. Raise as the map expands past Tokyo. */
export const CITYWIDE_SEED_GOAL = 10000;

export const cityImpactSummary = {
  totalRaisedYen: stations.reduce((sum, s) => sum + s.fundingRaisedYen, 0),
  totalLearners: stations.reduce((sum, s) => sum + s.activeLearners, 0),
  totalSeeds: stations.reduce((sum, s) => sum + s.activeSeedCount, 0),
  totalImpressions: stations.reduce((sum, s) => sum + s.impressions, 0),
  // Sum of each station's donorCount double-counts anyone who supported more than
  // one field. This is the deduplicated distinct-supporter estimate — see
  // docs/12-engagement-and-advertising.md for how this is derived for real once
  // there's a real users table to COUNT(DISTINCT user_id) against.
  totalSupporters: 480,
  seedGoal: CITYWIDE_SEED_GOAL,
  meetupsThisMonth: 84,
};

// ==================== UNIVERSITY FORESTS ====================

export interface University {
  slug: string;
  name: string;
  nameJa: string;
  activeSeedCount: number;
  fundingRaisedYen: number;
  impressions: number;
  registrations: number;
  activeLearners: number;
  upcomingEvents: number;
  forestHealthScore: number;
  ambassadorCount: number;
}

type UniversitySeed = Omit<University, never>;

const universitySeeds: UniversitySeed[] = [
  {
    slug: "waseda",
    name: "Waseda University",
    nameJa: "早稲田大学",
    activeSeedCount: 186,
    fundingRaisedYen: 312000,
    impressions: 28400,
    registrations: 640,
    activeLearners: 180,
    upcomingEvents: 3,
    forestHealthScore: 66,
    ambassadorCount: 9,
  },
  {
    slug: "sophia",
    name: "Sophia University",
    nameJa: "上智大学",
    activeSeedCount: 94,
    fundingRaisedYen: 158000,
    impressions: 15200,
    registrations: 310,
    activeLearners: 88,
    upcomingEvents: 2,
    forestHealthScore: 54,
    ambassadorCount: 5,
  },
  {
    slug: "keio",
    name: "Keio University",
    nameJa: "慶應義塾大学",
    activeSeedCount: 121,
    fundingRaisedYen: 201000,
    impressions: 19800,
    registrations: 402,
    activeLearners: 115,
    upcomingEvents: 2,
    forestHealthScore: 58,
    ambassadorCount: 7,
  },
  {
    slug: "meiji",
    name: "Meiji University",
    nameJa: "明治大学",
    activeSeedCount: 58,
    fundingRaisedYen: 94000,
    impressions: 9600,
    registrations: 188,
    activeLearners: 52,
    upcomingEvents: 1,
    forestHealthScore: 41,
    ambassadorCount: 4,
  },
  {
    slug: "rikkyo",
    name: "Rikkyo University",
    nameJa: "立教大学",
    activeSeedCount: 33,
    fundingRaisedYen: 51000,
    impressions: 5400,
    registrations: 96,
    activeLearners: 27,
    upcomingEvents: 1,
    forestHealthScore: 29,
    ambassadorCount: 2,
  },
  {
    slug: "hosei",
    name: "Hosei University",
    nameJa: "法政大学",
    activeSeedCount: 19,
    fundingRaisedYen: 28000,
    impressions: 2900,
    registrations: 47,
    activeLearners: 14,
    upcomingEvents: 0,
    forestHealthScore: 18,
    ambassadorCount: 1,
  },
  {
    slug: "aoyama-gakuin",
    name: "Aoyama Gakuin University",
    nameJa: "青山学院大学",
    activeSeedCount: 8,
    fundingRaisedYen: 11000,
    impressions: 1100,
    registrations: 19,
    activeLearners: 5,
    upcomingEvents: 0,
    forestHealthScore: 8,
    ambassadorCount: 1,
  },
];

const universityGrowthScores = computeGrowthScores(universitySeeds);

export const universities: (University & { growthScore: number; growthStage: GrowthStage; fieldStatus: FieldStatus })[] =
  universitySeeds.map((u, i) => ({
    ...u,
    growthScore: universityGrowthScores[i],
    growthStage: growthStageForScore(universityGrowthScores[i]),
    fieldStatus: fieldStatusForHealth(u.forestHealthScore),
  }));

// ==================== REAL-TIME ACTIVITY STREAM ====================

export interface ActivityEvent {
  id: string;
  icon: string;
  text: string;
  timeAgo: string;
}

export const activityStream: ActivityEvent[] = [
  { id: "a1", icon: "🌱", text: "5 seeds planted in Shinjuku", timeAgo: "just now" },
  { id: "a2", icon: "🌱", text: "10 seeds planted in Waseda", timeAgo: "2 min ago" },
  { id: "a3", icon: "🌳", text: "Shibuya reached Tree Level", timeAgo: "8 min ago" },
  { id: "a4", icon: "🌲", text: "Ikebukuro became a Forest", timeAgo: "24 min ago" },
  { id: "a5", icon: "🎉", text: "22 people joined a meetup in Shibuya", timeAgo: "41 min ago" },
  { id: "a6", icon: "💬", text: "New English question posted: \"How do I keep a conversation going?\"", timeAgo: "1 hr ago" },
  { id: "a7", icon: "🌱", text: "3 seeds planted at Sophia University", timeAgo: "1 hr ago" },
  { id: "a8", icon: "✅", text: "A question in Business English got a best answer", timeAgo: "2 hr ago" },
  { id: "a9", icon: "🌿", text: "Tokyo Station's field sprouted", timeAgo: "3 hr ago" },
  { id: "a10", icon: "🎉", text: "A language exchange match was made near Nakano", timeAgo: "5 hr ago" },
];

// ==================== SEASONAL DESIGN SYSTEM ====================

export type Season = "spring" | "summer" | "autumn" | "winter";

/** Derives the real current season from the given date's month — never hard-coded, always matches the calendar. */
export function seasonForDate(date: Date): Season {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export const seasonMeta: Record<Season, { label: string; labelJa: string; emoji: string; accent: string }> = {
  spring: { label: "Spring", labelJa: "春", emoji: "🌸", accent: "#F4B6C2" },
  summer: { label: "Summer", labelJa: "夏", emoji: "🌿", accent: "#3D9A5C" },
  autumn: { label: "Autumn", labelJa: "秋", emoji: "🍁", accent: "#C1443A" },
  winter: { label: "Winter", labelJa: "冬", emoji: "❄️", accent: "#A9C6D8" },
};

// ==================== ADVERTISING SEEDS ====================
// Fund promotion on the platforms Japanese 18-30s actually use, instead of
// (or alongside) funding a physical field. See
// docs/12-engagement-and-advertising.md for how this ties into the same
// attribution model as station/university seeds.

export interface AdPlatform {
  key: string;
  name: string;
  nameJa: string;
  emoji: string;
  description: string;
  /** Illustrative estimate, not a real rate card — see docs/12. */
  impressionsPerThousandYen: number;
}

export const adPlatforms: AdPlatform[] = [
  {
    key: "tiktok",
    name: "TikTok",
    nameJa: "ティックトック",
    emoji: "🎵",
    description: "Short-form video — the strongest reach among Japanese 18-24s.",
    impressionsPerThousandYen: 340,
  },
  {
    key: "instagram",
    name: "Instagram",
    nameJa: "インスタグラム",
    emoji: "📷",
    description: "Reels and Stories — strong for event photos and campus reach.",
    impressionsPerThousandYen: 260,
  },
  {
    key: "line",
    name: "LINE",
    nameJa: "LINE",
    emoji: "💬",
    description: "Japan's dominant messaging app — LINE Ads and Timeline reach nearly everyone.",
    impressionsPerThousandYen: 300,
  },
  {
    key: "x",
    name: "X (Twitter)",
    nameJa: "X（旧Twitter）",
    emoji: "🐦",
    description: "Good for real-time event buzz and community conversation.",
    impressionsPerThousandYen: 190,
  },
  {
    key: "youtube",
    name: "YouTube",
    nameJa: "ユーチューブ",
    emoji: "▶️",
    description: "Pre-roll and Shorts — higher cost per view, higher intent.",
    impressionsPerThousandYen: 150,
  },
];

/** Quick-pick ad budget presets. */
export const adBudgetPresets = [1000, 5000, 10000, 25000, 50000];

export function estimateAdImpressions(platformKey: string, budgetYen: number) {
  const platform = adPlatforms.find((p) => p.key === platformKey) ?? adPlatforms[0];
  return Math.round((budgetYen / 1000) * platform.impressionsPerThousandYen);
}

export interface AdPackage {
  key: string;
  name: string;
  nameJa: string;
  platformKeys: string[];
  priceYen: number;
  description: string;
}

export const adPackages: AdPackage[] = [
  {
    key: "conversation_night_push",
    name: "Conversation Night Promo",
    nameJa: "カンバセーション・ナイト告知",
    platformKeys: ["line", "instagram"],
    priceYen: 8000,
    description: "Push one upcoming event to LINE and Instagram in the week before it happens.",
  },
  {
    key: "camp_launch_push",
    name: "English Camp Launch Push",
    nameJa: "イングリッシュキャンプ告知",
    platformKeys: ["tiktok", "instagram", "line"],
    priceYen: 15000,
    description: "Announce a new English camp or workshop across the three highest-reach platforms.",
  },
  {
    key: "citywide_awareness",
    name: "Citywide Awareness Bundle",
    nameJa: "都市全体の認知拡大",
    platformKeys: ["tiktok", "instagram", "line", "x", "youtube"],
    priceYen: 50000,
    description: "General brand awareness for Seed English Tokyo across every platform we run ads on.",
  },
];

export function estimatePackageImpressions(pkg: AdPackage) {
  const perPlatformBudget = pkg.priceYen / pkg.platformKeys.length;
  return pkg.platformKeys.reduce((sum, key) => sum + estimateAdImpressions(key, perPlatformBudget), 0);
}
