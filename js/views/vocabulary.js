import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { runLesson } from "../core/lessonPlayer.js";
import { getHearts, hasHearts, minutesUntilNextHeart } from "../core/hearts.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsId(v) {
  return `vocab_${v.id}`;
}

// Normalize for lenient "did you actually use the word" checking — strips
// accents/punctuation so conjugated/plural forms of the same stem still count.
function normalizeLoose(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,;:"“”']/g, "")
    .trim();
}

function wordStem(word) {
  // Drop a leading article (el/la/los/las/un/una) since VOCABULARY.es often includes it.
  const cleaned = normalizeLoose(word).replace(/^(el|la|los|las|un|una)\s+/, "");
  const firstWord = cleaned.split(/\s+/)[0] || cleaned;
  return firstWord.slice(0, Math.max(4, firstWord.length - 2)); // tolerate conjugation/plural endings
}

function sentenceUsesWord(sentence, targetWord) {
  const stem = wordStem(targetWord);
  if (!stem) return false;
  return normalizeLoose(sentence).includes(stem);
}

// Wraps whichever token in `sentence` matches the target word's stem in a
// <strong>, so the learner immediately sees the word doing its job inside a
// real sentence instead of hunting for it. Falls back to plain text if no
// token matches (shouldn't normally happen given the data, but keep it safe).
function highlightWordInSentence(sentence, targetWord) {
  const stem = wordStem(targetWord);
  const tokens = (sentence || "").split(/(\s+|[.,;:!?¿¡"“”'—-])/);
  const nodes = tokens.map((tok) => {
    if (!tok) return null;
    const normTok = normalizeLoose(tok).replace(/[^a-zñü]/gi, "");
    if (stem && normTok && normTok.startsWith(stem)) {
      return el("strong", { class: "flashcard-highlight" }, tok);
    }
    return tok;
  });
  return el("span", {}, nodes.filter((n) => n !== null));
}

// Plain-language, bilingual micro-instructions per immersion level — this is
// what makes the flashcard step-by-step and unintimidating for a total
// beginner, while gradually stepping back as the learner picks immersion 2-4.
// Every level teaches the word inside its example sentence, not in isolation
// — only how much English scaffolding is shown up front changes.
function immersionCopy(level) {
  if (level <= 1) {
    return {
      badge: "Beginner-friendly / Nivel principiante",
      instructions: "Step 1: Read the Spanish sentence below, with its English translation. Step 2: Tap 🔊 to hear the whole sentence. Step 3: Try saying it out loud, word for word.",
      hint: "Tap the card to see it again"
    };
  }
  if (level === 2) {
    return {
      badge: "Un poco más de español",
      instructions: "Read the Spanish sentence. Try to guess what it means from context before you check the English underneath.",
      hint: "Toca la tarjeta / Tap the card"
    };
  }
  if (level === 3) {
    return {
      badge: "Mostly Spanish",
      instructions: "Lee la frase en español. ¿Qué significa? Piénsalo antes de tocar para comprobar.",
      hint: "Toca para comprobar"
    };
  }
  return {
    badge: "Español",
    instructions: "Lee y escucha la frase en español. Intenta entenderla completamente en español antes de comprobar.",
    hint: "Toca para comprobar"
  };
}

function parseQuery() {
  const q = (window.location.hash.split("?")[1]) || "";
  return new URLSearchParams(q);
}

// ---------- Duolingo-style lesson question generators ----------

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickDistractors(v, count) {
  const sameCategory = VOCABULARY.filter((x) => x.id !== v.id && x.category === v.category && x.en !== v.en);
  const pool = sameCategory.length >= count ? sameCategory : VOCABULARY.filter((x) => x.id !== v.id && x.en !== v.en);
  return shuffle(pool).slice(0, count);
}

function normalizeEn(s) {
  return normalizeLoose(s).replace(/^(the|a|an)\s+/, "");
}

function recordVocabResult(v, correct) {
  gradeItem(srsId(v), "vocab", correct ? QUALITY.GOOD : QUALITY.AGAIN);
  store.state.progress.vocabExposure[v.id] = (store.state.progress.vocabExposure[v.id] || 0) + 1;
  updateSkillScore("vocabulary", correct ? 1 : -0.5);
  store.save();
}

function mcqOptionList(options, correctOption, onPick) {
  const list = el("div", { class: "option-list" });
  options.forEach((opt) => {
    list.appendChild(
      el(
        "button",
        {
          class: "option-btn",
          style: "font-family:var(--font-es)",
          onclick: (e) => {
            list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
            const correct = opt === correctOption;
            e.currentTarget.classList.add(correct ? "correct" : "incorrect");
            if (!correct) Array.from(list.children).find((b) => b.textContent === correctOption)?.classList.add("correct");
            onPick(correct);
          }
        },
        opt
      )
    );
  });
  return list;
}

function meaningMcqQuestion(v) {
  return {
    render(host, onResult) {
      const options = shuffle([v.en, ...pickDistractors(v, 3).map((d) => d.en)]);
      const hasExample = !!(v.exampleEs && v.exampleEn);
      host.appendChild(el("h3", { style: "margin:0 0 .75rem" }, "What does this mean? · ¿Qué significa?"));
      host.appendChild(
        hasExample
          ? el("div", { class: "flashcard-sentence", style: "text-align:left" }, [highlightWordInSentence(v.exampleEs, v.es)])
          : el("div", { class: "flashcard-word", style: "text-align:left" }, v.es)
      );
      host.appendChild(
        el(
          "button",
          { class: "play-btn", style: "margin:.6rem 0 1rem", onclick: () => audioEngine.speak(hasExample ? v.exampleEs : v.es) },
          "🔊"
        )
      );
      host.appendChild(
        mcqOptionList(options, v.en, (correct) => {
          recordVocabResult(v, correct);
          onResult(correct, { correctText: v.en });
        })
      );
    }
  };
}

function listenMcqQuestion(v) {
  return {
    render(host, onResult) {
      const options = shuffle([v.es, ...pickDistractors(v, 3).map((d) => d.es)]);
      host.appendChild(el("h3", { style: "margin:0 0 1rem" }, "Listen and choose · Escucha y elige"));
      host.appendChild(
        el(
          "button",
          { class: "btn btn-primary btn-lg", style: "margin-bottom:1rem", onclick: () => audioEngine.speak(v.es) },
          "🔊 Play again · Repetir"
        )
      );
      host.appendChild(
        mcqOptionList(options, v.es, (correct) => {
          recordVocabResult(v, correct);
          onResult(correct, { correctText: v.es });
        })
      );
      audioEngine.speak(v.es);
    }
  };
}

function typeTranslationQuestion(v) {
  return {
    render(host, onResult) {
      host.appendChild(el("h3", { style: "margin:0 0 .75rem" }, "Type the English translation"));
      host.appendChild(el("div", { class: "flashcard-word", style: "text-align:left;margin-bottom:.5rem" }, v.es));
      host.appendChild(
        el("button", { class: "play-btn", style: "margin-bottom:.85rem", onclick: () => audioEngine.speak(v.es) }, "🔊")
      );
      const input = el("input", { type: "text", class: "exercise-input", placeholder: "Type in English...", autocomplete: "off" });
      input.style.cssText =
        "width:100%;padding:.7rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
      const checkBtn = el(
        "button",
        {
          class: "btn btn-primary",
          style: "margin-top:.6rem",
          onclick: () => {
            const correct = normalizeEn(input.value) === normalizeEn(v.en);
            input.disabled = true;
            checkBtn.disabled = true;
            recordVocabResult(v, correct);
            onResult(correct, { correctText: v.en });
          }
        },
        "Check"
      );
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkBtn.click();
      });
      host.appendChild(input);
      host.appendChild(el("div", { class: "btn-row", style: "margin-top:.5rem" }, [checkBtn]));
    }
  };
}

function buildReviewQueue(limit = 20) {
  const due = dueItems("vocab").filter((i) => i.id.startsWith("vocab_"));
  const newIds = newItems(VOCABULARY.map(srsId), "vocab");
  let queue = [...due.map((d) => d.id.replace("vocab_", "")), ...newIds.map((id) => id.replace("vocab_", ""))];
  queue = [...new Set(queue)].slice(0, limit);
  return queue.map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean);
}

