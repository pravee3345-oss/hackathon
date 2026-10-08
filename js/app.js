const LANGS = {
  en: {
    name:"English", home:"Home", about:"About", language:"Language", register:"Register", login:"Login",
    settings:"Settings", heroTag:"ACCESS FOR EVERYONE", heroTitle:"Technology that makes life easier.", heroText:"AccessEase is an accessibility-first digital experience designed to help people interact with technology through voice, text and motion.",
    getStarted:"Get Started", learnMore:"Learn More", features:"Designed for everyone", featuresText:"Simple tools that make digital experiences more accessible.",
    voice:"Voice Assistant", voiceDesc:"Use voice commands and spoken feedback.", text:"Text Assistant", textDesc:"Get helpful guidance through text.", motion:"Motion Gesture", motionDesc:"Navigate with supported motion gestures.",
    aboutTitle:"About AccessEase", aboutText:"AccessEase brings accessibility features into one simple experience. The platform is designed around flexible interaction so users can choose the way that works best for them.",
    loginTitle:"Welcome Back", loginText:"Sign in to continue to your AccessEase dashboard.", username:"Username", password:"Password", signIn:"Sign In", noAccount:"Don't have an account?", createAccount:"Create an account",
    registerTitle:"Create Your Account", registerText:"Join AccessEase and personalize your accessibility experience.", fullName:"Full Name", age:"Age", email:"Email", confirmPassword:"Confirm Password", preferredLanguage:"Preferred Language", create:"Create Account", haveAccount:"Already have an account?",
    dashboard:"Dashboard", welcome:"Welcome", assistantStatus:"AI Assistant", enabled:"Enabled", preferences:"Accessibility Preferences", logout:"Logout",
    settingsTitle:"Accessibility Settings", settingsText:"Choose how you want AccessEase to assist you.", save:"Save Settings",
    aiGreeting:"Hi! I'm your AccessEase AI assistant. How can I help?", typeMessage:"Type a message...", send:"Send"
  },
  ta: {
    name:"தமிழ்", home:"முகப்பு", about:"எங்களைப் பற்றி", language:"மொழி", register:"பதிவு", login:"உள்நுழைவு",
    settings:"அமைப்புகள்", heroTag:"அனைவருக்கும் அணுகல்", heroTitle:"வாழ்க்கையை எளிதாக்கும் தொழில்நுட்பம்.", heroText:"AccessEase என்பது குரல், உரை மற்றும் இயக்கம் மூலம் தொழில்நுட்பத்தை எளிதாக பயன்படுத்த உதவும் accessibility-first தளம்.",
    getStarted:"தொடங்குங்கள்", learnMore:"மேலும் அறிக", features:"அனைவருக்காக வடிவமைக்கப்பட்டது", featuresText:"டிஜிட்டல் அனுபவங்களை எளிதாக அணுக உதவும் கருவிகள்.",
    voice:"குரல் உதவியாளர்", voiceDesc:"குரல் கட்டளைகள் மற்றும் ஒலி feedback பயன்படுத்துங்கள்.", text:"உரை உதவியாளர்", textDesc:"உரை மூலம் உதவி பெறுங்கள்.", motion:"இயக்க சைகை", motionDesc:"ஆதரிக்கப்படும் இயக்க சைகைகள் மூலம் செல்லுங்கள்.",
    aboutTitle:"AccessEase பற்றி", aboutText:"AccessEase பல accessibility வசதிகளை ஒரே எளிய அனுபவமாக வழங்குகிறது.",
    loginTitle:"மீண்டும் வரவேற்கிறோம்", loginText:"உங்கள் AccessEase dashboard-க்கு செல்ல உள்நுழையுங்கள்.", username:"பயனர் பெயர்", password:"கடவுச்சொல்", signIn:"உள்நுழைக", noAccount:"கணக்கு இல்லையா?", createAccount:"கணக்கு உருவாக்கவும்",
    registerTitle:"உங்கள் கணக்கை உருவாக்குங்கள்", registerText:"AccessEase-ல் சேர்ந்து உங்கள் accessibility அனுபவத்தை அமைக்கவும்.", fullName:"முழு பெயர்", age:"வயது", email:"மின்னஞ்சல்", confirmPassword:"கடவுச்சொல்லை உறுதிப்படுத்தவும்", preferredLanguage:"விருப்ப மொழி", create:"கணக்கு உருவாக்கவும்", haveAccount:"ஏற்கனவே கணக்கு உள்ளதா?",
    dashboard:"Dashboard", welcome:"வரவேற்கிறோம்", assistantStatus:"AI உதவியாளர்", enabled:"இயக்கத்தில்", preferences:"Accessibility விருப்பங்கள்", logout:"வெளியேறு",
    settingsTitle:"Accessibility அமைப்புகள்", settingsText:"AccessEase உங்களுக்கு எவ்வாறு உதவ வேண்டும் என்பதை தேர்வு செய்யுங்கள்.", save:"அமைப்புகளை சேமி",
    aiGreeting:"வணக்கம்! நான் உங்கள் AccessEase AI உதவியாளர். எப்படி உதவலாம்?", typeMessage:"செய்தியை உள்ளிடுங்கள்...", send:"அனுப்பு"
  },
  hi: {
    name:"हिन्दी", home:"होम", about:"हमारे बारे में", language:"भाषा", register:"रजिस्टर", login:"लॉगिन",
    settings:"सेटिंग्स", heroTag:"सभी के लिए एक्सेस", heroTitle:"तकनीक जो जीवन को आसान बनाती है।", heroText:"AccessEase आवाज़, टेक्स्ट और मोशन के माध्यम से तकनीक को अधिक सुलभ बनाने वाला प्लेटफ़ॉर्म है.",
    getStarted:"शुरू करें", learnMore:"और जानें", features:"सभी के लिए बनाया गया", featuresText:"डिजिटल अनुभव को अधिक सुलभ बनाने वाले सरल टूल.",
    voice:"वॉइस असिस्टेंट", voiceDesc:"वॉइस कमांड और ऑडियो फीडबैक का उपयोग करें.", text:"टेक्स्ट असिस्टेंट", textDesc:"टेक्स्ट के माध्यम से सहायता पाएं.", motion:"मोशन जेस्चर", motionDesc:"समर्थित मोशन जेस्चर से नेविगेट करें.",
    aboutTitle:"AccessEase के बारे में", aboutText:"AccessEase कई accessibility सुविधाओं को एक सरल अनुभव में जोड़ता है.",
    loginTitle:"वापसी पर स्वागत है", loginText:"अपने AccessEase डैशबोर्ड पर जाने के लिए साइन इन करें.", username:"यूज़रनेम", password:"पासवर्ड", signIn:"साइन इन", noAccount:"खाता नहीं है?", createAccount:"खाता बनाएं",
    registerTitle:"अपना खाता बनाएं", registerText:"AccessEase से जुड़ें और अपने अनुभव को व्यक्तिगत बनाएं.", fullName:"पूरा नाम", age:"आयु", email:"ईमेल", confirmPassword:"पासवर्ड की पुष्टि", preferredLanguage:"पसंदीदा भाषा", create:"खाता बनाएं", haveAccount:"पहले से खाता है?",
    dashboard:"डैशबोर्ड", welcome:"स्वागत", assistantStatus:"AI असिस्टेंट", enabled:"सक्रिय", preferences:"Accessibility प्राथमिकताएं", logout:"लॉगआउट",
    settingsTitle:"Accessibility सेटिंग्स", settingsText:"चुनें कि AccessEase आपकी कैसे सहायता करे.", save:"सेटिंग्स सेव करें",
    aiGreeting:"नमस्ते! मैं आपका AccessEase AI असिस्टेंट हूँ। मैं कैसे मदद करूँ?", typeMessage:"संदेश लिखें...", send:"भेजें"
  },
  es: {
    name:"Español", home:"Inicio", about:"Acerca de", language:"Idioma", register:"Registro", login:"Iniciar sesión",
    settings:"Ajustes", heroTag:"ACCESO PARA TODOS", heroTitle:"Tecnología que hace la vida más fácil.", heroText:"AccessEase es una experiencia digital accesible mediante voz, texto y movimiento.",
    getStarted:"Comenzar", learnMore:"Saber más", features:"Diseñado para todos", featuresText:"Herramientas sencillas para experiencias digitales más accesibles.",
    voice:"Asistente de voz", voiceDesc:"Usa comandos de voz y comentarios hablados.", text:"Asistente de texto", textDesc:"Recibe ayuda mediante texto.", motion:"Gestos de movimiento", motionDesc:"Navega con gestos compatibles.",
    aboutTitle:"Acerca de AccessEase", aboutText:"AccessEase reúne funciones de accesibilidad en una experiencia sencilla.",
    loginTitle:"Bienvenido de nuevo", loginText:"Inicia sesión para continuar.", username:"Usuario", password:"Contraseña", signIn:"Iniciar sesión", noAccount:"¿No tienes cuenta?", createAccount:"Crear una cuenta",
    registerTitle:"Crea tu cuenta", registerText:"Únete a AccessEase y personaliza tu experiencia.", fullName:"Nombre completo", age:"Edad", email:"Correo", confirmPassword:"Confirmar contraseña", preferredLanguage:"Idioma preferido", create:"Crear cuenta", haveAccount:"¿Ya tienes una cuenta?",
    dashboard:"Panel", welcome:"Bienvenido", assistantStatus:"Asistente IA", enabled:"Activado", preferences:"Preferencias de accesibilidad", logout:"Cerrar sesión",
    settingsTitle:"Ajustes de accesibilidad", settingsText:"Elige cómo quieres que AccessEase te ayude.", save:"Guardar ajustes",
    aiGreeting:"¡Hola! Soy tu asistente IA de AccessEase. ¿Cómo puedo ayudarte?", typeMessage:"Escribe un mensaje...", send:"Enviar"
  },
  fr: {
    name:"Français", home:"Accueil", about:"À propos", language:"Langue", register:"Inscription", login:"Connexion",
    settings:"Paramètres", heroTag:"ACCÈS POUR TOUS", heroTitle:"La technologie qui facilite la vie.", heroText:"AccessEase est une expérience numérique accessible par la voix, le texte et le mouvement.",
    getStarted:"Commencer", learnMore:"En savoir plus", features:"Conçu pour tous", featuresText:"Des outils simples pour rendre les expériences numériques plus accessibles.",
    voice:"Assistant vocal", voiceDesc:"Utilisez les commandes vocales et les retours audio.", text:"Assistant texte", textDesc:"Recevez de l'aide par texte.", motion:"Gestes de mouvement", motionDesc:"Naviguez avec les gestes pris en charge.",
    aboutTitle:"À propos d'AccessEase", aboutText:"AccessEase rassemble les fonctions d'accessibilité dans une expérience simple.",
    loginTitle:"Bon retour", loginText:"Connectez-vous pour continuer.", username:"Nom d'utilisateur", password:"Mot de passe", signIn:"Se connecter", noAccount:"Pas de compte ?", createAccount:"Créer un compte",
    registerTitle:"Créer votre compte", registerText:"Rejoignez AccessEase et personnalisez votre expérience.", fullName:"Nom complet", age:"Âge", email:"E-mail", confirmPassword:"Confirmer le mot de passe", preferredLanguage:"Langue préférée", create:"Créer un compte", haveAccount:"Vous avez déjà un compte ?",
    dashboard:"Tableau de bord", welcome:"Bienvenue", assistantStatus:"Assistant IA", enabled:"Activé", preferences:"Préférences d'accessibilité", logout:"Déconnexion",
    settingsTitle:"Paramètres d'accessibilité", settingsText:"Choisissez comment AccessEase doit vous aider.", save:"Enregistrer",
    aiGreeting:"Bonjour ! Je suis votre assistant IA AccessEase. Comment puis-je vous aider ?", typeMessage:"Écrivez un message...", send:"Envoyer"
  },
  de: {
    name:"Deutsch", home:"Start", about:"Über uns", language:"Sprache", register:"Registrieren", login:"Anmelden",
    settings:"Einstellungen", heroTag:"ZUGANG FÜR ALLE", heroTitle:"Technologie, die das Leben einfacher macht.", heroText:"AccessEase ist eine barrierearme digitale Erfahrung mit Sprache, Text und Bewegung.",
    getStarted:"Loslegen", learnMore:"Mehr erfahren", features:"Für alle entwickelt", featuresText:"Einfache Werkzeuge für barriereärmere digitale Erlebnisse.",
    voice:"Sprachassistent", voiceDesc:"Nutze Sprachbefehle und Sprachausgabe.", text:"Textassistent", textDesc:"Erhalte Hilfe per Text.", motion:"Bewegungsgesten", motionDesc:"Navigiere mit unterstützten Gesten.",
    aboutTitle:"Über AccessEase", aboutText:"AccessEase bündelt Barrierefreiheitsfunktionen in einer einfachen Erfahrung.",
    loginTitle:"Willkommen zurück", loginText:"Melde dich an, um fortzufahren.", username:"Benutzername", password:"Passwort", signIn:"Anmelden", noAccount:"Noch kein Konto?", createAccount:"Konto erstellen",
    registerTitle:"Konto erstellen", registerText:"Werde Teil von AccessEase und personalisiere deine Erfahrung.", fullName:"Vollständiger Name", age:"Alter", email:"E-Mail", confirmPassword:"Passwort bestätigen", preferredLanguage:"Bevorzugte Sprache", create:"Konto erstellen", haveAccount:"Bereits ein Konto?",
    dashboard:"Dashboard", welcome:"Willkommen", assistantStatus:"KI-Assistent", enabled:"Aktiv", preferences:"Barrierefreiheitsoptionen", logout:"Abmelden",
    settingsTitle:"Barrierefreiheitseinstellungen", settingsText:"Wähle, wie AccessEase dich unterstützen soll.", save:"Einstellungen speichern",
    aiGreeting:"Hallo! Ich bin dein AccessEase KI-Assistent. Wie kann ich helfen?", typeMessage:"Nachricht eingeben...", send:"Senden"
  }
};

