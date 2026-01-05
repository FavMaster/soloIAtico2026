/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.6 STABLE
 * FULL I18N — TOPIC & SUITES FIXED
 * Mobile Safe (iOS / Android)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.5.6 — Loaded");

  /****************************************************
   * MÉMOIRE CONVERSATIONNELLE (SESSION)
   ****************************************************/
  const memory = {
    lastTopic: null
  };

  /****************************************************
   * I18N COMPLET
   ****************************************************/
  const I18N = {
    fr: {
      help: "Je peux vous renseigner sur nos suites, le bateau Tintorera, le Reiki, la piscine ou les activités 😊",
      clarify: "Pouvez-vous préciser votre demande ? 😊",
      more: "Voir la description complète",
      bookBoat: "⛵ Réserver une sortie en mer",
      listSuitesTitle: "Voici nos hébergements ✨",
      listSuites: [
        "Suite Neus",
        "Suite Bourlardes",
        "Chambre Blue Patio"
      ],
      short: {
        bateau: "La Tintorera vous propose des sorties en mer inoubliables ⛵",
        reiki: "Le Reiki est un soin énergétique favorisant détente et bien-être 🌿",
        piscine: "Notre piscine rooftop est accessible aux hôtes 🏖️",
        suite: "Voici les informations sur nos hébergements ✨",
        default: "Voici ce que je peux vous dire 😊"
      }
    },

    en: {
      help: "I can help you with our suites, the Tintorera boat, Reiki, the pool or activities 😊",
      clarify: "Could you please clarify your request? 😊",
      more: "View full description",
      bookBoat: "⛵ Book a boat trip",
      listSuitesTitle: "Here are our accommodations ✨",
      listSuites: [
        "Suite Neus",
        "Suite Bourlardes",
        "Blue Patio Room"
      ],
      short: {
        bateau: "Tintorera offers unforgettable boat trips ⛵",
        reiki: "Reiki is an energy healing treatment promoting deep relaxation 🌿",
        piscine: "Our rooftop pool is available to guests 🏖️",
        suite: "Here is information about our accommodations ✨",
        default: "Here is what I can tell you 😊"
      }
    },

    es: {
      help: "Puedo informarle sobre nuestras suites, el barco Tintorera, Reiki o la piscina 😊",
      clarify: "¿Podría precisar su solicitud? 😊",
      more: "Ver la descripción completa",
      bookBoat: "⛵ Reservar una salida en barco",
      listSuitesTitle: "Nuestros alojamientos ✨",
      listSuites: [
        "Suite Neus",
        "Suite Bourlardes",
        "Habitación Blue Patio"
      ],
      short: {
        bateau: "Tintorera ofrece salidas en barco inolvidables ⛵",
        reiki: "El Reiki es un tratamiento energético que favorece la relajación 🌿",
        piscine: "Nuestra piscina rooftop está disponible 🏖️",
        suite: "Aquí tiene información sobre nuestros alojamientos ✨",
        default: "Esto es lo que puedo decirle 😊"
      }
    },

    nl: {
      help: "Ik kan u helpen met onze suites, de Tintorera-boot, Reiki of het zwembad 😊",
      clarify: "Kunt u uw vraag verduidelijken? 😊",
      more: "Volledige beschrijving bekijken",
      bookBoat: "⛵ Boottocht reserveren",
      listSuitesTitle: "Onze accommodaties ✨",
      listSuites: [
        "Suite Neus",
        "Suite Bourlardes",
        "Blue Patio Kamer"
      ],
      short: {
        bateau: "Tintorera biedt onvergetelijke boottochten ⛵",
        reiki: "Reiki is een energetische behandeling voor diepe ontspanning 🌿",
        piscine: "Ons rooftopzwembad is toegankelijk 🏖️",
        suite: "Hier is informatie over onze accommodaties ✨",
        default: "Dit is wat ik u kan vertellen 😊"
      }
    },

    cat: {
      help: "Puc informar-vos sobre les nostres suites, el vaixell Tintorera, Reiki o la piscina 😊",
      clarify: "Podeu precisar la vostra sol·licitud? 😊",
      more: "Veure la descripció completa",
      bookBoat: "⛵ Reservar una sortida en vaixell",
      listSuitesTitle: "Els nostres allotjaments ✨",
      listSuites: [
        "Suite Neus",
        "Suite Bourlardes",
        "Habitació Blue Patio"
      ],
      short: {
        bateau: "La Tintorera ofereix sortides en vaixell inoblidables ⛵",
        reiki: "El Reiki és un tractament energètic per a la relaxació 🌿",
        piscine: "La nostra piscina rooftop és accessible 🏖️",
        suite: "Aquí teniu informació sobre els allotjaments ✨",
        default: "Això és el que us puc explicar 😊"
      }
    }
  };

  function t(lang, key) {
    return I18N[lang]?.[key] || I18N.fr[key];
  }

  function shortAnswer(lang, topic) {
    return I18N[lang]?.short?.[topic] || I18N.fr.short.default;
  }

  /****************************************************
   * DÉTECTION LANGUE
   ****************************************************/
  function detectLanguage(text = "") {
    const t = text.toLowerCase();
    if (/what|is|are|reiki|pool|boat/.test(t)) return "en";
    if (/piscina|hacer|reiki/.test(t)) return "es";
    if (/zwembad|boot/.test(t)) return "nl";
    if (/fer|piscina/.test(t)) return "cat";
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  /****************************************************
   * INTENTIONS
   ****************************************************/
  function detectIntent(text) {
    const t = text.toLowerCase();
    if (/help|aide|ayuda/.test(t)) return "help";
    if (/suite|suites|rooms|kamers|hébergements/.test(t)) return "list_suites";
    return "specific";
  }

  /****************************************************
   * TOPICS
   ****************************************************/
  function detectTopic(text) {
    const t = text.toLowerCase();

    if (/neus/.test(t)) return "suite_neus";
    if (/bourlard/.test(t)) return "suite_bourlardes";
    if (/blue/.test(t)) return "suite_blue";

    if (/tintorera|bateau|boat|boot/.test(t)) return "bateau";
    if (/reiki|massage/.test(t)) return "reiki";
    if (/piscine|pool|zwembad/.test(t)) return "piscine";

    return "default";
  }

  /****************************************************
   * ROUTEUR KB
   ****************************************************/
  function resolveKBPath(topic, lang) {
    const map = {
      bateau: "03_services/tintorera-bateau.txt",
      reiki: "03_services/reiki.txt",
      piscine: "03_services/piscine-rooftop.txt",
      suite_neus: "02_suites/suite-neus.txt",
      suite_bourlardes: "02_suites/suite-bourlardes.txt",
      suite_blue: "02_suites/suite-blue-patio.txt"
    };

    return map[topic]
      ? `${KB_BASE_URL}/kb/${lang}/${map[topic]}`
      : null;
  }

  function parseKB(text) {
    const short = text.match(/SHORT:\s*([\s\S]*?)\nLONG:/i);
    const long = text.match(/LONG:\s*([\s\S]*)/i);
    return {
      short: short ? short[1].trim() : "",
      long: long ? long[1].trim() : ""
    };
  }

  function buildLongList(text) {
    const ul = document.createElement("ul");
    ul.className = "kbLongList";

    text
      .split(/\n|•|- /)
      .map(l => l.trim())
      .filter(l => l.length > 30)
      .slice(0, 6)
      .forEach(line => {
        const li = document.createElement("li");
        li.textContent = line;
        ul.appendChild(li);
      });

    return ul;
  }

  /****************************************************
   * INIT DOM READY
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    chatWin.style.display = "none";
    let isOpen = false;

    openBtn.addEventListener("click", e => {
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    async function sendMessage() {
      if (!input.value.trim()) return;

      const text = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${text}</div>`);
      typing.style.display = "flex";

      const lang   = detectLanguage(text);
      const intent = detectIntent(text);
      const topic  = detectTopic(text);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "help") {
          bot.textContent = t(lang, "help");
        }

        else if (intent === "list_suites") {
          bot.innerHTML = `<b>${t(lang, "listSuitesTitle")}</b><br><br>`;
          I18N[lang].listSuites.forEach(s => {
            bot.innerHTML += `• ${s}<br>`;
          });
        }

        else {
          bot.innerHTML = `<b>${shortAnswer(lang, topic)}</b><br><br>`;

          const kbPath = resolveKBPath(topic, lang);
          if (kbPath) {
            let res = await fetch(kbPath);
            if (!res.ok && lang !== "fr") {
              res = await fetch(kbPath.replace(`/kb/${lang}/`, `/kb/fr/`));
            }

            if (res.ok) {
              const kb = parseKB(await res.text());

              if (kb.short) {
                bot.innerHTML += `<div>${kb.short}</div>`;
              }

              if (kb.long) {
                const moreBtn = document.createElement("button");
                moreBtn.className = "kbMoreBtn";
                moreBtn.textContent = t(lang, "more");

                moreBtn.onclick = () => {
                  moreBtn.remove();
                  bot.appendChild(buildLongList(kb.long));
                  bodyEl.scrollTop = bodyEl.scrollHeight;
                };

                bot.appendChild(document.createElement("br"));
                bot.appendChild(moreBtn);
              }
            }
          }

          if (topic === "bateau") {
            bot.innerHTML += `<br>
              <a class="kbBookBtn" target="_blank"
                 href="https://koalendar.com/e/tintorera">
                ${t(lang, "bookBoat")}
              </a>`;
          }
        }

      } catch (e) {
        console.error(e);
        bot.textContent = t(lang, "clarify");
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", e => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("✅ Chatbot Solo’IA’tico v1.5.6 prêt");
  });

})();
