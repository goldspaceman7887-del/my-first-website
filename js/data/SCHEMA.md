# Data file schemas — Spain Spanish learning platform

All data files are plain ES modules using `export const NAME = [...]` (ES module syntax, loaded via `<script type="module">`). No imports needed inside data files — they are pure data. Use plain double-quoted strings, escape apostrophes properly. Write valid, lint-clean modern JavaScript. Every `id` must be globally unique and stable (kebab/snake case, prefixed as shown).

Target dialect: **Peninsular (Spain) Spanish only** — use vosotros, coche/móvil/ordenador/conducir/piso/zumo/coger/vale/camiseta/bocadillo/patata etc. Only mention Latin American forms as explicit comparisons, never as the primary form. Use Castilian ce/ci/z distinction where relevant in notes.

---

## 1. Vocabulary — `js/data/vocabulary.js` → `export const VOCABULARY = [...]`

```js
{
  id: "voc_0001",                 // unique, sequential per file
  es: "el coche",                 // Spanish, with article for nouns
  en: "the car",
  pos: "noun",                    // noun | verb | adjective | adverb | phrase | expression
  gender: "m",                    // "m" | "f" | null (for non-nouns)
  category: "transport",          // greetings | numbers | family | food | house | travel | work | time | adjectives | verbs | daily-life | shopping | health | body | weather | emotions | technology | expressions | education | nature
  level: "A1",                    // A0 | A1 | A2 | B1 | B2 | C1
  frequencyRank: 120,             // approximate integer, lower = more frequent/common
  spainNote: "Spain uses \"coche\"; Latin America uses \"carro/auto\".",  // string or null — only when there's a genuine dialect difference
  exampleEs: "Voy a comprar un coche nuevo.",
  exampleEn: "I'm going to buy a new car.",
  tags: ["spain-specific", "high-frequency"]   // array of short tags
}
```

## 2. Grammar — `js/data/grammar.js` → `export const GRAMMAR = [...]`

```js
{
  id: "gram_ser_estar",
  title: "Ser vs. Estar",
  level: "A1",
  tier: "beginner",                // beginner | intermediate | advanced
  simpleExplanation: "One short sentence, plain English, zero jargon.",
  detailedExplanation: "2-4 sentences of full explanation, may reference Spain usage.",
  englishComparison: "How this differs from/maps to English grammar.",
  commonMistakes: ["Mistake 1 with why it's wrong", "Mistake 2"],
  spainExamples: ["Example sentence used in Spain with brief gloss"],
  exampleSentences: [ { es: "...", en: "..." }, { es: "...", en: "..." } ],  // 3-5 pairs
  memoryTricks: "A mnemonic or memorable trick.",
  visualExplanation: "Text description of a table/diagram (rendered as plain text/table by the UI), e.g. a conjugation table written as rows 'yo hablo | tú hablas | ...'.",
  exercises: [
    // 4-6 exercises mixing types. type is one of:
    // "multiple-choice" | "fill-blank" | "error-correction" | "translation" | "sentence-building" | "dialogue-completion"
    { type: "multiple-choice", prompt: "...", options: ["a","b","c","d"], answer: "b", explanation: "..." },
    { type: "fill-blank", prompt: "Yo ___ (ser) profesor.", answer: "soy", explanation: "..." },
    { type: "error-correction", prompt: "Yo es de Madrid.", answer: "Yo soy de Madrid.", explanation: "..." },
    { type: "translation", prompt: "I am tired.", answer: "Estoy cansado.", explanation: "accept 'cansada' too — note in explanation" },
    { type: "sentence-building", words: ["está","la","cocina","en","María"], answer: "María está en la cocina.", explanation: "..." },
    { type: "dialogue-completion", prompt: "—¿Cómo ___ ? —___ bien, gracias.", answer: "estás / Estoy", explanation: "..." }
  ]
}
```
Cover exactly this roadmap (one concept object per item):
- Beginner tier: Alphabet, Pronunciation, Articles, Gender, Plural forms, Adjectives, Ser, Estar, Hay, Present tense (regular -ar/-er/-ir), Present tense (irregular yo forms + stem-changing), Reflexive verbs, Questions
- Intermediate tier: Preterite, Imperfect, Preterite vs Imperfect, Future, Conditional, Direct object pronouns, Indirect object pronouns, Comparisons (más/menos que, tan...como), Commands (imperative, incl. vosotros), Relative pronouns (que/quien/donde), Passive constructions (ser + participio, se pasiva)
- Advanced tier: Present subjunctive, Imperfect subjunctive, Perfect tenses (pretérito perfecto, pluscuamperfecto), Conditional perfect, Reported speech (estilo indirecto), Advanced connectors (sin embargo, no obstante, por lo tanto, aunque...), Idiomatic structures, Spain-specific advanced usage (leísmo, vosotros in subjunctive/commands, vale/venga as discourse markers)

That's ~30 concept objects total. Give every one full detail — do not abbreviate.

## 3. Dialogues — one array per file, `export const DIALOGUES = [...]`

