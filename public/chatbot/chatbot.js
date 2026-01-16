/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.7 — SUITES FIRST (CORS FIX)
 * BASE 1.6.9.6 STRICTE
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.6.9.7 — CORS FIX");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
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

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ===== NLP ===== */
    const norm = t =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function intent(t) {
      if (/suite|chambre|room|hotel|logement|dorm|nuit|sejour|prix|price|reser/.test(t))
        return "suites";
      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";
      if (t.length < 4 || /bonjour|hello|hola|info/.test(t))
        return "suites";
      return null;
    }

    /* ===== KB (RELATIVE — NO CORS) ===== */
    async function loadKB(lang, file) {
      let r = await fetch(`/kb/${lang}/${file}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`/kb/fr/${file}`);
      }
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
          const kb = parseKB(await loadKB("fr", "02_suites/suites.txt"));
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">
              ✨ <b>Avec plaisir</b><br><br>
              <b>${kb.short}</b>
            </div>`);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        const file =
          i === "tintorera" ? "03_services/tintorera-bateau.txt" :
          i === "reiki"     ? "03_services/reiki.txt" :
          "03_services/piscine-rooftop.txt";

        const kb = parseKB(await loadKB("fr", file));
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg"><b>${kb.short}</b></div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">
            ⚠️ Contenu en cours de mise à jour.<br>
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
