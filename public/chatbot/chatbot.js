/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.6 — STABLE + SHORT/LONG + BOOKING
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.6 — STABLE FULL");

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

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ Chatbot DOM incomplet");
      return;
    }

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

    /* ===== WHATSAPP ===== */
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ===== LANG ===== */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|zwembad|boot/.test(t)) return "nl";
      if (/what|how|pool|boat/.test(t)) return "en";
      if (/piscina|barco/.test(t)) return "es";
      if (/piscina|vaixell/.test(t)) return "ca";
      return pageLang();
    }

    /* ===== NLP ===== */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {
      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    /* ===== KB ===== */
    async function loadKB(lang, file) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/${file}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${file}`);
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

    /* ===== UI TEXT ===== */
    const UI = {
      fr: {
        more: "Voir la description complète",
        bookBoat: "⛵ Réserver la sortie Tintorera",
        bookReiki: "🧘‍♀️ Réserver une séance Reiki",
        bookSuite: "🏨 Réserver"
      },
      en: {
        more: "View full description",
        bookBoat: "⛵ Book the Tintorera boat trip",
        bookReiki: "🧘‍♀️ Book a Reiki session",
        bookSuite: "🏨 Book now"
      },
      es: {
        more: "Ver la descripción completa",
        bookBoat: "⛵ Reservar salida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sesión de Reiki",
        bookSuite: "🏨 Reservar"
      },
      ca: {
        more: "Veure la descripció completa",
        bookBoat: "⛵ Reservar sortida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sessió de Reiki",
        bookSuite: "🏨 Reservar"
      },
      nl: {
        more: "Volledige beschrijving bekijken",
        bookBoat: "⛵ Tintorera boottocht boeken",
        bookReiki: "🧘‍♀️ Reiki-sessie boeken",
        bookSuite: "🏨 Reserveren"
      }
    };

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const t = norm(raw);
      const lang = detectLang(t);
      const i = intent(t);

      try {
        if (!i) {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);
          return;
        }

        const file =
          i === "tintorera" ? "03_services/tintorera-bateau.txt" :
          i === "reiki"     ? "03_services/reiki.txt" :
          "03_services/piscine-rooftop.txt";

        const kb = parseKB(await loadKB(lang, file));

        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        /* SHORT */
        const shortDiv = document.createElement("div");
        shortDiv.innerHTML = `<b>${kb.short}</b>`;
        bot.appendChild(shortDiv);

        /* LONG (hidden) */
        if (kb.long) {
          const moreBtn = document.createElement("button");
          moreBtn.className = "kbMoreBtn";
          moreBtn.textContent = UI[lang].more;

          moreBtn.onclick = () => {
            moreBtn.remove();
            const longDiv = document.createElement("div");
            longDiv.className = "kbLong";
            longDiv.innerHTML = `<br>${kb.long}`;
            bot.appendChild(longDiv);
            bodyEl.scrollTop = bodyEl.scrollHeight;
          };

          bot.appendChild(document.createElement("br"));
          bot.appendChild(moreBtn);
        }

        /* BOOKING */
        let bookingUrl = null;
        if (i === "tintorera") bookingUrl = "https://koalendar.com/e/tintorera";
        if (i === "reiki") bookingUrl = "https://koalendar.com/e/soloatico-reiki";

        if (bookingUrl) {
          const bookBtn = document.createElement("a");
          bookBtn.href = bookingUrl;
          bookBtn.target = "_blank";
          bookBtn.className = "kbBookBtn";
          bookBtn.textContent = i === "tintorera"
            ? UI[lang].bookBoat
            : UI[lang].bookReiki;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(bookBtn);
        }

        bodyEl.appendChild(bot);
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
