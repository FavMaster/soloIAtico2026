/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.0.1 — FLOW SUITES (SYNTAX FIX)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.7.0.1 — FLOW SUITES FIX");

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

    /* ===== WHATSAPP (FIX SYNTAX) ===== */
    const waLaurent = document.getElementById("waLaurent");
    if (waLaurent) {
      waLaurent.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        window.open("https://wa.me/34621210642", "_blank");
      });
    }

    const waSophia = document.getElementById("waSophia");
    if (waSophia) {
      waSophia.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        window.open("https://wa.me/34621128303", "_blank");
      });
    }

    /* ===== LANG ===== */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|kamer|kamers/.test(t)) return "nl";
      if (/room|rooms/.test(t)) return "en";
      if (/habitacion|habitaciones/.test(t)) return "es";
      if (/habitacio|habitacions/.test(t)) return "ca";
      return pageLang();
    }

    /* ===== NLP ===== */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    function suiteSlug(t) {
      if (/neus/.test(t)) return "suite-neus.txt";
      if (/bourlard/.test(t)) return "suite-bourlardes.txt";
      if (/blue/.test(t)) return "suite-blue-patio.txt";
      return null;
    }

    function intent(t) {
      if (/suite|suites|chambre|chambres|room|rooms|kamer|kamers|habitacion/.test(t)) {
        return suiteSlug(t) ? "suite_detail" : "suite_list";
      }
      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/02_suites/${path}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/02_suites/${path}`);
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

    /* ===== UI TEXT ===== */
    const UI = {
      fr: {
        list: "Nous proposons trois hébergements au Solo Ático :<br>• Suite Neus<br>• Suite Bourlardes<br>• Chambre Blue Patio",
        more: "Voir la description complète",
        book: "🏨 Réserver cette suite"
      },
      en: {
        list: "We offer three accommodations at Solo Ático:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio Room",
        more: "View full description",
        book: "🏨 Book this suite"
      },
      es: {
        list: "Ofrecemos tres alojamientos en Solo Ático:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitación Blue Patio",
        more: "Ver la descripción completa",
        book: "🏨 Reservar esta suite"
      },
      ca: {
        list: "Oferim tres allotjaments a Solo Ático:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitació Blue Patio",
        more: "Veure la descripció completa",
        book: "🏨 Reservar aquesta suite"
      },
      nl: {
        list: "Wij bieden drie accommodaties bij Solo Ático:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio Kamer",
        more: "Volledige beschrijving bekijken",
        book: "🏨 Deze suite reserveren"
      }
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

        if (i === "suite_list") {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">${UI[lang].list}</div>`);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        if (i === "suite_detail") {
          const file = suiteSlug(t);
          const kb = parseKB(await loadKB(lang, file));

          const bot = document.createElement("div");
          bot.className = "msg botMsg";
          bot.innerHTML = `<b>${kb.short}</b>`;

          if (kb.long) {
            const more = document.createElement("button");
            more.className = "kbMoreBtn";
            more.textContent = UI[lang].more;
            more.onclick = () => {
              more.remove();
              bot.innerHTML += `<br><br>${kb.long}`;
              bodyEl.scrollTop = bodyEl.scrollHeight;
            };
            bot.appendChild(document.createElement("br"));
            bot.appendChild(more);
          }

          const book = document.createElement("a");
          book.href = "https://soloatico.amenitiz.io";
          book.target = "_blank";
          book.className = "kbBookBtn";
          book.textContent = UI[lang].book;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(book);

          bodyEl.appendChild(bot);
          bodyEl.scrollTop = bodyEl.scrollHeight;
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

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

  });

})();
