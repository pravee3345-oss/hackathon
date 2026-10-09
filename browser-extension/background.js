const API_BASE = "http://localhost:5001/api";
const MANAGED_TABS_KEY = "accessEaseManagedTabs";
const SERVICE_HOSTS = {
  youtube: ["youtube.com"],
  google: ["google.com"],
  wikipedia: ["wikipedia.org"],
};

function serviceForUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  return Object.entries(SERVICE_HOSTS).find(([, hosts]) =>
    hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
  )?.[0] || null;
}

async function openManagedTab(value) {
  const service = serviceForUrl(value);
  if (!service) throw new Error("The assistant returned an unsupported destination.");
  const tab = await chrome.tabs.create({ url: value, active: true });
  const stored = await chrome.storage.local.get(MANAGED_TABS_KEY);
  const managedTabs = Array.isArray(stored[MANAGED_TABS_KEY]) ? stored[MANAGED_TABS_KEY] : [];
  managedTabs.push({ tabId: tab.id, service });
  await chrome.storage.local.set({ [MANAGED_TABS_KEY]: managedTabs });
}

async function closeManagedTab(service, currentTab) {
  if (!Object.prototype.hasOwnProperty.call(SERVICE_HOSTS, service)) {
    throw new Error("The requested website is not supported.");
  }
  const stored = await chrome.storage.local.get(MANAGED_TABS_KEY);
  const managedTabs = Array.isArray(stored[MANAGED_TABS_KEY]) ? stored[MANAGED_TABS_KEY] : [];
  const index = managedTabs.map(tab => tab.service).lastIndexOf(service);
  if (index < 0) {
    if (serviceForUrl(currentTab?.url || "") !== service || !Number.isInteger(currentTab?.id)) {
      throw new Error(`No open ${service} tab was found here, so nothing was closed.`);
    }
    await chrome.tabs.remove(currentTab.id);
    return;
  }
  const [managedTab] = managedTabs.splice(index, 1);
  await chrome.tabs.remove(managedTab.tabId);
  await chrome.storage.local.set({ [MANAGED_TABS_KEY]: managedTabs });
}

chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.local.get(MANAGED_TABS_KEY).then(stored => {
    const managedTabs = Array.isArray(stored[MANAGED_TABS_KEY]) ? stored[MANAGED_TABS_KEY] : [];
    const remaining = managedTabs.filter(tab => tab.tabId !== tabId);
    if (remaining.length !== managedTabs.length) {
      return chrome.storage.local.set({ [MANAGED_TABS_KEY]: remaining });
    }
  }).catch(error => console.error("[tabs] Failed to update managed-tab list:", error));
});

async function readSession() {
  return chrome.storage.local.get(["accessEaseToken", "accessEaseSettings"]);
}

async function apiRequest(endpoint, body) {
  const { accessEaseToken } = await readSession();
  const headers = { "Content-Type": "application/json" };
  if (accessEaseToken) headers.Authorization = `Bearer ${accessEaseToken}`;

  delete headers.Authorization;

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

  if (message.type === "openManagedTab") {
    openManagedTab(message.url)
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ error: error.message || "The browser could not open this tab." }));
    return true;
  }

  if (message.type === "closeManagedTab") {
    closeManagedTab(message.service, sender.tab)
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ error: error.message || "The browser could not close this tab." }));
    return true;
  }
});
