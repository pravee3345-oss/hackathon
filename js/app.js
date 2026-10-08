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
    settingsTitle:"Accessibility Settings", settingsText:"Choose how you want AccessEase to assist you.", largeText:"Large text", largeTextDesc:"Increase text size across AccessEase.", highContrast:"High contrast", highContrastDesc:"Use stronger colors for improved contrast.", voiceOutput:"Voice output", voiceOutputDesc:"Speak the assistant's replies aloud.", save:"Save Settings",
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
    settingsTitle:"Accessibility அமைப்புகள்", settingsText:"AccessEase உங்களுக்கு எவ்வாறு உதவ வேண்டும் என்பதை தேர்வு செய்யுங்கள்.", largeText:"பெரிய எழுத்து", largeTextDesc:"AccessEase முழுவதும் எழுத்தின் அளவை அதிகரிக்கவும்.", highContrast:"அதிக நிற வேறுபாடு", highContrastDesc:"தெளிவுக்காக அதிக வேறுபாடுள்ள நிறங்களைப் பயன்படுத்தவும்.", voiceOutput:"குரல் வெளியீடு", voiceOutputDesc:"உதவியாளரின் பதில்களை சத்தமாகச் சொல்லவும்.", save:"அமைப்புகளை சேமி",
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
    settingsTitle:"Accessibility सेटिंग्स", settingsText:"चुनें कि AccessEase आपकी कैसे सहायता करे.", largeText:"बड़ा टेक्स्ट", largeTextDesc:"AccessEase में टेक्स्ट का आकार बढ़ाएं.", highContrast:"हाई कंट्रास्ट", highContrastDesc:"बेहतर स्पष्टता के लिए अधिक कंट्रास्ट वाले रंग उपयोग करें.", voiceOutput:"वॉइस आउटपुट", voiceOutputDesc:"असिस्टेंट के जवाब ज़ोर से सुनें.", save:"सेटिंग्स सेव करें",
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
const SPEECH_LOCALES = {
  en:"en-US", ta:"ta-IN", hi:"hi-IN", te:"te-IN", kn:"kn-IN", ml:"ml-IN",
  bn:"bn-IN", mr:"mr-IN", gu:"gu-IN", pa:"pa-IN", es:"es-ES", fr:"fr-FR",
  de:"de-DE", zh:"zh-CN", ja:"ja-JP", ar:"ar-SA"
};

function getLang() { return localStorage.getItem("accessEaseLanguage") || "en"; }
function backendLanguage(language = getLang()) { return language === "ta" ? "ta" : "en"; }
async function setLang(lang) {
  localStorage.setItem("accessEaseLanguage", lang);
  if (API_CONFIG.USE_BACKEND && ["en", "ta"].includes(lang) && localStorage.getItem("accessEaseToken")) {
    try {
      const result = await API.updateSettings({ language: backendLanguage(lang) });
      if (!result.settings) throw new Error("The server did not return the updated settings.");
      localStorage.setItem("accessEaseSettings", JSON.stringify(result.settings));
    } catch (err) {
      showToast(`Language changed here, but could not be saved to your account: ${err.message}`);
    }
  }
  location.reload();
}
function T(key) {
  const lang = getLang();
  return (LANGS[lang] && LANGS[lang][key]) || LANGS.en[key] || key;
}

function currentUser() {
  try { return JSON.parse(localStorage.getItem("accessEaseUser") || "null"); }
  catch { return null; }
}

function logout() {
  localStorage.removeItem("accessEaseUser");
  localStorage.removeItem("accessEaseToken");
  localStorage.removeItem("accessEaseSettings");
  window.postMessage({ type: "ACCESSEASE_SESSION", token: null }, location.origin);
  location.href = "index.html";
}

function syncBrowserExtensionSession(token = localStorage.getItem("accessEaseToken"), settings = defaultSettings()) {
  window.postMessage({ type: "ACCESSEASE_SESSION", token, settings }, location.origin);
}

function defaultSettings() {
  const defaults = { language: "en", largeText: false, highContrast: false, voiceOutput: false };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem("accessEaseSettings") || "{}") };
  } catch {
    return defaults;
  }
}

