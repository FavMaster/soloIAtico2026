/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.7 — FALLBACK HUMAIN + TINTORERA
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const BOOKING_URL = "https://www.amenitiz.io/soloatico";

  console.log("Solo’IA’tico Chatbot v1.7.7");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ===== DOM ===== */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) return;

    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ===== WHATSAPP ===== */
    const WA = {
      laurent: "https://wa.me/34621210642",
      sophia:  "https://wa.me/34621128303"
    };

    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open(WA.laurent, "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open(WA.sophia, "_blank");
    });

    /* ===== NORMALISATION ===== */
    function normalize(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);

      if (/\b(what|where|how|have you|do you|is there|are there)\b/.test(t)) return "en";
      if (/\b(habitacion|reservar|barco|piscina)\b/.test(t)) return "es";
      if (/\b(habitacio|reservar|vaixell|piscina)\b/.test(t)) return "ca";
      if (/\b(kamer|reserveren|boot|zwembad)\b/.test(t)) return "nl";

      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== FUZZY / INTENT ===== */
    const FUZZY = {
      rooms: ["suite", "suites", "chambre", "room", "kamers"],
      boat: ["tintorera", "bateau", "batea", "bato", "boat", "boot", "vaixell"],
      reiki: ["reiki", "reiky", "riki"],
      pool: ["piscine", "piscina", "pool", "swimming", "zwembad"]
    };

    function intent(text) {
      const t = normalize(text);
      for (const key in FUZZY) {
        if (FUZZY[key].some(k => t.includes(k))) return key;
      }
      return "unknown";
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      const dir = kbLang(lang);
      let r = await fetch(`${KB_BASE_URL}/kb/${dir}/${path}`);
      if (!r.ok && dir !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!r.ok) throw "KB introuvable";
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || ["",""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || ["",""])[1].trim()
      };
    }

    /* ===== STYLE ===== */
    const STYLE = {
      fr: { boat:"⛵ **Tintorera**\nUne expérience exclusive :" },
      en: { boat:"⛵ **Tintorera**\nAn exclusive experience :" },
      es: { boat:"⛵ **Tintorera**\nUna experiencia exclusiva :" },
      ca: { boat:"⛵ **Tintorera**\nUna experiència exclusiva :" },
      nl: { boat:"⛵ **Tintorera**\nEen exclusieve ervaring :" }
    };

    /* ===== FALLBACK HUMAIN ===== */
    const FALLBACK = {
      fr: "✨ **Excellente question !**<br>Contactez **Sophia** ou **Laurent** via WhatsApp afin d’avoir votre réponse 🙂",
      en: "✨ **Great question!**<br>Please contact **Sophia** or **Laurent** on WhatsApp to get your answer 🙂",
      es: "✨ **¡Excelente pregunta!**<br>Contacta con **Sophia** o **Laurent** por WhatsApp para obtener tu respuesta 🙂",
      ca: "✨ **Excel·lent pregunta!**<br>Contacta amb **Sophia** o **Laurent** via WhatsApp per obtenir la teva resposta 🙂",
      nl: "✨ **Goede vraag!**<br>Neem contact op met **Sophia** of **Laurent** via WhatsApp voor je antwoord 🙂"
    };

    /* ===== UI ===== */
    const UI = {
      fr:{ more:"Voir la description complète" },
      en:{ more:"View full description" },
      es:{ more:"Ver la descripción completa" },
      ca:{ more:"Veure la descripció completa" },
      nl:{ more:"Volledige beschrijving bekijken" }
    };

    function renderLong(bot, text) {
      const wrap = document.createElement("div");
      wrap.className = "kbLong";
      text.split("\n\n").forEach(p => {
        const el = document.createElement("p");
        el.innerHTML = p;
        wrap.appendChild(el);
      });
      bot.appendChild(wrap);
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(raw);
      const i = intent(raw);

      let files = [];
      if (i === "boat") files = ["03_services/tintorera-bateau.txt"];
      if (i === "pool") files = ["03_services/piscine-rooftop.txt"];
      if (i === "reiki") files = ["03_services/reiki.txt"];
      if (i === "rooms") files = [
        "02_suites/suite-neus.txt",
        "02_suites/suite-bourlardes.txt",
        "02_suites/room-blue-patio.txt"
      ];

      if (files.length === 0) {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${FALLBACK[lang]}</div>`);
        return;
      }

      for (const f of files) {
        const kb = parseKB(await loadKB(lang, f));
        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        const prefix = STYLE[lang]?.[i] || "";
        bot.innerHTML = `${prefix}<br>${kb.short}`;

        if (kb.long) {
          const moreBtn = document.createElement("button");
          moreBtn.className = "kbMoreBtn";
          moreBtn.textContent = UI[lang].more;
          moreBtn.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            moreBtn.remove();
            renderLong(bot, kb.long);
          };
          bot.appendChild(document.createElement("br"));
          bot.appendChild(moreBtn);
        }

        bodyEl.appendChild(bot);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

  });

})();
