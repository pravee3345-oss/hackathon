async function apiRequest(endpoint, options = {}) {
  if (!API_CONFIG.USE_BACKEND) {
    return { demo: true, success: true };
  }

  const token = localStorage.getItem("accessEaseToken");
  let response;
  try {
    response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Could not connect to the AccessEase backend at ${API_CONFIG.BASE_URL}. Start the backend server and try again.`);
    }
    throw error;
  }

  const responseText = await response.text();
  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) throw new Error("The server returned an invalid response.");
    }
  }
  if (!response.ok) {
    throw new Error(data.error || data.message || `API request failed (${response.status})`);
  }
  return data;
}

const API = {
  health: () => apiRequest("/health"),
  login: (payload) => apiRequest("/auth/login", {
    method: "POST", body: JSON.stringify(payload)
  }),
  register: (payload) => apiRequest("/auth/register", {
    method: "POST", body: JSON.stringify(payload)
  }),
  getSettings: () => apiRequest("/user/settings"),
  updateSettings: (payload) => apiRequest("/user/settings", {
    method: "PUT", body: JSON.stringify(payload)
  }),
  aiChat: (message) => apiRequest("/ai/chat", {
    method: "POST", body: JSON.stringify(message)
  }),
  confirmAIAction: (payload) => apiRequest("/ai/confirm", {
    method: "POST", body: JSON.stringify(payload)
  })
};