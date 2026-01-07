/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.3.1 — BASE v1.7.3 + PRESENTATION SAFE
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.7.3.1 — PRESENTATION SAFE");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ================= CSS ================= */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ================= HTML ================= */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ================= DOM ================= */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ Chatbot DOM incomplet");
      return;
    }

    /* ================= OPEN / CLOSE ================= */
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

    /* ================= WHATSAPP ================= */
    const waLaurent = document.getElementById("waLaurent");
    if (waLaurent) {
      waLaurent.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        window.open("https://wa.me/34621210642", "_blank");
      });
    }

    const waSophia = document.getElementById("waSophia");
    if (waSophia) {
      waSophia.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        window.open("https://wa.me/34621128303", "_blank");
      });
    }

    /* ================= LANG ================= */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/wat is|informatie/.test(t)) return "nl";
      if (/tell me|about|what is/.test(t)) return "en";
      if (/presentacion|que es/.test(t)) return "es";
      if (/presentacio|que es/.test(t)) return "ca";
      return pageLang();
    }

    /* ================= NLP ================= */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /* ================= INTENT (SAFE EXTENSION) ================= */
    function isPresentation(t) {
      return (
        /presentation|présentation|presentacion|presentacio/.test(t) ||
        /parle moi de|parle-moi de|tell me about|about solo|what is solo|wat is solo/.test(t) ||
        /solo atico/.test(t)
      );
    }

    /* ================= KB ================= */
    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1].trim()
      };
    }

    async function loadPresentationKB(lang) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/01_presentation/presentation.txt`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/01_presentation/presentation.txt`);
      }
      if (!r.ok) throw "KB presentation introuvable";
      return parseKB(await r.text());
    }

    /* ================= UI ================= */
    const UI_MORE = {
      fr: "Voir la description complète",
      en: "View full description",
      es: "Ver la descripción completa",
      ca: "Veure la descripció completa",
      nl: "Volledige beschrijving bekijken"
    };

    /* ================= SEND ================= */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const t = norm(raw);
      const lang = detectLang(t);

      try {

        /* ===== FLOW 01_PRESENTATION (SAFE) ===== */
        if (isPresentation(t)) {
          const kb = await loadPresentationKB(lang);

          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          if (kb.long) {
            const more = document.createElement("button");
            more.className = "kbMoreBtn";
            more.textContent = UI_MORE[lang] || UI_MORE.fr;

            more.onclick = e => {
              e.preventDefault();
              e.stopPropagation();
              more.remove();
              bot.innerHTML += `<br><br>${kb.long}`;
              bodyEl.scrollTop = bodyEl.scrollHeight;
            };

            bot.appendChild(document.createElement("br"));
            bot.appendChild(more);
          }

          bodyEl.appendChild(bot);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        /* ===== FALLBACK → LAISSE PASSER LES AUTRES FLOWS (v1.7.3) ===== */
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);

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
