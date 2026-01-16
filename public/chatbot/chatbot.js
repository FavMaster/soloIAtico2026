/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.7 — SUITES PRIORITAIRES + NLP SOUPLE
 * BASE STRICTE 1.6.9.6 (AUCUNE RÉGRESSION)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.7 — SUITES FIRST");

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

    /* ===== LANG ===== */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|zwembad|boot/.test(t)) return "nl";
      if (/what|how|room|suite|price/.test(t)) return "en";
      if (/piscina|barco|habitacion|precio/.test(t)) return "es";
      if (/piscina|vaixell|habitacio/.test(t)) return "ca";
      return pageLang();
    }

    /* ===== NLP ===== */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {

      /* 🥇 SUITES — PRIORITÉ ABSOLUE */
      if (/suite|chambre|room|habitacion|habitacio|hotel|logement|dorm|nuit|sejour|price|prix|reser/.test(t))
        return "suites";

      /* SERVICES EXISTANTS */
      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";

      /* FALLBACK HÔTELIER */
      if (t.length < 4 || /bonjour|hello|hola|info/.test(t))
        return "suites";

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

    /* ===== REFORMULATION CONCIERGE ===== */
    function concierge(text, lang) {
      const intro = {
        fr: "✨ Avec plaisir, voici ce que je peux vous proposer :",
        en: "✨ With pleasure, here is what I can offer you:",
        es: "✨ Con mucho gusto, esto es lo que le propongo:",
        ca: "✨ Amb molt de gust, això és el que li proposo:",
        nl: "✨ Met plezier stel ik het volgende voor:"
      };
      return `<div><i>${intro[lang] || intro.fr}</i><br><br><b>${text}</b></div>`;
    }

    /* ===== UI TEXT ===== */
    const UI = {
      fr: { more: "Voir la description complète", bookSuite: "🏨 Réserver la suite" },
      en: { more: "View full description", bookSuite: "🏨 Book the suite" },
      es: { more: "Ver la descripción completa", bookSuite: "🏨 Reservar la suite" },
      ca: { more: "Veure la descripció completa", bookSuite: "🏨 Reservar la suite" },
      nl: { more: "Volledige beschrijving bekijken", bookSuite: "🏨 Suite reserveren" }
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

        /* 🥇 SUITES */
        if (i === "suites") {
          const kb = parseKB(await loadKB(lang, "02_suites/suites.txt"));

          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = concierge(kb.short, lang);

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
            };
            bot.appendChild(document.createElement("br"));
            bot.appendChild(moreBtn);
          }

          bodyEl.appendChild(bot);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        /* SERVICES EXISTANTS (inchangés) */
        const file =
          i === "tintorera" ? "03_services/tintorera-bateau.txt" :
          i === "reiki"     ? "03_services/reiki.txt" :
          "03_services/piscine-rooftop.txt";

        const kb = parseKB(await loadKB(lang, file));

        const bot = document.createElement("div");
        bot.className = "msg botMsg";
        bot.innerHTML = concierge(kb.short, lang);

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
          };
          bot.appendChild(document.createElement("br"));
          bot.appendChild(moreBtn);
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
