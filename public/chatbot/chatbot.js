/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.7.8 — BOUTONS DE RÉSERVATION
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const LANG_KEY = "soloia_lang";

  console.log("Solo’IA’tico Chatbot v1.6.7.8 — Booking buttons ON");

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

    if (waLaurent) waLaurent.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    };

    if (waSophia) waSophia.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    };

    /* ================= LANG ================= */
    function getLang() {
      return localStorage.getItem(LANG_KEY)
        || document.documentElement.lang?.slice(0,2)
        || "fr";
    }
    function setLang(lang) {
      localStorage.setItem(LANG_KEY, lang);
    }

    /* ================= LANG SELECTOR ================= */
    const langBar = document.createElement("div");
    langBar.className = "soloia-langbar";
    langBar.innerHTML = `
      <button data-lang="fr">FR</button>
      <button data-lang="es">ES</button>
      <button data-lang="en">EN</button>
      <button data-lang="ca">CAT</button>
      <button data-lang="nl">NL</button>
    `;
    langBar.querySelectorAll("button").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        setLang(btn.dataset.lang);
      };
    });
    chatWin.querySelector(".chatHeader")?.appendChild(langBar);

    /* ================= UI TEXT ================= */
    const UI = {
      fr: {
        more: "Voir la description complète",
        clarify: "Pouvez-vous préciser votre demande ? 😊",
        bookBoat: "⛵ Réserver la sortie Tintorera",
        bookReiki: "🧘‍♀️ Réserver une séance Reiki",
        bookSuite: "🏨 Réserver cette suite",
        listSuites: "Nous proposons trois hébergements :<br>• Suite Neus<br>• Suite Bourlardes<br>• Chambre Blue Patio"
      },
      es: {
        more: "Ver la descripción completa",
        clarify: "¿Podría precisar su solicitud? 😊",
        bookBoat: "⛵ Reservar salida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sesión de Reiki",
        bookSuite: "🏨 Reservar esta suite",
        listSuites: "Ofrecemos tres alojamientos:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitación Blue Patio"
      },
      en: {
        more: "View full description",
        clarify: "Could you please clarify your request? 😊",
        bookBoat: "⛵ Book the Tintorera boat trip",
        bookReiki: "🧘‍♀️ Book a Reiki session",
        bookSuite: "🏨 Book this suite",
        listSuites: "We offer three accommodations:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio Room"
      },
      ca: {
        more: "Veure la descripció completa",
        clarify: "Podeu precisar la vostra sol·licitud? 😊",
        bookBoat: "⛵ Reservar sortida Tintorera",
        bookReiki: "🧘‍♀️ Reservar sessió de Reiki",
        bookSuite: "🏨 Reservar aquesta suite",
        listSuites: "Oferim tres allotjaments:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitació Blue Patio"
      },
      nl: {
        more: "Volledige beschrijving bekijken",
        clarify: "Kunt u uw vraag verduidelijken? 😊",
        bookBoat: "⛵ Tintorera boottocht boeken",
        bookReiki: "🧘‍♀️ Reiki-sessie boeken",
        bookSuite: "🏨 Deze suite reserveren",
        listSuites: "Wij bieden drie accommodaties:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio kamer"
      }
    };

    /* ================= KB ================= */
    function parseKB(text) {
      const short = text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const long  = text.match(/LONG:\s*([\s\S]*)/i);
      return { short: short?.[1]?.trim() || "", long: long?.[1]?.trim() || "" };
    }

    async function loadKB(lang, path) {
      let res = await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if (!res.ok && lang !== "fr") {
        res = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!res.ok) throw new Error("KB introuvable");
      return parseKB(await res.text());
    }

    /* ================= NLP ================= */
    function norm(t) {
      return t.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function route(t) {
      if (/bateau|tintorera|boat/.test(t)) return "tintorera";
      if (/reiki|riki|energie|energetique/.test(t)) return "reiki";
      if (/piscine|piscina|pool|zwembad|rooftop/.test(t)) return "piscine";
      if (/petit|dejeuner|breakfast|ontbijt|esmorzar/.test(t)) return "petitdej";
      if (/que faire|escala|doen|what to do/.test(t)) return "escala";
      if (/neus/.test(t)) return "suite-neus";
      if (/bourlard/.test(t)) return "suite-bourlardes";
      if (/blue|patio/.test(t)) return "room-blue-patio";
      if (/suite|chambre|room/.test(t)) return "suite-list";
      return null;
    }

    /* ================= RENDER ================= */
    function renderKB(lang, kb, bookBtn=null) {
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      bot.innerHTML = `<div class="kbShort">${kb.short}</div>`;

      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = kb.long.replace(/\n/g,"<br>");
      bot.appendChild(longDiv);

      if (kb.long) {
        const moreBtn = document.createElement("button");
        moreBtn.className = "kbMoreBtn";
        moreBtn.textContent = UI[lang].more;
        moreBtn.onclick = e => {
          e.stopPropagation();
          longDiv.style.display = "block";
          moreBtn.remove();
        };
        bot.appendChild(moreBtn);
      }

      if (bookBtn) bot.appendChild(bookBtn);

      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function bookingButton(label, url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.className = "kbBookBtn";
      a.textContent = label;
      a.onclick = e => e.stopPropagation();
      return a;
    }

    /* ================= SEND ================= */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";
      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);
      typing.style.display = "flex";

      const t = norm(raw);
      const lang = getLang();
      const r = route(t);

      try {
        if (r === "tintorera") {
          renderKB(lang,
            await loadKB(lang,"03_services/tintorera-bateau.txt"),
            bookingButton(UI[lang].bookBoat,"https://koalendar.com/e/tintorera")
          );
        }
        else if (r === "reiki") {
          renderKB(lang,
            await loadKB(lang,"03_services/reiki.txt"),
            bookingButton(UI[lang].bookReiki,"https://koalendar.com/e/soloatico-reiki")
          );
        }
        else if (r === "piscine") {
          renderKB(lang, await loadKB(lang,"03_services/piscine-rooftop.txt"));
        }
        else if (r === "petitdej") {
          renderKB(lang, await loadKB(lang,"03_services/petit-dejeuner.txt"));
        }
        else if (r === "escala") {
          renderKB(lang, await loadKB(lang,"04_que-faire/que-faire-escala.txt"));
        }
        else if (r === "suite-list") {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">${UI[lang].listSuites}</div>`);
        }
        else if (r?.startsWith("suite")) {
          renderKB(lang,
            await loadKB(lang,`02_suites/${r}.txt`),
            bookingButton(UI[lang].bookSuite,`https://soloatico.amenitiz.io/${lang}/booking/room`)
          );
        }
        else {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">${UI[lang].clarify}</div>`);
        }
      } catch {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${UI[lang].clarify}</div>`);
      }

      typing.style.display = "none";
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => { if (e.key==="Enter") { e.preventDefault(); sendMessage(); } };

    console.log("✅ Solo’IA’tico v1.6.7.8 — READY FOR SLEEP");
  });

})();
