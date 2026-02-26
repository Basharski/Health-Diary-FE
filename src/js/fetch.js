

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:3000/api";

export const showSnackbar = (message, isError = false) => {
  const snack = document.getElementById("snackbar");
  if (!snack) return;

  snack.textContent = message;
  snack.className = "show " + (isError ? "error" : "success");

  setTimeout(() => {
    snack.className = snack.className.replace("show", "");
  }, 3000);
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearStoredUser = () => localStorage.removeItem(USER_KEY);

export const clearSession = () => {
  clearToken();
  clearStoredUser();
};

export const apiUrl = (path) => {
  if (!path.startsWith("/")) return `${API_BASE}/${path}`;
  return `${API_BASE}${path}`;
};

export const fetchData = async (url, options = {}) => {
  try {
    const headers = new Headers(options.headers || {});

    // If sending JSON body, ensure content-type is set
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Attach JWT automatically (for protected routes)
    const token = getToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    // Handle empty responses (204 etc.)
    if (response.status === 204) {
      return {};
    }

    const contentType = response.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const message =
        (data && (data.message || data.error)) ||
        response.statusText ||
        "API Error occurred";
      throw new Error(message);
    }

    // Success snackbar (only when backend returned message)
    const method = (options.method || "GET").toUpperCase();
    if (data?.message && method !== "GET") {
      showSnackbar(data.message, false);
    }

    return data || {};
  } catch (error) {
    showSnackbar(error.message, true);
    return { error: error.message };
  }
};