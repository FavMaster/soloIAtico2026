/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.3 — STABLE RÉFÉRENCE
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  console.log("Solo’IA’tico Chatbot v1.7.3 — STABLE");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ========== CSS ========== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ========== HTML ========== */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ========== DOM ========== */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ DOM chatbot incomplet");
      return;
    }

    /* ========== OPEN / CLOSE ========== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    };

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ========== WHATSAPP ========== */
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ========== LANG ========== */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|ontbijt|zwembad|informatie/.test(t)) return "nl";
      if (/what|how|breakfast|pool|boat|information/.test(t)) return "en";
      if (/desayuno|piscina|barco|informacion/.test(t)) return "es";
      if (/esmorzar|piscina|vaixell|informacio/.test(t)) return "ca";
      return pageLang();
    }

    /* ========== NLP ========== */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {
      if (/suite|suites|chambre|chambres|room|rooms|kamer|kamers/.test(t)) return "suites";
      if (/tintorera|bateau|boat/.test(t)) return "bateau";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/petit dejeuner|breakfast|ontbijt|esmorzar|desayuno/.test(t)) return "breakfast";
      if (/infos pratiques|check|parking|wifi|animal|dog|pet/.test(t)) return "infos";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    /* ========== KB ========== */
    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1].trim()
      };
    }

    async function loadKB(lang, path) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!r.ok) throw "KB introuvable";
      return parseKB(await r.text());
    }

    /* ========== UI ========== */
    const UI = {
      fr: {
        more: "Voir la description complète",
        bookBoat: "⛵ Réserver la sortie Tintorera",
        bookReiki: "🧘‍♀️ Réserver une séance Reiki",
        bookSuite: "🏨 Réserver cette suite",
        infos: "Voir toutes les infos pratiques"
      },
      en: {
        more: "View full description",
        bookBoat: "⛵ Book the Tintorera boat trip",
        bookReiki: "🧘‍♀️ Book a Reiki session",
        bookSuite: "🏨 Book this suite",
        infos: "View all practical information"
      },
      es: {
        more: "Ver la descripción completa",
        bookBoat: "⛵ Reservar salida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sesión Reiki",
        bookSuite: "🏨 Reservar esta suite",
        infos: "Ver toda la información práctica"
      },
      ca: {
        more: "Veure la descripció completa",
        bookBoat: "⛵ Reservar sortida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sessió Reiki",
        bookSuite: "🏨 Reservar aquesta suite",
        infos: "Veure tota la informació pràctica"
      },
      nl: {
        more: "Volledige beschrijving bekijken",
        bookBoat: "⛵ Tintorera boottocht boeken",
        bookReiki: "🧘‍♀️ Reiki-sessie boeken",
        bookSuite: "🏨 Deze suite reserveren",
        infos: "Alle praktische informatie bekijken"
      }
    };

    /* ========== SEND MESSAGE ========== */
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

        /* ===== SUITES ===== */
        if (i === "suites") {
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = "🏨 <b>Nos hébergements :</b><br>• Suite Neus<br>• Suite Bourlardes<br>• Chambre Blue Patio";
          bodyEl.appendChild(bot);
          return;
        }

        /* ===== BATEAU ===== */
        if (i === "bateau") {
          const kb = await loadKB(lang, "03_services/tintorera-bateau.txt");
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          const more = document.createElement("button");
          more.className = "kbMoreBtn";
          more.textContent = UI[lang].more;
          more.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            more.remove();
            bot.innerHTML += `<br><br>${kb.long}`;
          };

          const book = document.createElement("a");
          book.href = "https://koalendar.com/e/tintorera";
          book.target = "_blank";
          book.className = "kbBookBtn";
          book.textContent = UI[lang].bookBoat;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(more);
          bot.appendChild(document.createElement("br"));
          bot.appendChild(book);

          bodyEl.appendChild(bot);
          return;
        }

        /* ===== REIKI ===== */
        if (i === "reiki") {
          const kb = await loadKB(lang, "03_services/reiki.txt");
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          const more = document.createElement("button");
          more.className = "kbMoreBtn";
          more.textContent = UI[lang].more;
          more.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            more.remove();
            bot.innerHTML += `<br><br>${kb.long}`;
          };

          const book = document.createElement("a");
          book.href = "https://koalendar.com/e/soloatico-reiki";
          book.target = "_blank";
          book.className = "kbBookBtn";
          book.textContent = UI[lang].bookReiki;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(more);
          bot.appendChild(document.createElement("br"));
          bot.appendChild(book);

          bodyEl.appendChild(bot);
          return;
        }

        /* ===== PETIT-DEJEUNER ===== */
        if (i === "breakfast") {
          const kb = await loadKB(lang, "03_services/petit-dejeuner.txt");
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          const more = document.createElement("button");
          more.className = "kbMoreBtn";
          more.textContent = UI[lang].more;
          more.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            more.remove();
            bot.innerHTML += `<br><br>${kb.long}`;
          };

          bot.appendChild(document.createElement("br"));
          bot.appendChild(more);

          bodyEl.appendChild(bot);
          return;
        }

        /* ===== INFOS PRATIQUES ===== */
        if (i === "infos") {
          const kb = await loadKB(lang, "06_infos-pratiques/infos-pratiques.txt");
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          const more = document.createElement("button");
          more.className = "kbMoreBtn";
          more.textContent = UI[lang].infos;
          more.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            more.remove();
            bot.innerHTML += `<br><br>${kb.long}`;
          };

          bot.appendChild(document.createElement("br"));
          bot.appendChild(more);

          bodyEl.appendChild(bot);
          return;
        }

        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">❌ Une erreur est survenue.</div>`);
      }
    }

    sendBtn.onclick = sendMessage;
    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    };

  });

})();
