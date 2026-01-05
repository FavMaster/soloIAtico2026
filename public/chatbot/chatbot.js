/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.4 STABLE
 * FULL KB (SHORT + LONG) + Mémoire conversationnelle
 * Mobile Safe (iOS / Android)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.5.4 — Loaded");

  /****************************************************
   * MÉMOIRE CONVERSATIONNELLE (SESSION)
   ****************************************************/
  const memory = {
    lastTopic: null,
    lastLang: "fr"
  };

  /****************************************************
   * I18N — TEXTES CENTRALISÉS
   ****************************************************/
  const I18N = {
    fr: {
      help: "Je peux vous renseigner sur nos suites, le bateau Tintorera, le Reiki ou la piscine 😊",
      clarify: "Pouvez-vous préciser votre demande ? 😊",
      more: "Voir la description complète",
      bookBoat: "⛵ Réserver une sortie en mer",
      short: {
        bateau: "La Tintorera vous propose des sorties en mer inoubliables ⛵",
        reiki: "Des séances de Reiki sont disponibles 🌿",
        piscine: "Notre piscine rooftop est accessible aux hôtes 🏖️",
        suite: "Voici les informations sur nos hébergements ✨",
        default: "Voici ce que je peux vous dire 😊"
      }
    },

    en: {
      help: "I can help you with our suites, the Tintorera boat, Reiki or the pool 😊",
      clarify: "Could you please clarify your request? 😊",
      more: "View full description",
      bookBoat: "⛵ Book a boat trip",
      short: {
        bateau: "Tintorera offers unforgettable boat trips ⛵",
        reiki: "Reiki sessions are available 🌿",
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
    return (
      I18N[lang]?.short?.[topic] ||
      I18N.fr.short[topic] ||
      I18N.fr.short.default
    );
  }

  /****************************************************
   * OUTILS LINGUISTIQUES
   ****************************************************/
  function detectLanguage(text = "") {
    const t = text.toLowerCase();
    if (/zwembad|boot/.test(t)) return "nl";
    if (/boat|pool/.test(t)) return "en";
    if (/piscina|hacer/.test(t)) return "es";
    if (/fer|piscina/.test(t)) return "cat";
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function detectIntent(text) {
    const t = text.toLowerCase();
    if (/help|aide|ayuda/.test(t)) return "help";
    return "specific";
  }

  function detectTopic(text) {
    const t = text.toLowerCase();

    if (/tintorera|bateau|boat|boot/.test(t)) return "bateau";
    if (/reiki|massage/.test(t)) return "reiki";
    if (/piscine|pool|zwembad/.test(t)) return "piscine";
    if (/suite|room|chambre/.test(t)) return "suite";

    return memory.lastTopic || "default";
  }

  /****************************************************
   * ROUTEUR KB
   ****************************************************/
  function resolveKBPath(topic, lang) {
    const map = {
      bateau: "03_services/tintorera-bateau.txt",
      reiki: "03_services/reiki.txt",
      piscine: "03_services/piscine-rooftop.txt"
    };

    if (!map[topic]) return null;
    return `${KB_BASE_URL}/kb/${lang}/${map[topic]}`;
  }

  function parseKB(text) {
    const short = text.match(/SHORT:\s*([\s\S]*?)\nLONG:/i);
    const long = text.match(/LONG:\s*([\s\S]*)/i);

    return {
      short: short ? short[1].trim() : "",
      long: long ? long[1].trim() : ""
    };
  }

  function formatLong(text) {
    const lines = text
      .split(/\n|•|- /)
      .map(l => l.trim())
      .filter(l => l.length > 30)
      .slice(0, 6);

    return `<ul class="kbLongList">
      ${lines.map(l => `<li>${l}</li>`).join("")}
    </ul>`;
  }

  /****************************************************
   * INIT DOM READY (MOBILE SAFE)
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    /* CSS */
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    /* HTML */
    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    if (!chatWin || !openBtn || !sendBtn || !input) {
      console.error("❌ Chatbot HTML incomplet");
      return;
    }

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

      bodyEl.innerHTML += `<div class="msg userMsg">${text}</div>`;
      typing.style.display = "flex";

      const lang = detectLanguage(text);
      const intent = detectIntent(text);
      const topic = detectTopic(text);

      memory.lastTopic = topic;
      memory.lastLang = lang;

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "help") {
          bot.textContent = t(lang, "help");
        } else {

          // Intro courte
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
                const btn = document.createElement("button");
                btn.className = "kbMoreBtn";
                btn.textContent = t(lang, "more");

                btn.onclick = () => {
                  btn.remove();
                  bot.innerHTML += formatLong(kb.long);
                  bodyEl.scrollTop = bodyEl.scrollHeight;
                };

                bot.appendChild(document.createElement("br"));
                bot.appendChild(btn);
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

    console.log("✅ Chatbot Solo’IA’tico v1.5.4 prêt");
  });

})();