const SUPPORTED = [
  ["en","English"],["ta","தமிழ்"],["hi","हिन्दी"],["te","తెలుగు"],["kn","ಕನ್ನಡ"],["ml","മലയാളം"],
  ["bn","বাংলা"],["mr","मराठी"],["gu","ગુજરાતી"],["pa","ਪੰਜਾਬੀ"],["es","Español"],["fr","Français"],
  ["de","Deutsch"],["zh","中文"],["ja","日本語"],["ar","العربية"]
];

function getLang() { return localStorage.getItem("accessEaseLanguage") || "en"; }
function setLang(lang) { localStorage.setItem("accessEaseLanguage", lang); location.reload(); }
function T(key) {
  const lang = getLang();
  return (LANGS[lang] && LANGS[lang][key]) || LANGS.en[key] || key;
}

function currentUser() {
  try { return JSON.parse(localStorage.getItem("accessEaseUser") || "null"); }
  catch { return null; }
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function navHTML(page) {
  const user = currentUser();
  return `
  <nav class="navbar">
    <a class="brand" href="index.html"><span class="brand-mark">A</span>AccessEase</a>
    <button class="menu-btn" id="menuBtn">☰</button>
    <div class="nav-links" id="navLinks">
      <a class="${page==="home"?"active":""}" href="index.html">${T("home")}</a>
      <a class="${page==="about"?"active":""}" href="about.html">${T("about")}</a>
      ${user ? `<a class="${page==="dashboard"?"active":""}" href="dashboard.html">${T("dashboard")}</a>` : ""}
      <a class="${page==="register"?"active":""}" href="register.html">${T("register")}</a>
      ${user ? `<button class="nav-link-btn" id="logoutBtn">${T("logout")}</button>` : `<a class="${page==="login"?"active":""}" href="login.html">${T("login")}</a>`}
      <a class="${page==="settings"?"active":""}" href="settings.html">⚙ ${T("settings")}</a>
    </div>
    <div class="nav-actions">
      <select class="lang-select" id="languageSelect" aria-label="${T("language")}">
        ${SUPPORTED.map(([code,name]) => `<option value="${code}" ${getLang()===code?"selected":""}>${name}</option>`).join("")}
      </select>
    </div>
  </nav>`;
}

function footerHTML() {
  return `<footer class="footer"><div class="container">© 2026 AccessEase · Accessibility for everyone.</div></footer>`;
}

function aiHTML() {
  return `
  <div class="ai-agent">
    <div class="ai-panel" id="aiPanel">
      <div class="ai-head"><strong>🤖 AccessEase AI</strong><button id="aiClose" style="background:none;border:0;color:#fff;font-size:18px">×</button></div>
      <div class="ai-messages" id="aiMessages"><div class="ai-msg bot">${T("aiGreeting")}</div></div>
      <form class="ai-input" id="aiForm">
        <input id="aiInput" placeholder="${T("typeMessage")}" autocomplete="off">
        <button title="${T("send")}">➤</button>
      </form>
    </div>
    <button class="ai-toggle" id="aiToggle" aria-label="AI Assistant">🤖</button>
  </div>`;
}

function layout(content, page) {
  document.getElementById("app").innerHTML = navHTML(page) + `<main>${content}</main>` + footerHTML() + aiHTML();
  document.getElementById("languageSelect")?.addEventListener("change", e => setLang(e.target.value));
  document.getElementById("menuBtn")?.addEventListener("click", () => document.getElementById("navLinks").classList.toggle("show"));
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("accessEaseUser");
    location.href = "index.html";
  });
  initAI();
}

