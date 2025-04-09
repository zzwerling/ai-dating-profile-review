import firebase_admin
from firebase_admin import credentials

from dotenv import load_dotenv

import base64
import json
import os

def init_firebase_from_env():
    b64_creds = os.getenv("FIREBASE_CREDENTIALS_B64")
    if not b64_creds:
        raise ValueError("Missing FIREBASE_CREDENTIALS_B64 in environment")

    decoded_json = base64.b64decode(b64_creds).decode("utf-8")
    creds_dict = json.loads(decoded_json)
    cred = credentials.Certificate(creds_dict)

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

