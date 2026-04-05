*** Settings ***
Documentation       Tehtävä 5: Kirjautumistesti .env-tiedostoon piilotettuilla tunnuksilla
...                 Käyttäjätunnus ja salasana ladataan .env-tiedostosta
...                 resources/variables.py:n kautta (python-dotenv).
...
...                 HUOM: Ennen testien ajamista:
...                   1. Tarkista, että projektin juuressa on .env-tiedosto:
...                      TEST_USERNAME=johndoe
...                      TEST_PASSWORD=password1
...                   2. Back-end:  node server.js  (port 3000)
...                   3. Front-end: npm run dev     (port 5173)
Library             Browser    auto_closing_level=TEST
Variables           ../resources/variables.py


*** Test Cases ***
Kirjautuminen onnistuu .env-tiedoston tunnuksilla
    [Documentation]    Kirjaudu sisään .env-tiedostosta python-dotenvilla ladatuilla tunnuksilla.
    ...                TEST_USERNAME ja TEST_PASSWORD haetaan automaattisesti .env-tiedostosta.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${TEST_USERNAME}    delay=0.1 s
    Type Text    id=login-password    ${TEST_PASSWORD}    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    entries

Kirjautuminen epäonnistuu väärällä .env-salasanalla
    [Documentation]    Varmista, että väärä salasana estää kirjautumisen.
    ...                Käyttäjätunnus haetaan .env:stä, mutta salasana on selvästi väärä.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${TEST_USERNAME}    delay=0.1 s
    Type Text    id=login-password    vaarasalasana123    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    login
