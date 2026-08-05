// ROLEPLAY MODE — short, realistic scripted scenarios (bar, hotel, asking
// for directions, pharmacy, renting a piso). The bot plays one role aloud in
// Peninsular Spanish; you type the other role's line, get a gentle inline
// correction on your own Spanish, then see how a native speaker would say
// that same line before the bot moves the scene on.

import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, textSimilarity, speechRecognitionSupported, listenOnce } from "../core/audio.js";
import { inlineCorrection } from "../core/feedback.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { store, todayISO } from "../core/storage.js";

const SCENARIOS = [
  {
    id: "bar",
    icon: "🍺",
    title: "En el bar",
    titleEn: "Ordering at a bar",
    level: "A1-A2",
    botRole: "Camarero/a",
    userRole: "Tú (cliente)",
    lines: [
      { spk: "bot", es: "¡Hola! ¿Qué te pongo?", en: "Hi! What can I get you?" },
      { spk: "user", es: "Una caña y una ración de patatas bravas, por favor.", en: "A small beer and a portion of patatas bravas, please." },
      { spk: "bot", es: "Marchando. ¿Queréis algo más, unas aceitunas o un poco de jamón?", en: "Coming right up. Want anything else — some olives or a bit of ham?" },
      { spk: "user", es: "No, con eso vale. ¿Cuánto es?", en: "No, that's fine. How much is it?" },
      { spk: "bot", es: "Son seis euros con cincuenta. ¿Pagas en efectivo o con tarjeta?", en: "That's six fifty. Are you paying cash or by card?" },
      { spk: "user", es: "Con tarjeta, gracias.", en: "By card, thanks." },
      { spk: "bot", es: "Perfecto, aquí tienes. ¡Que aproveche!", en: "Perfect, here you go. Enjoy!" }
    ]
  },
  {
    id: "hotel",
    icon: "🏨",
    title: "En el hotel",
    titleEn: "Checking into a hotel",
    level: "A2-B1",
    botRole: "Recepcionista",
    userRole: "Tú (huésped)",
    lines: [
      { spk: "bot", es: "Buenas tardes, bienvenido/a. ¿Tiene una reserva?", en: "Good afternoon, welcome. Do you have a reservation?" },
      { spk: "user", es: "Sí, tengo una reserva para dos noches.", en: "Yes, I have a reservation for two nights." },
      { spk: "bot", es: "Perfecto, déjeme comprobarlo... Aquí está. ¿Me deja su DNI o pasaporte, por favor?", en: "Perfect, let me check... Here it is. Could I see your ID or passport, please?" },
      { spk: "user", es: "Claro, aquí tiene mi pasaporte.", en: "Of course, here's my passport." },
      { spk: "bot", es: "Gracias. Su habitación es la trescientos cinco, en el tercer piso. El desayuno se sirve de siete a diez. ¿Alguna pregunta?", en: "Thank you. Your room is three-oh-five, on the third floor. Breakfast is served from seven to ten. Any questions?" },
      { spk: "user", es: "¿Hay wifi en el hotel?", en: "Is there wifi at the hotel?" },
      { spk: "bot", es: "Sí, la contraseña está en la tarjeta de la habitación. Que disfrute de su estancia.", en: "Yes, the password is on the room card. Enjoy your stay." }
    ]
  },
  {
    id: "direcciones",
    icon: "🧭",
    title: "Pidiendo direcciones",
    titleEn: "Asking for directions",
    level: "A1-A2",
    botRole: "Un/a vecino/a",
    userRole: "Tú (turista)",
    lines: [
      { spk: "bot", es: "¡Hola! ¿Te has perdido? Pareces un poco despistado/a.", en: "Hi! Are you lost? You look a little confused." },
      { spk: "user", es: "Sí, perdona. ¿Sabes dónde está la parada de metro más cercana?", en: "Yes, sorry. Do you know where the nearest metro stop is?" },
      { spk: "bot", es: "Claro, sigue todo recto hasta el semáforo y luego gira a la derecha. Está al lado de una farmacia.", en: "Sure, go straight ahead to the traffic light and then turn right. It's next to a pharmacy." },
      { spk: "user", es: "¿Está muy lejos de aquí?", en: "Is it far from here?" },
      { spk: "bot", es: "No, está a cinco minutos andando.", en: "No, it's a five-minute walk." },
      { spk: "user", es: "Muchas gracias por la ayuda.", en: "Thanks a lot for the help." },
      { spk: "bot", es: "De nada, ¡que tengas un buen día!", en: "You're welcome, have a good day!" }
    ]
  },
  {
    id: "farmacia",
    icon: "💊",
    title: "En la farmacia",
    titleEn: "At the pharmacy",
    level: "A2-B1",
    botRole: "Farmacéutico/a",
    userRole: "Tú (cliente)",
    lines: [
      { spk: "bot", es: "Buenos días, ¿qué desea?", en: "Good morning, what would you like?" },
      { spk: "user", es: "Buenos días. Tengo dolor de cabeza y un poco de fiebre. ¿Qué me recomienda?", en: "Good morning. I have a headache and a bit of a fever. What would you recommend?" },
      { spk: "bot", es: "Le puedo dar un antiinflamatorio. ¿Es alérgico/a a algún medicamento?", en: "I can give you an anti-inflammatory. Are you allergic to any medication?" },
      { spk: "user", es: "No, no soy alérgico/a a nada.", en: "No, I'm not allergic to anything." },
      { spk: "bot", es: "Vale, tome una pastilla cada ocho horas, con comida. Si sigue con fiebre mañana, vaya al médico.", en: "Okay, take one pill every eight hours, with food. If you still have a fever tomorrow, go to the doctor." },
      { spk: "user", es: "De acuerdo. ¿Cuánto le debo?", en: "Alright. How much do I owe you?" },
      { spk: "bot", es: "Son cuatro euros con veinte.", en: "That's four twenty." }
    ]
  },
  {
    id: "piso",
    icon: "🔑",
    title: "Alquilar un piso",
    titleEn: "Renting a flat",
    level: "B1-B2",
    botRole: "Casero/a",
    userRole: "Tú (inquilino/a)",
    lines: [
      { spk: "bot", es: "Hola, soy el/la casero/a. Me dijiste que estabas interesado/a en el piso. ¿Qué te gustaría saber?", en: "Hi, I'm the landlord. You said you were interested in the flat. What would you like to know?" },
      { spk: "user", es: "¿Cuánto cuesta el alquiler al mes?", en: "How much is the rent per month?" },
      { spk: "bot", es: "Son setecientos euros al mes, gastos de comunidad incluidos, pero la luz y el agua van aparte.", en: "It's seven hundred euros a month, community fees included, but electricity and water are separate." },
      { spk: "user", es: "¿Se puede entrar a vivir el mes que viene?", en: "Can I move in next month?" },
      { spk: "bot", es: "Sí, sin problema. Solo necesito una fianza de un mes y el contrato firmado.", en: "Yes, no problem. I just need one month's deposit and the signed contract." },
      { spk: "user", es: "Perfecto, me interesa mucho el piso.", en: "Perfect, I'm very interested in the flat." },
      { spk: "bot", es: "Estupendo, quedamos esta semana para que lo veas en persona.", en: "Great, let's arrange for you to see it in person this week." }
    ]
  }
];

