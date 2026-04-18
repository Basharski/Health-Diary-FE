*** Settings ***
Documentation       Tehtävä 6: Kirjautumistesti CryptoLibraryllä kryptatuilla tunnuksilla
...                 Käyttäjätunnus ja salasana on kryptattu epäsymmetrisellä EC-kryptauksella.
...                 CryptoLibrary purkaa muuttujat automaattisesti (variable_decryption=True).
...
...                 HUOM: Ennen testien ajamista:
...                   1. Aseta yksityisen avaimen salasana ympäristömuuttujaksi:
...                      PowerShell: $env:private_key_password="testkey123"
...                   2. Avainpari sijaitsee: resources/private_key.json
...                   3. Back-end:  node server.js  (port 3000)
...                   4. Front-end: npm run dev     (port 5173)
...
...                 Kryptaus tehty komennolla:
...                   python -c "from CryptoLibrary.utils import CryptoUtility; ..."
...                 Julkinen avain: resources/public_key.key
Library             Browser    auto_closing_level=TEST
Library             CryptoLibrary    %{private_key_password}    variable_decryption=True    key_path=${CURDIR}/../resources
Variables           ../resources/variables.py


*** Variables ***
# Kryptattu käyttäjätunnus: johndoe
${CRYPTO_USER}      crypt:KqsN0IdflRSOo7wZTHqQI9vpwbOSylFMmKbTRbKYJAGqSMSnwdoQY2Je1CqdeZ3fOy94hTiERA==
# Kryptattu salasana: password1
${CRYPTO_PASS}      crypt:Gr7u5qkGW0srUSj85CGuZ6lRgYYBxm0gObDSbSqM4CljNewQeYqtBlM0SzLSLemgQWLAHjxvq2eI


*** Test Cases ***
Kirjautuminen onnistuu kryptatuilla tunnuksilla
    [Documentation]    Kirjaudu CryptoLibraryllä kryptatuilla tunnuksilla.
    ...                CryptoLibrary purkaa automaattisesti ${CRYPTO_USER} ja ${CRYPTO_PASS}
    ...                ennen testiä, koska variable_decryption=True.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${CRYPTO_USER}    delay=0.1 s
    Type Text    id=login-password    ${CRYPTO_PASS}    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    entries

Kryptattu salasana ei näy lokeissa
    [Documentation]    Varmista kirjautuminen ja demonstroi että CryptoLibrary
    ...                piilottaa salasanan lokeista (variable_decryption=True purkaa automaattisesti).
    ...                Type Secret käyttää $-notaatiota, jolloin arvo maskautuu ***-merkeillä lokeissa.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${CRYPTO_USER}    delay=0.1 s
    Type Secret    id=login-password    $CRYPTO_PASS    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    entries
