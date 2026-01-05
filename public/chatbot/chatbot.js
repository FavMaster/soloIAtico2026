/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.3 STABLE
 * FULL i18n — Mobile Safe (iOS / Android)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.5.3 — Loaded");

  /****************************************************
   * I18N — TEXTES CENTRALISÉS
   ****************************************************/
  const I18N = {
    fr: {
      help: "Je peux vous renseigner sur nos suites, le bateau Tintorera, le Reiki ou la piscine 😊",
      listSuites: "Nos hébergements ✨",
      clarify: "Pouvez-vous préciser votre demande ? 😊",
      bookBoat: "⛵ Réserver une sortie en mer",
      short: {
        bateau: "Oui ⛵ nous proposons des sorties en mer avec la Tintorera.",
        reiki: "Oui 🌿 des séances de Reiki sont disponibles.",
        piscine: "Notre piscine rooftop est accessible aux hôtes 🏖️",
        suite: "Voici les informations sur nos hébergements ✨",
        default: "Voici ce que je peux vous dire 😊"
      }
    },

    en: {
      help: "I can help you with our suites, the Tintorera boat, Reiki or the pool 😊",
      listSuites: "Our accommodations ✨",
      clarify: "Could you please clarify your request? 😊",
      bookBoat: "⛵ Book a boat trip",
      short: {
        bateau: "Yes ⛵ we offer boat trips with Tintorera.",
        reiki: "Yes 🌿 Reiki sessions are available.",
        piscine: "Our rooftop pool is available to guests 🏖️",
        suite: "Here is information about our accommodations ✨",
        default: "Here is what I can tell you 😊"
      }
    },

    es: {
      help: "Puedo informarle sobre nuestras suites, el barco Tintorera, Reiki o la piscina 😊",
      listSuites: "Nuestros alojamientos ✨",
      clarify: "¿Podría precisar su solicitud? 😊",
      bookBoat: "⛵ Reservar una salida en barco",
      short: {
        bateau: "Sí ⛵ ofrecemos salidas en barco con Tintorera.",
        reiki: "Sí 🌿 hay sesiones de Reiki disponibles.",
        piscine: "Nuestra piscina rooftop está disponible 🏖️",
        suite: "Aquí tiene información sobre nuestros alojamientos ✨",
        default: "Esto es lo que puedo decirle 😊"
      }
    },

    nl: {
      help: "Ik kan u helpen met onze suites, de Tintorera-boot, Reiki of het zwembad 😊",
      listSuites: "Onze accommodaties ✨",
      clarify: "Kunt u uw vraag verduidelijken? 😊",
      bookBoat: "⛵ Boottocht reserveren",
      short: {
        bateau: "Ja ⛵ wij bieden boottochten aan met Tintorera.",
        reiki: "Ja 🌿 Reiki-sessies zijn beschikbaar.",
        piscine: "Ons rooftopzwembad is toegankelijk 🏖️",
        suite: "Hier is informatie over onze accommodaties ✨",
        default: "Dit is wat ik u kan vertellen 😊"
      }
    },

    cat: {
      help: "Puc informar-vos sobre les nostres suites, el vaixell Tintorera, Reiki o la piscina 😊",
      listSuites: "Els nostres allotjaments ✨",
      clarify: "Podeu precisar la vostra sol·licitud? 😊",
      bookBoat: "⛵ Reservar una sortida en vaixell",
      short: {
        bateau: "Sí ⛵ oferim sortides en vaixell amb la Tintorera.",
        reiki: "Sí 🌿 hi ha sessions de Reiki disponibles.",
        piscine: "La nostra piscina rooftop és accessible 🏖️",
        suite: "Aquí teniu informació sobre els allotjaments ✨",
        default: "Això és el que us puc explicar 😊"
      }
    }
  };

  function t(lang, key) {
    return I18N[lang]?.[key] || I18N.fr[key];
  }

  function short(lang, topic) {
    return I18N[lang]?.short?.[topic] || I18N.fr.short[topic] || I18N.fr.short.default;
  }

  /****************************************************
   * OUTILS
   ****************************************************/
  function detectLanguage(text = "") {
    const t = text.toLowerCase();
    if (/zwembad|boot/.test(t)) return "nl";
    if (/boat|pool/.test(t)) return "en";
    if (/piscina|hacer/.test(t)) return "es";
    if (/fer|piscina/.test(t)) return "cat";
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function detectIntent(text) {
    const t = text.toLowerCase();
    if (/help|aide|ayuda/.test(t)) return "help";
    if (/suite|room|chambre|kamer/.test(t)) return "list_suites";
    return "specific";
  }

  function detectTopic(text) {
    const t = text.toLowerCase();
    if (/bateau|boat|boot|tintorera/.test(t)) return "bateau";
    if (/reiki|massage/.test(t)) return "reiki";
    if (/piscine|pool|zwembad/.test(t)) return "piscine";
    if (/suite|room|chambre/.test(t)) return "suite";
    return "default";
  }

  /****************************************************
   * INIT — DOM READY (CRUCIAL MOBILE)
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    /* CSS */
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    /* HTML */
    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    /* ELEMENTS */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    if (!chatWin || !openBtn || !sendBtn || !input) {
      console.error("❌ Chatbot HTML incomplet");
      return;
    }

    chatWin.style.display = "none";
    let isOpen = false;

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

    async function sendMessage() {
      if (!input.value.trim()) return;

      const text = input.value.trim();
      input.value = "";

      bodyEl.innerHTML += `<div class="msg userMsg">${text}</div>`;
      typing.style.display = "flex";

      const lang = detectLanguage(text);
      const intent = detectIntent(text);
      const topic = detectTopic(text);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      if (intent === "help") {
        bot.textContent = t(lang, "help");
      } else if (intent === "list_suites") {
        bot.innerHTML = `<b>${t(lang, "listSuites")}</b><br><br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio`;
      } else {
        bot.innerHTML = `<b>${short(lang, topic)}</b>`;
        if (topic === "bateau") {
          bot.innerHTML += `<br><br>
            <a class="kbBookBtn" target="_blank"
               href="https://koalendar.com/e/tintorera">
              ${t(lang, "bookBoat")}
            </a>`;
        }
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", e => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("✅ Chatbot Solo’IA’tico v1.5.3 prêt");
  });

})();
