/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.7 — PATH SAFE (DOMAINE ACTUEL)
 ****************************************************/

(function () {

  const SCRIPT_URL = document.currentScript?.src || "";
  const BASE_PATH = SCRIPT_URL.split("/chatbot/")[0] || "";

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
          if (!r.ok) throw "HTML 404";
          return r.text();
        });
        document.body.insertAdjacentHTML("beforeend", html);
      } catch (e) {
        console.error("❌ Impossible de charger chatbot.html", e);
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

    openBtn.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    };

    /* ===== NLP SIMPLE ===== */
    const norm = t =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function intent(t) {
      if (/suite|chambre|room|hotel|logement|nuit|prix|reser/.test(t))
        return "suites";
      if (/bateau|boat|tintorera/.test(t)) return "tintorera";
      if (/reiki/.test(t)) return "reiki";
      if (/piscine|pool/.test(t)) return "piscine";
      if (t.length < 4) return "suites";
      return null;
    }

    /* ===== KB ===== */
    async function loadKB(file) {
      const r = await fetch(`${BASE_PATH}/kb/fr/${file}`);
      if (!r.ok) throw "KB 404";
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
              ✨ <b>Bienvenue chez Solo’Atico</b><br><br>
              <b>${kb.short}</b>
            </div>`);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">Je peux vous aider avec nos suites.</div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">⚠️ Contenu temporairement indisponible.</div>`);
      }
    }

    sendBtn.onclick = sendMessage;
    input.onkeydown = e => {
      if (e.key === "Enter") sendMessage();
    };

  });

})();
