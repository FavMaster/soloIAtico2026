/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.3.1 (Architecture B) - chemin relatif
 * Chargement HTML + CSS + JS sans ouverture automatique
 ****************************************************/

(function() {

  console.log("Solo’IA’tico Chatbot v1.3.1 — Initialisation…");

  /****************************************************
   * 1) Charger le fichier CSS
   ****************************************************/
function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/chatbot/chatbot.css";   // chemin relatif
    document.head.appendChild(link);
}

  /****************************************************
   * 2) Charger le template HTML
   ****************************************************/
async function loadHTML() {
    const response = await fetch("/chatbot/chatbot.html");  // chemin relatif
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

    console.log("— HTML + CSS injectés");

    // Sélectionner les éléments
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");
    const bodyEl = document.getElementById("chatBody");
    const typing = document.getElementById("typing");

    /****************************************************
     * 4) Garantir que le chatbot est FERMÉ au chargement
     ****************************************************/
    chatWin.style.display = "none";

    /****************************************************
     * 5) Ouvrir seulement au clic
     ****************************************************/
    openBtn.addEventListener("click", () => {
      chatWin.style.display = "flex";
    });

    /****************************************************
     * 6) Fonction d’envoi
     ****************************************************/
    function sendMessage() {
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
        bot.textContent = "(Réponse simulée)";
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
