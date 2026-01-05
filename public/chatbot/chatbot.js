/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.7.2 — FLOWS TINTO + REIKI
 * KB driven / UI stable
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.7.2 — Tintorera + Reiki");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(async function () {

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
    const typing  = document.getElementById("typing");

    /* ================= OPEN / CLOSE ================= */
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

    /* ================= WHATSAPP ================= */
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) waLaurent.onclick = () =>
      window.open("https://wa.me/34621210642", "_blank");

    if (waSophia) waSophia.onclick = () =>
      window.open("https://wa.me/34621128303", "_blank");

    /* ================= LANG ================= */
    function detectLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    /* ================= KB PARSER ================= */
    function parseKB(text) {
      const short = text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const long  = text.match(/LONG:\s*([\s\S]*)/i);

      return {
        short: short ? short[1].trim() : "",
        long:  long  ? long[1].trim()  : ""
      };
    }

    async function loadKB(path) {
      const res = await fetch(path);
      if (!res.ok) throw new Error("KB introuvable");
      return parseKB(await res.text());
    }

    /* ================= NLP ================= */
    function normalize(t) {
      return t.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function isBateau(t) {
      return /bateau|tintorera|boat/.test(t);
    }

    function isReiki(t) {
      return /reiki|riki|soin|energie|energetique/.test(t);
    }

    /* ================= RENDER GENERIC ================= */
    function renderKBBlock({ short, long, bookLabel, bookUrl }) {
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      const shortDiv = document.createElement("div");
      shortDiv.className = "kbShort";
      shortDiv.textContent = short;
      bot.appendChild(shortDiv);

      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = long.replace(/\n/g, "<br>");
      bot.appendChild(longDiv);

      const actions = document.createElement("div");
      actions.className = "kbActions";

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = "Voir la description complète";

      moreBtn.onclick = e => {
        e.stopPropagation();
        longDiv.style.display = "block";
        moreBtn.remove();
      };

      const bookBtn = document.createElement("a");
      bookBtn.href = bookUrl;
      bookBtn.target = "_blank";
      bookBtn.className = "kbBookBtn";
      bookBtn.textContent = bookLabel;

      actions.appendChild(moreBtn);
      actions.appendChild(bookBtn);
      bot.appendChild(actions);

      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /* ================= SEND ================= */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`
      );

      typing.style.display = "flex";

      const t = normalize(raw);
      const lang = detectLang();

      try {
        if (isBateau(t)) {
          const kb = await loadKB(
            `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`
          );

          renderKBBlock({
            short: kb.short,
            long: kb.long,
            bookLabel: "⛵ Réserver la sortie Tintorera",
            bookUrl: "https://koalendar.com/e/tintorera"
          });
        }

        else if (isReiki(t)) {
          const kb = await loadKB(
            `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`
          );

          renderKBBlock({
            short: kb.short,
            long: kb.long,
            bookLabel: "🧘‍♀️ Réserver une séance Reiki",
            bookUrl: "https://koalendar.com/e/soloatico-reiki"
          });
        }

        else {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">Pouvez-vous préciser votre demande ? 😊</div>`
          );
        }

      } catch (e) {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">Désolé, les informations demandées sont momentanément indisponibles.</div>`
        );
      }

      typing.style.display = "none";
    }

    sendBtn.onclick = e => {
      e.preventDefault();
      sendMessage();
    };

    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    };

    console.log("✅ Solo’IA’tico v1.6.7.2 — Reiki OK");
  });

})();
