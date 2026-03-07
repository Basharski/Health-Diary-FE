
// AI-avusteinen: lomakkeen validointi ja kirjautumisen ohjaus tarkennettu Copilotin avulla.
import { login, isLoggedIn } from "../js/auth.js";
import { showSnackbar } from "../js/fetch.js";

document.addEventListener("DOMContentLoaded", () => {
  const redirectToEntries = () => {
    window.location.href = "../entries/index.html";
  };

  const form = document.getElementById("login-form");
  const userInput = document.getElementById("login-username");
  const passInput = document.getElementById("login-password");
  const submitBtn = document.getElementById("login-submit");

  // If already logged in, you can redirect or just show a message
  if (isLoggedIn()) {
    showSnackbar("Already logged in");
    setTimeout(redirectToEntries, 500);
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = userInput?.value?.trim();
    const password = passInput?.value;

    if (!username || !password) {
      showSnackbar("Username and password required", true);
      return;
    }

    submitBtn && (submitBtn.disabled = true);

    const res = await login(username, password);

    submitBtn && (submitBtn.disabled = false);

    if (!res?.error) {
      showSnackbar(res.message || "Login successful");
      setTimeout(redirectToEntries, 400);
    }
  });
});