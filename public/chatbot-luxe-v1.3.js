/********************************************
 * SOLO'IA'TICO — CHATBOT LUXE VERSION 1.3
 * Fichier complet prêt à être déployé
 ********************************************/

/* CSS à injecter */
const css = `
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f2f2f2;
}

/* Bouton d'ouverture */
#openChatBtn {
  transition: all 0.25s ease;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 72px;
  height: 72px;
  padding: 0;
  background: linear-gradient(135deg, #f7e7c1, #e0c28c);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.28);
  border: 1px solid rgba(255,255,255,0.55);
}

/* Effet hover bouton */
#openChatBtn:hover {
  box-shadow: 0 0 14px rgba(255,225,170,0.75),
              0 8px 20px rgba(0,0,0,0.32);
  transform: scale(1.06);
}

/* Fenêtre du chatbot */
#chatWindow {
  width: 380px;
  height: 75vh;
  max-height: 600px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 0 18px rgba(0,0,0,0.15);
  position: fixed;
  bottom: 90px;
  right: 20px;
  display: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* HEADER */
#chatHeader {
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 15px;
}

#chatHeader img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
}

#chatHeader h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

/* Messages */
#chatBody {
  -webkit-overflow-scrolling: touch;
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fafafa;
}

.msg {
  max-width: 80%;
  padding: 10px 14px;
  margin-bottom: 12px;
  border-radius: 14px;
  line-height: 1.4;
  font-size: 15px;
}

.botMsg {
  margin-right: auto !important;
  background: linear-gradient(135deg, #f9f5ef 0%, #e7d9c9 40%, #d6c4b1 100%);
  align-self: flex-start;
  position: relative;
  padding: 20px 22px;
  margin-left: 0;
  border-radius: 28px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.65);
  backdrop-filter: blur(5px);
  z-index: 1;
}

.userMsg {
  margin-left: auto !important;
  background: linear-gradient(135deg, #5a4a3d, #3e332a) !important;
  color: #f7f2e9 !important;
  align-self: flex-end;
  padding: 16px 20px;
  border-radius: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.32);
  border: 1px solid rgba(255,255,255,0.12);
  font-weight: 500;
}

/* Typing */
#typing {
  display: none;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

#typing .dot {
  width: 8px;
  height: 8px;
  background: #888;
  border-radius: 50%;
  animation: blink 1.4s infinite;
}

#typing .dot:nth-child(2) { animation-delay: 0.2s; }
#typing .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* Footer */
#chatFooter {
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.whatsappBtns {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.waBtn {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: #3b2f1a;
  background: linear-gradient(135deg, #f7e7c1, #e0c28c);
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.4);
}

/* Input */
#inputZone {
  display: flex;
  gap: 8px;
}

#userInput {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid rgba(214, 190, 150, 0.6);
  border-radius: 18px;
  font-size: 15px;
  background: linear-gradient(135deg, #fdf8f1, #f5e8d5);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
  color: #5a4a33;
}

#sendBtn {
  padding: 14px 18px;
  background: linear-gradient(135deg, #e0c28c, #d4b27a);
  color: #4a3a23;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0,0,0,0.18),
              inset 0 1px 4px rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.5);
  transition: all 0.2s ease;
}

#sendBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.25),
              inset 0 1px 4px rgba(255,255,255,0.8);
}

/* Accueil animation */
#chatBody .botMsg:first-child {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 70%;
  animation: welcomeFade 0.9s ease-out,
             welcomeGlow 1.4s ease-out;
}

@keyframes welcomeGlow {
  0% { box-shadow: 0 0 0 rgba(255,215,160,0); }
  40% { box-shadow: 0 0 18px rgba(255,215,160,0.55); }
  100%{ box-shadow: 0 0 0 rgba(255,215,160,0); }
}

@keyframes welcomeFade {
  0% { opacity: 0; transform: translateY(10px) scale(0.98); }
  60%{ opacity: 1; transform: translateY(0px) scale(1.01); }
  100%{ opacity: 1; transform: translateY(0) scale(1); }
}
`;

/* Inject CSS */
const style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

/* HTML to inject */
const html = `
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
       border-radius:18px 18px 0 0;
       box-shadow: inset 0 2px 6px rgba(255,255,255,0.4),
                   inset 0 -2px 8px rgba(0,0,0,0.25);">
       
    <img src="https://soloatico.es/bot2026/images/avatar.png"
         alt="Avatar"
         style="width:55px;height:55px;object-fit:contain;
         filter: drop-shadow(0px 0px 6px rgba(0,0,0,0.6));" />

    <h2 style="color:#fff;font-size:22px;font-weight:700;
               text-shadow:0 0 14px rgba(0,0,0,0.95); margin:0;">
      Solo'IA'tico Assistant
    </h2>
  </div>

  <div id="chatBody">
    <div class="msg botMsg">
      <b>👋 Bonjour et bienvenue !</b><br>
      Je suis Solo’IA’tico Assistant.<br>
      Posez-moi vos questions concernant :<br>

      <ul class="luxList">
        <li>Suites & Réservation</li>
        <li>Bateau Tintorera</li>
        <li>Reiki & Bien-être</li>
        <li>Que faire à L’Escala</li>
      </ul>

      <br><b>Comment puis-je vous aider ?</b>
    </div>

    <div id="typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>

  <div id="chatFooter">
    <div class="whatsappBtns">
      <div class="waBtn">
        <img src="https://soloatico.es/bot2026/images/whatsapp_solo.png"
             style="width:20px;height:20px;vertical-align:middle;" />
        Laurent
      </div>

      <div class="waBtn">
        <img src="https://soloatico.es/bot2026/images/whatsapp_solo.png"
             style="width:20px;height:20px;vertical-align:middle;" />
        Sophia
      </div>
    </div>

    <div id="inputZone">
      <input type="text" id="userInput" placeholder="Écrire un message..." />
      <div id="sendBtn">Envoyer</div>
    </div>
  </div>
</div>
`;

const wrapper = document.createElement("div");
wrapper.innerHTML = html;
document.body.appendChild(wrapper);

/* Script */
const openBtn = document.getElementById("openChatBtn");
const chatWin = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const bodyEl = document.getElementById("chatBody");
const typing = document.getElementById("typing");

openBtn.onclick = () => {
  chatWin.style.display = "flex";
};

sendBtn.onclick = () => sendMessage();
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

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
