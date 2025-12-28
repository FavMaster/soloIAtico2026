/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.4 STABLE — Intentions + KB Short / Long
 * Base saine validée
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.4 — Initialisation");

  /****************************************************
   * CONFIG
   ****************************************************/
  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  /****************************************************
   * Chargement CSS
   ****************************************************/
  function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(link);
  }

  /****************************************************
   * Chargement HTML
   ****************************************************/
  async function loadHTML() {
    const res = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`);
    return await res.text();
  }

  /****************************************************
   * Détection langue
   ****************************************************/
  function detectLanguage(message = "") {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.split("-")[0];

    const t = message.toLowerCase();
    if (/\b(el|la|los|qué|hacer)\b/.test(t)) return "es";
    if (/\b(wat|doen|kamer)\b/.test(t)) return "nl";
    if (/\b(què|fer|habitació)\b/.test(t)) return "cat";
    if (/\b(what|room|booking)\b/.test(t)) return "en";

    return "fr";
  }

  /****************************************************
   * Intentions
   ****************************************************/
function detectIntent(message) {
  const text = normalizeText(message);

  const intents = {
    list_suites: [
      "suite", "suites", "chambre", "chambres", "logement", "hebergement",
      "room", "rooms", "accommodation",
      "habitacion", "habitaciones",
      "kamer", "kamers",
      "habitacio", "habitacions"
    ],

    help: [
      "aide", "help", "ayuda", "hulp",
      "que peux", "que faire", "what can", "what do you"
    ],

    booking: [
      "reserver", "reservation", "booking", "book", "disponibilite"
    ]
  };

  for (const intent in intents) {
    if (intents[intent].some(word => text.includes(word))) {
      return intent;
    }
  }

  return "specific";
}


  /****************************************************
   * Topic
   ****************************************************/
 function detectTopic(message) {
  const text = normalizeText(message);

  if (text.includes("neus")) return "suite_neus";
  if (text.includes("bourlard")) return "suite_bourlardes";
  if (text.includes("blue")) return "suite_blue";

  if (text.includes("suite") || text.includes("chambre"))
    return "suite";

  if (text.includes("bateau") || text.includes("tintorera"))
    return "bateau";

  if (text.includes("reiki"))
    return "reiki";

  if (text.includes("piscine"))
    return "piscine";

  if (text.includes("petit"))
    return "petitdej";

  if (text.includes("escala") || text.includes("faire"))
    return "escale";

  return "default";
}

  /****************************************************
   * Router KB
   ****************************************************/
  function resolveKBPath(message, lang) {
    const t = message.toLowerCase();

    if (t.includes("neus")) return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-neus.txt`;
    if (t.includes("bourlard")) return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-bourlardes.txt`;
    if (t.includes("blue")) return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-blue-patio.txt`;

    if (t.includes("bateau") || t.includes("tintorera"))
      return `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;

    if (t.includes("reiki"))
      return `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`;

    if (t.includes("piscine"))
      return `${KB_BASE_URL}/kb/${lang}/03_services/piscine-rooftop.txt`;

    if (t.includes("petit"))
      return `${KB_BASE_URL}/kb/${lang}/03_services/petit-dejeuner.txt`;

    if (t.includes("escala"))
      return `${KB_BASE_URL}/kb/${lang}/04_que-faire/que-faire-escala.txt`;

    return null;
  }

  /****************************************************
   * Short answers
   ****************************************************/
  function getShortAnswer(topic, lang) {
    const fr = {
      suite: "Voici les informations sur la suite que vous avez demandée ✨",
      bateau: "La Tintorera vous promet un moment magique en mer 🌊",
      reiki: "Un moment de détente et d’énergie positive 🌿",
      piscine: "Notre piscine rooftop offre une vue à couper le souffle 🏖️",
      petitdej: "Le petit-déjeuner est inclus et servi avec soin ☕",
      escale: "L’Escala regorge de choses à découvrir 🌞",
      default: "Voici les informations que je peux vous partager 😊"
    };
    return fr[topic] || fr.default;
  }

  /****************************************************
   * Parser KB
   ****************************************************/
  function parseKB(text) {
    const short = text.match(/SHORT:\s*([\s\S]*?)\nLONG:/i);
    const long = text.match(/LONG:\s*([\s\S]*)/i);

    return {
      short: short ? short[1].trim() : "",
      long: long ? long[1].trim() : ""
    };
  }

/****************************************************
 * Mise en forme élégante du texte LONG — Version PRO
 ****************************************************/
function formatLongText(text) {
  if (!text) return "";

  const clean = text
    .replace(/\r/g, "")
    .trim();

  const lines = clean
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let html = `<div class="kbLongWrapper">`;

  let count = 0;

  for (const line of lines) {
    if (count >= 8) break; // limite élégante

    // Titres (finissant par : ou tout en majuscules)
    if (
      line.endsWith(":") ||
      (line === line.toUpperCase() && line.length < 40)
    ) {
      html += `<div class="kbLongTitle">${line}</div>`;
    }

    // Bullet points
    else if (
      line.startsWith("-") ||
      line.startsWith("•")
    ) {
      html += `<div class="kbLongBullet">• ${line.replace(/^[-•]\s*/, "")}</div>`;
      count++;
    }

    // Paragraphes normaux
    else if (line.length > 40) {
      html += `<div class="kbLongParagraph">${line}</div>`;
      count++;
    }
  }

  html += `</div>`;
  return html;
}


  /****************************************************
   * INITIALISATION CHATBOT
   ****************************************************/
  async function initChatbot() {
    loadCSS();
    const html = await loadHTML();
    document.body.insertAdjacentHTML("beforeend", html);

    await new Promise(requestAnimationFrame);

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");
    const bodyEl = document.getElementById("chatBody");
    const typing = document.getElementById("typing");

    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    document.addEventListener("click", (e) => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });



/****************************************************
 * Normalisation pour 7.6
 ****************************************************/

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[^a-z0-9\s]/g, "")     // ponctuation
    .replace(/\s+/g, " ")
    .trim();
}





/****************************************************
 * WhatsApp Buttons — Activation
 ****************************************************/
const waLaurent = document.getElementById("waLaurent");
const waSophia  = document.getElementById("waSophia");

if (waLaurent) {
  waLaurent.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open("https://wa.me/34621210642", "_blank");
  });
}

if (waSophia) {
  waSophia.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open("https://wa.me/34621128303", "_blank");
  });
}

    /****************************************************
     * SEND MESSAGE — VERSION SAINE
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const userText = input.value.trim();
      input.value = "";

      const userBubble = document.createElement("div");
      userBubble.className = "msg userMsg";
      userBubble.textContent = userText;
      bodyEl.appendChild(userBubble);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      typing.style.display = "flex";

      const lang = detectLanguage(userText);
      const intent = detectIntent(userText);
      const topic = detectTopic(userText);
      const kbPath = resolveKBPath(userText, lang);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "list_suites") {
          bot.innerHTML = `
            <b>Nous proposons trois hébergements au Solo Ático ✨</b><br><br>
            • <b>Suite Neus</b><br>
            • <b>Suite Bourlardes</b><br>
            • <b>Chambre Blue Patio</b><br><br>
            Souhaitez-vous que je vous détaille l’un d’eux ?
          `;
        }

        else if (intent === "help") {
          bot.textContent =
            "Je peux vous renseigner sur nos suites, services, le bateau Tintorera, le Reiki ou les activités à L’Escala 😊";
        }

        else {
          const intro = document.createElement("div");
          intro.innerHTML = `<b>${getShortAnswer(topic, lang)}</b><br><br>`;
          bot.appendChild(intro);

          if (!kbPath) {
            bot.appendChild(document.createTextNode(
              "Pouvez-vous préciser votre demande ? 😊"
            ));
          } else {
            const res = await fetch(kbPath);
            const raw = await res.text();
            const kb = parseKB(raw);

            if (kb.short) {
              const s = document.createElement("div");
              s.textContent = kb.short;
              bot.appendChild(s);
            }

            if (kb.long) {
              const btn = document.createElement("button");
              btn.className = "kbMoreBtn";
              btn.textContent = "Voir la description complète";

              btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const l = document.createElement("div");
                l.className = "kbLongText";
                l.textContent = kb.long;
                bot.appendChild(l);
                btn.remove();
                bodyEl.scrollTop = bodyEl.scrollHeight;
              });

              bot.appendChild(document.createElement("br"));
              bot.appendChild(btn);
            }
          }
        }

      } catch (err) {
        console.error(err);
        bot.textContent =
          "Désolé, une erreur est survenue. Pouvez-vous reformuler ?";
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });

    console.log("Chatbot prêt — version 1.4");
  }

  window.addEventListener("DOMContentLoaded", initChatbot);

})();
