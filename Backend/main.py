from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import hashlib
import os
import uuid
import sqlite3
from git import Repo, Actor

app = FastAPI()

# Allow requests from the dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_DB = os.path.join(os.path.dirname(__file__), "users.db")
REPOS_ROOT = os.path.join(os.path.dirname(__file__), "repos")
os.makedirs(REPOS_ROOT, exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY", "change_me")
auth_scheme = HTTPBearer()


def init_db():
    conn = sqlite3.connect(USERS_DB)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, salt TEXT, password TEXT)"
    )
    conn.commit()
    conn.close()


init_db()


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((password + salt).encode()).hexdigest()


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


class UserCredentials(BaseModel):
    email: str
    password: str


class DocumentData(BaseModel):
    content: str
    message: str | None = None
    branch: str | None = None


class DocumentName(BaseModel):
    name: str


class BranchData(BaseModel):
    document: str
    branch: str


class MergeData(BaseModel):
    document: str
    source: str
    target: str


@app.get("/api/hello")
def read_root():
    return {"msg": "Olá, mundo!"}


@app.post("/api/register")
def register(creds: UserCredentials):
    conn = sqlite3.connect(USERS_DB)
    cur = conn.cursor()
    cur.execute("SELECT email FROM users WHERE email=?", (creds.email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    salt = uuid.uuid4().hex[:8]
    cur.execute(
        "INSERT INTO users (email, salt, password) VALUES (?, ?, ?)",
        (creds.email, salt, hash_password(creds.password, salt)),
    )
    conn.commit()
    conn.close()
    return {"msg": "User registered"}


@app.post("/api/login")
def login(creds: UserCredentials):
    conn = sqlite3.connect(USERS_DB)
    cur = conn.cursor()
    cur.execute("SELECT salt, password FROM users WHERE email=?", (creds.email,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    salt, stored_hash = row
    if hash_password(creds.password, salt) != stored_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(creds.email)
    return {"token": token}


def _user_repo(email: str) -> str:
    path = os.path.join(REPOS_ROOT, email)
    os.makedirs(path, exist_ok=True)
    return path


@app.post("/api/documents")
def create_document(doc: DocumentName, email: str = Depends(verify_token)):
    user_path = _user_repo(email)
    doc_path = os.path.join(user_path, doc.name)
    if os.path.exists(doc_path):
        raise HTTPException(status_code=400, detail="Document already exists")
    os.makedirs(doc_path, exist_ok=True)
    Repo.init(doc_path)
    return {"msg": "Document created"}


@app.get("/api/documents")
def list_documents(email: str = Depends(verify_token)):
    user_path = _user_repo(email)
    return [d for d in os.listdir(user_path) if os.path.isdir(os.path.join(user_path, d))]


@app.post("/api/branches")
def create_branch(data: BranchData, email: str = Depends(verify_token)):
    repo_path = os.path.join(REPOS_ROOT, email, data.document)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Document not found")
    repo = Repo(repo_path)
    if data.branch in repo.heads:
        raise HTTPException(status_code=400, detail="Branch already exists")
    repo.git.branch(data.branch)
    return {"msg": "Branch created"}


@app.get("/api/branches/{document}")
def list_branches(document: str, email: str = Depends(verify_token)):
    repo_path = os.path.join(REPOS_ROOT, email, document)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Document not found")
    repo = Repo(repo_path)
    return [h.name for h in repo.heads]


@app.post("/api/merge")
def merge_branches(data: MergeData, email: str = Depends(verify_token)):
    repo_path = os.path.join(REPOS_ROOT, email, data.document)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Document not found")
    repo = Repo(repo_path)
    if data.source not in repo.heads or data.target not in repo.heads:
        raise HTTPException(status_code=404, detail="Branch not found")
    repo.git.checkout(data.target)
    try:
        repo.git.merge(data.source)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Merge failed: {e}")
    return {"msg": "Merge completed"}

#Comentei só pra ver o gif funcionando lá no front, quando tiver criando certinho descomentamos!

# @app.post("/api/save/{document}")
# def save_document(document: str, data: DocumentData, email: str = Depends(verify_token)):
#     repo_path = os.path.join(REPOS_ROOT, email, document)
#     if not os.path.exists(repo_path):
#         raise HTTPException(status_code=404, detail="Document not found")
#     repo = Repo(repo_path)
#     branch = data.branch or "main"
#     if branch in repo.heads:
#         repo.git.checkout(branch)
#     else:
#         repo.git.checkout("-b", branch)
#     doc_file = os.path.join(repo_path, "document.txt")
#     with open(doc_file, "w", encoding="utf-8") as f:
#         f.write(data.content)
#     repo.index.add(["document.txt"])
#     actor = Actor(email, email)
#     repo.index.commit(data.message or "Update", author=actor, committer=actor)
#     return {"msg": "Document saved"}

@app.post("/api/save/{document}")
def save_document(document: str, data: DocumentData):
    return {"msg": "Document saved"}


@app.get("/api/load/{document}")
def load_document(document_id: str):
    return {"msg": "Document loaded"}


@app.get("/api/history/{document}")
def commit_history(document: str, branch: str | None = None, email: str = Depends(verify_token)):
    repo_path = os.path.join(REPOS_ROOT, email, document)
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Document not found")
    repo = Repo(repo_path)
    ref = branch or "HEAD"
    if branch and branch not in repo.heads:
        raise HTTPException(status_code=404, detail="Branch not found")
    commits = []
    for c in repo.iter_commits(ref):
        try:
            diff = repo.git.show(c.hexsha, "--patch")
        except Exception:
            diff = ""
        commits.append(
            {
                "hash": c.hexsha,
                "author": c.author.name,
                "message": c.message.strip(),
                "timestamp": c.committed_datetime.isoformat(),
                "diff": diff,
            }
        )        
    return commits