/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.4.1 STABLE
 * Multilingue + KB Short / Long + Intentions
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.4.1 — Initialisation");

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  /****************************************************
   * CSS
   ****************************************************/
  function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(link);
  }

  /****************************************************
   * HTML
   ****************************************************/
  async function loadHTML() {
    const res = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`);
    return await res.text();
  }

  /****************************************************
   * Langue
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
    const t = message.toLowerCase();

    const suites = [
      "suite","suites","chambre","chambres",
      "room","rooms","kamer","kamers",
      "habitacion","habitaciones"
    ];
    if (suites.some(w => t.includes(w))) return "list_suites";

    const help = [
      "aide","help","ayuda",
      "que faire","what can","what do"
    ];
    if (help.some(w => t.includes(w))) return "help";

    return "specific";
  }

  /****************************************************
   * Topic
   ****************************************************/
  function detectTopic(message) {
    const t = message.toLowerCase();

    if (t.includes("neus") || t.includes("bourlard") || t.includes("suite")) return "suite";
    if (t.includes("bateau") || t.includes("tintorera")) return "bateau";
    if (t.includes("reiki")) return "reiki";
    if (t.includes("piscine")) return "piscine";
    if (t.includes("petit")) return "petitdej";
    if (t.includes("escala") || t.includes("faire")) return "escale";

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
    if (t.includes("bateau") || t.includes("tintorera")) return `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;
    if (t.includes("reiki")) return `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`;
    if (t.includes("piscine")) return `${KB_BASE_URL}/kb/${lang}/03_services/piscine-rooftop.txt`;
    if (t.includes("petit")) return `${KB_BASE_URL}/kb/${lang}/03_services/petit-dejeuner.txt`;
    if (t.includes("escala")) return `${KB_BASE_URL}/kb/${lang}/04_que-faire/que-faire-escala.txt`;

    return null;
  }

  /****************************************************
   * Short answers
   ****************************************************/
  function getShortAnswer(topic, lang) {
    const answers = {
      fr: {
        suite: "Voici les informations sur la suite que vous avez demandée ✨",
        bateau: "La Tintorera vous promet un moment magique en mer 🌊",
        reiki: "Un moment de détente et d’énergie positive 🌿",
        piscine: "Notre piscine rooftop offre une vue à couper le souffle 🏖️",
        petitdej: "Le petit-déjeuner est inclus et servi avec soin ☕",
        escale: "L’Escala regorge de choses à découvrir 🌞",
        default: "Voici ce que je peux vous dire à ce sujet 😊"
      },
      es: {
        suite: "Aquí tiene la información sobre la suite ✨",
        bateau: "La Tintorera le espera para un momento mágico en el mar 🌊",
        reiki: "Un momento de relajación y bienestar 🌿",
        piscine: "Nuestra piscina rooftop ofrece una vista increíble 🏖️",
        petitdej: "El desayuno está incluido ☕",
        escale: "L’Escala tiene mucho que ofrecer 🌞",
        default: "Aquí está la información 😊"
      },
      en: {
        default: "Here is what I can tell you 😊"
      }
    };

    return answers[lang]?.[topic] || answers[lang]?.default || answers.fr.default;
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
   * Format LONG
   ****************************************************/
  function formatLongText(text) {
    const lines = text
      .split(/\n|•|- /)
      .map(l => l.trim())
      .filter(l => l.length > 30)
      .slice(0, 6);

    return `
      <div class="kbLongWrapper">
        <ul class="kbLongList">
          ${lines.map(l => `<li>${l}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  /****************************************************
   * INIT
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

    openBtn.onclick = (e) => {
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

    /****************************************************
     * SEND MESSAGE
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
          bot.innerHTML = `<b>${getShortAnswer(topic, lang)}</b><br><br>`;

          if (!kbPath) {
            bot.innerHTML += "Pouvez-vous préciser votre demande ? 😊";
          } else {
            let res = await fetch(kbPath);

            if (!res.ok && lang !== "fr") {
              res = await fetch(kbPath.replace(`/kb/${lang}/`, `/kb/fr/`));
            }

            if (!res.ok) throw new Error("KB introuvable");

            const kb = parseKB(await res.text());

            if (kb.short) bot.innerHTML += kb.short + "<br><br>";

            if (kb.long) {
              const btnLabels = {
                fr: "Voir la description complète",
                en: "View full description",
                es: "Ver la descripción completa",
                nl: "Bekijk volledige beschrijving",
                cat: "Veure la descripció completa"
              };

              const btn = document.createElement("button");
              btn.className = "kbMoreBtn";
              btn.textContent = btnLabels[lang] || btnLabels.fr;

              btn.onclick = (e) => {
                e.stopPropagation();
                btn.remove();
                bot.innerHTML += formatLongText(kb.long);
                bodyEl.scrollTop = bodyEl.scrollHeight;
              };

              bot.appendChild(btn);
            }
          }
        }

      } catch {
        bot.textContent =
          "Désolé, une erreur est survenue. Pouvez-vous reformuler ?";
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.onclick = sendMessage;
    input.addEventListener("keydown", e => e.key === "Enter" && sendMessage());
  }

  window.addEventListener("DOMContentLoaded", initChatbot);

})();
