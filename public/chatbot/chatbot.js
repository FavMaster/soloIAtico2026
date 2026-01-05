/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.7 — UI STABLE + KB ACTIVE
 * Flow Bateau (KB driven)
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const KB_TINTO = `${KB_BASE_URL}/kb/fr/bateau/tintorera.txt`;

  console.log("Solo’IA’tico Chatbot v1.6.7 — KB active");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(async function () {

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

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    /* ===== OPEN / CLOSE ===== */
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

    /* ===== WHATSAPP ===== */
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) waLaurent.onclick = () =>
      window.open("https://wa.me/34621210642", "_blank");

    if (waSophia) waSophia.onclick = () =>
      window.open("https://wa.me/34621128303", "_blank");

    /* ===== KB PARSER ===== */
    function parseKB(text) {
      const get = (label) => {
        const r = new RegExp(`${label}:([\\s\\S]*?)(\\n[A-Z]+:|$)`, "i");
        const m = text.match(r);
        return m ? m[1].trim() : "";
      };

      return {
        short:  get("SHORT"),
        intro:  get("INTRO"),
        long:   get("LONG"),
        prices: get("PRICES")
      };
    }

    async function loadTintoreraKB() {
      const res = await fetch(KB_TINTO);
      if (!res.ok) throw new Error("KB Tintorera introuvable");
      return parseKB(await res.text());
    }

    /* ===== NLP ===== */
    function normalize(t) {
      return t.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function isBateau(t) {
      return /bateau|tintorera|boat/.test(t);
    }

    /* ===== RENDER ===== */
    async function renderTintorera() {
      const kb = await loadTintoreraKB();

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      const shortDiv = document.createElement("div");
      shortDiv.className = "kbShort";
      shortDiv.textContent = kb.short || "Oui ⛵ Nous proposons des sorties en mer privées.";
      bot.appendChild(shortDiv);

      const introDiv = document.createElement("div");
      introDiv.className = "kbIntro";
      introDiv.innerHTML = `<strong>${kb.intro}</strong>`;
      bot.appendChild(introDiv);

      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = `<p>${kb.long.replace(/\n/g, "<br>")}</p>`;
      bot.appendChild(longDiv);

      if (kb.prices) {
        const priceDiv = document.createElement("div");
        priceDiv.className = "kbPrices";
        priceDiv.style.display = "none";
        priceDiv.innerHTML = `<p>${kb.prices.replace(/\n/g, "<br>")}</p>`;
        bot.appendChild(priceDiv);
      }

      const actions = document.createElement("div");
      actions.className = "kbActions";

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = "Voir la description complète";

      moreBtn.onclick = e => {
        e.stopPropagation();
        longDiv.style.display = "block";
        if (kb.prices) bot.querySelector(".kbPrices").style.display = "block";
        moreBtn.remove();
      };

      const bookBtn = document.createElement("a");
      bookBtn.href = "https://koalendar.com/e/tintorera";
      bookBtn.target = "_blank";
      bookBtn.className = "kbBookBtn";
      bookBtn.textContent = "⛵ Réserver la sortie Tintorera";

      actions.appendChild(moreBtn);
      actions.appendChild(bookBtn);
      bot.appendChild(actions);

      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`
      );

      typing.style.display = "flex";

      const t = normalize(raw);

      if (isBateau(t)) {
        try {
          await renderTintorera();
        } catch (e) {
          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.textContent = "Désolé, les informations du bateau sont momentanément indisponibles.";
          bodyEl.appendChild(bot);
        }
      } else {
        const bot = document.createElement("div");
        bot.className = "msg botMsg";
        bot.textContent = "Pouvez-vous préciser votre demande ? 😊";
        bodyEl.appendChild(bot);
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

    console.log("✅ Solo’IA’tico v1.6.7 — KB connected");
  });

})();
