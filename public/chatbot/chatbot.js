/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.0 — CONCIERGE CORE
 * Memory Engine + State Machine
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v16";

  console.log("Solo’IA’tico Chatbot v1.6.0 — Concierge Core Loaded");

  /****************************************************
   * MEMORY ENGINE (PERSISTENT)
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

  // Initial defaults
  memory.lang = memory.lang || null;
  memory.lastTopic = memory.lastTopic || null;
  memory.state = memory.state || "IDLE";
  memory.slots = memory.slots || {};

  saveMemory();

  /****************************************************
   * STATE MACHINE
   ****************************************************/
  const STATES = {
    IDLE: "IDLE",
    INFO_MODE: "INFO_MODE",
    CONCIERGE_BATEAU: "CONCIERGE_BATEAU",
    CONCIERGE_REIKI: "CONCIERGE_REIKI",
    CONCIERGE_SUITES: "CONCIERGE_SUITES"
  };

  function setState(newState) {
    memory.state = newState;
    saveMemory();
    console.log("🔁 STATE →", newState);
  }

  /****************************************************
   * I18N (UI TEXT ONLY)
   ****************************************************/
  const I18N = {
    fr: {
      help: "Je peux vous renseigner sur nos suites, le bateau Tintorera, le Reiki, la piscine ou les activités 😊",
      clarify: "Pouvez-vous préciser votre demande ? 😊",
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
   * LANGUAGE RESOLUTION (LOCKED PRIORITY)
   ****************************************************/
  function getPageLang() {
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function detectLangFromText(text) {
    const t = text.toLowerCase();
    if (/what|is|are|can you|please/.test(t)) return "en";
    return null;
  }

  function resolveLang(text) {
    if (memory.lang) return memory.lang;

    const pageLang = getPageLang();
    if (pageLang) return pageLang;

    const detected = detectLangFromText(text);
    if (detected) return detected;

    return "fr";
  }

  /****************************************************
   * INTENT & TOPIC DETECTION (BASE)
   ****************************************************/
  function detectIntent(text) {
    const t = text.toLowerCase();
    if (/help|aide/.test(t)) return "help";
    return "info";
  }

  function detectTopic(text) {
    const t = text.toLowerCase();

    if (/tintorera|bateau|boat/.test(t)) return "bateau";
    if (/reiki/.test(t)) return "reiki";
    if (/piscine|pool/.test(t)) return "piscine";
    if (/suite|room|chambre/.test(t)) return "suite";

    return null;
  }

  /****************************************************
   * DOM READY
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

    chatWin.style.display = "none";
    let isOpen = false;

    openBtn.addEventListener("click", e => {
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    /****************************************************
     * SEND MESSAGE — CORE MODE
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const text = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${text}</div>`);
      typing.style.display = "flex";

      const lang   = resolveLang(text);
      const intent = detectIntent(text);
      const topic  = detectTopic(text);

      memory.lang = lang;
      memory.lastTopic = topic || memory.lastTopic;
      memory.state = STATES.INFO_MODE;
      saveMemory();

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "help") {
          bot.textContent = t(lang, "help");
        } else {
          bot.textContent = shortAnswer(lang, topic || "default");
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

    console.log("✅ Concierge Core v1.6.0 ready");
  });

})();
