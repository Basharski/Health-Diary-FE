*** Settings ***
Documentation       Tehtävä 4: Uuden päiväkirjamerkinnän luontitesti
...                 Testaa diary entry -luomista REST API:n kautta kirjautumisen jälkeen.
...
...                 HUOM: Ennen testien ajamista käynnistä:
...                   1. Back-end:  node server.js  (port 3000)
Library             RequestsLibrary
Resource            ../resources/keywords.resource
Variables           ../resources/variables.py

Suite Setup         Create Session    health_diary    ${BASE_URL}    verify=${False}
Suite Teardown      Delete All Sessions


*** Variables ***
${VALID_USER}       johndoe
${VALID_PASS}       password1


*** Test Cases ***
Kirjautuminen onnistuu ja palauttaa tokenin
    [Documentation]    Varmista, että kirjautuminen palauttaa JWT-tokenin,
    ...                jota käytetään suojattujen reittien kutsuihin.
    ${token}=    Login And Get Token    ${VALID_USER}    ${VALID_PASS}
    Should Not Be Empty    ${token}

Uusi päiväkirjamerkintä luodaan onnistuneesti
    [Documentation]    Kirjaudu sisään, luo uusi diary entry POST /api/entries -kutsulla
    ...                ja varmista, että vastaus sisältää luodun merkinnän tiedot.
    ${token}=    Login And Get Token    ${VALID_USER}    ${VALID_PASS}
    ${entry}=    Create Dictionary
    ...    entry_date=2026-04-05
    ...    mood=Hyvä
    ...    weight=${72.5}
    ...    sleep_hours=${8}
    ...    notes=Testiautomaatiolla luotu merkintä
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${response}=    POST On Session    health_diary    /api/entries    json=${entry}    headers=${headers}
    Should Be Equal As Integers    ${response.status_code}    201
    Dictionary Should Contain Key    ${response.json()}    entry_id

Merkinnät haetaan kirjautuneena käyttäjänä
    [Documentation]    Varmista, että GET /api/entries palauttaa kirjautuneen käyttäjän merkinnät.
    ${token}=    Login And Get Token    ${VALID_USER}    ${VALID_PASS}
    ${response}=    Authenticated GET    /api/entries    ${token}
    Should Be Equal As Integers    ${response.status_code}    200
    ${entries}=    Set Variable    ${response.json()}
    Should Not Be Empty    ${entries}

Merkinnän luominen ilman tokenia palauttaa 401
    [Documentation]    Varmista, että uuden merkinnän luominen ilman autentikointia epäonnistuu.
    ${entry}=    Create Dictionary
    ...    entry_date=2026-04-05
    ...    mood=Testi
    ...    weight=${70}
    ...    sleep_hours=${7}
    ...    notes=Ei tokenilla yritetty
    ${response}=    POST On Session    health_diary    /api/entries    json=${entry}    expected_status=401
    Should Be Equal As Integers    ${response.status_code}    401
