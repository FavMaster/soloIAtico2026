/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.6 — STABLE CONCIERGE
 * Bateau + Reiki + Suites
 * Short / Long / Booking
 * Multilingue FR / EN / ES / NL / CAT
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v166";

  console.log("Solo’IA’tico Chatbot v1.6.6 — Stable Concierge");

  /* ================= MEMORY ================= */
  const memory = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  })();

  function saveMemory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  memory.lang  = memory.lang || null;
  memory.state = memory.state || "INFO";
  memory.slots = memory.slots || {};
  saveMemory();

  /* ================= STATES ================= */
  const STATES = {
    INFO: "INFO",
    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE",
    REIKI_DATE: "REIKI_DATE",
    REIKI_PEOPLE: "REIKI_PEOPLE",
    SUITES_DATES: "SUITES_DATES",
    SUITES_PEOPLE: "SUITES_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
    console.log("STATE →", s);
  }

  /* ================= I18N ================= */
  const I18N = {
    fr: {
      bateau: {
        short: "La Tintorera vous propose des sorties en mer inoubliables ⛵",
        long: "Tintorera est une balade en bateau privée à bord d’un llaut catalan traditionnel. Idéale pour baignades, couchers de soleil, découvertes marines et moments inoubliables sur la Costa Brava.",
        askDate: "Pour quelle date souhaitez-vous la sortie en mer ?",
        askPeople: "Combien de personnes participeront à la sortie ?",
        book: "⛵ Réserver la sortie Tintorera"
      },
      reiki: {
        short: "Des séances de Reiki sont disponibles 🌿",
        long: "Le Reiki est un soin énergétique japonais favorisant une détente profonde, l’apaisement mental et le relâchement des tensions.",
        askDate: "Pour quelle date souhaitez-vous la séance de Reiki ?",
        askPeople: "Pour combien de personnes sera la séance ?",
        book: "🧘‍♀️ Réserver une séance de Reiki"
      },
      suites: {
        short: "Nous proposons trois hébergements élégants ✨",
        long: "Solo Ático propose des suites et chambres haut de gamme, pensées pour un séjour confortable et apaisant à L’Escala.",
        askDates: "Quelles dates souhaitez-vous pour votre séjour ?",
        askPeople: "Pour combien de personnes sera le séjour ?",
        book: "🏨 Vérifier les disponibilités"
      },
      more: "Voir la description complète",
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    }
    // 👉 pour stabilité immédiate : FR only (on réactivera les autres langues ensuite proprement)
  };

  /* ================= HELPERS ================= */
  function getLang() {
    return memory.lang || document.documentElement.lang?.split("-")[0] || "fr";
  }

  function normalize(t) {
    return t.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s?]/g, "");
  }

  function isBateau(t) { return /bateau|tintorera/.test(t); }
  function isReiki(t) { return /reiki|riki/.test(t); }
  function isSuites(t){ return /suite|suites|chambre|dormir|sejour/.test(t); }
  function isBook(t)  { return /reserver|reservation|book|peut on/.test(t); }

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

      const lang = getLang();
      const t = normalize(raw);
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      /* ===== BATEAU ===== */
      if (isBateau(t) && memory.state === STATES.INFO) {
        bot.innerHTML = `<b>${I18N[lang].bateau.short}</b><br><br>${I18N[lang].bateau.long}`;

        if (isBook(t)) {
          setState(STATES.BATEAU_DATE);
          bot.innerHTML += `<br><br>${I18N[lang].bateau.askDate}`;
        } else {
          const btn = document.createElement("button");
          btn.className = "kbMoreBtn";
          btn.textContent = I18N[lang].more;
          btn.onclick = () => {};
          bot.appendChild(document.createElement("br"));
          bot.appendChild(btn);
        }
      }

      else if (memory.state === STATES.BATEAU_DATE) {
        memory.slots.date = raw;
        setState(STATES.BATEAU_PEOPLE);
        bot.textContent = I18N[lang].bateau.askPeople;
      }

      else if (memory.state === STATES.BATEAU_PEOPLE) {
        memory.slots.people = raw;
        bot.innerHTML = `<b>${I18N[lang].bateau.short}</b><br><br>
        • Date : ${memory.slots.date}<br>
        • Personnes : ${memory.slots.people}<br><br>`;

        const a = document.createElement("a");
        a.href = "https://koalendar.com/e/tintorera";
        a.target = "_blank";
        a.className = "kbBookBtn";
        a.textContent = I18N[lang].bateau.book;
        bot.appendChild(a);

        memory.slots = {};
        setState(STATES.INFO);
      }

      /* ===== REIKI ===== */
      else if (isReiki(t) && memory.state === STATES.INFO) {
        bot.innerHTML = `<b>${I18N[lang].reiki.short}</b><br><br>${I18N[lang].reiki.long}`;
      }

      /* ===== SUITES ===== */
      else if (isSuites(t) && memory.state === STATES.INFO) {
        bot.innerHTML = `<b>${I18N[lang].suites.short}</b><br><br>${I18N[lang].suites.long}`;
      }

      else {
        bot.textContent = I18N[lang].clarify;
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      saveMemory();
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } };

    console.log("✅ v1.6.6 Concierge ready");
  });

})();