function homePage() {
  layout(`
  <section class="hero container">
    <div>
      <span class="badge">${T("heroTag")}</span>
      <h1>${T("heroTitle").split(" ").slice(0,4).join(" ")} <span class="gradient-text">${T("heroTitle").split(" ").slice(4).join(" ")}</span></h1>
      <p>${T("heroText")}</p>
      <div class="actions">
        <a class="btn" href="${currentUser() ? "dashboard.html" : "register.html"}">${T("getStarted")} →</a>
        <a class="btn secondary" href="about.html">${T("learnMore")}</a>
      </div>
    </div>
    <div class="hero-card"><div class="agent-preview"><div class="robot">🤖</div></div></div>
  </section>
  <section class="page container">
    <div class="section-title"><h2>${T("features")}</h2><p>${T("featuresText")}</p></div>
    <div class="grid">
      <div class="card"><div class="icon">🎙️</div><h3>${T("voice")}</h3><p>${T("voiceDesc")}</p></div>
      <div class="card"><div class="icon">💬</div><h3>${T("text")}</h3><p>${T("textDesc")}</p></div>
      <div class="card"><div class="icon">👋</div><h3>${T("motion")}</h3><p>${T("motionDesc")}</p></div>
    </div>
  </section>`, "home");
}

function aboutPage() {
  layout(`
  <section class="page container">
    <div class="section-title"><h2>${T("aboutTitle")}</h2><p>${T("aboutText")}</p></div>
    <div class="grid">
      <div class="card"><div class="icon">♿</div><h3>Accessibility First</h3><p>Built to support different ways of interacting with digital experiences.</p></div>
      <div class="card"><div class="icon">🌐</div><h3>Multilingual</h3><p>Switch the interface language from the navbar without rebuilding the page.</p></div>
      <div class="card"><div class="icon">🤖</div><h3>AI Companion</h3><p>A floating assistant stays available across the website pages.</p></div>
    </div>
  </section>`, "about");
}

