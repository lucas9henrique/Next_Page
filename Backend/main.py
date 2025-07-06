from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import json
import os
import uuid
from git import Repo

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
REPOS_ROOT = os.path.join(os.path.dirname(__file__), "repos")
os.makedirs(REPOS_ROOT, exist_ok=True)


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


class DocumentData(BaseModel):
    email: str
    content: str
    message: str | None = None


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


@app.post("/api/save")
def save_document(data: DocumentData):
    repo_path = os.path.join(REPOS_ROOT, data.email)
    if not os.path.exists(repo_path):
        os.makedirs(repo_path, exist_ok=True)
        repo = Repo.init(repo_path)
    else:
        repo = Repo(repo_path)
    doc_file = os.path.join(repo_path, "document.txt")
    with open(doc_file, "w", encoding="utf-8") as f:
        f.write(data.content)
    repo.index.add(["document.txt"])
    repo.index.commit(data.message or "Update")
    return {"msg": "Document saved"}


@app.get("/api/history/{email}")
def commit_history(email: str):
    repo_path = os.path.join(REPOS_ROOT, email)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="No repository found")
    repo = Repo(repo_path)
    commits = [
        {
            "message": c.message.strip(),
            "timestamp": c.committed_datetime.isoformat(),
        }
        for c in repo.iter_commits()
    ]
    return commits
