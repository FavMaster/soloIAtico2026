/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.8.1 — FREEZE OFFICIEL
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const LANG_KEY = "soloia_lang_manual";

  console.log("Solo’IA’tico Chatbot v1.6.8.1 — FREEZE");

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

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";

      // Welcome message (once)
      if (isOpen && !chatWin.dataset.welcomed) {
        const lang = resolveLang("");
        const welcome = document.createElement("div");
        welcome.className = "msg botMsg welcomeMsg";
        welcome.innerHTML = WELCOME[lang] || WELCOME.fr;
        bodyEl.appendChild(welcome);
        bodyEl.scrollTop = bodyEl.scrollHeight;
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
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) waLaurent.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    };

    if (waSophia) waSophia.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    };

    /* ================= LANG LOGIC ================= */
    function detectLangFromMessage(t) {
      if (/\b(is er|zwembad|boot)\b/.test(t)) return "nl";
      if (/\b(what|how|is|are|pool|boat)\b/.test(t)) return "en";
      if (/\b(piscina|barco)\b/.test(t)) return "es";
      if (/\b(piscina|vaixell)\b/.test(t)) return "ca";
      return null;
    }

    function getManualLang() {
      return localStorage.getItem(LANG_KEY);
    }

    function setManualLang(lang) {
      localStorage.setItem(LANG_KEY, lang);
    }

    function resolveLang(messageNorm) {
      return (
        detectLangFromMessage(messageNorm) ||
        getManualLang() ||
        document.documentElement.lang?.slice(0,2) ||
        "fr"
      );
    }

    /* ================= LANG SELECTOR (FLAGS) ================= */
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
      <button data-lang="fr" title="Français">🇫🇷</button>
      <button data-lang="es" title="Español">🇪🇸</button>
      <button data-lang="en" title="English">🇬🇧</button>
      <button data-lang="ca" title="Català">🇨🇦</button>
      <button data-lang="nl" title="Nederlands">🇳🇱</button>
    `;
    langBar.querySelectorAll("button").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        setManualLang(btn.dataset.lang);
      };
    });
    chatWin.prepend(langBar);

    /* ================= UI TEXT ================= */
    const UI = {
      fr:{ more:"Voir la description complète", clarify:"Pouvez-vous préciser votre demande ? 😊",
        bookBoat:"⛵ Réserver la sortie Tintorera",
        bookReiki:"🧘‍♀️ Réserver une séance Reiki",
        bookSuite:"🏨 Réserver cette suite",
        listSuites:"Nous proposons trois hébergements :<br>• Suite Neus<br>• Suite Bourlardes<br>• Chambre Blue Patio"},
      en:{ more:"View full description", clarify:"Could you please clarify your request? 😊",
        bookBoat:"⛵ Book the Tintorera boat trip",
        bookReiki:"🧘‍♀️ Book a Reiki session",
        bookSuite:"🏨 Book this suite",
        listSuites:"We offer three accommodations:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio Room"},
      es:{ more:"Ver la descripción completa", clarify:"¿Podría precisar su solicitud? 😊",
        bookBoat:"⛵ Reservar salida Tintorera",
        bookReiki:"🧘‍♀️ Reservar sesión de Reiki",
        bookSuite:"🏨 Reservar esta suite",
        listSuites:"Ofrecemos tres alojamientos:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitación Blue Patio"},
      ca:{ more:"Veure la descripció completa", clarify:"Podeu precisar la vostra sol·licitud? 😊",
        bookBoat:"⛵ Reservar sortida Tintorera",
        bookReiki:"🧘‍♀️ Reservar sessió de Reiki",
        bookSuite:"🏨 Reservar aquesta suite",
        listSuites:"Oferim tres allotjaments:<br>• Suite Neus<br>• Suite Bourlardes<br>• Habitació Blue Patio"},
      nl:{ more:"Volledige beschrijving bekijken", clarify:"Kunt u uw vraag verduidelijken? 😊",
        bookBoat:"⛵ Tintorera boottocht boeken",
        bookReiki:"🧘‍♀️ Reiki-sessie boeken",
        bookSuite:"🏨 Deze suite reserveren",
        listSuites:"Wij bieden drie accommodaties:<br>• Suite Neus<br>• Suite Bourlardes<br>• Blue Patio kamer"}
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

    /* ================= KB HELPERS ================= */
    function parseKB(text){
      const s=text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const l=text.match(/LONG:\s*([\s\S]*)/i);
      return {short:s?.[1]?.trim()||"",long:l?.[1]?.trim()||""};
    }

    async function loadKB(lang,path){
      let r=await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if(!r.ok&&lang!=="fr") r=await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      if(!r.ok) throw Error();
      return parseKB(await r.text());
    }

    /* ================= NLP ================= */
    function norm(t){
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    function route(t){
      if(/bateau|tintorera|boat/.test(t)) return "tintorera";
      if(/reiki|riki/.test(t)) return "reiki";
      if(/piscine|pool|zwembad/.test(t)) return "piscine";
      if(/petit|breakfast|ontbijt/.test(t)) return "petitdej";
      if(/escala|what to do|doen/.test(t)) return "escala";
      if(/neus/.test(t)) return "suite-neus";
      if(/bourlard/.test(t)) return "suite-bourlardes";
      if(/blue|patio/.test(t)) return "room-blue-patio";
      if(/suite|chambre|room/.test(t)) return "suite-list";
      return null;
    }

    function booking(label,url){
      const a=document.createElement("a");
      a.href=url; a.target="_blank";
      a.className="kbBookBtn";
      a.textContent=label;
      a.onclick=e=>e.stopPropagation();
      return a;
    }

    function render(lang,kb,btn=null){
      const b=document.createElement("div");
      b.className="msg botMsg";
      b.innerHTML=`<div class="kbShort">${kb.short}</div>`;
      const l=document.createElement("div");
      l.className="kbLong"; l.style.display="none";
      l.innerHTML=kb.long.replace(/\n/g,"<br>");
      b.appendChild(l);
      if(kb.long){
        const m=document.createElement("button");
        m.className="kbMoreBtn"; m.textContent=UI[lang].more;
        m.onclick=e=>{e.stopPropagation();l.style.display="block";m.remove();};
        b.appendChild(m);
      }
      if(btn) b.appendChild(btn);
      bodyEl.appendChild(b);
      bodyEl.scrollTop=bodyEl.scrollHeight;
    }

    /* ================= SEND ================= */
    async function sendMessage(){
      if(!input.value.trim()) return;
      const raw=input.value; input.value="";
      bodyEl.insertAdjacentHTML("beforeend",`<div class="msg userMsg">${raw}</div>`);
      typing.style.display="flex";

      const t=norm(raw);
      const lang=resolveLang(t);
      const r=route(t);

      try{
        if(r==="tintorera") render(lang,await loadKB(lang,"03_services/tintorera-bateau.txt"),
          booking(UI[lang].bookBoat,"https://koalendar.com/e/tintorera"));
        else if(r==="reiki") render(lang,await loadKB(lang,"03_services/reiki.txt"),
          booking(UI[lang].bookReiki,"https://koalendar.com/e/soloatico-reiki"));
        else if(r==="piscine") render(lang,await loadKB(lang,"03_services/piscine-rooftop.txt"));
        else if(r==="petitdej") render(lang,await loadKB(lang,"03_services/petit-dejeuner.txt"));
        else if(r==="escala") render(lang,await loadKB(lang,"04_que-faire/que-faire-escala.txt"));
        else if(r==="suite-list")
          bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">${UI[lang].listSuites}</div>`);
        else if(r?.startsWith("suite"))
          render(lang,await loadKB(lang,`02_suites/${r}.txt`),
            booking(UI[lang].bookSuite,`https://soloatico.amenitiz.io/${lang}/booking/room`));
        else
          bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">${UI[lang].clarify}</div>`);
      }catch{
        bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">${UI[lang].clarify}</div>`);
      }

      typing.style.display="none";
    }

    sendBtn.onclick=e=>{e.preventDefault();sendMessage();};
    input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();sendMessage();}};
  });

})();
