/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.8 — CORS SAFE / SUITES FIRST
 * BASE 1.6.9.6 RESPECTÉE
 ****************************************************/

(function () {

  // 🔐 TOUJOURS le domaine de la page
  const BASE_PATH = window.location.origin;

  console.log("Solo’IA’tico Chatbot — BASE PATH =", BASE_PATH);

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${BASE_PATH}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("chatWindow")) {
      try {
        const html = await fetch(`${BASE_PATH}/chatbot/chatbot.html`).then(r => {
          if (!r.ok) throw "HTML introuvable";
          return r.text();
        });
        document.body.insertAdjacentHTML("beforeend", html);
      } catch (e) {
        console.error("❌ chatbot.html introuvable sur le site", e);
        return;
      }
    }

    /* ===== DOM ===== */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ Chatbot DOM incomplet");
      return;
    }

    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    /* ===== NLP ===== */
    const norm = t =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function intent(t) {
      // 🥇 Suites = priorité absolue
      if (/suite|chambre|room|hotel|logement|nuit|prix|price|reser/.test(t))
        return "suites";

      if (/bateau|boat|tintorera/.test(t)) return "tintorera";
      if (/reiki/.test(t)) return "reiki";
      if (/piscine|pool/.test(t)) return "piscine";

      // fallback hôtelier
      if (t.length < 4 || /bonjour|hello|hola|info/.test(t))
        return "suites";

      return null;
    }

    /* ===== KB (SAME ORIGIN — SAFE) ===== */
    async function loadKB(file) {
      const r = await fetch(`${BASE_PATH}/kb/fr/${file}`);
      if (!r.ok) throw "KB introuvable";
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1].trim()
      };
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const t = norm(raw);
      const i = intent(t);

      try {

        if (i === "suites") {
          const kb = parseKB(await loadKB("02_suites/suites.txt"));
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">
              ✨ <b>Avec plaisir</b><br><br>
              <b>${kb.short}</b>
            </div>`);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">
            Je peux vous aider à découvrir nos <b>suites</b>.
          </div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">
            ⚠️ Les informations sont temporairement indisponibles.<br>
            Souhaitez-vous découvrir nos <b>suites</b> ?
          </div>`);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

  });

})();
