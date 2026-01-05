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
  const text = message.toLowerCase();

  // 1️⃣ Détection par le message (PRIORITAIRE)
  if (/\b(is er|zwembad|kamer|kamers|boot|eten)\b/.test(text)) return "nl";
  if (/\b(what|room|rooms|pool|boat|breakfast)\b/.test(text)) return "en";
  if (/\b(el|la|los|las|qué|hacer|piscina)\b/.test(text)) return "es";
  if (/\b(què|fer|habitació|piscina)\b/.test(text)) return "cat";

  // 2️⃣ Fallback : langue de la page
  const htmlLang = document.documentElement.lang;
  if (htmlLang) return htmlLang.split("-")[0];

  // 3️⃣ Fallback final
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

  // Suites
  if (
    t.includes("neus") ||
    t.includes("bourlard") ||
    t.includes("suite") ||
    t.includes("room") ||
    t.includes("kamer") ||
    t.includes("habitacion")
  ) return "suite";

  // Bateau
  if (
    t.includes("bateau") ||
    t.includes("tintorera") ||
    t.includes("boat") ||
    t.includes("boot")
  ) return "bateau";

  // Reiki
  if (
    t.includes("reiki") ||
    t.includes("massage")
  ) return "reiki";

  // Piscine ✅
  if (
    t.includes("piscine") ||
    t.includes("pool") ||
    t.includes("zwembad")
  ) return "piscine";

  // Petit-déjeuner
  if (
    t.includes("petit") ||
    t.includes("breakfast") ||
    t.includes("ontbijt")
  ) return "petitdej";

  // L’Escala / activités
  if (
    t.includes("escala") ||
    t.includes("que faire") ||
    t.includes("wat te doen") ||
    t.includes("what to do")
  ) return "escale";

  return "default";
}


  /****************************************************
   * Router KB
   ****************************************************/
 function resolveKBPath(message, lang) {
  const t = message.toLowerCase();

  if (t.includes("neus"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-neus.txt`;

  if (t.includes("bourlard"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-bourlardes.txt`;

  if (t.includes("blue"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-blue-patio.txt`;

  if (
    t.includes("bateau") ||
    t.includes("tintorera") ||
    t.includes("boat") ||
    t.includes("boot")
  )
    return `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;

  if (t.includes("reiki") || t.includes("massage"))
    return `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`;

  if (
    t.includes("piscine") ||
    t.includes("pool") ||
    t.includes("zwembad")
  )
    return `${KB_BASE_URL}/kb/${lang}/03_services/piscine-rooftop.txt`;

  if (
    t.includes("petit") ||
    t.includes("breakfast") ||
    t.includes("ontbijt")
  )
    return `${KB_BASE_URL}/kb/${lang}/03_services/petit-dejeuner.txt`;

  if (
    t.includes("escala") ||
    t.includes("wat te doen") ||
    t.includes("what to do")
  )
    return `${KB_BASE_URL}/kb/${lang}/04_que-faire/que-faire-escala.txt`;

  return null;
}


  /****************************************************
   * Short answers
   ****************************************************/
  function getShortAnswer(topic, lang = "fr") {
  const answers = {
    fr: {
      piscine: "Notre piscine rooftop offre une vue à couper le souffle 🏖️",
      suite: "Voici les informations sur la suite que vous avez demandée ✨",
      bateau: "La Tintorera vous promet un moment magique en mer 🌊",
      reiki: "Un moment de détente et d’énergie positive 🌿",
      petitdej: "Le petit-déjeuner est inclus et servi avec soin ☕",
      escale: "L’Escala regorge de choses à découvrir 🌞",
      default: "Voici ce que je peux vous dire à ce sujet 😊"
    },

    nl: {
      piscine: "Ons rooftopzwembad biedt een adembenemend uitzicht 🏖️",
      suite: "Hier vindt u informatie over onze accommodaties ✨",
      bateau: "De Tintorera belooft een magisch moment op zee 🌊",
      reiki: "Een moment van ontspanning en hernieuwde energie 🌿",
      petitdej: "Het ontbijt is inbegrepen en met zorg bereid ☕",
      escale: "Er valt veel te ontdekken in L’Escala 🌞",
      default: "Dit is wat ik u hierover kan vertellen 😊"
    },

    en: {
      piscine: "Our rooftop pool offers a breathtaking view 🏖️",
      suite: "Here is information about our accommodations ✨",
      bateau: "Tintorera promises a magical moment at sea 🌊",
      reiki: "A moment of relaxation and positive energy 🌿",
      petitdej: "Breakfast is included and carefully prepared ☕",
      escale: "There is so much to discover in L’Escala 🌞",
      default: "Here is what I can tell you 😊"
    },

    es: {
      piscine: "Nuestra piscina rooftop ofrece una vista impresionante 🏖️",
      suite: "Aquí tiene la información sobre nuestros alojamientos ✨",
      bateau: "La Tintorera le promete un momento mágico en el mar 🌊",
      reiki: "Un momento de relajación y energía positiva 🌿",
      petitdej: "El desayuno está incluido y servido con cuidado ☕",
      escale: "Hay mucho que descubrir en L’Escala 🌞",
      default: "Esto es lo que puedo decirle 😊"
    },

    cat: {
      piscine: "La nostra piscina rooftop ofereix una vista espectacular 🏖️",
      suite: "Aquí teniu informació sobre els nostres allotjaments ✨",
      bateau: "La Tintorera promet un moment màgic al mar 🌊",
      reiki: "Un moment de relaxació i energia positiva 🌿",
      petitdej: "L’esmorzar està inclòs i preparat amb cura ☕",
      escale: "Hi ha molt per descobrir a L’Escala 🌞",
      default: "Això és el que et puc explicar 😊"
    }
  };

  return (
    answers[lang]?.[topic] ||
    answers[lang]?.default ||
    answers.fr.default
  );
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
 * I18N — Textes système multilingues
 ****************************************************/
const i18n = {
  fr: {
    more: "Voir la description complète",
    clarify: "Pouvez-vous préciser votre demande ? 😊",
    help: "Je peux vous renseigner sur nos suites, services, le bateau Tintorera, le Reiki ou les activités à L’Escala 😊",
    listIntro: "Nous proposons trois hébergements au Solo Ático ✨",
    choose: "Souhaitez-vous que je vous détaille l’un d’eux ?"
  },

  en: {
    more: "View full description",
    clarify: "Could you please clarify your request? 😊",
    help: "I can help you with our suites, services, the Tintorera boat, Reiki, or things to do in L’Escala 😊",
    listIntro: "We offer three accommodations at Solo Ático ✨",
    choose: "Would you like details about one of them?"
  },

  es: {
    more: "Ver la descripción completa",
    clarify: "¿Podría precisar su solicitud? 😊",
    help: "Puedo informarle sobre nuestras suites, servicios, el barco Tintorera, Reiki o qué hacer en L’Escala 😊",
    listIntro: "Ofrecemos tres alojamientos en Solo Ático ✨",
    choose: "¿Desea que le detalle alguno de ellos?"
  },

  nl: {
    more: "Volledige beschrijving bekijken",
    clarify: "Kunt u uw vraag verduidelijken? 😊",
    help: "Ik kan u helpen met onze suites, diensten, de Tintorera-boot, Reiki of activiteiten in L’Escala 😊",
    listIntro: "Wij bieden drie accommodaties bij Solo Ático ✨",
    choose: "Wilt u meer details over één ervan?"
  },

  cat: {
    more: "Veure la descripció completa",
    clarify: "Podeu precisar la vostra sol·licitud? 😊",
    help: "Puc informar-vos sobre les nostres suites, serveis, el vaixell Tintorera, Reiki o què fer a l’Escala 😊",
    listIntro: "Oferim tres allotjaments a Solo Ático ✨",
    choose: "Voleu que us en detalli algun?"
  }
};

function t(lang, key) {
  return i18n[lang]?.[key] || i18n.fr[key];
}







/****************************************************
 * SEND MESSAGE — VERSION MULTILINGUE STABLE (v1.4+)
 ****************************************************/
async function sendMessage() {
  if (!input.value.trim()) return;

  const userText = input.value.trim();
  input.value = "";

  /* Message utilisateur */
  const userBubble = document.createElement("div");
  userBubble.className = "msg userMsg";
  userBubble.textContent = userText;
  bodyEl.appendChild(userBubble);
  bodyEl.scrollTop = bodyEl.scrollHeight;

  typing.style.display = "flex";

  const lang   = detectLanguage(userText);
  const intent = detectIntent(userText);
  const topic  = detectTopic(userText);
  const kbPath = resolveKBPath(userText, lang);

  const bot = document.createElement("div");
  bot.className = "msg botMsg";

  try {

    /* ================================
       INTENTION : LISTE DES SUITES
    ================================= */
    if (intent === "list_suites") {
      bot.innerHTML = `
        <b>${t(lang, "listIntro")}</b><br><br>
        • <b>Suite Neus</b><br>
        • <b>Suite Bourlardes</b><br>
        • <b>Chambre Blue Patio</b><br><br>
        ${t(lang, "choose")}
      `;
    }

    /* ================================
       INTENTION : AIDE
    ================================= */
    else if (intent === "help") {
      bot.textContent = t(lang, "help");
    }

    /* ================================
       INTENTION : SUJET PRÉCIS (KB)
    ================================= */
    else {
      /* Intro courte */
      const intro = document.createElement("div");
      intro.innerHTML = `<b>${getShortAnswer(topic, lang)}</b><br><br>`;
      bot.appendChild(intro);

      if (!kbPath) {
        bot.appendChild(document.createTextNode(t(lang, "clarify")));
      } else {
        let res = await fetch(kbPath);

        /* Fallback FR si fichier manquant */
        if (!res.ok && lang !== "fr") {
          res = await fetch(kbPath.replace(`/kb/${lang}/`, `/kb/fr/`));
        }

        if (!res.ok) throw new Error("KB introuvable");

        const kb = parseKB(await res.text());

        /* Résumé */
        if (kb.short) {
          const shortDiv = document.createElement("div");
          shortDiv.textContent = kb.short;
          bot.appendChild(shortDiv);
        }

        /* Bouton LONG */
        if (kb.long) {
          const btn = document.createElement("button");
          btn.className = "kbMoreBtn";
          btn.textContent = t(lang, "more");

          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            btn.remove();

            const longHTML = document.createElement("div");
            longHTML.innerHTML = formatLongText(kb.long);
            bot.appendChild(longHTML);

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
      "Une erreur est survenue. Pouvez-vous reformuler votre demande ?";
  }

  typing.style.display = "none";
  bodyEl.appendChild(bot);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}
