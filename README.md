# 🏥 Health Diary – Front-End

Terveysseurantasovelluksen HTML/CSS/JavaScript-käyttöliittymä, joka kommunikoi RESTful-taustapalvelun kanssa.

## 📋 Sovelluksen ominaisuudet

### 🔐 Autentikointi & Käyttäjähallinta
- **Kirjautuminen** – JWT-pohjainen kirjautuminen käyttäjätunnuksella ja salasanalla
- **Uloskirjautuminen** – Session tyhjennys localStoragesta
- **Kirjautumistilan tunnistus** – Automaattinen uudelleenohjaus jos käyttäjä on jo kirjautunut
- **Käyttäjien listaus** – Kaikkien käyttäjien haku ja näyttäminen taulukossa
- **Käyttäjän luonti** – Uuden käyttäjän rekisteröinti (username, email, password)
- **Käyttäjän poistaminen** – Käyttäjän poisto suoraan taulukosta
- **Oman profiilin päivitys** – Suojattu reitti (vain oma tili), JWT-tokenilla

### 📓 Päiväkirjakirjaukset (Entries)
- **Kirjausten haku** – Suojattu reitti, palauttaa vain kirjautuneen käyttäjän kirjaukset
- **Kirjauksen luonti** – Uuden kirjauksen lisääminen (päivämäärä, mieliala, paino, unimäärä, muistiinpanot)
- **Kirjauksen päivitys** – Olemassa olevan kirjauksen muokkaus
- **Kirjauksen poistaminen** – Kirjauksen poisto
- **Kirjausten näyttäminen korteissa** – Responsiivinen card-pohjainen näkymä

### 📦 Kohteet (Items)
- **Kohteiden listaus** – Kaikki kohteet haetaan ja näytetään taulukossa
- **Kohteen haku ID:llä** – Yksittäisen kohteen tietojen haku
- **Kohteen lisääminen** – Uuden kohteen luonti (nimi, paino)
- **Kohteen päivittäminen** – Olemassa olevan kohteen tietojen muokkaus
- **Kohteen poistaminen** – Kohteen poisto vahvistuksen kera
- **Info-dialogi** – Modal-ikkuna kohteen yksityiskohtaisille tiedoille

### ⚖️ BMI-laskin
- Painoindeksin laskeminen pituuden ja painon perusteella
- BMI-kategorian näyttäminen taulukossa korostettuna
- Tekstimuotoinen analyysi tuloksesta

### 🌐 Fetch API Lab
- Erillinen harjoitussivu API-kutsujen testaamiseen

### 🎨 Käyttöliittymä
- Responsiivinen navigaatiopalkki kaikilla sivuilla
- Hero-banneri jokaisella sivulla
- Snackbar-ilmoitukset onnistuneista ja epäonnistuneista toiminnoista
- Yhtenäinen CSS-tyylimäärittely (`src/css/style.css`)

---

## 🗄️ Tietokannan rakenne

Tietokanta suunniteltiin MySQL-yhteensopivaksi. Back-end käyttää tällä hetkellä in-memory -tietorakennetta (taulukot).

```mermaid
erDiagram

Users {
    int user_id PK
    varchar username
    varchar password
    varchar email
    datetime created_at
    varchar user_level
}

DiaryEntries {
    int entry_id PK
    int user_id FK
    date entry_date
    varchar mood
    decimal weight
    int sleep_hours
    text notes
    datetime created_at
}

Workouts {
    int workout_id PK
    int user_id FK
    varchar workout_type
    int duration_minutes
    int calories_burned
    date workout_date
}

Users ||--o{ DiaryEntries : "has"
Users ||--o{ Workouts : "performs"
```

### Taulut

| Taulu | Kuvaus |
|-------|--------|
| `Users` | Käyttäjätiedot: käyttäjänimi, salasana (bcrypt-hash), sähköposti, taso |
| `DiaryEntries` | Päiväkirjakirjaukset: päivämäärä, mieliala, paino, unet, muistiinpanot |
| `Workouts` | Treenikirjaukset: tyyppi, kesto, kalorit, päivämäärä |

