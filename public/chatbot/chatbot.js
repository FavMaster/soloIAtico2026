/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE - Fav - Chemin Complet
 * Version 1.3.1 (Architecture B) - chemin relatif
 * Chargement HTML + CSS + JS sans ouverture automatique
 ****************************************************/

// Force Vercel update 2025-02-25

(function() {

  console.log("Solo’IA’tico Chatbot v1.3.1 — Initialisation…");

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
 * TEST KB — Chargement présentation FR
 ****************************************************/
console.log("🧪 TEST KB : fonction appelée");

async function loadKBTest() {
  try {
    const response = await fetch(
      "https://solobotatico2026.vercel.app/kb/fr/01_presentation/presentation-generale.txt"
    );

    if (!response.ok) {
      throw new Error("Fichier KB introuvable");
    }

    const text = await response.text();

    const botBubble = document.createElement("div");
    botBubble.className = "msg botMsg";
    botBubble.textContent =
      text.substring(0, 400) + "…";

    bodyEl.appendChild(botBubble);
    bodyEl.scrollTop = bodyEl.scrollHeight;

    console.log("KB chargée avec succès");

  } catch (err) {
    console.error("Erreur chargement KB :", err);
  }
}

/* Lancer le test */
loadKBTest();


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
     * 6B) Fonction d’envoi
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const bubble = document.createElement("div");
      bubble.className = "msg userMsg";
      bubble.textContent = input.value;
      bodyEl.appendChild(bubble);

      input.value = "";
      bodyEl.scrollTop = bodyEl.scrollHeight;

      typing.style.display = "flex";

      setTimeout(() => {
        typing.style.display = "none";

        const bot = document.createElement("div");
        bot.className = "msg botMsg";
        const kbText = await loadKB(
  "fr",
  "01_presentation",
  "presentation-generale.txt"
);

bot.textContent = kbText.substring(0, 600) + "…";

        bodyEl.appendChild(bot);

        bodyEl.scrollTop = bodyEl.scrollHeight;

      }, 1200);
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
