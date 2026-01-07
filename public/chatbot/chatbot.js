/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.4 — FLOW 01_PRESENTATION
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.7.4 — PRESENTATION");

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
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ================= LANG ================= */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|informatie|wat is/.test(t)) return "nl";
      if (/tell me|about|presentation|what is/.test(t)) return "en";
      if (/presentacion|que es|informacion/.test(t)) return "es";
      if (/presentacio|que es|informacio/.test(t)) return "ca";
      return pageLang();
    }

    /* ================= NLP ================= */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {

      /* PRESENTATION */
      if (/presentation|présentation|presentacion|presentacio|about|wat is|what is solo/.test(t)) {
        return "presentation";
      }

      /* INFOS PRATIQUES */
      if (/infos pratiques|information|practical|useful|informatie|informacions/.test(t))
        return "infos_pratiques";

      if (/check in|arrivee|arrival/.test(t)) return "checkin";
      if (/check out|depart|departure/.test(t)) return "checkout";
      if (/parking|garer|aparcamiento|aparcament/.test(t)) return "parking";
      if (/wifi|internet/.test(t)) return "wifi";
      if (/chien|animal|dog|pet/.test(t)) return "animaux";

      /* AUTRES FLOWS EXISTANTS */
      if (/suite|suites|chambre|chambres|room|rooms|kamer|kamers|habitacion/.test(t))
        return "suite_list";

      if (/petit dejeuner|breakfast|ontbijt|esmorzar|desayuno/.test(t))
        return "breakfast";

      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";

      return null;
    }

    /* ================= KB ================= */
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

    /* ================= UI ================= */
    const UI = {
      fr: { more: "Voir la description complète" },
      en: { more: "View full description" },
      es: { more: "Ver la descripción completa" },
      ca: { more: "Veure la descripció completa" },
      nl: { more: "Volledige beschrijving bekijken" }
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
      const i = intent(t);

      try {

        /* ===== PRESENTATION ===== */
        if (i === "presentation") {
          const kb = await loadKB(lang, "01_presentation/presentation.txt");

          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          if (kb.long) {
            const more = document.createElement("button");
            more.className = "kbMoreBtn";
            more.textContent = UI[lang].more;
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

        /* ===== FALLBACK ===== */
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
