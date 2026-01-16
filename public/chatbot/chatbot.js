/* =========================================================
   SOLO'IA'TICO — CHATBOT LUXE
   Livraison v1 — Suites INTENT N°1 + Concierge IA (safe)
   Compatible HTML/CSS existants
   ========================================================= */

(function () {
  /* -----------------------------
     CONFIG
  ----------------------------- */
  const KB_BASE = "/kb";                 // /kb/{lang}/{path}.txt
  const LANGS = ["fr", "en", "es", "ca", "nl"];
  let currentLang = "fr";

  // Activer / désactiver l’embellissement concierge
  const CONCIERGE_AI_ENABLED = true;

  /* -----------------------------
     DOM
  ----------------------------- */
  const openBtn   = document.getElementById("openChatBtn");
  const chatWin   = document.getElementById("chatWindow");
  const chatBody  = document.getElementById("chatBody");
  const input     = document.getElementById("userInput");
  const sendBtn   = document.getElementById("sendBtn");
  const typingEl  = document.getElementById("typing");

  /* -----------------------------
     UI
  ----------------------------- */
  openBtn.onclick = () => {
    chatWin.style.display = (chatWin.style.display === "flex") ? "none" : "flex";
  };
  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

  function addMsg(html, cls="botMsg") {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = html;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function typing(show){ typingEl.style.display = show ? "flex" : "none"; }

  /* -----------------------------
     UTILS
  ----------------------------- */
  const norm = s => (s||"").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");

  function detectLangFromText(t){
    const s = norm(t);
    if (/(què|activitats|visites|habitació)/.test(s)) return "ca";
    if (/(que hacer|actividades|habitacion)/.test(s)) return "es";
    if (/(wat te doen|activiteiten|kamer)/.test(s)) return "nl";
    if (/(what to do|activities|room)/.test(s)) return "en";
    return currentLang;
  }

  /* -----------------------------
     CONCIERGE AI (SAFE)
     - Embellit sans inventer
     - Pas d’API externe
  ----------------------------- */
  function conciergeEmbellish(text){
    if (!CONCIERGE_AI_ENABLED) return text;
    const openings = {
      fr: ["Avec plaisir.", "Bien sûr.", "Voici ce que je vous propose."],
      en: ["With pleasure.", "Of course.", "Here’s what I suggest."],
      es: ["Con gusto.", "Por supuesto.", "Esto es lo que le propongo."],
      ca: ["Amb molt de gust.", "És clar.", "Això és el que li proposo."],
      nl: ["Graag.", "Zeker.", "Dit stel ik voor."]
    };
    const closings = {
      fr: ["Souhaitez-vous en savoir plus ?", "Je suis là si vous le souhaitez."],
      en: ["Would you like to know more?", "I’m here if you need."],
      es: ["¿Desea saber más?", "Estoy aquí si lo desea."],
      ca: ["Vol saber-ne més?", "Sóc aquí si ho necessita."],
      nl: ["Wilt u meer weten?", "Ik ben er als u wilt."]
    };
    const o = openings[currentLang] || openings.fr;
    const c = closings[currentLang] || closings.fr;
    return `<b>${o[Math.floor(Math.random()*o.length)]}</b><br>${text}<br><i>${c[Math.floor(Math.random()*c.length)]}</i>`;
  }

  /* -----------------------------
     HARD INTENTS (toujours OK)
  ----------------------------- */
  function hardIntents(msg){
    if (/(bateau|boat|barco)/.test(msg)){
      addMsg(conciergeEmbellish("⛵ <b>Bateau Tintorera</b><br>Sortie en mer exclusive, moments inoubliables."));
      return true;
    }
    if (/(reiki|massage|bien[- ]?etre)/.test(msg)){
      addMsg(conciergeEmbellish("🌿 <b>Reiki & Bien-être</b><br>Un instant de détente profonde, sur mesure."));
      return true;
    }
    if (/(piscine|pool|rooftop)/.test(msg)){
      addMsg(conciergeEmbellish("🏊 <b>Piscine Rooftop</b><br>Vue agréable et atmosphère relaxante."));
      return true;
    }
    return false;
  }

  /* -----------------------------
     SUITES — INTENT N°1 + FILET
  ----------------------------- */
  const SUITES_KEYWORDS = {
    fr: ["suite","chambre","logement","hotel","dorm","nuit","séjour","reser","prix"],
    en: ["suite","room","hotel","stay","night","book","price"],
    es: ["suite","habitacion","hotel","estancia","noche","reserv","precio"],
    ca: ["suite","habitació","hotel","estada","nit","reserv","preu"],
    nl: ["suite","kamer","hotel","verblijf","nacht","boek","prijs"]
  };

  function detectSuites(msg){
    const keys = SUITES_KEYWORDS[currentLang] || [];
    return keys.some(k => msg.includes(k)) || msg.length < 6; // filet si flou
  }

  async function loadKB(path){
    const url = `${KB_BASE}/${currentLang}/${path}.txt`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("KB missing");
    return r.text();
  }
  function parseKB(t){
    const s = (t.split("SHORT:")[1]||"").split("LONG:")[0].trim();
    const l = (t.split("LONG:")[1]||"").trim();
    return { short:s, long:l };
  }

  async function showSuitesList(){
    // Liste guidée (exemples — adapte les chemins selon ta KB)
    const items = [
      {label:"Suite Neus", path:"02_suites/suite-neus"},
      {label:"Suite Bourlardes", path:"02_suites/suite-bourlardes"},
      {label:"Blue Patio", path:"02_suites/room-blue-patio"}
    ];
    let html = `<b>🏨 Nos suites</b><ul class="luxList">`;
    items.forEach((it,i)=>{
      html += `<li><button class="kbBookBtn" data-i="${i}">${it.label}</button></li>`;
    });
    html += `</ul>`;
    addMsg(conciergeEmbellish(html));

    // délégation clic
    setTimeout(()=>{
      document.querySelectorAll(".kbBookBtn").forEach(btn=>{
        btn.onclick = async ()=>{
          const it = items[btn.getAttribute("data-i")];
          try{
            const raw = await loadKB(it.path);
            const kb = parseKB(raw);
            addMsg(`${conciergeEmbellish(kb.short)}
              <br><button class="readMoreBtn">En savoir plus</button>
              <div class="kbLongWrapper" style="display:none">${kb.long}</div>`);
            const last = chatBody.lastElementChild;
            last.querySelector(".readMoreBtn").onclick = function(){
              this.nextElementSibling.style.display="block"; this.remove();
            };
          }catch(e){
            addMsg("Information indisponible pour le moment.");
          }
        };
      });
    },0);
  }

  /* -----------------------------
     AUTRES INTENTS KB
  ----------------------------- */
  const KB_INTENTS = [
    {
      id:"que_faire",
      keys:{
        fr:["que faire","activit","visite","excursion"],
        en:["what to do","activities"],
        es:["que hacer","actividades"],
        ca:["què fer","activitats"],
        nl:["wat te doen","activiteiten"]
      },
      path:"04_que-faire/que-faire-escala"
    }
  ];

  function matchKB(msg){
    for(const it of KB_INTENTS){
      const ks = it.keys[currentLang]||[];
      if(ks.some(k=>msg.includes(k))) return it;
    }
    return null;
  }

  /* -----------------------------
     SEND
  ----------------------------- */
  async function sendMessage(){
    const text = input.value.trim();
    if(!text) return;
    addMsg(text,"userMsg");
    input.value = "";

    const m = norm(text);
    currentLang = detectLangFromText(m);
    typing(true);

    setTimeout(async ()=>{
      typing(false);

      // 1) SUITES (prioritaire + filet)
      if (detectSuites(m)){
        await showSuitesList();
        return;
      }

      // 2) Intents existants
      if (hardIntents(m)) return;

      // 3) KB générique
      const it = matchKB(m);
      if (it){
        try{
          const raw = await loadKB(it.path);
          const kb = parseKB(raw);
          addMsg(`${conciergeEmbellish(kb.short)}
            <br><button class="readMoreBtn">En savoir plus</button>
            <div class="kbLongWrapper" style="display:none">${kb.long}</div>`);
          const last = chatBody.lastElementChild;
          last.querySelector(".readMoreBtn").onclick = function(){
            this.nextElementSibling.style.display="block"; this.remove();
          };
          return;
        }catch(e){
          addMsg("Information indisponible pour le moment.");
          return;
        }
      }

      // 4) Fallback hôtelier
      addMsg(conciergeEmbellish(
        "Je peux vous aider à découvrir nos <b>suites</b>, organiser votre <b>séjour</b>, " +
        "ou vous proposer des <b>expériences</b> autour de L’Escala."
      ));
    }, 500);
  }

})();
