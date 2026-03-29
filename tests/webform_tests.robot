*** Settings ***
Documentation       Tehtävä 3: Web form -testit Browser Libraryn avulla
...                 Testaa Selenium Web Form -esimerkkisivun kenttiä:
...                 Dropdown (select), Dropdown (datalist), File input,
...                 Checkboxit ja Radio buttonit.
...                 Testisivu: https://www.selenium.dev/selenium/web/web-form.html
Library             Browser    auto_closing_level=SUITE


*** Variables ***
${WEBFORM_URL}      https://www.selenium.dev/selenium/web/web-form.html
${FORM_PASSWORD}    salasana


*** Test Cases ***
Dropdown Select - Valitaan vaihtoehto listasta
    [Documentation]    Testaa normaalia <select>-pudotusvalikkoa.
    ...    Valitaan "Two" ja varmistetaan arvo.
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    Select Options By    select[name="my-select"]    value    2
    ${arvo}=    Get Selected Options    select[name="my-select"]    value
    Should Be Equal    ${arvo}[0]    2

Dropdown Datalist - Kirjoitetaan arvo datalist-kenttään
    [Documentation]    Testaa <datalist>-pudotusvalikkoa, johon voi kirjoittaa vapaasti
    ...    tai valita ehdotetuista arvoista.
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    Type Text    input[name="my-datalist"]    New York    delay=0.1 s
    ${arvo}=    Get Property    input[name="my-datalist"]    value
    Should Be Equal    ${arvo}    New York

Checkbox - Checked-tila vaihdetaan
    [Documentation]    Testaa checkboxia: oletuksena checkbox 1 on checked ja checkbox 2 on unchecked.
    ...    Poistetaan valinta checkbox 1:stä ja asetetaan checkbox 2 checked-tilaan.
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    # Checkbox 1 on oletuksena checked – klikataan se pois päältä
    ${checked_before}=    Get Property    id=my-check-1    checked
    Should Be True    ${checked_before}
    Uncheck Checkbox    id=my-check-1
    ${checked_after}=    Get Property    id=my-check-1    checked
    Should Not Be True    ${checked_after}
    # Checkbox 2 on oletuksena unchecked – asetetaan se checked-tilaan
    ${unchecked_before}=    Get Property    id=my-check-2    checked
    Should Not Be True    ${unchecked_before}
    Check Checkbox    id=my-check-2
    ${unchecked_after}=    Get Property    id=my-check-2    checked
    Should Be True    ${unchecked_after}

Radio Button - Valitaan toinen vaihtoehto
    [Documentation]    Testaa radio-nappeja: valitaan radio 2 ja varmistetaan,
    ...    että se on valittu ja radio 1 ei ole.
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    # Oletuksena radio 1 on valittu
    ${radio1_default}=    Get Property    id=my-radio-1    checked
    Should Be True    ${radio1_default}
    # Klikataan radio 2
    Click    id=my-radio-2
    ${radio2_checked}=    Get Property    id=my-radio-2    checked
    Should Be True    ${radio2_checked}
    # Radio 1 ei enää ole valittu
    ${radio1_after}=    Get Property    id=my-radio-1    checked
    Should Not Be True    ${radio1_after}

File Input - Tiedostokenttä tunnistetaan
    [Documentation]    Varmistaa, että tiedostokenttä löytyy sivulta ja on vuorovaikutteinen.
    ...    (Tiedoston lataus ei tehdä tässä testissä.)
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    ${type}=    Get Property    input[name="my-file"]    type
    Should Be Equal    ${type}    file

Kaikkien kenttien lomake lähetetään onnistuneesti
    [Documentation]    Täyttää kaikki testatut kentät ja klikkaa Submit – varmistaa kuittaussivun.
    New Browser    chromium    headless=No
    New Page    ${WEBFORM_URL}
    Get Title    ==    Web form
    # Peruskentät
    Type Text    input[name="my-text"]    Testi    delay=0.05 s
    Type Secret    input[name="my-password"]    $FORM_PASSWORD    delay=0.05 s
    Type Text    textarea[name="my-textarea"]    Robot Framework testi    delay=0.05 s
    # Dropdown
    Select Options By    select[name="my-select"]    value    3
    # Datalist
    Type Text    input[name="my-datalist"]    San Francisco    delay=0.05 s
    # Checkbox ja radio
    Check Checkbox    id=my-check-2
    Click    id=my-radio-2
    # Submit
    Click With Options    css=button[type="submit"]    delay=1 s
    Get Text    id=message    ==    Received!
