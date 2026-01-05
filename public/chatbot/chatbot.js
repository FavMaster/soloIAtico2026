/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.8 STABLE
 * LANGUE 100% COHÉRENTE
 * Mémoire persistante + KB SAFE
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_state_v2";

  console.log("Solo’IA’tico Chatbot v1.5.8 — Loaded");

  /****************************************************
   * MÉMOIRE PERSISTANTE
   ****************************************************/
  const memory = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  })();

  function saveMemory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  /****************************************************
   * I18N — TEXTES UI UNIQUEMENT
   ****************************************************/
  const I18N = {
    fr: {
      help: "Je peux vous renseigner sur nos suites, le bateau Tintorera, le Reiki, la piscine ou les activités 😊",
      clarify: "Pouvez-vous préciser votre demande ? 😊",
      more: "Voir la description complète",
      bookBoat: "⛵ Réserver une sortie en mer",
      listSuitesTitle: "Voici nos hébergements ✨",
      listSuites: ["Suite Neus","Suite Bourlardes","Chambre Blue Patio"],
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
      listSuites: ["Suite Neus","Suite Bourlardes","Blue Patio Room"],
      short: {
        bateau: "Tintorera offers unforgettable boat trips ⛵",
        reiki: "Reiki is an energy healing treatment promoting deep relaxation 🌿",
        piscine: "Our rooftop pool is available 🏖️",
        suite: "Here is information about our accommodations ✨",
        default: "Here is what I can tell you 😊"
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
   * LANGUE — PRIORITÉ CORRIGÉE
   ****************************************************/
  function getPageLang() {
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function detectLanguageFromText(text) {
    const t = text.toLowerCase();
    if (/[a-z]/.test(t) && /what|is|are|can you/.test(t)) return "en";
    if (/qué|puede|hacer/.test(t)) return "es";
    return null;
  }

  function resolveLang(text) {
    if (memory.lang) return memory.lang;

    const pageLang = getPageLang();
    if (pageLang) return pageLang;

    const detected = detectLanguageFromText(text);
    if (detected) return detected;

    return "fr";
  }

  /****************************************************
   * INTENT / TOPIC
   ****************************************************/
  function detectIntent(text) {
    const t = text.toLowerCase();
    if (/suite|suites|rooms|hébergements/.test(t)) return "list_suites";
    if (/help|aide/.test(t)) return "help";
    return "specific";
  }

  function detectTopic(text) {
    const t = text.toLowerCase();

    if (/neus/.test(t)) return "suite_neus";
    if (/bourlard/.test(t)) return "suite_bourlardes";
    if (/blue/.test(t)) return "suite_blue";
    if (/tintorera|bateau|boat/.test(t)) return "bateau";
    if (/reiki/.test(t)) return "reiki";
    if (/piscine|pool/.test(t)) return "piscine";

    return memory.lastTopic || "default";
  }

  /****************************************************
   * KB
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
    const s = text.match(/SHORT:\s*([\s\S]*?)\nLONG:/i);
    const l = text.match(/LONG:\s*([\s\S]*)/i);
    return { short: s?.[1]?.trim(), long: l?.[1]?.trim() };
  }

  function buildLongList(text) {
    const ul = document.createElement("ul");
    ul.className = "kbLongList";
    text.split(/\n|•|- /)
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

      const lang   = resolveLang(text);
      const intent = detectIntent(text);
      const topic  = detectTopic(text);

      memory.lastTopic = topic;
      memory.lang = lang;
      saveMemory();

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "help") {
          bot.textContent = t(lang, "help");
        }

        else if (intent === "list_suites") {
          const title = document.createElement("b");
          title.textContent = t(lang, "listSuitesTitle");
          bot.appendChild(title);
          bot.appendChild(document.createElement("br"));
          bot.appendChild(document.createElement("br"));

          I18N[lang].listSuites.forEach(s => {
            const line = document.createElement("div");
            line.textContent = `• ${s}`;
            bot.appendChild(line);
          });
        }

        else {
          const intro = document.createElement("div");
          intro.innerHTML = `<b>${shortAnswer(lang, topic)}</b><br><br>`;
          bot.appendChild(intro);

          const kbPath = resolveKBPath(topic, lang);
          if (kbPath) {
            let res = await fetch(kbPath);
            if (!res.ok && lang !== "fr") {
              res = await fetch(kbPath.replace(`/kb/${lang}/`, `/kb/fr/`));
            }

            if (res.ok) {
              const kb = parseKB(await res.text());

              if (kb.short) {
                const s = document.createElement("div");
                s.textContent = kb.short;
                bot.appendChild(s);
              }

              if (kb.long) {
                const moreBtn = document.createElement("button");
                moreBtn.className = "kbMoreBtn";
                moreBtn.textContent = t(lang, "more");

                moreBtn.addEventListener("click", () => {
                  moreBtn.remove();
                  bot.appendChild(buildLongList(kb.long));
                  bodyEl.scrollTop = bodyEl.scrollHeight;
                });

                bot.appendChild(document.createElement("br"));
                bot.appendChild(moreBtn);
              }
            }
          }

          if (topic === "bateau") {
            const book = document.createElement("a");
            book.className = "kbBookBtn";
            book.href = "https://koalendar.com/e/tintorera";
            book.target = "_blank";
            book.textContent = t(lang, "bookBoat");
            bot.appendChild(document.createElement("br"));
            bot.appendChild(book);
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

    console.log("✅ Chatbot Solo’IA’tico v1.5.8 prêt");
  });

})();
