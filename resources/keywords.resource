*** Settings ***
Documentation    Common keywords for Health Diary API tests
Library          RequestsLibrary


*** Keywords ***
Login And Get Token
    [Documentation]    Log in with given credentials and return the JWT token
    [Arguments]    ${username}    ${password}
    ${body}=    Create Dictionary    username=${username}    password=${password}
    ${response}=    POST On Session    health_diary    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${response.status_code}    200
    RETURN    ${response.json()}[token]

Authenticated GET
    [Documentation]    Perform a GET request with a Bearer token
    [Arguments]    ${path}    ${token}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${response}=    GET On Session    health_diary    ${path}    headers=${headers}
    RETURN    ${response}
