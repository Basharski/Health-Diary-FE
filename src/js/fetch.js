export const showSnackbar = (message, isError = false) => {
  const snack = document.getElementById("snackbar");
  if (!snack) return;

  snack.textContent = message;
  snack.className = "show " + (isError ? "error" : "success");

  setTimeout(() => {
    snack.className = snack.className.replace("show", "");
  }, 3000);
};

export const fetchData = async (url, options = {}) => {
  try {
    const headers = new Headers(options.headers || {});
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || response.statusText || "API Error occurred";
      throw new Error(message);
    }

    return data || {};
  } catch (error) {
    showSnackbar(error.message, true);
    return { error: error.message };
  }
};