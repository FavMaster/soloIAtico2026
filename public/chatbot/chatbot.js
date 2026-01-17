/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.22 — PRESENTATION INTELLIGENCE ENHANCED
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  const BOOKING_URLS = {
    fr: "https://soloatico.amenitiz.io/fr/booking/room#DatesGuests-BE",
    es: "https://soloatico.amenitiz.io/es/booking/room#DatesGuests-BE",
    nl: "https://soloatico.amenitiz.io/nl/booking/room#DatesGuests-BE",
    ca: "https://soloatico.amenitiz.io/ca/booking/room#DatesGuests-BE",
    en: "https://soloatico.amenitiz.io/en/booking/room#DatesGuests-BE"
  };

  const SERVICE_BOOKING = {
    boat: "https://koalendar.com/e/tintorera",
    reiki: "https://koalendar.com/e/soloatico-reiki"
  };

  const BOOKING_INTRO = {
    fr: "✅ **Oui, bien sûr 🙂 Vous pouvez réserver dès maintenant.**",
    en: "✅ **Yes, of course 🙂 You can book right now.**",
    es: "✅ **Sí, por supuesto 🙂 Puedes reservar ahora mismo.**",
    ca: "✅ **Sí, és clar 🙂 Pots reservar ara mateix.**",
    nl: "✅ **Ja, natuurlijk 🙂 Je kunt nu reserveren.**"
  };

  const ACTIVITIES_INTRO = {
    fr: "✨ **L’Escala regorge d’expériences à découvrir :**",
    en: "✨ **L’Escala offers many experiences to enjoy:**",
    es: "✨ **L’Escala ofrece muchas experiencias para descubrir:**",
    ca: "✨ **L’Escala ofereix moltes experiències per descobrir:**",
    nl: "✨ **L’Escala biedt tal van ervaringen om te ontdekken:**"
  };

  console.log("Solo’IA’tico Chatbot v1.7.22 — Presentation intelligence");

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

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) return;

    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
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

    /* ===== NORMALISATION ===== */
    function normalize(text) {
      return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    function wantsToBook(text) {
      const t = normalize(text);
      return /(reserv|book|boeke|pued|puis[-\s]?je|kan ik|can i)/.test(t);
    }

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);
      if (/\b(hello|hi|what|where|things to do|activities|nearby)\b/.test(t)) return "en";
      if (/\b(que hacer|actividades|cerca)\b/.test(t)) return "es";
      if (/\b(que fer|activitats|voltants)\b/.test(t)) return "ca";
      if (/\b(wat te doen|activiteiten|in de buurt)\b/.test(t)) return "nl";
      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENTS ===== */
    const GREETINGS = [
      "bonjour","bonsoir","salut","coucou","bjr",
      "hello","hi","hey","good morning","good evening",
      "hola","buenos dias","buenas",
      "bon dia","bones",
      "hallo","goeiedag","goedemorgen"
    ];

    const SUITES_BY_NAME = {
      neus: "02_suites/suite-neus.txt",
      bourlardes: "02_suites/suite-bourlardes.txt",
      blue: "02_suites/room-blue-patio.txt",
      patio: "02_suites/room-blue-patio.txt"
    };

    const FUZZY = {
      presentation: [
        "presentation","hotel","etablissement","concept",
        "about","place","our hotel",
        "presentacion","establecimiento",
        "presentacio","establiment",
        "accommodatie","hotel concept",
        "soloatico","solo atico","solo atico guest suite",
        "votre hotel","votre etablissement",
        "laurent","sophie","plage"
      ],
      rooms: ["suite","suites","chambre","room","kamers"],
      boat: ["tintorera","bateau","batea","bato","boat","boot","vaixell"],
      reiki: ["reiki","reiky","riki"],
      pool: ["piscine","piscina","pool","swimming","zwembad"],
      activities: [
        "que faire","quoi faire","activites","activites a",
        "things to do","activities","what to do","nearby",
        "que hacer","actividades","cerca",
        "que fer","activitats","voltants",
        "wat te doen","activiteiten","in de buurt"
      ]
    };

    function intent(text) {
      const t = normalize(text);

      if (GREETINGS.some(g => t.includes(g))) return "greeting";

      for (const name in SUITES_BY_NAME) {
        if (t.includes(name)) return "suite_named";
      }

      for (const key in FUZZY) {
        if (FUZZY[key].some(k => t.includes(k))) return key;
      }

      return "unknown";
    }

    /* ===== FALLBACK ===== */
    const FALLBACK = {
      fr: "✨ **Excellente question !**<br>Contactez **Sophia** ou **Laurent** via WhatsApp afin d’avoir votre réponse 🙂",
      en: "✨ **Great question!**<br>Please contact **Sophia** or **Laurent** on WhatsApp 🙂",
      es: "✨ **¡Excelente pregunta!**<br>Contacta con **Sophia** o **Laurent** por WhatsApp 🙂",
      ca: "✨ **Excel·lent pregunta!**<br>Contacta amb **Sophia** o **Laurent** via WhatsApp 🙂",
      nl: "✨ **Goede vraag!**<br>Neem contact op met **Sophia** of **Laurent** via WhatsApp 🙂"
    };

    /* ===== ROOM ATTRIBUTES ===== */
    const ROOM_META = {
      "02_suites/suite-neus.txt":       { vue_mer:true,  lumineuse:true,  intimiste:false, vue_patio:false },
      "02_suites/suite-bourlardes.txt": { vue_mer:true,  lumineuse:false, intimiste:true,  vue_patio:false },
      "02_suites/room-blue-patio.txt":  { vue_mer:false, lumineuse:false, intimiste:false, vue_patio:true  }
    };

    function extractRoomCriteria(text) {
      const t = normalize(text);
      return {
        vue_mer: /(vue mer|sea view|vista mar)/.test(t),
        vue_patio: /(patio)/.test(t),
        intimiste: /(intimiste|cosy|cocon)/.test(t),
        lumineuse: /(lumineuse|bright|luminoso)/.test(t)
      };
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      const dir = kbLang(lang);
      let r = await fetch(`${KB_BASE_URL}/kb/${dir}/${path}`);
      if (!r.ok && dir !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!r.ok) throw "KB introuvable";
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || ["",""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || ["",""])[1].trim()
      };
    }

    function renderLongPro(bot, text, isActivities=false) {
      const wrapper = document.createElement("div");
      wrapper.className = "kbLongWrapper";

      text.split("\n").forEach(line => {
        const l = line.trim();
        if (!l) return;

        const p = document.createElement("div");
        p.className = "kbLongParagraph";
        p.textContent = l;

        if (isActivities) {
          if (/plage|beach|platja|strand/i.test(l)) p.prepend("🏖️ ");
          else if (/mus[eé]e|museum/i.test(l)) p.prepend("🏛️ ");
          else if (/randonn|hike|walk|cami/i.test(l)) p.prepend("🥾 ");
          else if (/restaurant|gastronom/i.test(l)) p.prepend("🍽️ ");
        }

        wrapper.appendChild(p);
      });

      bot.appendChild(wrapper);
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(raw);
      const i = intent(raw);

      if (i === "greeting") {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">👋</div>`);
        return;
      }

      let files = [];

      if (i === "presentation") {
        files = ["01_presentation/presentation-generale.txt"];
      }

      if (i === "suite_named") {
        const t = normalize(raw);
        for (const key in SUITES_BY_NAME) {
          if (t.includes(key)) files = [SUITES_BY_NAME[key]];
        }
      }

      if (i === "rooms") {
        files = Object.keys(ROOM_META);
        const criteria = extractRoomCriteria(raw);
        const hasCriteria = Object.values(criteria).some(v => v);
        if (hasCriteria) {
          files = files.filter(f =>
            Object.keys(criteria).every(k => !criteria[k] || ROOM_META[f][k])
          );
        }
      }

      if (i === "boat")  files = ["03_services/tintorera-bateau.txt"];
      if (i === "reiki") files = ["03_services/reiki.txt"];
      if (i === "pool")  files = ["03_services/piscine-rooftop.txt"];
      if (i === "activities") files = ["04_que-faire/que-faire-escala.txt"];

      if (files.length === 0) {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${FALLBACK[lang]}</div>`);
        return;
      }

      for (const f of files) {
        const kb = parseKB(await loadKB(lang, f));
        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        if (wantsToBook(raw) && BOOKING_INTRO[lang]) {
          bot.insertAdjacentHTML("beforeend",
            `<div class="kbLongParagraph">${BOOKING_INTRO[lang]}</div>`
          );
        }

        if (i === "activities" && ACTIVITIES_INTRO[lang]) {
          bot.insertAdjacentHTML("beforeend",
            `<div class="kbLongParagraph">${ACTIVITIES_INTRO[lang]}</div>`
          );
        }

        bot.insertAdjacentHTML("beforeend", `<div>${kb.short}</div>`);

        if (kb.long) {
          const moreBtn = document.createElement("button");
          moreBtn.className = "kbMoreBtn";
          moreBtn.textContent = "➕";
          moreBtn.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            moreBtn.remove();
            renderLongPro(bot, kb.long, i === "activities");
          };
          bot.appendChild(moreBtn);
        }

        if (i === "presentation" || i === "rooms" || i === "boat" || i === "reiki") {
          const bookBtn = document.createElement("a");
          bookBtn.href =
            (i === "boat") ? SERVICE_BOOKING.boat :
            (i === "reiki") ? SERVICE_BOOKING.reiki :
            (BOOKING_URLS[lang] || BOOKING_URLS.fr);
          bookBtn.target = "_blank";
          bookBtn.className = "kbBookBtn";
          bookBtn.textContent = "🛎️";
          bot.appendChild(bookBtn);
        }

        bodyEl.appendChild(bot);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
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