```js
{
  id: "dlg_coffee_order",
  title: "Pedir un café",
  englishTitle: "Ordering a coffee",
  level: "A0",                    // A0-C1
  category: "beginner",           // beginner | intermediate | advanced | challenge
  topic: "ordering-coffee",
  scenario: "You walk into a busy Madrid café at 9am and order breakfast at the counter.",
  lines: [
    { speaker: "Camarero", es: "¡Hola! ¿Qué te pongo?", en: "Hi! What can I get you?" },
    { speaker: "Tú", es: "Un café con leche, por favor.", en: "A coffee with milk, please." }
    // 8-16 lines total, natural Spain Spanish (vosotros where plural informal address applies)
  ],
  vocabulary: [ { es: "poner (¿qué te pongo?)", en: "to get/serve (what can I get you?)", note: "idiomatic service-industry phrase" } ], // 6-10 items
  grammarNotes: [ { point: "Present tense of pedir (e>i)", explanation: "..." } ], // 2-4 items
  comprehensionQuestions: [
    { q: "¿Qué pide el cliente?", type: "mc", options: ["Un té","Un café con leche","Un zumo"], answer: "Un café con leche" }
  ], // 4-6 items, mix of "mc" and "short-answer" (short-answer has no options, just `answer` string)
  speakingTasks: ["Roleplay ordering your own breakfast combo out loud.", "..."],  // 2-4 tasks
  dictationText: "Un café con leche, por favor.",   // 1-3 sentences drawn from the dialogue for dictation practice
  culturalNotes: {
    context: "...",
    nativeBehaviour: "...",
    register: "...",
    keyExpressions: ["..."],
    warnings: ["..."],
    regionalNotes: "...",
    practicalAdvice: "...",
    nativeSpeakerNotes: "..."
  },
  commonMistakes: ["English speakers often say X instead of Y because ..."], // 2-4 items
  advancedLowExtension: "A follow-up open-ended speaking/narration task pushing toward ACTFL Advanced Low (e.g. 'Narrate a time you had a bad experience ordering food abroad, using past tenses.')"
}
```

## 4. Culture — `js/data/culture.js` → `export const CULTURE = [...]`

```js
{
  id: "cul_tapas",
  title: "Tapas Culture",
  category: "food",              // food | social | work | university | housing | travel | healthcare | government | festivals | modern
  summary: "One-sentence hook.",
  content: "4-8 sentences / paragraphs (use \\n\\n between paragraphs) of rich explanatory content: why Spaniards do this, what to expect, practical tips.",
  comparison: { spain: "...", uk: "...", us: "..." },   // required for major topics (food, social, work, housing, travel at minimum)
  quiz: [ { q: "...", options: ["...","...","..."], answer: "..." } ]  // 3-5 items
}
```
Cover all of: Food (tapas, sobremesa, menú del día, breakfast culture, dinner culture — can be 1 entry per subtopic or combined), Social Life (friendships, invitations, humor, politeness/social norms), Work (meetings, hierarchy, networking, workplace communication), University (student life, classroom culture), Housing (renting a piso, roommates), Travel (Renfe, metro, buses, taxis), Healthcare (pharmacy, emergencies), Government (appointments, bureaucracy), Festivals (Semana Santa, Reyes Magos, Feria de Abril, San Fermín), Modern Spain (technology, social media, youth culture, workplace trends). Aim for ~22-26 entries total covering every named subtopic as its own entry.

## 5. Reading — `js/data/reading.js` → `export const READINGS = [...]`

```js
{
  id: "read_01",
  title: "Un día en Madrid",
  level: "A1",
  wordCount: 120,
  text: "Full Spanish passage, several paragraphs, \\n\\n separated.",
  translation: "Full English translation.",
  vocab: [ { es: "...", en: "..." } ],  // 6-10 glossed items
  questions: [ { q: "...", options: ["...","...","..."], answer: "..." } ]  // 4-6 comprehension questions
}
```
Provide ~10 readings at progressive difficulty: 2×A0/A1 (very short, present tense), 2×A2 (past tense narrative), 2×B1 (opinion/storytelling), 2×B2 (news-style article), 2×C1 (nuanced/literary or opinion piece on a current-events-style topic), all Spain-set (Madrid, Barcelona, Sevilla, etc.), Spain vocabulary only.

## 6. Expressions — `js/data/expressions.js` → `export const EXPRESSIONS = [...]`

```js
{
  id: "expr_vale",
  es: "vale",
  literal: "worth / it's worth",
  actualMeaning: "okay / got it / agreed",
  register: "neutral-informal",       // formal | neutral | informal | youth-slang
  context: "Used constantly in Spain to agree or confirm; can end a phone call: 'Vale, vale, hasta luego.'",
  example: { es: "—¿Nos vemos a las ocho? —Vale.", en: "—Shall we meet at eight? —Okay." }
}
```
Cover exactly this list plus a few more common Spain fillers: vale, venga, hombre, pues, o sea, claro, anda, qué guay, qué pasada, me apetece, ya ves, a ver, en plan, madre mía, no pasa nada, tío/tía, qué fuerte, ¡qué va!, oye, mola, currar, flipar. ~20 entries.

## 7. Writing prompts — `js/data/writing.js` → `export const WRITING_PROMPTS = [...]`

```js
{
  id: "wr_01",
  level: "A2",
  type: "journal",                  // journal | opinion | storytelling | guided | paragraph
  title: "Mi fin de semana",
  prompt: "Escribe sobre tu fin de semana. ¿Qué hiciste? ¿Con quién?",
  minWords: 50,
  checklist: ["Use at least 3 preterite verbs", "Include a time expression (el sábado, luego, después)", "Mention one person you were with"],
  modelAnswer: "A short model paragraph in Spain Spanish showing what a good answer looks like."
}
```
Provide ~15 prompts spanning A1 through C1 (journal entries → opinion pieces → storytelling → professional/guided writing tasks), each Spain-flavored.

---

## Output requirements for every data-file agent
- Write the file directly with the Write tool at the exact path given.
- Pure ES module: only `export const ...` statements (plus the export, no default export, no imports, no top-level side effects).
- No trailing commentary needed in the response — just confirm the file was written and give counts of items per export.
- Double-check the file is syntactically valid JS (balanced braces/brackets, no dangling commas issues) before finishing.