function loginPage() {
  layout(`
  <section class="page container">
    <div class="form-wrap"><div class="form-card">
      <h1>${T("loginTitle")}</h1><p>${T("loginText")}</p>
      <form id="loginForm">
        <div class="form-group"><label>${T("username")}</label><input id="loginUsername" required autocomplete="username"></div>
        <div class="form-group"><label>${T("password")}</label><input id="loginPassword" type="password" required autocomplete="current-password"></div>
        <button class="btn" type="submit">${T("signIn")}</button>
      </form>
      <div class="form-footer">${T("noAccount")} <a href="register.html">${T("createAccount")}</a></div>
    </div></div>
  </section>`, "login");
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    try {
      if (API_CONFIG.USE_BACKEND) {
        const result = await API.login({username,password});
        const user = result.user || result.data?.user || {username};
        localStorage.setItem("accessEaseUser", JSON.stringify(user));
      } else {
        const saved = JSON.parse(localStorage.getItem("accessEaseDemoUser") || "null");
        if (!saved || saved.username !== username || saved.password !== password) {
          showToast("Demo: register first or use your registered details.");
          return;
        }
        localStorage.setItem("accessEaseUser", JSON.stringify(saved));
      }
      location.href = "dashboard.html";
    } catch (err) { showToast(err.message); }
  });
}

