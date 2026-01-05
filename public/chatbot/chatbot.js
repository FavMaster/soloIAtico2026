/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.6.1 — STABLE CONCIERGE FIX
 * Short / Long / Booking OK
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v1661";

  console.log("Solo’IA’tico Chatbot v1.6.6.1 — Stable Fix");

  /* ================= MEMORY ================= */
  const memory = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  })();

  function saveMemory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  memory.state = memory.state || "INFO";
  memory.slots = memory.slots || {};
  saveMemory();

  /* ================= STATES ================= */
  const STATES = {
    INFO: "INFO",
    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
  }

  /* ================= I18N (FR) ================= */
  const I18N = {
    bateau: {
      short: "La Tintorera vous propose des sorties en mer inoubliables ⛵",
      long: "Tintorera est une balade en bateau privée à bord d’un llaut catalan traditionnel. Idéale pour baignades, couchers de soleil, découvertes marines et moments inoubliables sur la Costa Brava.",
      askDate: "Pour quelle date souhaitez-vous la sortie en mer ?",
      askPeople: "Combien de personnes participeront à la sortie ?",
      book: "⛵ Réserver la sortie Tintorera"
    },
    more: "Voir la description complète",
    clarify: "Pouvez-vous préciser votre demande ? 😊"
  };

  /* ================= HELPERS ================= */
  function normalize(t) {
    return t.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s?]/g, "");
  }

  function isBateau(t) {
    return /bateau|tintorera/.test(t);
  }

  function wantsBooking(t) {
    return /reserver|reservation|booking|peut on reserver|est il possible/.test(t);
  }

  /* ================= INIT ================= */
  document.addEventListener("DOMContentLoaded", async () => {

    /* CSS */
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    /* HTML */
    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    /* OPEN / CLOSE */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");

    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
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

    /* CHAT CORE */
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);
      typing.style.display = "flex";

      const t = normalize(raw);
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      /* ===== BATEAU INFO ===== */
      if (isBateau(t) && memory.state === STATES.INFO) {

        bot.innerHTML = `<b>${I18N.bateau.short}</b>`;

        /* Bouton description complète */
        const moreBtn = document.createElement("button");
        moreBtn.className = "kbMoreBtn";
        moreBtn.textContent = I18N.more;

        moreBtn.onclick = () => {
          moreBtn.remove();
          const longDiv = document.createElement("div");
          longDiv.innerHTML = `<br>${I18N.bateau.long}<br><br>`;
          bot.appendChild(longDiv);

          /* Bouton réserver visible après long */
          const bookBtn = document.createElement("a");
          bookBtn.href = "https://koalendar.com/e/tintorera";
          bookBtn.target = "_blank";
          bookBtn.className = "kbBookBtn";
          bookBtn.textContent = I18N.bateau.book;
          bot.appendChild(bookBtn);

          bodyEl.scrollTop = bodyEl.scrollHeight;
        };

        bot.appendChild(document.createElement("br"));
        bot.appendChild(moreBtn);

        /* Si intention réservation directe */
        if (wantsBooking(t)) {
          setState(STATES.BATEAU_DATE);
          bot.appendChild(document.createElement("br"));
          bot.appendChild(document.createTextNode(I18N.bateau.askDate));
        }
      }

      /* ===== FLOW DATE ===== */
      else if (memory.state === STATES.BATEAU_DATE) {
        memory.slots.date = raw;
        setState(STATES.BATEAU_PEOPLE);
        bot.textContent = I18N.bateau.askPeople;
      }

      /* ===== FLOW PEOPLE ===== */
      else if (memory.state === STATES.BATEAU_PEOPLE) {
        memory.slots.people = raw;

        bot.innerHTML = `
          <b>${I18N.bateau.short}</b><br><br>
          • Date : ${memory.slots.date}<br>
          • Personnes : ${memory.slots.people}<br><br>
        `;

        const a = document.createElement("a");
        a.href = "https://koalendar.com/e/tintorera";
        a.target = "_blank";
        a.className = "kbBookBtn";
        a.textContent = I18N.bateau.book;
        bot.appendChild(a);

        memory.slots = {};
        setState(STATES.INFO);
      }

      else {
        bot.textContent = I18N.clarify;
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      saveMemory();
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    };

    console.log("✅ v1.6.6.1 Concierge FIX ready");
  });

})();
