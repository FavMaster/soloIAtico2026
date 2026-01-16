/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.6a — LANG + FUZZY ALIGNÉS
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const BOOKING_URL = "https://www.amenitiz.io/soloatico";

  console.log("Solo’IA’tico Chatbot v1.7.6a — LANG FUZZY");

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
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ===== NORMALISATION ===== */
    function normalize(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    /* ===== FUZZY KEYWORDS ===== */
    const FUZZY = {
      rooms: ["suite", "suites", "chambre", "room", "kamers"],
      boat: ["bateau", "batea", "bato", "boat", "boot", "vaixell"],
      reiki: ["reiki", "reiky", "riki"],
      pool: ["piscine", "piscina", "pool", "swimming", "zwembad"]
    };

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);

      // 🔑 aide par mots métiers très discriminants
      if (FUZZY.pool.some(k => t.includes(k))) {
        if (t.includes("zwembad")) return "nl";
        if (t.includes("piscina")) return "es";
        if (t.includes("swimming") || t.includes("pool")) return "en";
      }

      if (FUZZY.boat.some(k => t.includes(k))) {
        if (t.includes("vaixell")) return "ca";
        if (t.includes("boat") || t.includes("boot")) return "en";
      }

      // marqueurs linguistiques forts
      if (/\b(what|where|how|have you|do you|is there|are there)\b/.test(t)) return "en";
      if (/\b(habitacion|reservar)\b/.test(t)) return "es";
      if (/\b(habitacio|reservar)\b/.test(t)) return "ca";
      if (/\b(kamer|reserveren)\b/.test(t)) return "nl";

      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENT ===== */
    function intent(text) {
      const t = normalize(text);
      for (const key in FUZZY) {
        if (FUZZY[key].some(k => t.includes(k))) return key;
      }
      return "generic";
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
      fr: { pool: "🏊‍♀️ **Piscine rooftop**\nUn véritable atout de la maison :" },
      en: { pool: "🏊‍♀️ **Rooftop pool**\nOne of the highlights of the house :" },
      es: { pool: "🏊‍♀️ **Piscina rooftop**\nUn gran atractivo de la casa :" },
      ca: { pool: "🏊‍♀️ **Piscina rooftop**\nUn gran atractiu de la casa :" },
      nl: { pool: "🏊‍♀️ **Rooftop zwembad**\nEen van onze troeven :" }
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
      if (i === "pool") files = ["03_services/piscine-rooftop.txt"];
      if (i === "boat") files = ["03_services/tintorera-bateau.txt"];
      if (i === "reiki") files = ["03_services/reiki.txt"];
      if (i === "rooms") files = [
        "02_suites/suite-neus.txt",
        "02_suites/suite-bourlardes.txt",
        "02_suites/room-blue-patio.txt"
      ];

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