function buildVocabLessonQuestions(items) {
  return items.map((v) => {
    const hasExample = !!(v.exampleEs && v.exampleEn);
    const r = Math.random();
    if (r < 0.5 || !hasExample) return meaningMcqQuestion(v);
    if (r < 0.75) return listenMcqQuestion(v);
    return typeTranslationQuestion(v);
  });
}

function levelsPresent() {
  return ["A0", "A1", "A2", "B1", "B2", "C1"].filter((l) => VOCABULARY.some((v) => v.level === l));
}

function categoriesPresent() {
  return [...new Set(VOCABULARY.map((v) => v.category))].sort();
}

export function renderVocabulary(container) {
  const query = parseQuery();
  const state = {
    tab: "lesson",
    level: query.get("level") || "all",
    category: "all",
    search: ""
  };
  let activeLessonDestroy = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗂️ Vocabulary · Vocabulario"),
      el("p", {}, "Learn the most useful Spain-Spanish words, one at a time. The app quietly reminds you of each word right before you'd forget it."),
      el("p", { class: "text-faint" }, "Vocabulario de mayor frecuencia del español de España, con repetición espaciada y audio nativo.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("lesson", "🎯 Lesson"),
    tabBtn("flashcards", "Flashcards"),
    tabBtn("explore", "Browse / Explorar")
  ]);
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el(
      "button",
      { class: `tab-btn ${state.tab === id ? "active" : ""}`, onclick: () => setTab(id) },
      label
    );
    b.dataset.tabId = id;
    return b;
  }

  function setTab(id) {
    if (activeLessonDestroy) {
      activeLessonDestroy();
      activeLessonDestroy = null;
    }
    state.tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tabId === id));
    renderBody();
  }

  function renderBody() {
    body.innerHTML = "";
    if (state.tab === "lesson") body.appendChild(renderLessonIntro());
    else if (state.tab === "flashcards") body.appendChild(renderFlashcards());
    else body.appendChild(renderExplore());
  }

  function renderLessonIntro() {
    const wrap = el("div", {});
    const items = buildReviewQueue(10);
    const hearts = getHearts();

    if (items.length === 0) {
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "All caught up! · ¡Todo repasado!"),
          el("p", {}, "No words are due right now. Come back later, or explore new words in \"Browse.\"")
        ])
      );
      return wrap;
    }

    if (!hasHearts()) {
      const mins = minutesUntilNextHeart();
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "💔"),
          el("h3", {}, "Out of hearts for now"),
          el("p", {}, `Your next heart comes back in about ${mins} minute${mins === 1 ? "" : "s"}. You can still browse or use plain Flashcards (no hearts needed) in the meantime.`)
        ])
      );
      return wrap;
    }

    wrap.appendChild(
      el("div", { class: "card", style: "text-align:center;padding:2rem 1.5rem" }, [
        el("div", { style: "font-size:2.5rem;margin-bottom:.5rem" }, "🎯"),
        el("h2", { style: "margin:0 0 .5rem" }, "Ready for a lesson?"),
        el("p", { class: "text-muted" }, `${items.length} word${items.length === 1 ? "" : "s"} to practice · ${hearts.current} ❤️ available`),
        el(
          "button",
          {
            class: "btn btn-primary btn-lg btn-duo-cta",
            style: "margin-top:1rem",
            onclick: () => {
              body.innerHTML = "";
              const questions = buildVocabLessonQuestions(items);
              activeLessonDestroy = runLesson(body, {
                title: "Vocabulary lesson",
                questions,
                xpPerCorrect: 8,
                onExit: () => {
                  activeLessonDestroy = null;
                  renderBody();
                }
              });
            }
          },
          "Start Lesson"
        )
      ])
    );
    return wrap;
  }

  function renderFlashcards() {
    const wrap = el("div", {});
    const items = buildReviewQueue(20);

    if (items.length === 0) {
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "All caught up! · ¡Todo repasado!"),
          el("p", {}, "You have no cards due right now — nice work. Come back later, or explore new words in the \"Browse\" tab.")
        ])
      );
      return wrap;
    }

    const immersionLevel = store.state.settings.immersionLevel || 1;
    const copy = immersionCopy(immersionLevel);

    wrap.appendChild(
      el("div", { class: "card", style: "margin-bottom:1rem;border-left:3px solid var(--accent)" }, [
        el("span", { class: "badge badge-gold" }, copy.badge),
        el("p", { style: "margin:.5rem 0 0" }, copy.instructions)
      ])
    );

    let idx = 0;
    const stage = el("div", { class: "flashcard-stage" });
    const counter = el("p", { class: "text-muted" }, `Card 1 of ${items.length} · Tarjeta 1 de ${items.length}`);
    wrap.appendChild(counter);
    wrap.appendChild(stage);

    function showCard() {
      stage.innerHTML = "";
      const v = items[idx];
      const showTranslationUpfront = immersionLevel <= 1;
      const hasExample = !!(v.exampleEs && v.exampleEn);

      function playBtn(text, size) {
        return el(
          "button",
          {
            class: "play-btn",
            style: size ? `width:${size}px;height:${size}px` : "",
            "aria-label": "Listen / Escuchar",
            onclick: (e) => {
              e.stopPropagation();
              audioEngine.speak(text);
            }
          },
          "🔊"
        );
      }

      // Front: the word is taught inside its example sentence, not alone —
      // "el coche" is a label for what you're learning, the sentence is the lesson.
      const frontChildren = [
        el("div", { class: "flex justify-between items-center", style: "width:100%" }, [
          el("div", { class: "badge badge-level" }, v.level),
          el("div", { class: "text-faint", style: "font-size:.8rem;font-weight:700" }, v.es)
        ]),
        hasExample
          ? el("div", { class: "flashcard-sentence" }, [highlightWordInSentence(v.exampleEs, v.es)])
          : el("div", { class: "flashcard-word" }, v.es)
      ];
      if (hasExample && showTranslationUpfront) {
        frontChildren.push(el("div", { class: "flashcard-sub" }, v.exampleEn));
      } else if (hasExample && immersionLevel === 2) {
        frontChildren.push(el("div", { class: "flashcard-sub text-faint" }, `(${v.exampleEn})`));
      }
      frontChildren.push(
        el("div", { class: "flex gap-1 items-center", style: "margin-top:.3rem" }, [
          playBtn(hasExample ? v.exampleEs : v.es),
          hasExample ? el("span", { class: "text-faint", style: "font-size:.78rem" }, "Listen to the sentence") : null
        ].filter(Boolean)),
        el("div", { class: "flashcard-hint" }, copy.hint)
      );

      const backChildren = [
        el("div", { class: "flashcard-word", style: "font-size:1.4rem" }, `${v.es} = ${v.en}`),
        hasExample && (!showTranslationUpfront || immersionLevel > 1)
          ? el("div", { class: "flashcard-sub", style: "margin-top:.5rem" }, v.exampleEn)
          : null,
        v.spainNote ? el("div", { class: "badge badge-gold", style: "margin-top:.4rem" }, v.spainNote) : null
      ].filter(Boolean);

      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, frontChildren),
        el("div", { class: "flashcard-face back" }, backChildren)
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      // Optional, ungraded free-production step: prove you understand the
      // word by using it, not just recognizing it. Collapsed by default so
      // it never slows down the core review loop — it's there if you want it.
      const practiceWrap = el("div", { style: "width:min(560px, 100%);margin-top:.75rem" });
      const practiceToggle = el(
        "button",
        { class: "btn btn-ghost btn-block", onclick: () => { practiceBox.classList.toggle("hidden"); } },
        "✍️ Try writing a sentence with this word (optional)"
      );
      const practiceInput = el("input", { type: "text", class: "exercise-input", placeholder: `Write a sentence using "${v.es}"...` });
      practiceInput.style.cssText = "width:100%;padding:.7rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:var(--font-es);font-size:1rem;";
      const practiceFeedback = el("div", { class: "feedback-block hidden" });
      const practiceCheck = el(
        "button",
        {
          class: "btn btn-primary btn-sm",
          style: "margin-top:.5rem",
          onclick: () => {
            const text = practiceInput.value.trim();
            const usesWord = sentenceUsesWord(text, v.es);
            const longEnough = text.split(/\s+/).filter(Boolean).length >= 3;
            const good = usesWord && longEnough;
            blurActive();
            practiceFeedback.classList.remove("hidden", "correct", "incorrect");
            practiceFeedback.classList.add(good ? "correct" : "incorrect");
            practiceFeedback.textContent = good
              ? "¡Muy bien! Nice work using it in a real sentence. (+3 XP)"
              : !text
              ? "Write a full sentence, not just the word by itself."
              : !usesWord
              ? `Try to actually include "${v.es}" in your sentence.`
              : "Try a slightly longer sentence — subject + verb + something else.";
            if (good) addXP(3, `Frase propia: ${v.es}`);
          }
        },
        "Check / Comprobar"
      );
      practiceInput.addEventListener("keydown", (e) => { if (e.key === "Enter") practiceCheck.click(); });
      const practiceBox = el("div", { class: "card hidden", style: "margin-top:.5rem" }, [practiceInput, practiceCheck, practiceFeedback]);
      practiceWrap.appendChild(practiceToggle);
      practiceWrap.appendChild(practiceBox);
      stage.appendChild(practiceWrap);

      const ratingRow = el("div", { class: "srs-rating-row" }, [
        ratingBtn("Again / Otra vez", QUALITY.AGAIN, "btn-danger"),
        ratingBtn("Hard / Difícil", QUALITY.HARD, "btn"),
        ratingBtn("Good / Bien", QUALITY.GOOD, "btn"),
        ratingBtn("Easy / Fácil", QUALITY.EASY, "btn-success")
      ]);
      stage.appendChild(ratingRow);
      counter.textContent = `Card ${idx + 1} of ${items.length} · Tarjeta ${idx + 1} de ${items.length}`;

      if (store.state.settings.autoplayAudio) audioEngine.speak(hasExample ? v.exampleEs : v.es);

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              blurActive();
              gradeItem(srsId(v), "vocab", quality);
              store.state.progress.vocabExposure[v.id] = (store.state.progress.vocabExposure[v.id] || 0) + 1;
              const xp = quality >= 3 ? 3 : 1;
              addXP(xp, `Vocabulario: ${v.es}`);
              updateSkillScore("vocabulary", quality >= 3 ? 1 : -0.5);
              store.save();
              idx++;
              if (idx >= items.length) {
                stage.innerHTML = "";
                counter.textContent = "";
                stage.appendChild(
                  el("div", { class: "card empty-state pop-in" }, [
                    el("div", { class: "empty-icon" }, "✅"),
                    el("h3", {}, "Session complete! · ¡Sesión completada!"),
                    el("button", { class: "btn btn-primary", onclick: renderBody }, "Keep going / Repasar más")
                  ])
                );
              } else {
                showCard();
              }
            }
          },
          label
        );
      }
    }
    showCard();
    return wrap;
  }

  function renderExplore() {
    const wrap = el("div", {});
    const searchRow = el("div", { class: "search-row" });
    const input = el("input", { type: "search", placeholder: "Buscar en español o inglés...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
    input.addEventListener("input", () => {
      state.search = input.value;
      renderList();
    });
    searchRow.appendChild(input);
    wrap.appendChild(searchRow);

    const levelPills = el("div", { class: "level-pills" }, [
      pill("all", "Todos los niveles"),
      ...levelsPresent().map((l) => pill(l, l))
    ]);
    wrap.appendChild(levelPills);

    const catPills = el("div", { class: "level-pills", style: "margin-top:.5rem" }, [
      catPill("all", "Todas las categorías"),
      ...categoriesPresent().map((c) => catPill(c, c))
    ]);
    wrap.appendChild(catPills);

    const countLabel = el("p", { class: "text-muted", style: "margin-top:.75rem" }, "");
    wrap.appendChild(countLabel);
    const list = el("div", { class: "grid grid-auto" });
    wrap.appendChild(list);

    function pill(level, label) {
      const b = el(
        "button",
        { class: `level-pill ${state.level === level ? "active" : ""}`, onclick: () => { state.level = level; refreshPills(); renderList(); } },
        label
      );
      b.dataset.level = level;
      return b;
    }
    function catPill(cat, label) {
      const b = el(
        "button",
        { class: `level-pill ${state.category === cat ? "active" : ""}`, onclick: () => { state.category = cat; refreshCatPills(); renderList(); } },
        label
      );
      b.dataset.cat = cat;
      return b;
    }
    function refreshPills() {
      levelPills.querySelectorAll(".level-pill").forEach((b) => b.classList.toggle("active", b.dataset.level === state.level));
    }
    function refreshCatPills() {
      catPills.querySelectorAll(".level-pill").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.category));
    }

    function renderList() {
      list.innerHTML = "";
      const s = state.search.trim().toLowerCase();
      const filtered = VOCABULARY.filter((v) => {
        if (state.level !== "all" && v.level !== state.level) return false;
        if (state.category !== "all" && v.category !== state.category) return false;
        if (s && !(v.es.toLowerCase().includes(s) || v.en.toLowerCase().includes(s))) return false;
        return true;
      }).sort((a, b) => a.frequencyRank - b.frequencyRank);

      countLabel.textContent = `${filtered.length} palabras`;
      filtered.slice(0, 150).forEach((v) => {
        const mastery = masteryLevel(srsId(v));
        list.appendChild(
          el("div", { class: "card", style: "padding:.9rem" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("span", { class: "badge badge-level" }, v.level),
              el(
                "button",
                { class: "play-btn", style: "width:30px;height:30px", onclick: () => audioEngine.speak(v.es) },
                "🔊"
              )
            ]),
            el("div", { style: "font-family:var(--font-es);font-weight:700;font-size:1.15rem;margin-top:.4rem" }, v.es),
            el("div", { class: "text-muted", style: "font-size:.88rem" }, v.en),
            el("div", { class: "text-faint", style: "font-size:.78rem;margin-top:.3rem" }, `#${v.frequencyRank} · ${v.category}`),
            el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [
              el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })
            ])
          ])
        );
      });
      if (filtered.length > 150) {
        list.appendChild(el("p", { class: "text-faint" }, `Mostrando 150 de ${filtered.length}. Afina la búsqueda para ver más.`));
      }
    }
    renderList();
    return wrap;
  }

  renderBody();

  return () => {
    if (activeLessonDestroy) activeLessonDestroy();
  };
}
