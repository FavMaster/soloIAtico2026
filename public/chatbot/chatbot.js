/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.8.4 — WELCOME = PAGE LANG
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const LANG_KEY = "soloia_lang_manual";
  const CAT_FLAG = "https://impro.usercontent.one/appid/oneComWsb/domain/soloatico.es/media/soloatico.es/onewebmedia/Flag_of_Catalonia.svg.png?etag=%221f1-650def4e%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=54%2B36";

  console.log("Solo’IA’tico Chatbot v1.6.8.4");

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

    function resolveLangFromMessage(t) {
      if (/\b(is er|zwembad|boot)\b/.test(t)) return "nl";
      if (/\b(what|how|is|are|pool|boat)\b/.test(t)) return "en";
      if (/\b(piscina|barco)\b/.test(t)) return "es";
      if (/\b(piscina|vaixell)\b/.test(t)) return "ca";
      return null;
    }

    function resolveLang(t="") {
      return (
        resolveLangFromMessage(t) ||
        localStorage.getItem(LANG_KEY) ||
        pageLang() ||
        "fr"
      );
    }

    /* ================= WELCOME ================= */
    const WELCOME = {
      fr:`👋 <b>Bonjour et bienvenue !</b><br>
          Je suis <b>Solo’IA’tico Assistant</b>.<br><br>
          Posez-moi vos questions concernant :<br>
          • Suites & Réservation<br>
          • Bateau Tintorera<br>
          • Reiki & Bien-être<br>
          • Que faire à L’Escala<br><br>
          <b>Comment puis-je vous aider ?</b>`,

      en:`👋 <b>Hello and welcome!</b><br>
          I’m <b>Solo’IA’tico Assistant</b>.<br><br>
          You can ask me about:<br>
          • Suites & Booking<br>
          • Tintorera Boat<br>
          • Reiki & Wellness<br>
          • Things to do in L’Escala<br><br>
          <b>How can I help you?</b>`,

      es:`👋 <b>¡Hola y bienvenido!</b><br>
          Soy <b>Solo’IA’tico Assistant</b>.<br><br>
          Puedes preguntarme sobre:<br>
          • Suites y Reservas<br>
          • Barco Tintorera<br>
          • Reiki y Bienestar<br>
          • Qué hacer en L’Escala<br><br>
          <b>¿En qué puedo ayudarte?</b>`,

      ca:`👋 <b>Hola i benvingut!</b><br>
          Sóc <b>Solo’IA’tico Assistant</b>.<br><br>
          Em pots preguntar sobre:<br>
          • Suites i Reserves<br>
          • Vaixell Tintorera<br>
          • Reiki i Benestar<br>
          • Què fer a L’Escala<br><br>
          <b>Com et puc ajudar?</b>`,

      nl:`👋 <b>Hallo en welkom!</b><br>
          Ik ben <b>Solo’IA’tico Assistant</b>.<br><br>
          Je kunt mij vragen stellen over:<br>
          • Suites & Reserveren<br>
          • Tintorera boottocht<br>
          • Reiki & Welzijn<br>
          • Wat te doen in L’Escala<br><br>
          <b>Waarmee kan ik je helpen?</b>`
    };

    function showWelcome(lang) {
      chatWin.querySelectorAll(".welcomeMsg").forEach(el => el.remove());
      const w = document.createElement("div");
      w.className = "msg botMsg welcomeMsg";
      w.innerHTML = WELCOME[lang] || WELCOME.fr;
      bodyEl.prepend(w);
    }

    /* ================= OPEN ================= */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";

      if (isOpen && !chatWin.dataset.welcomed) {
        showWelcome(resolveLang());
        chatWin.dataset.welcomed = "1";
      }
    };

    /* ================= LANG SELECTOR ================= */
    const langBar = document.createElement("div");
    langBar.className = "soloia-langbar";
    langBar.style.cssText = `
      display:flex;
      justify-content:center;
      gap:12px;
      padding:6px 0;
      border-bottom:1px solid rgba(255,255,255,.12);
    `;

    langBar.innerHTML = `
      <button data-lang="fr">🇫🇷</button>
      <button data-lang="es">🇪🇸</button>
      <button data-lang="en">🇬🇧</button>
      <button data-lang="ca"><img src="${CAT_FLAG}" style="height:16px"></button>
      <button data-lang="nl">🇳🇱</button>
    `;

    langBar.querySelectorAll("button").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        localStorage.setItem(LANG_KEY, lang);
        showWelcome(lang);
      };
    });

    chatWin.prepend(langBar);

    /* ================= SEND (inchangé) ================= */
    function norm(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }

    function route(t){
      if(/bateau|tintorera|boat/.test(t)) return "tintorera";
      if(/reiki|riki/.test(t)) return "reiki";
      if(/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    async function sendMessage(){
      if(!input.value.trim()) return;
      const raw=input.value; input.value="";
      bodyEl.insertAdjacentHTML("beforeend",`<div class="msg userMsg">${raw}</div>`);

      const lang = resolveLang(norm(raw));
      const r = route(norm(raw));

      if(!r){
        bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">${WELCOME[lang] ? "" : ""}</div>`);
      }
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => { if (e.key==="Enter"){ e.preventDefault(); sendMessage(); } };

  });

})();
