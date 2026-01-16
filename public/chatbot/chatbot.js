/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.6 — FINAL SAFE DOM INIT
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.6.9.6 — WAIT DOM");

  function initChatbot() {

    const openBtn    = document.getElementById("openChatBtn");
    const chatWindow = document.getElementById("chatWindow");

    if (!openBtn || !chatWindow) {
      return false;
    }

    const sendBtn  = document.getElementById("sendBtn");
    const input    = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");
    const typing   = document.getElementById("typing");

    /* ================================
       OPEN / CLOSE
       ================================ */
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chatWindow.style.display =
        chatWindow.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (
        chatWindow.style.display === "flex" &&
        !chatWindow.contains(e.target) &&
        !openBtn.contains(e.target)
      ) {
        chatWindow.style.display = "none";
      }
    });

    chatWindow.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    /* ==================================================
       ✅ FIX DEMANDÉ
       Empêcher fermeture sur "Voir la description complète"
       ================================================== */
    chatWindow.addEventListener("click", (e) => {
      if (
        e.target.closest(".readMoreBtn") ||
        e.target.closest(".kbMoreBtn")
      ) {
        e.stopPropagation();
      }
    });

    /* ================================
       Messaging (inchangé)
       ================================ */
    function appendMessage(content, className) {
      const msg = document.createElement("div");
      msg.className = `msg ${className}`;
      msg.innerHTML = content;
      chatBody.insertBefore(msg, typing);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      appendMessage(text, "userMsg");
      input.value = "";
      typing.style.display = "flex";

      setTimeout(() => {
        typing.style.display = "none";
        appendMessage("Réponse IA (KB)", "botMsg");
      }, 600);
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("Solo’IA’tico Chatbot initialisé ✅");
    return true;
  }

  /* ================================
     Observer DOM (clé de la stabilité)
     ================================ */
  const observer = new MutationObserver(() => {
    if (initChatbot()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