function registerPage() {
  layout(`
  <section class="page container">
    <div class="form-wrap"><div class="form-card">
      <h1>${T("registerTitle")}</h1><p>${T("registerText")}</p>
      <form id="registerForm">
        <div class="form-group"><label>${T("fullName")}</label><input id="regName" required></div>
        <div class="form-group"><label>${T("age")}</label><input id="regAge" type="number" min="1" max="120" required></div>
        <div class="form-group"><label>${T("email")}</label><input id="regEmail" type="email" required></div>
        <div class="form-group"><label>${T("username")}</label><input id="regUsername" required autocomplete="username"></div>
        <div class="form-group"><label>${T("password")}</label><input id="regPassword" type="password" minlength="6" required autocomplete="new-password"></div>
        <div class="form-group"><label>${T("confirmPassword")}</label><input id="regConfirm" type="password" required autocomplete="new-password"></div>
        <div class="form-group"><label>${T("preferredLanguage")}</label><select id="regLanguage">${SUPPORTED.map(([c,n])=>`<option value="${c}" ${getLang()===c?"selected":""}>${n}</option>`).join("")}</select></div>
        <button class="btn" type="submit">${T("create")}</button>
      </form>
      <div class="form-footer">${T("haveAccount")} <a href="login.html">${T("login")}</a></div>
    </div></div>
  </section>`, "register");
  document.getElementById("registerForm").addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;
    if (password !== confirm) { showToast("Passwords do not match."); return; }
    const payload = {
      name: document.getElementById("regName").value.trim(),
      age: Number(document.getElementById("regAge").value),
      email: document.getElementById("regEmail").value.trim(),
      username: document.getElementById("regUsername").value.trim(),
      password,
      language: document.getElementById("regLanguage").value
    };
    try {
      if (API_CONFIG.USE_BACKEND) {
        await API.register(payload);
      } else {
        localStorage.setItem("accessEaseDemoUser", JSON.stringify(payload));
      }
      showToast("Registration successful!");
      setTimeout(() => location.href = "login.html", 700);
    } catch (err) { showToast(err.message); }
  });
}

