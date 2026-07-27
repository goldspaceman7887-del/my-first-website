// Generic renderer + grader for the exercise types used across Grammar Lab,
// Dialogue Academy comprehension checks, and Listening dictation.

import { el, esc } from "./ui.js";

export function normalize(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,;:"“”']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstAnswerVariant(answer) {
  return String(answer).split("/")[0].trim();
}

function answerMatches(userInput, answer) {
  const variants = String(answer)
    .split("/")
    .map((v) => normalize(v));
  return variants.includes(normalize(userInput));
}

/**
 * Render one exercise. Calls onResult(correct:boolean) once graded.
 */
export function renderExercise(ex, { onResult } = {}) {
  const wrap = el("div", { class: "exercise-card" });
  const typeLabels = {
    "multiple-choice": "Opción múltiple",
    "fill-blank": "Completa el espacio",
    "error-correction": "Corrige el error",
    translation: "Traduce",
    "sentence-building": "Ordena la frase",
    "dialogue-completion": "Completa el diálogo"
  };
  wrap.appendChild(el("div", { class: "badge badge-default" }, typeLabels[ex.type] || ex.type));
  wrap.appendChild(el("div", { class: "exercise-prompt" }, ex.prompt || ""));

  const feedback = el("div", { class: "feedback-block hidden" });
  function showFeedback(correct, correctAnswer, explanation) {
    feedback.classList.remove("hidden", "correct", "incorrect");
    feedback.classList.add(correct ? "correct" : "incorrect");
    feedback.innerHTML = `<strong>${correct ? "¡Correcto! ✅" : "No exactamente. ❌"}</strong> ${
      !correct ? `Respuesta esperada: <em>${esc(firstAnswerVariant(correctAnswer))}</em>. ` : ""
    }${esc(explanation || "")}`;
    onResult && onResult(correct);
  }

  if (ex.type === "multiple-choice") {
    const list = el("div", { class: "option-list" });
    ex.options.forEach((opt) => {
      const btn = el(
        "button",
        {
          class: "option-btn",
          onclick: () => {
            list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
            const correct = opt === ex.answer;
            btn.classList.add(correct ? "correct" : "incorrect");
            if (!correct) {
              Array.from(list.children)
                .find((b) => b.textContent === ex.answer)
                ?.classList.add("correct");
            }
            showFeedback(correct, ex.answer, ex.explanation);
          }
        },
        opt
      );
      list.appendChild(btn);
    });
    wrap.appendChild(list);
  } else if (ex.type === "sentence-building") {
    const bank = el("div", { class: "word-bank" });
    const built = el("div", { class: "word-bank" });
    built.style.marginTop = ".5rem";
    let words = [...ex.words];
    function renderBank() {
      bank.innerHTML = "";
      words.forEach((w, idx) => {
        const chip = el(
          "button",
          {
            class: "word-chip",
            onclick: () => {
              built.appendChild(
                el(
                  "button",
                  {
                    class: "word-chip",
                    onclick: (e2) => {
                      e2.currentTarget.remove();
                      words.push(w);
                      renderBank();
                    }
                  },
                  w
                )
              );
              words.splice(idx, 1);
              renderBank();
            }
          },
          w
        );
        bank.appendChild(chip);
      });
    }
    renderBank();
    const checkBtn = el(
      "button",
      {
        class: "btn btn-primary",
        onclick: () => {
          const attempt = Array.from(built.children)
            .map((c) => c.textContent)
            .join(" ");
          const correct = normalize(attempt) === normalize(ex.answer);
          checkBtn.disabled = true;
          showFeedback(correct, ex.answer, ex.explanation);
        }
      },
      "Comprobar"
    );
    wrap.appendChild(el("div", {}, [el("p", { class: "text-faint" }, "Toca las palabras en orden:"), built, bank]));
    wrap.appendChild(el("div", { class: "btn-row" }, [checkBtn]));
  } else {
    // fill-blank, error-correction, translation, dialogue-completion: free text input
    const input = el("input", {
      type: "text",
      class: "exercise-input",
      placeholder: "Escribe tu respuesta en español...",
      autocomplete: "off",
      spellcheck: "false"
    });
    input.style.cssText =
      "width:100%;padding:.7rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:var(--font-es);font-size:1rem;";
    const checkBtn = el(
      "button",
      {
        class: "btn btn-primary",
        onclick: () => {
          const correct = answerMatches(input.value, ex.answer);
          input.disabled = true;
          checkBtn.disabled = true;
          showFeedback(correct, ex.answer, ex.explanation);
        }
      },
      "Comprobar"
    );
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkBtn.click();
    });
    wrap.appendChild(input);
    wrap.appendChild(el("div", { class: "btn-row" }, [checkBtn]));
  }

  wrap.appendChild(feedback);
  return wrap;
}

export { answerMatches };
