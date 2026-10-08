async function apiRequest(endpoint, options = {}) {
  if (!API_CONFIG.USE_BACKEND) {
    return { demo: true, success: true };
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

const API = {
  login: (payload) => apiRequest("/auth/login", {
    method: "POST", body: JSON.stringify(payload)
  }),
  register: (payload) => apiRequest("/auth/register", {
    method: "POST", body: JSON.stringify(payload)
  }),
  updateSettings: (payload) => apiRequest("/user/settings", {
    method: "PUT", body: JSON.stringify(payload)
  }),
  aiChat: (message) => apiRequest("/ai/chat", {
    method: "POST", body: JSON.stringify({ message })
  })
};