*** Settings ***
Documentation       Tehtävä 2: Kirjautumistesti Health Diary -sovellukselle
...                 Testaa kirjautumislomakkeen toimintaa Browser Libraryn avulla.
...
...                 HUOM: Ennen testien ajamista käynnistä:
...                   1. Back-end:  node server.js  (port 3000)
...                   2. Front-end: npm run dev     (port 5173)
Library             Browser    auto_closing_level=SUITE
Variables           ../resources/variables.py


*** Variables ***
${LOGIN_URL}        http://localhost:5173/src/auth/login.html
${VALID_USER}       johndoe
${VALID_PASS}       password1
${INVALID_PASS}     wrongpassword


*** Test Cases ***
Onnistunut kirjautuminen ohjaa entries-sivulle
    [Documentation]    Kirjaudu oikeilla tunnuksilla ja varmista, että sivu ohjautuu entries-sivulle.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${VALID_USER}    delay=0.1 s
    Type Text    id=login-password    ${VALID_PASS}    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    entries

Epäonnistunut kirjautuminen pysyy kirjautumissivulla
    [Documentation]    Kirjaudu väärällä salasanalla ja varmista, että sivu ei ohjaudu pois.
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Get Title    ==    My Health Diary - Login
    Type Text    id=login-username    ${VALID_USER}    delay=0.1 s
    Type Text    id=login-password    ${INVALID_PASS}    delay=0.1 s
    Click    id=login-submit
    Sleep    1.5 s
    Get Url    contains    login

Tyhjillä tunnuksilla ei voi kirjautua
    [Documentation]    Varmista, että tyhjillä kentillä submit ei toimi (HTML5 required-validointi).
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}
    Click    id=login-submit
    ${url}=    Get Url
    Should Contain    ${url}    login
