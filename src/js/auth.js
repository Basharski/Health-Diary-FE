

import {
  fetchData,
  apiUrl,
  setToken,
  setStoredUser,
  clearSession,
  getToken,
  getStoredUser,
  showSnackbar,
} from "./fetch.js";

export const login = async (username, password) => {
  const res = await fetchData(apiUrl("/auth/login"), {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  // Backend returns: { message, user, token }
  if (res?.token) setToken(res.token);
  if (res?.user) setStoredUser(res.user);

  // Optional: show success if backend didn't include message
  if (!res?.error && !res?.message) {
    showSnackbar("Login successful!", false);
  }

  return res;
};

export const logout = () => {
  clearSession();
  showSnackbar("Logged out", false);
};

export const isLoggedIn = () => Boolean(getToken());

export const currentUser = () => getStoredUser();

export const me = async () => {
  // Requires token; fetchData auto-attaches it
  return fetchData(apiUrl("/auth/me"));
};