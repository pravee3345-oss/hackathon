const API_BASE = "http://localhost:5001/api";

async function readSession() {
  return chrome.storage.local.get(["accessEaseToken", "accessEaseSettings"]);
}

async function apiRequest(endpoint, body) {
  const { accessEaseToken } = await readSession();
  const headers = { "Content-Type": "application/json" };
  if (accessEaseToken) headers.Authorization = `Bearer ${accessEaseToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Cannot reach the backend. Make sure it is running, then check CORS_EXTENSION_ID in server/.env matches this extension ID and restart the backend.");
    }
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status}).`);
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "syncSession") {
    const senderUrl = sender.url || "";
    if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(senderUrl)) {
      sendResponse({ error: "Session sync is only allowed from the local AccessEase app." });
      return;
    }
    const values = message.token
      ? { accessEaseToken: message.token, accessEaseSettings: message.settings || {} }
      : { accessEaseToken: null, accessEaseSettings: null };
    chrome.storage.local.set(values)
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (message.type === "chat" || message.type === "confirm") {
    apiRequest(message.type === "chat" ? "/ai/chat" : "/ai/confirm", message.payload)
      .then(result => sendResponse({ result }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (message.type === "getSettings") {
    readSession().then(sendResponse).catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (message.type === "closeCurrentTab") {
    let tabUrl;
    try {
      tabUrl = new URL(sender.tab?.url || sender.url || "");
    } catch {
      sendResponse({ error: "The current tab is not a regular web page." });
      return;
    }
    const tabId = sender.tab?.id;
    if (!["http:", "https:"].includes(tabUrl.protocol) || !Number.isInteger(tabId)) {
      sendResponse({ error: "The current tab is not a regular web page." });
      return;
    }
    chrome.tabs.remove(tabId)
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ error: error.message || "The browser could not close this tab." }));
    return true;
  }
});
