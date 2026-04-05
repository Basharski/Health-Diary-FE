# Robot Framework variable file
# Update BASE_URL if your back-end runs on a different host/port

import os
from dotenv import load_dotenv

# Ladataan .env-tiedosto projektin juuresta (Tehtävä 5)
load_dotenv()

BASE_URL = "http://127.0.0.1:3000"
FRONTEND_URL = "http://localhost:5173"
LOGIN_URL = f"{FRONTEND_URL}/src/auth/login.html"

# Tunnukset .env-tiedostosta – älä hardkoodaa oikeita salasanoja lähdekoodiin!
TEST_USERNAME = os.getenv("TEST_USERNAME", "johndoe")
TEST_PASSWORD = os.getenv("TEST_PASSWORD", "password1")