function dashboardPage() {
  const user = currentUser();
  if (!user) { location.href = "login.html"; return; }
  layout(`
  <section class="page container">
    <div class="dashboard-head"><div><h1>${T("welcome")}, ${user.name || user.username || "User"} 👋</h1><p>AccessEase is ready to support you.</p></div><button class="btn danger" id="dashLogout">${T("logout")}</button></div>
    <div class="stat-grid">
      <div class="stat"><span>${T("assistantStatus")}</span><strong>🤖 ${T("enabled")}</strong></div>
      <div class="stat"><span>${T("preferredLanguage")}</span><strong>${SUPPORTED.find(x=>x[0]===(user.language||getLang()))?.[1] || "English"}</strong></div>
      <div class="stat"><span>${T("preferences")}</span><strong>3 Modes</strong></div>
    </div>
    <div class="card">
      <h2>${T("preferences")}</h2><p style="color:var(--muted);margin:8px 0 20px">Manage your accessibility tools.</p>
      <a class="btn secondary" href="settings.html">⚙ ${T("settings")}</a>
    </div>
  </section>`, "dashboard");
  document.getElementById("dashLogout").addEventListener("click", () => { localStorage.removeItem("accessEaseUser"); location.href="index.html"; });
}

function defaultSettings() {
  return JSON.parse(localStorage.getItem("accessEaseSettings") || '{"voice":true,"text":true,"motion":false}');
}

