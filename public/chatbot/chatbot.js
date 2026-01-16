/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.2 — SUITES & CHAMBRE (KB RÉELLE)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const BOOKING_URL = "https://www.amenitiz.io/soloatico";

  console.log("Solo’IA’tico Chatbot v1.7.2 — SUITES FIRST");

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
      e.preventDefault();
      e.stopPropagation();
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
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/kamer|suite/.test(t)) return "nl";
      if (/room|suite/.test(t)) return "en";
      if (/habitacion|suite/.test(t)) return "es";
      if (/habitacio|suite/.test(t)) return "cat";
      return pageLang();
    }

    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /* ===== KB ===== */
    async function loadKB(lang, file) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/02_suites/${file}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/02_suites/${file}`);
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
      fr: { more: "Voir la description complète", book: "🏨 Réserver" },
      en: { more: "View full description", book: "🏨 Book now" },
      es: { more: "Ver la descripción completa", book: "🏨 Reservar" },
      cat:{ more: "Veure la descripció completa", book: "🏨 Reservar" },
      nl: { more: "Volledige beschrijving bekijken", book: "🏨 Reserveren" }
    };

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(norm(raw));

      try {
        const rooms = [
          { title: "🛏 Suite Neus", file: "suite-neus.txt" },
          { title: "🛏 Suite Bourlardes", file: "suite-bourlardes.txt" },
          { title: "🛏 Chambre Blue Patio", file: "room-blue-patio.txt" }
        ];

        for (const room of rooms) {
          const kb = parseKB(await loadKB(lang, room.file));

          const bot = document.createElement("div");
          bot.className = "msg botMsg";

          bot.innerHTML = `<b>${room.title}</b><br>${kb.short}`;

          if (kb.long) {
            const moreBtn = document.createElement("button");
            moreBtn.className = "kbMoreBtn";
            moreBtn.textContent = UI[lang].more;

            moreBtn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              moreBtn.remove();

              const longDiv = document.createElement("div");
              longDiv.className = "kbLong";
              longDiv.innerHTML = `<br>${kb.long}`;
              bot.appendChild(longDiv);
              bodyEl.scrollTop = bodyEl.scrollHeight;
            });

            bot.appendChild(document.createElement("br"));
            bot.appendChild(moreBtn);
          }

          bodyEl.appendChild(bot);
        }

        // 🔘 BOUTON GLOBAL RÉSERVATION
        const bookBtn = document.createElement("a");
        bookBtn.href = BOOKING_URL;
        bookBtn.target = "_blank";
        bookBtn.className = "kbBookBtn";
        bookBtn.textContent = UI[lang].book;

        bodyEl.appendChild(bookBtn);
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