function applyAccessibilitySettings(settings) {
  document.body.classList.toggle("large-text", !!settings.largeText);
  document.body.classList.toggle("high-contrast", !!settings.highContrast);
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
        <button type="button" id="aiMic" class="ai-mic" aria-label="Speak to assistant" aria-pressed="false" title="Speak to assistant">🎙️</button>
        <button type="submit" title="${T("send")}">➤</button>
      </form>
    </div>
    <button class="ai-toggle" id="aiToggle" aria-label="AI Assistant">🤖</button>
  </div>`;
}

function layout(content, page) {
  document.getElementById("app").innerHTML = navHTML(page) + `<main>${content}</main>` + footerHTML() + aiHTML();
  applyAccessibilitySettings(defaultSettings());
  syncBrowserExtensionSession();
  document.getElementById("languageSelect")?.addEventListener("change", e => setLang(e.target.value));
  document.getElementById("menuBtn")?.addEventListener("click", () => document.getElementById("navLinks").classList.toggle("show"));
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
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
        <div class="form-group"><label>${T("email")}</label><input id="loginEmail" type="email" required autocomplete="email"></div>
        <div class="form-group"><label>${T("password")}</label><input id="loginPassword" type="password" required autocomplete="current-password"></div>
        <button class="btn" type="submit">${T("signIn")}</button>
      </form>
      <div class="form-footer">${T("noAccount")} <a href="register.html">${T("createAccount")}</a></div>
    </div></div>
  </section>`, "login");
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    try {
      if (API_CONFIG.USE_BACKEND) {
        const result = await API.login({ email, password });
        if (!result.token || !result.user) throw new Error("The server did not return a login token and user.");
        localStorage.setItem("accessEaseToken", result.token);
        localStorage.setItem("accessEaseUser", JSON.stringify(result.user));
        syncBrowserExtensionSession(result.token);
        if (result.settings) {
          localStorage.setItem("accessEaseSettings", JSON.stringify(result.settings));
          if (["en", "ta"].includes(getLang())) localStorage.setItem("accessEaseLanguage", result.settings.language);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("accessEaseDemoUser") || "null");
        if (!saved || saved.email !== email || saved.password !== password) {
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
        <div class="form-group"><label>${T("email")}</label><input id="regEmail" type="email" required></div>
        <div class="form-group"><label>${T("password")}</label><input id="regPassword" type="password" minlength="8" required autocomplete="new-password"></div>
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
      email: document.getElementById("regEmail").value.trim(),
      password,
      language: backendLanguage(document.getElementById("regLanguage").value)
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
  document.getElementById("dashLogout").addEventListener("click", logout);
}

function renderSettingsPage(s) {
  layout(`
  <section class="page container">
    <div class="form-wrap" style="max-width:700px"><div class="form-card">
      <h1>${T("settingsTitle")}</h1><p>${T("settingsText")}</p>
      <div class="setting-row"><div class="setting-info"><h3>🔎 ${T("largeText")}</h3><p>${T("largeTextDesc")}</p></div><label class="switch"><input id="largeTextSetting" type="checkbox" ${s.largeText?"checked":""}><span class="slider"></span></label></div>
      <div class="setting-row"><div class="setting-info"><h3>🎨 ${T("highContrast")}</h3><p>${T("highContrastDesc")}</p></div><label class="switch"><input id="highContrastSetting" type="checkbox" ${s.highContrast?"checked":""}><span class="slider"></span></label></div>
      <div class="setting-row"><div class="setting-info"><h3>🔊 ${T("voiceOutput")}</h3><p>${T("voiceOutputDesc")}</p></div><label class="switch"><input id="voiceOutputSetting" type="checkbox" ${s.voiceOutput?"checked":""}><span class="slider"></span></label></div>
      <button class="btn" id="saveSettings" style="margin-top:22px">${T("save")}</button>
    </div></div>
  </section>`, "settings");
  document.getElementById("saveSettings").addEventListener("click", async () => {
    const settings = {
      language: s.language || backendLanguage(),
      largeText: document.getElementById("largeTextSetting").checked,
      highContrast: document.getElementById("highContrastSetting").checked,
      voiceOutput: document.getElementById("voiceOutputSetting").checked
    };
    try {
      const result = API_CONFIG.USE_BACKEND ? await API.updateSettings(settings) : { settings };
      if (!result.settings) throw new Error("The server did not return the updated settings.");
      localStorage.setItem("accessEaseSettings", JSON.stringify(result.settings));
      applyAccessibilitySettings(result.settings);
      syncBrowserExtensionSession(localStorage.getItem("accessEaseToken"), result.settings);
    } catch(err) {
      showToast(err.message);
      return;
    }
    showToast("Settings saved successfully!");
  });
}

async function settingsPage() {
  if (API_CONFIG.USE_BACKEND && !localStorage.getItem("accessEaseToken")) {
    location.href = "login.html";
    return;
  }
  let settings = defaultSettings();
  if (API_CONFIG.USE_BACKEND) {
    try {
      const result = await API.getSettings();
      if (!result.settings) throw new Error("The server did not return your settings.");
      settings = result.settings;
      localStorage.setItem("accessEaseSettings", JSON.stringify(settings));
    } catch (err) {
      showToast(`Could not load your account settings: ${err.message}`);
      return;
    }
  }
  renderSettingsPage(settings);
}

function initAI() {
  const toggle = document.getElementById("aiToggle"), panel = document.getElementById("aiPanel");
  const close = document.getElementById("aiClose"), form = document.getElementById("aiForm");
  const input = document.getElementById("aiInput"), messages = document.getElementById("aiMessages");
  const mic = document.getElementById("aiMic");
  const sessionId = sessionStorage.getItem("accessEaseAssistantSession") || crypto.randomUUID();
  sessionStorage.setItem("accessEaseAssistantSession", sessionId);
  let pendingAction = null;
  let activeRecognition = null;
  let submitting = false;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function appendMessage(text, sender = "bot") {
    const message = document.createElement("div");
    message.className = `ai-msg ${sender}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function appendAssistantResult(result, openedWindow = null) {
    const reply = result.reply || result.message;
    if (reply) appendMessage(reply);
    if (result.status === "needs_confirmation" && result.action) {
      pendingAction = result.action;
      const controls = document.createElement("div");
      controls.className = "ai-confirm";
      controls.innerHTML = `<button type="button" data-confirm="yes">Yes</button><button type="button" data-confirm="no">No</button>`;
      messages.appendChild(controls);
    }
    if (result.openUrl) {
      try {
        const url = new URL(result.openUrl);
        const allowedHosts = ["youtube.com", "google.com", "wikipedia.org"];
        const allowedHost = allowedHosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
        if (url.protocol !== "https:" || !allowedHost) throw new Error("Unapproved destination.");
        if (openedWindow && !openedWindow.closed) {
          openedWindow.opener = null;
          openedWindow.location.assign(url.href);
        }
        const link = document.createElement("a");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `Open ${url.hostname.replace(/^www\./, "")}`;
        link.className = "ai-open-link";
        messages.appendChild(link);
        appendMessage("If the new tab doesn't appear, select the link above.");
      } catch {
        openedWindow?.close();
        appendMessage("The assistant returned an invalid link.");
      }
    } else {
      openedWindow?.close();
    }
    messages.scrollTop = messages.scrollHeight;
    if (defaultSettings().voiceOutput && reply) {
      if (!("speechSynthesis" in window)) {
        appendMessage("Voice output is not supported by this browser. You can still read the reply here.");
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = SPEECH_LOCALES[getLang()] || "en-US";
        utterance.onerror = event => {
          if (event.error !== "canceled" && event.error !== "interrupted") {
            appendMessage(`Voice output failed: ${event.error}. You can still read the reply here.`);
          }
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  toggle?.addEventListener("click", () => panel.classList.toggle("open"));
  close?.addEventListener("click", () => panel.classList.remove("open"));
  if (!SpeechRecognition) {
    mic.disabled = true;
    mic.title = "Voice input is not supported by this browser. Type your message instead.";
    mic.setAttribute("aria-label", mic.title);
    appendMessage(mic.title);
  } else {
    mic.addEventListener("click", () => {
      if (activeRecognition) {
        try {
          activeRecognition.stop();
        } catch (err) {
          appendMessage(`Could not finish voice capture: ${err.message}. Try selecting the microphone again.`);
        }
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LOCALES[getLang()] || "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      activeRecognition = recognition;
      mic.classList.add("listening");
      mic.setAttribute("aria-pressed", "true");
      mic.title = "Listening — select to finish";
      mic.setAttribute("aria-label", mic.title);
      const finalSegments = new Map();
      let interimTranscript = "";
      let reportedRecognitionError = false;
      recognition.onresult = event => {
        interimTranscript = "";
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const transcript = result[0]?.transcript?.trim();
          if (!transcript) continue;
          if (result.isFinal) {
            finalSegments.set(index, transcript);
          } else {
            interimTranscript = `${interimTranscript} ${transcript}`.trim();
          }
        }
        input.value = `${[...finalSegments.entries()].sort(([a], [b]) => a - b).map(([, text]) => text).join(" ")} ${interimTranscript}`.trim();
      };
      recognition.onerror = event => {
        if (event.error === "aborted") return;
        reportedRecognitionError = true;
        if (event.error === "no-speech") {
          appendMessage("I couldn't detect speech. Check that the correct microphone is selected and not muted, allow microphone access for the AccessEase site, and match the AccessEase language to your speech. Try again or type your message.");
          return;
        }
        const messagesByError = {
          "not-allowed": "Microphone access was blocked. Allow microphone access for the AccessEase site in your browser's site settings, then reload and try again.",
          "service-not-allowed": "Speech recognition is blocked by the browser or unavailable in this context. Try Chrome or Edge on a secure page.",
          "audio-capture": "No microphone is available. Connect or enable a microphone, then try again.",
          "network": "Speech recognition couldn't connect to the browser's recognition service. Check your internet connection and try again."
        };
        const message = messagesByError[event.error];
        if (message) {
          appendMessage(message);
        } else {
          appendMessage(`Voice input failed: ${event.error}. You can type your message instead.`);
        }
      };
      recognition.onstart = () => {
        mic.title = "Listening — select to finish";
        mic.setAttribute("aria-label", mic.title);
      };
      recognition.onend = () => {
        const spoken = `${[...finalSegments.entries()].sort(([a], [b]) => a - b).map(([, text]) => text).join(" ")} ${interimTranscript}`.trim();
        activeRecognition = null;
        mic.classList.remove("listening");
        mic.setAttribute("aria-pressed", "false");
        mic.title = "Speak to assistant";
        mic.setAttribute("aria-label", mic.title);
        if (!spoken) {
          if (!reportedRecognitionError) {
            appendMessage("I didn't receive a speech transcript. Check that the correct microphone is selected, allow microphone access for this site, and match the AccessEase language to your speech. Try again or type your message.");
          }
          return;
        }
        input.value = spoken;
      };
      try {
        recognition.start();
      } catch (err) {
        activeRecognition = null;
        mic.classList.remove("listening");
        mic.setAttribute("aria-pressed", "false");
        mic.title = "Speak to assistant";
        mic.setAttribute("aria-label", mic.title);
        appendMessage(`Could not start voice input: ${err.message}`);
      }
    });
  }
  messages?.addEventListener("click", async e => {
    const button = e.target.closest("[data-confirm]");
    if (!button || !pendingAction) return;
    const controls = button.parentElement;
    controls.querySelectorAll("button").forEach(item => item.disabled = true);
    const confirm = button.dataset.confirm === "yes";
    const openedWindow = confirm ? window.open("about:blank", "_blank") : null;
    appendMessage(confirm ? "Yes" : "No", "user");
    try {
      const result = await API.confirmAIAction({
        confirm,
        action: pendingAction,
        language: backendLanguage(),
        sessionId
      });
      pendingAction = null;
      controls.remove();
      appendAssistantResult(result, openedWindow);
    } catch (err) {
      openedWindow?.close();
      controls.querySelectorAll("button").forEach(item => item.disabled = false);
      appendMessage(`Sorry, I couldn't complete that request: ${err.message}`);
    }
  });
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message || submitting) return;
    submitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    appendMessage(message, "user");
    input.value = "";
    try {
      if (API_CONFIG.USE_BACKEND) {
        const result = await API.aiChat({
          message,
          language: backendLanguage(),
          sessionId
        });
        appendAssistantResult(result);
      } else {
        appendMessage("I’m ready to help! Connect the backend in js/config.js to use the AI assistant.");
      }
    } catch(err) {
      appendMessage(`Sorry, I couldn't reach the AI service: ${err.message}`);
    } finally {
      submitting = false;
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const page = document.body.dataset.page;
if (page === "home") homePage();
if (page === "about") aboutPage();
if (page === "login") loginPage();
if (page === "register") registerPage();
if (page === "dashboard") dashboardPage();
if (page === "settings") settingsPage();