function settingsPage() {
  const s = defaultSettings();
  layout(`
  <section class="page container">
    <div class="form-wrap" style="max-width:700px"><div class="form-card">
      <h1>${T("settingsTitle")}</h1><p>${T("settingsText")}</p>
      <div class="setting-row"><div class="setting-info"><h3>🎙️ ${T("voice")}</h3><p>${T("voiceDesc")}</p></div><label class="switch"><input id="voiceSetting" type="checkbox" ${s.voice?"checked":""}><span class="slider"></span></label></div>
      <div class="setting-row"><div class="setting-info"><h3>💬 ${T("text")}</h3><p>${T("textDesc")}</p></div><label class="switch"><input id="textSetting" type="checkbox" ${s.text?"checked":""}><span class="slider"></span></label></div>
      <div class="setting-row"><div class="setting-info"><h3>👋 ${T("motion")}</h3><p>${T("motionDesc")}</p></div><label class="switch"><input id="motionSetting" type="checkbox" ${s.motion?"checked":""}><span class="slider"></span></label></div>
      <button class="btn" id="saveSettings" style="margin-top:22px">${T("save")}</button>
    </div></div>
  </section>`, "settings");
  document.getElementById("saveSettings").addEventListener("click", async () => {
    const settings = {
      voice: document.getElementById("voiceSetting").checked,
      text: document.getElementById("textSetting").checked,
      motion: document.getElementById("motionSetting").checked
    };
    localStorage.setItem("accessEaseSettings", JSON.stringify(settings));
    try { if (API_CONFIG.USE_BACKEND) await API.updateSettings(settings); } catch(err) { showToast(err.message); return; }
    showToast("Settings saved successfully!");
  });
}

function initAI() {
  const toggle = document.getElementById("aiToggle"), panel = document.getElementById("aiPanel");
  const close = document.getElementById("aiClose"), form = document.getElementById("aiForm");
  const input = document.getElementById("aiInput"), messages = document.getElementById("aiMessages");
  toggle?.addEventListener("click", () => panel.classList.toggle("open"));
  close?.addEventListener("click", () => panel.classList.remove("open"));
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const message = input.value.trim(); if (!message) return;
    messages.insertAdjacentHTML("beforeend", `<div class="ai-msg user">${escapeHTML(message)}</div>`);
    input.value = "";
    try {
      let reply;
      if (API_CONFIG.USE_BACKEND) {
        const result = await API.aiChat(message);
        reply = result.reply || result.message || result.data?.reply || "I received your message.";
      } else {
        reply = "I’m ready to help! Your friend’s AI API can be connected in js/config.js when the backend is ready.";
      }
      messages.insertAdjacentHTML("beforeend", `<div class="ai-msg bot">${escapeHTML(reply)}</div>`);
      messages.scrollTop = messages.scrollHeight;
    } catch(err) {
      messages.insertAdjacentHTML("beforeend", `<div class="ai-msg bot">Sorry, I couldn't reach the AI service.</div>`);
    }
  });
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

const page = document.body.dataset.page;
if (page === "home") homePage();
if (page === "about") aboutPage();
if (page === "login") loginPage();
if (page === "register") registerPage();
if (page === "dashboard") dashboardPage();
if (page === "settings") settingsPage();
