export interface Badge {
  key: string;
  emoji: string;
  label: string;
  labelJa: string;
  description: string;
  earned: boolean;
}

export interface BadgeInputs {
  seedCount: number;
  prayerCount: number;
  connectionCount: number;
  testimonyCount: number;
  bibleStreak: number;
  bibleDaysCompleted: number;
}

/** Every badge is computed from real local activity on this device — never hand-set. */
export function computeBadges(inputs: BadgeInputs): Badge[] {
  return [
    {
      key: "first_seed",
      emoji: "🌱",
      label: "First Seed Planted",
      labelJa: "最初の種",
      description: "Plant your first seed.",
      earned: inputs.seedCount >= 1,
    },
    {
      key: "prayer_warrior",
      emoji: "🙏",
      label: "Prayer Warrior",
      labelJa: "祈りの戦士",
      description: "Share 3 or more prayer requests.",
      earned: inputs.prayerCount >= 3,
    },
    {
      key: "reaching_out",
      emoji: "🤝",
      label: "Reaching Out",
      labelJa: "手を差し伸べる",
      description: "Request a connection with someone.",
      earned: inputs.connectionCount >= 1,
    },
    {
      key: "storyteller",
      emoji: "📖",
      label: "Storyteller",
      labelJa: "物語を語る",
      description: "Share your own testimony.",
      earned: inputs.testimonyCount >= 1,
    },
    {
      key: "week_streak",
      emoji: "🔥",
      label: "Seven Day Streak",
      labelJa: "7日間連続",
      description: "Read the Bible plan 7 days in a row.",
      earned: inputs.bibleStreak >= 7,
    },
    {
      key: "gospel_of_john",
      emoji: "✝️",
      label: "Finished The Gospel of John",
      labelJa: "ヨハネの福音書を読了",
      description: "Complete all 21 days of the reading plan.",
      earned: inputs.bibleDaysCompleted >= 21,
    },
    {
      key: "grove_grower",
      emoji: "🌳",
      label: "Grove Grower",
      labelJa: "森を育てる者",
      description: "Plant 3 or more seeds.",
      earned: inputs.seedCount >= 3,
    },
  ];
}
