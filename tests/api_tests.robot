*** Settings ***
Documentation       Health Diary API Test Suite
...                 Tests the REST API endpoints of the Health Diary back-end.
Library             RequestsLibrary
Library             Collections
Resource            ../resources/keywords.resource
Variables           ../resources/variables.py

Suite Setup         Create Session    health_diary    ${BASE_URL}    verify=${False}
Suite Teardown      Delete All Sessions


*** Test Cases ***
GET /api/users Returns 200
    [Documentation]    Verify that the users endpoint returns HTTP 200
    ${response}=    GET On Session    health_diary    /api/users
    Should Be Equal As Integers    ${response.status_code}    200

GET /api/items Returns 200
    [Documentation]    Verify that the items endpoint returns HTTP 200
    ${response}=    GET On Session    health_diary    /api/items
    Should Be Equal As Integers    ${response.status_code}    200

POST /api/auth/login Returns 200 With Valid Credentials
    [Documentation]    Verify that login returns HTTP 200 with valid credentials
    ${body}=    Create Dictionary    username=johndoe    password=password1
    ${response}=    POST On Session    health_diary    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${response.status_code}    200
    Dictionary Should Contain Key    ${response.json()}    token

POST /api/auth/login Returns 401 With Invalid Credentials
    [Documentation]    Verify that login returns HTTP 401 with wrong credentials
    ${body}=    Create Dictionary    username=johndoe    password=wrongpassword
    ${response}=    POST On Session    health_diary    /api/auth/login    json=${body}    expected_status=401
    Should Be Equal As Integers    ${response.status_code}    401
