/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.6 — AUTONOME + SAFE
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.6.9.6 — INIT");

  /* ==================================================
     1️⃣ HTML DU CHATBOT (INLINE – PLUS DE FETCH)
     ================================================== */
  const CHATBOT_HTML = `
  <div id="openChatBtn">
    <img src="https://soloatico.es/bot2026/images/avatar.png"
         style="width:44px;height:44px;object-fit:contain;
         filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));" />
  </div>

  <div id="chatWindow">

    <div id="chatHeader"
         style="background:url('https://soloatico.es/bot2026/images/header.jpg')
         center/cover no-repeat;
         height:120px; display:flex; align-items:flex-end;
         padding:10px; border-bottom:1px solid #e5e5e5; gap:15px;
         border-radius:18px 18px 0 0;">
         
      <img src="https://soloatico.es/bot2026/images/avatar.png"
           style="width:55px;height:55px;object-fit:contain;" />

      <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0;">
        Solo'IA'tico Assistant
      </h2>
    </div>

    <div id="chatBody">
      <div class="msg botMsg">
        <b>👋 Bonjour et bienvenue !</b><br>
        Je suis Solo’IA’tico Assistant.<br><br>
        <b>Comment puis-je vous aider ?</b>
      </div>

      <div id="typing" style="display:none">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>

    <div id="chatFooter">
      <div id="inputZone">
        <input type="text" id="userInput" placeholder="Écrire un message..." />
        <div id="sendBtn">Envoyer</div>
      </div>
    </div>

  </div>
  `;

  /* ==================================================
     2️⃣ INJECTION HTML (UNE SEULE FOIS)
     ================================================== */
  function injectChatbotHTML() {
    if (document.getElementById("openChatBtn")) return;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = CHATBOT_HTML;
    document.body.appendChild(wrapper);
  }

  /* ==================================================
     3️⃣ INITIALISATION
     ================================================== */
  function initChatbot() {

    const openBtn    = document.getElementById("openChatBtn");
    const chatWindow = document.getElementById("chatWindow");

    if (!openBtn || !chatWindow) return false;

    const sendBtn  = document.getElementById("sendBtn");
    const input    = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");
    const typing   = document.getElementById("typing");

    /* OPEN / CLOSE */
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

    /* 🔒 FIX DEMANDÉ :
       empêcher fermeture sur KB */
    chatWindow.addEventListener("click", (e) => {
      if (
        e.target.closest(".readMoreBtn") ||
        e.target.closest(".kbMoreBtn")
      ) {
        e.stopPropagation();
      }
    });

    /* MESSAGES */
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
        appendMessage("Réponse IA (KB à venir)", "botMsg");
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

  /* ==================================================
     4️⃣ DÉMARRAGE SÛR
     ================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    injectChatbotHTML();
    initChatbot();
  });

})();
