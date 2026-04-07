# tests – Robot Framework testitiedostot

Tässä kansiossa ovat kaikki Robot Framework -automaatiotestit.

## Testien ajaminen

```bash
# Kaikki testit
robot --outputdir outputs tests/

# Yksittäinen tiedosto
robot --outputdir outputs tests/login_tests.robot
```

## Testitiedostot

| Tiedosto | Tehtävä | Kuvaus |
|----------|---------|--------|
| [api_tests.robot](api_tests.robot) | Tehtävä 9 | Backend-rajapintatestit (GET /users, GET /items, POST /auth/login) |
| [entry_tests.robot](entry_tests.robot) | Tehtävä 4 | Päiväkirjamerkinnän luonti RequestsLibrary-kirjastolla |
| [login_tests.robot](login_tests.robot) | Tehtävä 2 | Kirjautumistestit selaimessa (Browser Library) |
| [login_env_tests.robot](login_env_tests.robot) | Tehtävä 5 | Kirjautuminen .env-tunnuksilla |
| [login_crypto_tests.robot](login_crypto_tests.robot) | Tehtävä 6 | CryptoLibrary – salatut tunnukset |
| [webform_tests.robot](webform_tests.robot) | Tehtävä 3 | Web-lomakkeen kenttätestit (dropdown, checkbox, radio, file) |

## Tarvittavat kirjastot

```bash
pip install robotframework
pip install robotframework-browser
rfbrowser init
pip install robotframework-requests
pip install robotframework-cryptolibrary
pip install python-dotenv
```
