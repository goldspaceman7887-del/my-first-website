export interface ReadingDay {
  day: number;
  reference: string;
  summary: string;
}

/** Gospel of John has 21 real chapters — one chapter per day is a real, commonly used plan. */
export const johnReadingPlan: ReadingDay[] = [
  { day: 1, reference: "John 1", summary: "The Word became flesh; John the Baptist testifies about Jesus." },
  { day: 2, reference: "John 2", summary: "Jesus turns water into wine at Cana; clears the temple." },
  { day: 3, reference: "John 3", summary: "Jesus and Nicodemus; being \"born again\"; John 3:16." },
  { day: 4, reference: "John 4", summary: "Jesus and the Samaritan woman at the well." },
  { day: 5, reference: "John 5", summary: "Jesus heals a man at the pool of Bethesda; speaks of his authority." },
  { day: 6, reference: "John 6", summary: "Feeding the 5,000; Jesus walks on water; \"the bread of life.\"" },
  { day: 7, reference: "John 7", summary: "Jesus teaches openly at the Feast of Tabernacles." },
  { day: 8, reference: "John 8", summary: "The woman caught in adultery; \"I am the light of the world.\"" },
  { day: 9, reference: "John 9", summary: "Jesus heals a man born blind." },
  { day: 10, reference: "John 10", summary: "Jesus describes himself as the Good Shepherd." },
  { day: 11, reference: "John 11", summary: "Jesus raises Lazarus from the dead." },
  { day: 12, reference: "John 12", summary: "Mary anoints Jesus; his triumphal entry into Jerusalem." },
  { day: 13, reference: "John 13", summary: "The Last Supper; Jesus washes his disciples' feet." },
  { day: 14, reference: "John 14", summary: "Jesus comforts his disciples: \"I am the way, the truth, and the life.\"" },
  { day: 15, reference: "John 15", summary: "The vine and the branches; Jesus' command to love one another." },
  { day: 16, reference: "John 16", summary: "Jesus promises the Holy Spirit will come." },
  { day: 17, reference: "John 17", summary: "Jesus prays for his disciples." },
  { day: 18, reference: "John 18", summary: "Jesus is arrested and tried before Pilate." },
  { day: 19, reference: "John 19", summary: "Jesus' crucifixion and burial." },
  { day: 20, reference: "John 20", summary: "The resurrection; Jesus appears to Mary and the disciples." },
  { day: 21, reference: "John 21", summary: "Jesus restores Peter and gives his final words to the disciples." },
];

/** Real, public-domain (King James Version) verses — text quoted verbatim, not paraphrased. */
export const verseOfTheDayPool: { reference: string; text: string }[] = [
  { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { reference: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { reference: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
  { reference: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved." },
];

export function verseOfTheDay(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return verseOfTheDayPool[dayOfYear % verseOfTheDayPool.length];
}
