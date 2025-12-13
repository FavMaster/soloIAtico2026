/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE - Fav - Chemin Complet
 * Version 1.3.1 (Architecture B) - chemin relatif
 * Chargement HTML + CSS + JS sans ouverture automatique
 ****************************************************/

// Force Vercel update 2025-02-25

(function() {

  console.log("Solo’IA’tico Chatbot v1.3.1 — Initialisation…");

/****************************************************
 * BASE URL KB (Vercel)
 ****************************************************/
const KB_BASE_URL = "https://solobotatico2026.vercel.app";

/****************************************************
 * Langue active du chatbot
 ****************************************************/
const currentLang =
  document.documentElement.lang?.toLowerCase().startsWith("es") ? "es" :
  document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" :
  document.documentElement.lang?.toLowerCase().startsWith("nl") ? "nl" :
  document.documentElement.lang?.toLowerCase().startsWith("ca") ? "cat" :
  "fr";

console.log("🌍 Langue chatbot :", currentLang);


  /****************************************************
   * 1) Charger le fichier CSS
   ****************************************************/
function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://solobotatico2026.vercel.app/chatbot/chatbot.css";   // chemin directe
    document.head.appendChild(link);
}

  /****************************************************
   * 2) Charger le template HTML
   ****************************************************/
async function loadHTML() {
    const response = await fetch("https://solobotatico2026.vercel.app/chatbot/chatbot.html");  // chemin directe
    return await response.text();
}

  /****************************************************
   * 3) Injecter l’HTML dans la page
   ****************************************************/
  async function initChatbot() {

    // Charger CSS immédiatement
    loadCSS();

    // Charger HTML
    const html = await loadHTML();

    // Injecter dans la page
    document.body.insertAdjacentHTML("beforeend", html);

// Attendre que le DOM injecté soit réellement disponible
await new Promise(requestAnimationFrame);

    console.log("— HTML + CSS injectés");

    // Sélectionner les éléments
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");
    const bodyEl = document.getElementById("chatBody");
    const typing = document.getElementById("typing");

let isOpen = false;

const waLaurent = document.getElementById("waLaurent");
const waSophia  = document.getElementById("waSophia");

if (waLaurent) {
  waLaurent.addEventListener("click", () => {
    window.open("https://wa.me/34621210642", "_blank");
  });
}

if (waSophia) {
  waSophia.addEventListener("click", () => {
    window.open("https://wa.me/34621128303", "_blank");
  });
}


if (!chatWin || !openBtn) {
  console.error("❌ Chatbot non initialisé : chatWindow ou bouton introuvable");
  return;
}


/****************************************************
 * 4) Garantir que le chatbot est FERMÉ au chargement
 ****************************************************/
chatWin.style.display = "none";
isOpen = false;

/****************************************************
 * 5) Ouvrir / fermer via bouton (toggle)
 ****************************************************/
openBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isOpen) {
    chatWin.style.display = "none";
    isOpen = false;
  } else {
    chatWin.style.display = "flex";
    isOpen = true;
  }
});

/****************************************************
 * 6) Fermer si clic en dehors
 ****************************************************/
document.addEventListener("click", (e) => {
  if (!isOpen) return;

  const clickedInsideChat = chatWin.contains(e.target);
  const clickedOnButton = openBtn.contains(e.target);

  if (!clickedInsideChat && !clickedOnButton) {
    chatWin.style.display = "none";
    isOpen = false;
  }
});

/****************************************************
 *  6A) KB LOADER — Chargement dynamique de fichiers texte
 ****************************************************/
