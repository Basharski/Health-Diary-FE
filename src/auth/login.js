import { fetchData, showSnackbar } from "../js/fetch.js";

const loginUrl = "http://127.0.0.1:3000/api/users/login";
const form = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const statusLine = document.getElementById("login-status");

const renderStatus = (message, isError = false) => {
  if (!statusLine) return;
  statusLine.textContent = message;
  statusLine.className = isError ? "error" : "success";
};

const refreshLoginHint = () => {
  const userId = localStorage.getItem("userId");
  if (!statusLine) return;
  if (userId) {
    statusLine.textContent = `Logged in as user ${userId}. Ready for requests.`;
    statusLine.className = "success";
  } else {
    statusLine.textContent = "Not logged in yet. Submit the form to log in.";
    statusLine.className = "";
  }
};

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      showSnackbar("Check username and password requirements.", true);
      return;
    }

    const payload = {
      username: document.getElementById("login-username").value.trim(),
      password: document.getElementById("login-password").value,
    };

    const result = await fetchData(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (result && !result.error && result.userId) {
      localStorage.setItem("userId", String(result.userId));
      renderStatus("Login successful. Redirecting...", false);
      showSnackbar("Login successful");
      setTimeout(() => {
        window.location.href = "../entries/index.html";
      }, 900);
    } else {
      const message =
        (result && (result.error || result.message)) ||
        "Login failed. Check username/password.";
      renderStatus(message, true);
      showSnackbar(message, true);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    renderStatus("You are logged out.", false);
    showSnackbar("Logged out");
  });
}

refreshLoginHint();