(() => {
  const localHost = location.protocol === "http:" && ["localhost", "127.0.0.1"].includes(location.hostname);
  if (localHost) {
    function syncPageSession(token = localStorage.getItem("accessEaseToken")) {
      let settings = {};
      try {
        settings = JSON.parse(localStorage.getItem("accessEaseSettings") || "{}");
      } catch {
        settings = {};
      }
      chrome.runtime.sendMessage({
        type: "syncSession",
        token,
        settings
      });
    }

    window.addEventListener("message", event => {
      if (event.source !== window || event.origin !== location.origin || event.data?.type !== "ACCESSEASE_SESSION") return;
      syncPageSession(event.data.token);
    });
    window.addEventListener("storage", event => {
      if (event.key === "accessEaseToken" || event.key === "accessEaseSettings") syncPageSession();
    });
    syncPageSession();
    return;
  }

  if (document.getElementById("accessease-extension-root")) return;

  const root = document.createElement("div");
  root.id = "accessease-extension-root";
  root.style.cssText = "all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483647";
  const shadow = root.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;font:14px/1.4 Arial,sans-serif}
      .wrap{display:flex;flex-direction:column;align-items:flex-end;color:#182033}
      .toggle{width:60px;height:60px;border:0;border-radius:50%;background:linear-gradient(135deg,#5b4cf0,#00b8a9);color:white;font-size:27px;cursor:pointer;box-shadow:0 8px 26px #25205c55}
      .panel{display:none;width:min(350px,calc(100vw - 32px));height:min(440px,calc(100vh - 100px));margin-bottom:10px;background:#fff;border:1px solid #dfe2eb;border-radius:16px;box-shadow:0 12px 42px #18203340;overflow:hidden}
      .panel.open{display:flex;flex-direction:column}
      .head{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;color:white;background:linear-gradient(135deg,#5b4cf0,#756cff)}
      .head button{border:0;background:transparent;color:white;font-size:22px;cursor:pointer}
      .status{padding:7px 12px;background:#f2f2ff;color:#4d4c69;font-size:12px}
      .messages{flex:1;overflow:auto;padding:12px;background:#f8f8ff}
      .msg{max-width:88%;white-space:pre-wrap;overflow-wrap:anywhere;padding:9px 11px;margin:0 0 9px;border-radius:11px;background:#fff;border:1px solid #e6e8f0}
      .msg.user{margin-left:auto;background:#e8e6ff}
      .confirm{display:flex;gap:8px;margin:0 0 10px}
      button.action{padding:7px 12px;border:1px solid #5b4cf0;border-radius:8px;background:#fff;color:#4336c7;font-weight:bold;cursor:pointer}
      .form{display:flex;gap:6px;padding:9px;border-top:1px solid #e6e8f0}
      .form input{flex:1;min-width:0;border:1px solid #dfe2eb;border-radius:9px;padding:9px}
      .form button{width:38px;border:0;border-radius:9px;background:#5b4cf0;color:white;cursor:pointer}
      .form button.mic{background:#eae9ff;color:#4336c7}
      .form button.mic.listening{background:#fce4e4;color:#a32626}
      .form button:disabled{opacity:.55}
      @media(max-width:480px){#panel{width:calc(100vw - 32px)}}
    </style>
    <div class="wrap">
      <section class="panel" id="panel">
        <header class="head"><strong>🤖 AccessEase</strong><button id="close" aria-label="Close">×</button></header>
        <div class="status" id="status">Checking AccessEase login…</div>
        <div class="messages" id="messages"><div class="msg">I stay available on this page. Try “open YouTube” or ask about what is visible.</div></div>
        <form class="form" id="form">
          <input id="input" aria-label="Message" placeholder="Type or use the microphone…" autocomplete="off">
          <button type="button" class="mic" id="mic" title="Speak">🎙️</button>
          <button type="submit" title="Send">➤</button>
        </form>
      </section>
      <button class="toggle" id="toggle" aria-label="Open AccessEase assistant">🤖</button>
    </div>`;
  document.documentElement.appendChild(root);

  const $ = selector => shadow.querySelector(selector);
  const panel = $("#panel");
  const messages = $("#messages");
  const input = $("#input");
  const mic = $("#mic");
  const sessionId = crypto.randomUUID();
  let pendingAction = null;
  let activeRecognition = null;
  let submitting = false;
  let settings = { language: "en", voiceOutput: false };
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechLocales = { en: "en-US", ta: "ta-IN", hi: "hi-IN" };

  function addMessage(text, sender = "bot") {
    const node = document.createElement("div");
    node.className = `msg ${sender}`;
    node.textContent = text;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
  }

  function pageContext() {
    const visibleRegion = document.querySelector("main") || document.body;
    return JSON.stringify({
      title: document.title,
      visibleText: (visibleRegion?.innerText || "").slice(0, 9000)
    }).slice(0, 11000);
  }

  function speak(text) {
    if (!settings.voiceOutput || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLocales[settings.language] || "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function sendToBackend(type, payload) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type, payload }, response => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (response?.error) return reject(new Error(response.error));
        resolve(response.result);
      });
    });
  }

  function showResult(result) {
    const reply = result.reply || result.message;
    if (reply) {
      addMessage(reply);
      speak(reply);
    }
    if (result.status === "needs_confirmation" && result.action) {
      pendingAction = result.action;
      const row = document.createElement("div");
      row.className = "confirm";
      row.innerHTML = '<button class="action" data-confirm="yes">Yes</button><button class="action" data-confirm="no">No</button>';
      messages.appendChild(row);
    }
    if (result.openUrl) {
      const url = new URL(result.openUrl);
      const allowed = ["youtube.com", "google.com", "wikipedia.org"].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
      if (url.protocol !== "https:" || !allowed) {
        addMessage("The assistant returned an unsupported destination.");
        return;
      }
      location.assign(url.href);
    }
    if (result.closeTab === true) {
      closeCurrentTab().catch(error => addMessage(`Could not close this tab: ${error.message}`));
    }
  }

  async function submitMessage(text) {
    const message = text.trim();
    if (!message || submitting) return;
    submitting = true;
    const sendButton = $("#form button[type='submit']");
    sendButton.disabled = true;
    addMessage(message, "user");
    input.value = "";
    try {
      const result = await sendToBackend("chat", {
        message,
        language: speechLocales[settings.language] ? settings.language : "en",
        sessionId,
        pageContext: pageContext(),
        client: "browser-extension"
      });
      showResult(result);
    } catch (error) {
      addMessage(error.message);
    } finally {
      submitting = false;
      sendButton.disabled = false;
    }
  }

  $("#toggle").addEventListener("click", () => panel.classList.toggle("open"));
  $("#close").addEventListener("click", () => panel.classList.remove("open"));
  $("#form").addEventListener("submit", event => {
    event.preventDefault();
    submitMessage(input.value);
  });

  messages.addEventListener("click", async event => {
    const button = event.target.closest("[data-confirm]");
    if (!button || !pendingAction) return;
    const row = button.parentElement;
    row.querySelectorAll("button").forEach(item => item.disabled = true);
    const confirm = button.dataset.confirm === "yes";
    addMessage(confirm ? "Yes" : "No", "user");
    try {
      const result = await sendToBackend("confirm", {
        confirm,
        action: pendingAction,
        language: settings.language === "ta" ? "ta" : "en",
        sessionId,
        client: "browser-extension"
      });
      pendingAction = null;
      row.remove();
      showResult(result);
    } catch (error) {
      row.querySelectorAll("button").forEach(item => item.disabled = false);
      addMessage(error.message);
    }
  });

  function closeCurrentTab() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "closeCurrentTab" }, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response?.error) {
          reject(new Error(response.error));
        } else if (!response?.ok) {
          reject(new Error("The browser did not confirm that the tab was closed."));
        } else {
          resolve();
        }
      });
    });
  }

  if (SpeechRecognition) {
    mic.addEventListener("click", () => {
      if (activeRecognition) {
        try {
          activeRecognition.stop();
        } catch (error) {
          addMessage(`Could not finish voice capture: ${error.message}. Try selecting the mic again.`);
        }
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = speechLocales[settings.language] || "en-US";
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
      try {
        recognition.onstart = () => {
          mic.title = "Listening — select to finish";
          mic.setAttribute("aria-label", mic.title);
        };
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
            addMessage("I couldn't detect speech. Speak after selecting the mic, check that the microphone is not muted, and match AccessEase's language to your speech. YouTube may need microphone permission separately from the AccessEase site.");
            return;
          }
          const messagesByError = {
            "not-allowed": "Microphone access was blocked for this website. Allow microphone access for YouTube in the browser's site settings, then reload the tab and try again.",
            "service-not-allowed": "Speech recognition is blocked or unavailable in this browser. Try Chrome or Edge on a secure page.",
            "audio-capture": "No microphone is available. Connect or enable a microphone, then try again.",
            "network": "Speech recognition couldn't connect to the browser's speech service. Check your internet connection and try again."
          };
          addMessage(messagesByError[event.error] || `Voice input failed: ${event.error}. Type your message instead.`);
        };
        recognition.onend = () => {
          const spoken = `${[...finalSegments.entries()].sort(([a], [b]) => a - b).map(([, text]) => text).join(" ")} ${interimTranscript}`.trim();
          activeRecognition = null;
          mic.classList.remove("listening");
          mic.setAttribute("aria-pressed", "false");
          mic.title = "Speak";
          mic.setAttribute("aria-label", mic.title);
          if (!spoken) {
            if (!reportedRecognitionError) {
              addMessage("I didn't receive a speech transcript. Check microphone selection, this site's microphone permission, and the AccessEase language. Try again or type your message.");
            }
            return;
          }
          input.value = spoken;
        };
        recognition.start();
      } catch (error) {
        activeRecognition = null;
        mic.classList.remove("listening");
        mic.setAttribute("aria-pressed", "false");
        mic.title = "Speak";
        mic.setAttribute("aria-label", mic.title);
        addMessage(`Could not start voice input: ${error.message}`);
      }
    });
  } else {
    mic.disabled = true;
    mic.title = "Voice input is not supported in this browser. Type your message instead.";
    mic.setAttribute("aria-label", mic.title);
    addMessage(mic.title);
  }

  chrome.runtime.sendMessage({ type: "getSettings" }, response => {
    if (chrome.runtime.lastError) {
      $("#status").textContent = `Backend connection unavailable: ${chrome.runtime.lastError.message}`;
      return;
    }
    if (!response?.accessEaseToken) {
      $("#status").textContent = `Ready · ${document.title || location.hostname}`;
      return;
    }
    settings = { ...settings, ...(response.accessEaseSettings || {}) };
    $("#status").textContent = `Ready · ${document.title || location.hostname}`;
  });
})();
