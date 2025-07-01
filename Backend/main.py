from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import json
import os
import uuid

app = FastAPI()

# Allow requests from the dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")


def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f)


users_db = load_users()


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((password + salt).encode()).hexdigest()


class UserCredentials(BaseModel):
    email: str
    password: str


@app.get("/api/hello")
def read_root():
    return {"msg": "Olá, mundo!"}


@app.post("/api/register")
def register(creds: UserCredentials):
    if creds.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    salt = uuid.uuid4().hex[:8]
    users_db[creds.email] = {
        "salt": salt,
        "password": hash_password(creds.password, salt),
    }
    save_users(users_db)
    return {"msg": "User registered"}


@app.post("/api/login")
def login(creds: UserCredentials):
    user = users_db.get(creds.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if hash_password(creds.password, user["salt"]) != user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful"}