async function loadKB(lang, section, file) {
  try {
    const url = `https://solobotatico2026.vercel.app/kb/${lang}/${section}/${file}`;
    console.log("📚 Chargement KB :", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("KB introuvable");

    return await response.text();

  } catch (err) {
    console.error("❌ Erreur KB :", err);
    return "Désolé, cette information n’est pas encore disponible.";
  }
}

/****************************************************
 * Router KB — chemins ABSOLUS Vercel
 ****************************************************/
function resolveKBPath(message, lang = "fr") {
  const text = message.toLowerCase();

  if (text.includes("neus"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-neus.txt`;

  if (text.includes("bourlard"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-bourlardes.txt`;

  if (text.includes("blue"))
    return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-blue-patio.txt`;

  if (text.includes("bateau") || text.includes("tintorera"))
    return `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;

  if (text.includes("reiki"))
    return `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`;

  if (text.includes("piscine"))
    return `${KB_BASE_URL}/kb/${lang}/03_services/piscine-rooftop.txt`;

  if (text.includes("petit"))
    return `${KB_BASE_URL}/kb/${lang}/03_services/petit-dejeuner.txt`;

  if (text.includes("que faire") || text.includes("escala"))
    return `${KB_BASE_URL}/kb/${lang}/04_que-faire/que-faire-escala.txt`;

  if (text.includes("restaurant") || text.includes("manger"))
    return `${KB_BASE_URL}/kb/${lang}/05_solotogo/guide-client-solotogo.txt`;

  if (text.includes("check") || text.includes("heure") || text.includes("adresse"))
    return `${KB_BASE_URL}/kb/${lang}/06_infos-pratiques/infos-pratiques.txt`;

  return null;
}



// Langue active du chatbot
const currentLang = detectLanguage();

console.log("🌍 Langue détectée :", currentLang);

/****************************************************
 * Détection automatique de la langue (message + HTML)
 ****************************************************/
function detectLanguage(message = "") {
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    return htmlLang.split("-")[0];
  }

  const text = message.toLowerCase();

  if (text.match(/\b(el|la|los|las|qué|hacer|reserva)\b/)) return "es";
  if (text.match(/\b(wat|doen|kamer|boot|eten)\b/)) return "nl";
  if (text.match(/\b(què|fer|habitació|reserva)\b/)) return "cat";
  if (text.match(/\b(what|room|boat|booking)\b/)) return "en";

  return "fr";
}


/****************************************************
 * 7.2) Fonction d’envoi — Réponse courte / détaillée
 ****************************************************/
async function sendMessage() {
  if (!input.value.trim()) return;

  const userText = input.value;

  // Message utilisateur
  const userBubble = document.createElement("div");
  userBubble.className = "msg userMsg";
  userBubble.textContent = userText;
  bodyEl.appendChild(userBubble);

  input.value = "";
  bodyEl.scrollTop = bodyEl.scrollHeight;

  typing.style.display = "flex";

  const lang = detectLanguage(userText);
  const kbPath = resolveKBPath(userText, lang);

  let shortText = "";
  let fullText = "";

  if (!kbPath) {
    shortText =
      "Je peux vous renseigner sur nos suites, services, le bateau Tintorera, le Reiki ou que faire à L’Escala 😊";
  } else {
    try {
      console.log("📚 Chargement KB :", kbPath);
      const response = await fetch(kbPath);
      fullText = await response.text();
      shortText = fullText.substring(0, 300) + "…";
    } catch (err) {
      shortText = "Désolé, cette information n’est pas encore disponible.";
    }
  }

  typing.style.display = "none";

  // Message bot
  const botBubble = document.createElement("div");
  botBubble.className = "msg botMsg";
  botBubble.textContent = shortText;

  // Bouton "Lire la suite" si contenu long
  if (fullText.length > 350) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "readMoreBtn";
    moreBtn.textContent = "Lire la suite";

    moreBtn.addEventListener("click", () => {
      botBubble.textContent = fullText;
      moreBtn.remove();
    });

    botBubble.appendChild(moreBtn);
  }

  bodyEl.appendChild(botBubble);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}


    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });

    console.log("— Chatbot initialisé (fermé par défaut)");
  }



  /****************************************************
   * 7) Lancer tout quand la page est chargée
   ****************************************************/
  window.addEventListener("DOMContentLoaded", initChatbot);

})();