export function renderRoleplay(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎭 Juego de rol · Roleplay"),
      el(
        "p",
        {},
        "Elige un escenario real: pedir en un bar, el hotel, pedir direcciones, la farmacia, alquilar un piso. El bot interpreta un papel y habla en voz alta; tú escribes el otro papel. Te corrijo con cariño y comparamos con cómo lo diría un hablante nativo."
      )
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showPicker();

  function showPicker() {
    body.innerHTML = "";
    const grid = el("div", { class: "grid grid-auto" });
    SCENARIOS.forEach((s) => {
      grid.appendChild(
        el(
          "div",
          { class: "card", style: "cursor:pointer", onclick: () => startScenario(s) },
          [
            el("span", { class: "badge badge-level" }, s.level),
            el("h3", { style: "margin:.5rem 0 .2rem" }, `${s.icon} ${s.title}`),
            el("p", { class: "text-muted" }, s.titleEn)
          ]
        )
      );
    });
    body.appendChild(grid);
  }

  function startScenario(s) {
    body.innerHTML = "";
    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.75rem" }, [
        el("p", {}, [el("strong", {}, "🤖 El bot interpreta: "), s.botRole, el("br"), el("strong", {}, "🗣️ Tú interpretas: "), s.userRole]),
        el("button", { class: "btn btn-sm", onclick: showPicker }, "← Elegir otro escenario")
      ])
    );

    const log = el("div", { class: "chat-log" });
    body.appendChild(log);
    const controls = el("div", {});
    body.appendChild(controls);

    let i = 0;
    let turns = 0;
    step();

    function botBubble(line) {
      log.appendChild(
        el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, line.es), el("div", { class: "cb-en" }, line.en)])
      );
      log.scrollTop = log.scrollHeight;
      audioEngine.speak(line.es);
    }

    function userBubble(text) {
      log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
      log.scrollTop = log.scrollHeight;
    }

    function step() {
      controls.innerHTML = "";
      if (i >= s.lines.length) return finishSession();
      const line = s.lines[i];
      if (line.spk === "user") {
        promptUserTurn(line);
      } else {
        botBubble(line);
        i++;
        setTimeout(step, 500);
      }
    }

    function promptUserTurn(line) {
      const prompt = el("div", { class: "card" }, [
        el("p", { style: "font-weight:700" }, `Tu turno como ${s.userRole}:`),
        el("p", { class: "text-faint" }, `(${line.en})`)
      ]);
      const input = el("input", { type: "text", placeholder: "Escribe tu respuesta en español..." });
      input.style.cssText = "flex:1;min-width:0";
      const micBtn = speechRecognitionSupported()
        ? el(
            "button",
            {
              class: "btn btn-icon",
              title: "Habla tu respuesta",
              onclick: async () => {
                micBtn.disabled = true;
                const r = await listenOnce();
                micBtn.disabled = false;
                if (r.supported && r.transcript) input.value = r.transcript;
              }
            },
            "🎤"
          )
        : null;
      const submit = el("button", { class: "btn btn-primary", onclick: () => submitTurn() }, "Enviar");
      const row = el("div", { class: "chat-input-row" }, [micBtn, input, submit].filter(Boolean));
      const revealBtn = el(
        "button",
        {
          class: "btn btn-ghost btn-sm",
          style: "margin-top:.5rem",
          onclick: () => {
            userBubble(`${line.es} (mostrado, sin puntuar)`);
            i++;
            turns++;
            step();
          }
        },
        "No sé — muéstrame"
      );
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitTurn();
      });

      prompt.appendChild(row);
      prompt.appendChild(revealBtn);
      controls.appendChild(prompt);
      input.focus();

      function submitTurn() {
        const text = input.value.trim();
        if (!text) {
          toast("Escribe algo primero, o toca «muéstrame».", { type: "error" });
          return;
        }
        userBubble(text);
        const note = inlineCorrection(text);
        if (note) log.appendChild(note);

        const score = textSimilarity(text, line.es);
        const verdict = score >= 70 ? "¡Muy bien, casi igual!" : score >= 35 ? "Buen intento — así lo diría un hablante nativo:" : "Así lo diría un hablante nativo:";
        log.appendChild(
          el("div", { class: "correction-block compact" }, [
            el("div", { class: "co-line co-right" }, [
              el("span", { class: "co-tag" }, verdict),
              el("span", { class: "es-text" }, line.es),
              el(
                "button",
                { class: "btn btn-sm", style: "margin-left:.4rem", onclick: () => audioEngine.speak(line.es) },
                "🔊"
              )
            ]),
            el("p", { class: "co-explain" }, line.en)
          ])
        );
        log.scrollTop = log.scrollHeight;

        updateSkillScore("speaking", score >= 60 ? 2 : 0.5);
        turns++;
        i++;
        input.value = "";
        blurActive();
        setTimeout(step, 400);
      }
    }

    function finishSession() {
      controls.innerHTML = "";
      registerStudyToday();
      store.state.progress.roleplaySessions = store.state.progress.roleplaySessions || [];
      store.state.progress.roleplaySessions.push({ date: todayISO(), scenarioId: s.id, turns });
      const xp = 8 + turns * 2;
      addXP(xp, `Roleplay: ${s.title}`);
      store.save();
      controls.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, "¡Escenario completado!"),
          el("p", {}, `+${xp} XP · ${turns} turnos`),
          el("button", { class: "btn btn-primary", onclick: showPicker }, "Probar otro escenario")
        ])
      );
      toast(`¡Bien hecho! +${xp} XP`, { icon: "🎭" });
    }
  }

  return () => audioEngine.stop();
}
