/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.4b — FIX KB CATALAN (cat)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const BOOKING_URL = "https://www.amenitiz.io/soloatico";

  console.log("Solo’IA’tico Chatbot v1.7.4b — LANG ca / KB cat");

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

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = text.toLowerCase();
      if (/what|room|suite|boat|pool|reiki/.test(t)) return "en";
      if (/habitacion|barco|piscina|reiki/.test(t)) return "es";
      if (/habitacio|vaixell|piscina|reiki/.test(t)) return "ca"; // catalan
      if (/kamer|boot|zwembad|reiki/.test(t)) return "nl";
      return pageLang();
    }

    // 🔑 mapping langue → répertoire KB
    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENT ===== */
    function intent(t) {
      if (/suite|room|chambre|hotel/.test(t)) return "rooms";
      if (/reiki/.test(t)) return "reiki";
      if (/bateau|boat|boot|vaixell/.test(t)) return "boat";
      if (/piscine|pool|zwembad|piscina/.test(t)) return "pool";
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
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1].trim()
      };
    }

    /* ===== UI ===== */
    const UI = {
      fr:{ more:"Voir la description complète", book:"🏨 Réserver" },
      en:{ more:"View full description", book:"🏨 Book now" },
      es:{ more:"Ver la descripción completa", book:"🏨 Reservar" },
      ca:{ more:"Veure la descripció completa", book:"🏨 Reservar" },
      nl:{ more:"Volledige beschrijving bekijken", book:"🏨 Reserveren" }
    };

    /* ===== RENDER LONG (SEXY) ===== */
    function renderLong(bot, text) {
      const blocks = text.split("\n\n").filter(b => b.trim());
      const wrap = document.createElement("div");
      wrap.className = "kbLong";

      blocks.forEach(p => {
        const el = document.createElement("p");
        el.style.marginBottom = "10px";
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
      const i = intent(raw.toLowerCase());

      try {
        let files = [];

        if (i === "rooms") {
          files = [
            "02_suites/suite-neus.txt",
            "02_suites/suite-bourlardes.txt",
            "02_suites/room-blue-patio.txt"
          ];
        }

        if (i === "reiki") files = ["03_services/reiki.txt"];
        if (i === "boat")  files = ["03_services/tintorera-bateau.txt"];
        if (i === "pool")  files = ["03_services/piscine-rooftop.txt"];

        if (files.length === 0) return;

        for (const f of files) {
          const kb = parseKB(await loadKB(lang, f));
          const bot = document.createElement("div");
          bot.className = "msg botMsg";

          bot.innerHTML = `<b>${kb.short}</b>`;

          if (kb.long) {
            const moreBtn = document.createElement("button");
            moreBtn.className = "kbMoreBtn";
            moreBtn.textContent = UI[lang].more;

            moreBtn.addEventListener("click", e => {
              e.preventDefault(); e.stopPropagation();
              moreBtn.remove();
              renderLong(bot, kb.long);
              bodyEl.scrollTop = bodyEl.scrollHeight;
            });

            bot.appendChild(document.createElement("br"));
            bot.appendChild(moreBtn);
          }

          if (i === "rooms") {
            const bookBtn = document.createElement("a");
            bookBtn.href = BOOKING_URL;
            bookBtn.target = "_blank";
            bookBtn.className = "kbBookBtn";
            bookBtn.textContent = UI[lang].book;
            bot.appendChild(document.createElement("br"));
            bot.appendChild(bookBtn);
          }

          bodyEl.appendChild(bot);
        }

        bodyEl.scrollTop = bodyEl.scrollHeight;

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">❌ Une erreur est survenue.</div>`);
      }
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
