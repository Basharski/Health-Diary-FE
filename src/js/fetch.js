/**
 * fetch.js
 * Keskitetty moduuli API-kutsuille, token-hallinnalle ja snackbar-ilmoituksille.
 *
 * Vastuut:
 *  - API-pohja-URL:n määrittäminen (ympäristömuuttujasta tai oletuksesta)
 *  - JWT-tokenin tallennus ja haku localStoragesta
 *  - Kirjautuneen käyttäjän tallennus localStoragesta
 *  - fetchData-wrapper: lisää automaattisesti Content-Type ja Authorization -headerit
 *  - showSnackbar: käyttäjälle näytettävät väliaikaiset ilmoitukset
 *
 * AI-avusteinen: Tiedoston rakenne (fetchData-wrapper, header-logiikka) suunniteltiin
 * yhteistyössä GitHub Copilotin kanssa. Koodi on tarkastettu ja ymmärretty.
 */

// API:n pohja-URL – käytetään Viten ympäristömuuttujaa jos saatavilla, muuten localhost
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:3000/api';

/**
 * Näyttää väliaikaisen snackbar-ilmoituksen sivun alareunassa.
 * @param {string} message - Näytettävä viesti
 * @param {boolean} isError - Jos true, näytetään virheväri (punainen), muuten onnistumisväri
 */
export const showSnackbar = (message, isError = false) => {
  const snack = document.getElementById('snackbar');
  if (!snack) return; // Poistu hiljaa jos snackbar-elementtiä ei löydy

  snack.textContent = message;
  snack.className = 'show ' + (isError ? 'error' : 'success');

  // Piilotetaan snackbar 3 sekunnin jälkeen
  setTimeout(() => {
    snack.className = snack.className.replace('show', '');
  }, 3000);
};

// localStorage-avaimet tokenille ja käyttäjätiedoille
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** Hakee JWT-tokenin localStoragesta. Palauttaa null jos ei löydy. */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Tallentaa JWT-tokenin localStorageen kirjautumisen jälkeen. */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/** Poistaa JWT-tokenin localStoragesta (uloskirjautuminen). */
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Hakee tallennetun käyttäjäobjektin localStoragesta.
 * @returns {object|null} Käyttäjäobjekti tai null jos ei löydy tai JSON on virheellinen
 */
export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw); // Parsitaan JSON-merkkijono objektiksi
  } catch {
    return null; // Palautetaan null jos JSON on rikki
  }
};

/**
 * Tallentaa käyttäjäobjektin localStorageen JSON-merkkijonona.
 * @param {object} user - Tallennettava käyttäjäobjekti
 */
export const setStoredUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

/** Poistaa käyttäjätiedot localStoragesta. */
export const clearStoredUser = () => localStorage.removeItem(USER_KEY);

/**
 * Tyhjentää koko session: poistaa tokenin ja käyttäjätiedot.
 * Kutsutaan uloskirjautumisen yhteydessä.
 */
export const clearSession = () => {
  clearToken();
  clearStoredUser();
};

/**
 * Rakentaa täydellisen API-URL:n annetusta polusta.
 * @param {string} path - API-polku, esim. "/entries" tai "/users/1"
 * @returns {string} Täydellinen URL, esim. "http://127.0.0.1:3000/api/entries"
 */
export const apiUrl = (path) => {
  if (!path.startsWith('/')) return `${API_BASE}/${path}`;
  return `${API_BASE}${path}`;
};

/**
 * Yleiskäyttöinen fetch-wrapper joka hoitaa:
 *  - Content-Type JSON -headerin automaattisen lisäyksen
 *  - JWT-tokenin automaattisen liittämisen Authorization-headeriin
 *  - HTTP-virheiden käsittelyn ja snackbar-ilmoitukset
 *  - Tyhjien vastausten (204 No Content) käsittelyn
 *
 * AI-avusteinen: error handling -rakenne ja header-logiikka tehty Copilotin avulla.
 *
 * @param {string} url - Kohde-URL
 * @param {RequestInit} options - fetch()-asetukset (method, body, headers, jne.)
 * @returns {Promise<object>} Vastauksen data tai { error: string } virhetilanteessa
 */
export const fetchData = async (url, options = {}) => {
  try {
    const headers = new Headers(options.headers || {});

    // Asetetaan Content-Type automaattisesti jos lähetetään body-data
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Liitetään JWT-token automaattisesti suojatuille reiteille
    const token = getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    // 204 No Content – palautetaan tyhjä objekti (esim. DELETE-vastaukset)
    if (response.status === 204) {
      return {};
    }

    // Parsitaan vastaus: JSON tai teksti
    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    // HTTP-virhe (4xx, 5xx): heitetään Error joka catchataan alla
    if (!response.ok) {
      const message =
        (data && (data.message || data.error)) ||
        response.statusText ||
        'API Error occurred';
      throw new Error(message);
    }

    // Näytetään snackbar onnistuneille ei-GET-kutsuille joilla on viesti
    const method = (options.method || 'GET').toUpperCase();
    if (data?.message && method !== 'GET') {
      showSnackbar(data.message, false);
    }

    return data || {};
  } catch (error) {
    // Näytetään virhe snackbarissa ja palautetaan error-objekti
    showSnackbar(error.message, true);
    return { error: error.message };
  }
};
