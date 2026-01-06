/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.2 — STABLE (NO JS WELCOME)
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.2 — STABLE");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(async function () {

    /* ================= CSS ================= */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ================= HTML ================= */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ================= DOM ================= */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    /* ================= LANG ================= */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLangFromMessage(t) {
      if (/\b(is er|zwembad|boot)\b/.test(t)) return "nl";
      if (/\b(what|how|is|are|pool|boat)\b/.test(t)) return "en";
      if (/\b(piscina|barco)\b/.test(t)) return "es";
      if (/\b(piscina|vaixell)\b/.test(t)) return "ca";
      return null;
    }

    function resolveLang(t="") {
      return detectLangFromMessage(t) || pageLang() || "fr";
    }

    /* ================= ROUTER ================= */
    function norm(t){
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    function route(t){
      if(/bateau|tintorera|boat/.test(t)) return "tintorera";
      if(/reiki|riki/.test(t)) return "reiki";
      if(/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    /* ================= KB ================= */
    async function loadKB(lang, path){
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if(!r.ok && lang !== "fr"){
        r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if(!r.ok) throw new Error("KB introuvable");
      return await r.text();
    }

    function parseKB(text){
      const s = text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const l = text.match(/LONG:\s*([\s\S]*)/i);
      return {
        short: s?.[1]?.trim() || "",
        long: l?.[1]?.trim() || ""
      };
    }

    /* ================= SEND ================= */
    async function sendMessage(){
      if(!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const t = norm(raw);
      const lang = resolveLang(t);
      const intent = route(t);

      try {
        if(intent === "tintorera"){
          const kb = parseKB(await loadKB(lang,"03_services/tintorera-bateau.txt"));
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg"><b>${kb.short}</b><br><br>${kb.long}</div>`);
        }
        else if(intent === "reiki"){
          const kb = parseKB(await loadKB(lang,"03_services/reiki.txt"));
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg"><b>${kb.short}</b><br><br>${kb.long}</div>`);
        }
        else if(intent === "piscine"){
          const kb = parseKB(await loadKB(lang,"03_services/piscine-rooftop.txt"));
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg"><b>${kb.short}</b><br><br>${kb.long}</div>`);
        }
        else {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);
        }
      } catch(e){
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">❌ Une erreur est survenue.</div>`);
      }
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => {
      if(e.key === "Enter"){
        e.preventDefault();
        sendMessage();
      }
    };

  });

})();