> **Huom:** Back-end tallentaa datan muistiin (`src/users.js`, `src/entries.js`, `src/items.js`). Palvelimen uudelleenkäynnistys nollaa datan. SQL-skeema löytyy tiedostosta [`db/health_diary.sql`](https://github.com/Basharski/Health-Diary-BE/blob/main/db/health_diary.sql).

---

## 📁 Projektirakenne

```
Health-Diary-FE/
├── index.html              # Etusivu
├── fetchtestaus.html       # Fetch API -harjoitussivu
├── src/
│   ├── auth/
│   │   ├── login.html      # Kirjautumissivu
│   │   └── login.js        # Kirjautumislogiikka
│   ├── bmi/
│   │   ├── index.html      # BMI-laskinsivu
│   │   └── bmi.js          # BMI-laskentalogiikka
│   ├── entries/
│   │   └── index.html      # Päiväkirjakirjaukset (kortit)
│   ├── js/
│   │   ├── fetch.js        # Fetch-apufunktiot, token-hallinta, snackbar
│   │   ├── auth.js         # Auth-funktiot (login, logout, me)
│   │   ├── entries.js      # Entries CRUD -funktiot
│   │   ├── items.js        # Items CRUD + UI-logiikka
│   │   ├── users.js        # Users CRUD + UI-logiikka
│   │   └── main.js         # Päämoduuli
│   ├── css/
│   │   └── style.css       # Globaali tyylimäärittely
│   ├── about/              # Tietoa-sivu
│   └── contact/            # Yhteystiedot-sivu
├── public/
├── vite.config.js
└── package.json
```

---

## 🖼️ Kuvakaappaukset sovelluksen näkymistä


### Etusivu
<img width="1919" height="849" alt="Screenshot 2026-03-07 092020" src="https://github.com/user-attachments/assets/cf4bf802-3ddc-40b9-973c-92d229bf53bd" />

### Kirjautumissivu
<img width="1919" height="848" alt="Screenshot 2026-03-07 092114" src="https://github.com/user-attachments/assets/03228cfb-9380-4006-b2d0-86b9e149b23c" />

### Päiväkirjakirjaukset
<img width="1919" height="832" alt="Screenshot 2026-03-07 092159" src="https://github.com/user-attachments/assets/70b5781d-53fc-4c50-b567-c0500f1acb4d" />

### BMI-laskin
<img width="1919" height="854" alt="Screenshot 2026-03-07 092745" src="https://github.com/user-attachments/assets/bdd3d304-1a9d-44bd-b7f4-100ca5b6ec6b" />

---

## 🚀 Asennus ja käynnistys

### Vaatimukset
- Node.js (v18+)
- Back-end palvelin käynnissä (`http://127.0.0.1:3000`)

### Front-end

```bash
npm install
npm run dev
```

### Back-end (erillinen repo)

```bash
# Kloonaa: https://github.com/Basharski/Health-Diary-BE
npm install
npm run dev
```

Palvelin käynnistyy osoitteeseen `http://127.0.0.1:3000`.

### Ympäristömuuttujat

Luo `.env`-tiedosto FE-projektin juureen (valinnainen):

```env
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

---

## 🔌 API-endpointit (Back-end)

| Metodi | Polku | Suojattu | Kuvaus |
|--------|-------|----------|--------|
| `POST` | `/api/auth/login` | ❌ | Kirjautuminen, palauttaa JWT-tokenin |
| `GET` | `/api/auth/me` | ✅ | Palauttaa kirjautuneen käyttäjän tiedot |
| `GET` | `/api/users` | ❌ | Hakee kaikki käyttäjät |
| `POST` | `/api/users` | ❌ | Luo uuden käyttäjän |
| `PUT` | `/api/users/:id` | ✅ | Päivittää käyttäjän (vain oma) |
| `DELETE` | `/api/users/:id` | ❌ | Poistaa käyttäjän |
| `GET` | `/api/entries` | ✅ | Hakee kirjautuneen käyttäjän kirjaukset |
| `GET` | `/api/entries/:id` | ✅ | Hakee yksittäisen kirjauksen |
| `POST` | `/api/entries` | ✅ | Luo uuden kirjauksen |
| `PUT` | `/api/entries/:id` | ✅ | Päivittää kirjauksen |
| `DELETE` | `/api/entries/:id` | ✅ | Poistaa kirjauksen |
| `GET` | `/api/items` | ❌ | Hakee kaikki kohteet |
| `GET` | `/api/items/:id` | ❌ | Hakee yksittäisen kohteen |
| `POST` | `/api/items` | ❌ | Luo uuden kohteen |
| `PUT` | `/api/items/:id` | ❌ | Päivittää kohteen |
| `DELETE` | `/api/items/:id` | ❌ | Poistaa kohteen |

---

## ⚠️ Tunnetut bugit / ongelmat

- **In-memory data:** Back-end ei käytä pysyvää tietokantaa – palvelimen uudelleenkäynnistys nollaa kaiken datan
- **Items-suojaus:** Items-endpointit eivät vaadi autentikointia (suunniteltu harjoitustarkoituksiin)

---

## 📚 Lähteet, tutoriaalit ja käytetyt teknologiat

### Teknologiat & kirjastot
- [Express.js](https://expressjs.com/) – Back-end web-framework
- [Vite](https://vitejs.dev/) – Front-end build-työkalu
- [express-validator](https://express-validator.github.io/) – Syötteiden validointi
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JWT-autentikointi
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Salasanojen hashaus
- [dotenv](https://github.com/motdotla/dotenv) – Ympäristömuuttujat
- [cors](https://github.com/expressjs/cors) – Cross-Origin Resource Sharing

### Oppimislähteet
- [MDN Web Docs – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs – localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN Web Docs – ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [JWT.io – JSON Web Tokens](https://jwt.io/)
- [Express.js Documentation](https://expressjs.com/en/guide/routing.html)

### 🤖 Tekoälyn hyödyntäminen
Projektin kehityksessä hyödynnettiin GitHub Copilotia seuraavissa asioissa:
- README.md-tiedoston rakentaminen ja jäsentely
- Koodikommenttien kirjoittaminen
- Virheenkorjausapua fetch-funktioiden kanssa
- Koodin refaktorointiehdotuksia

> Tekoälyn tuottama koodi on tarkastettu ja ymmärretty ennen käyttöönottoa. AI-avusteinen koodi on merkitty kommenteilla lähdekoodissa.

---

## 🧪 Testikäyttäjät

Seuraavat testikäyttäjät löytyvät Back‑endistä (src/users.js):

- **username:** `johndoe` | **password:** `password1`
- **username:** `janedoe` | **password:** `password2`
- **username:** `bobsmith` | **password:** `password3`

---

## 🔗 Linkit

- **Julkaistu sovellus:** https://users.metropolia.fi/~bashara/FE-Web_Sovellu/FE_FINAL/
- **Front-end repo:** https://github.com/Basharski/Health-Diary-FE
- **Back-end repo:** https://github.com/Basharski/Health-Diary-BE