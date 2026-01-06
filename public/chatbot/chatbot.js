/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.8.2 — FREEZE FINAL UX
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const LANG_KEY = "soloia_lang_manual";
  const CAT_FLAG = "https://impro.usercontent.one/appid/oneComWsb/domain/soloatico.es/media/soloatico.es/onewebmedia/Flag_of_Catalonia.svg.png?etag=%221f1-650def4e%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=54%2B36";

  console.log("Solo’IA’tico Chatbot v1.6.8.2 — FINAL UX");

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
    const typing  = document.getElementById("typing");

    /* ================= OPEN / CLOSE ================= */
    let isOpen = false;
    chatWin.style.display = "none";

    function injectWelcome(lang) {
      const old = chatWin.querySelector(".welcomeMsg");
      if (old) old.remove();

      const welcome = document.createElement("div");
      welcome.className = "msg botMsg welcomeMsg";
      welcome.innerHTML = WELCOME[lang] || WELCOME.fr;
      bodyEl.prepend(welcome);
    }

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";

      if (isOpen && !chatWin.dataset.welcomed) {
        injectWelcome("fr"); // 👈 toujours FR au départ
        chatWin.dataset.welcomed = "1";
      }
    };

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ================= WHATSAPP ================= */
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ================= LANG ================= */
    function detectLangFromMessage(t) {
      if (/\b(is er|zwembad|boot)\b/.test(t)) return "nl";
      if (/\b(what|how|is|are|pool|boat)\b/.test(t)) return "en";
      if (/\b(piscina|barco)\b/.test(t)) return "es";
      if (/\b(piscina|vaixell)\b/.test(t)) return "ca";
      return null;
    }

    function resolveLang(t) {
      return detectLangFromMessage(t) ||
             localStorage.getItem(LANG_KEY) ||
             "fr";
    }

    /* ================= LANG SELECTOR ================= */
    const langBar = document.createElement("div");
    langBar.className = "soloia-langbar";
    langBar.style.cssText = `
      display:flex;
      justify-content:center;
      gap:10px;
      padding:6px 0;
      border-bottom:1px solid rgba(255,255,255,.12);
    `;

    langBar.innerHTML = `
      <button data-lang="fr">🇫🇷</button>
      <button data-lang="es">🇪🇸</button>
      <button data-lang="en">🇬🇧</button>
      <button data-lang="ca"><img src="${CAT_FLAG}" style="height:18px"></button>
      <button data-lang="nl">🇳🇱</button>
    `;

    langBar.querySelectorAll("button").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        localStorage.setItem(LANG_KEY, lang);
        injectWelcome(lang); // 👈 update accueil immédiatement
      };
    });

    chatWin.prepend(langBar);

    /* ================= UI TEXT ================= */
    const UI = {
      fr:{ more:"Voir la description complète", clarify:"Pouvez-vous préciser votre demande ? 😊",
        bookBoat:"⛵ Réserver la sortie Tintorera",
        bookReiki:"🧘‍♀️ Réserver une séance Reiki",
        bookSuite:"🏨 Réserver cette suite"},
      en:{ more:"View full description", clarify:"Could you please clarify your request? 😊",
        bookBoat:"⛵ Book the Tintorera boat trip",
        bookReiki:"🧘‍♀️ Book a Reiki session",
        bookSuite:"🏨 Book this suite"},
      es:{ more:"Ver la descripción completa", clarify:"¿Podría precisar su solicitud? 😊",
        bookBoat:"⛵ Reservar salida Tintorera",
        bookReiki:"🧘‍♀️ Reservar sesión de Reiki",
        bookSuite:"🏨 Reservar esta suite"},
      ca:{ more:"Veure la descripció completa", clarify:"Podeu precisar la vostra sol·licitud? 😊",
        bookBoat:"⛵ Reservar sortida Tintorera",
        bookReiki:"🧘‍♀️ Reservar sessió de Reiki",
        bookSuite:"🏨 Reservar aquesta suite"},
      nl:{ more:"Volledige beschrijving bekijken", clarify:"Kunt u uw vraag verduidelijken? 😊",
        bookBoat:"⛵ Tintorera boottocht boeken",
        bookReiki:"🧘‍♀️ Reiki-sessie boeken",
        bookSuite:"🏨 Deze suite reserveren"}
    };

    /* ================= WELCOME ================= */
    const WELCOME = {
      fr:`👋 <b>Bonjour et bienvenue !</b><br>Je suis <b>Solo’IA’tico Assistant</b>.<br><br>
          Posez-moi vos questions concernant :<br>
          • Suites & Réservation<br>
          • Bateau Tintorera<br>
          • Reiki & Bien-être<br>
          • Que faire à L’Escala<br><br>
          <b>Comment puis-je vous aider ?</b>`,
      en:`👋 <b>Hello and welcome!</b><br>I’m <b>Solo’IA’tico Assistant</b>.<br><br>
          You can ask me about:<br>
          • Suites & Booking<br>
          • Tintorera Boat<br>
          • Reiki & Wellness<br>
          • Things to do in L’Escala<br><br>
          <b>How can I help you?</b>`,
      es:`👋 <b>¡Hola y bienvenido!</b><br>Soy <b>Solo’IA’tico Assistant</b>.<br><br>
          Puedes preguntarme sobre:<br>
          • Suites y Reservas<br>
          • Barco Tintorera<br>
          • Reiki y Bienestar<br>
          • Qué hacer en L’Escala<br><br>
          <b>¿En qué puedo ayudarte?</b>`,
      ca:`👋 <b>Hola i benvingut!</b><br>Sóc <b>Solo’IA’tico Assistant</b>.<br><br>
          Em pots preguntar sobre:<br>
          • Suites i Reserves<br>
          • Vaixell Tintorera<br>
          • Reiki i Benestar<br>
          • Què fer a L’Escala<br><br>
          <b>Com et puc ajudar?</b>`,
      nl:`👋 <b>Hallo en welkom!</b><br>Ik ben <b>Solo’IA’tico Assistant</b>.<br><br>
          Je kunt mij vragen stellen over:<br>
          • Suites & Reserveren<br>
          • Tintorera boottocht<br>
          • Reiki & Welzijn<br>
          • Wat te doen in L’Escala<br><br>
          <b>Waarmee kan ik je helpen?</b>`
    };

    /* ================= SEND (inchangé) ================= */
    function norm(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }

    function route(t){
      if(/bateau|tintorera|boat/.test(t)) return "tintorera";
      if(/reiki|riki/.test(t)) return "reiki";
      if(/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    function parseKB(txt){
      const s=txt.match(/SHORT:\s*([\s\S]*?)\n/i);
      const l=txt.match(/LONG:\s*([\s\S]*)/i);
      return {short:s?.[1]||"",long:l?.[1]||""};
    }

    async function loadKB(lang,path){
      let r=await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if(!r.ok) r=await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      return parseKB(await r.text());
    }

    function render(lang,kb,btn){
      const b=document.createElement("div");
      b.className="msg botMsg";
      b.innerHTML=`<div class="kbShort">${kb.short}</div>`;
      if(kb.long){
        const m=document.createElement("button");
        m.className="kbMoreBtn";
        m.textContent=UI[lang].more;
        m.onclick=()=>{b.innerHTML+=`<div class="kbLong">${kb.long}</div>`;m.remove();};
        b.appendChild(m);
      }
      if(btn) b.appendChild(btn);
      bodyEl.appendChild(b);
    }

    async function sendMessage(){
      if(!input.value) return;
      const raw=input.value; input.value="";
      bodyEl.innerHTML+=`<div class="msg userMsg">${raw}</div>`;
      const t=norm(raw);
      const lang=resolveLang(t);
      const r=route(t);

      if(r==="tintorera"){
        render(lang,await loadKB(lang,"03_services/tintorera-bateau.txt"),
          (()=>{const a=document.createElement("a");a.href="https://koalendar.com/e/tintorera";a.target="_blank";a.className="kbBookBtn";a.textContent=UI[lang].bookBoat;return a;})());
      } else if(r==="reiki"){
        render(lang,await loadKB(lang,"03_services/reiki.txt"),
          (()=>{const a=document.createElement("a");a.href="https://koalendar.com/e/soloatico-reiki";a.target="_blank";a.className="kbBookBtn";a.textContent=UI[lang].bookReiki;return a;})());
      } else {
        bodyEl.innerHTML+=`<div class="msg botMsg">${UI[lang].clarify}</div>`;
      }
    }

    sendBtn.onclick=e=>{e.preventDefault();sendMessage();};
    input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();sendMessage();}};
  });

})();
