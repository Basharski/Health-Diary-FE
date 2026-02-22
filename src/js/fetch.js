// This function creates the message box
export const showSnackbar = (message, isError = false) => {
  const snack = document.getElementById('snackbar');
  if (!snack) return;

  snack.textContent = message;
  // Apply "error" (red) or "success" (green)
  snack.className = 'show ' + (isError ? 'error' : 'success');

  // Make it disappear after 3 seconds
  setTimeout(() => {
    snack.className = snack.className.replace('show', '');
  }, 3000);
};

// This function talks to your Backend
export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || response.statusText || 'API Error occurred';
      throw new Error(message);
    }

    return data || {};
  } catch (error) {
    // TRIGGER RED BOX
    showSnackbar(error.message, true);
    return { error: error.message };
  }
};