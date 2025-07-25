import os
import uuid
import sqlite3
import hashlib
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from git import Repo, Actor

from db import get_mongo, MongoDB, Project

def remove_git_lock(path: str):
    lock_path = os.path.join(path, ".git", "index.lock")
    if os.path.exists(lock_path):
        try:
            os.remove(lock_path)
        except PermissionError:
            print(f"⚠️ Não foi possível remover {lock_path} porque está em uso.")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# --- SQLite (usuários e autenticação) -----------------------
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
    payload = {"sub": email, "exp": datetime.utcnow() + timedelta(hours=1)}
    return __import__("jwt").encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> str:
    try:
        payload = __import__("jwt").decode(
            credentials.credentials, SECRET_KEY, algorithms=["HS256"]
        )
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

class UserCredentials(BaseModel):
    email: str
    password: str

class DocumentName(BaseModel):
    name: str

class UserEmail(BaseModel):
    email: str

class DocumentData(BaseModel):
    content: str
    message: str | None = None
    branch: str | None = None

class BranchData(BaseModel):
    document: str
    branch: str

class MergeData(BaseModel):
    document: str
    source: str
    target: str

# --- Endpoints de auth -------------------------------------
@app.post("/api/register")
def register(creds: UserCredentials):
    conn = sqlite3.connect(USERS_DB)
    cur = conn.cursor()
    cur.execute("SELECT email FROM users WHERE email=?", (creds.email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(400, "User already exists")
    salt = uuid.uuid4().hex[:8]
    cur.execute(
        "INSERT INTO users (email, salt, password) VALUES (?, ?, ?)",
        (creds.email, salt, hash_password(creds.password, salt))
    )
    conn.commit(); conn.close()
    return {"msg": "User registered"}

@app.post("/api/login")
def login(creds: UserCredentials):
    conn = sqlite3.connect(USERS_DB)
    cur = conn.cursor()
    cur.execute("SELECT salt, password FROM users WHERE email=?", (creds.email,))
    row = cur.fetchone(); conn.close()
    if not row or hash_password(creds.password, row[0]) != row[1]:
        raise HTTPException(401, "Invalid credentials")
    return {"token": create_token(creds.email)}

# --- Endpoints de documentos -------------------------------
@app.post("/api/documents")
def create_document(
    doc: DocumentName,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    seq = mongo.next_sequence()
    code = f"{seq:03d}{uuid.uuid4().hex[:3].upper()}"
    # cria repositório Git local
    repo_path = os.path.join(REPOS_ROOT, code)
    os.makedirs(repo_path, exist_ok=True)
    Repo.init(repo_path)
    # cria registro no Mongo
    project = Project(nomeProjeto=doc.name, codigo=code, donos=[email])
    mongo.insert_project(project)
    return {"codigo": code}

@app.get("/api/documents")
def list_documents(
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    projs = mongo.list_projects_for_owner(email)
    result = []
    for p in projs:
        branches = []
        repo_path = os.path.join(REPOS_ROOT, p["codigo"])
        if os.path.isdir(repo_path):
            for h in Repo(repo_path).heads:
                branches.append(h.name)
        result.append({
            "codigo": p["codigo"],
            "nomeProjeto": p["nomeProjeto"],
            "ultimaModificacao": p["ultimaModificacao"].isoformat(),
            "branches": branches,
        })
    return result

@app.post("/api/documents/{codigo}/add_user")
def add_user_to_document(
    codigo: str,
    new_user: UserEmail,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(codigo)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    mongo.add_owner(codigo, new_user.email)
    return {"msg": "User added"}

@app.post("/api/branches")
def create_branch(
    data: BranchData,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(data.document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, data.document)
    repo = Repo(path)
    if data.branch in repo.heads:
        raise HTTPException(400, "Branch already exists")
    repo.git.branch(data.branch)
    return {"msg": "Branch created"}

@app.get("/api/branches/{document}")
def list_branches(
    document: str,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, document)
    return [h.name for h in Repo(path).heads]

@app.post("/api/merge")
def merge_branches(
    data: MergeData,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(data.document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, data.document)
    repo = Repo(path)
    repo.git.checkout(data.target)
    try:
        repo.git.merge(data.source)
    except Exception as e:
        raise HTTPException(400, f"Merge failed: {e}")
    return {"msg": "Merge completed"}

@app.post("/api/save/{document}")
def save_document(
    document: str,
    data: DocumentData,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, document)
    remove_git_lock(path)
    branch = data.branch or "main"
    repo = Repo(path)
    if branch in repo.heads:
        repo.git.checkout(branch)
    else:
        repo.git.checkout("-b", branch)
    file_path = os.path.join(path, "document.txt")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(data.content)
    repo.index.add(["document.txt"])
    actor = Actor(email, email)
    repo.index.commit(data.message or "Update", author=actor, committer=actor)
    # atualiza Mongo
    mongo.update_project(document, {"Texto": data.content})
    return {"msg": "Document saved"}

@app.get("/api/load/{document}")
def load_document(
    document: str,
    branch: str | None = None,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, document)
    remove_git_lock(path)
    repo = Repo(path)
    ref = branch or "main"
    if ref in repo.heads:
        repo.git.checkout(ref)
    file_path = os.path.join(path, "document.txt")
    content = open(file_path, "r", encoding="utf-8").read() if os.path.exists(file_path) else ""
    return {"content": content}

@app.get("/api/history/{document}")
def commit_history(
    document: str,
    branch: str | None = None,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or email not in proj["donos"]:
        raise HTTPException(404, "Document not found")
    path = os.path.join(REPOS_ROOT, document)
    ref = branch or "HEAD"
    repo = Repo(path)
    if branch and branch not in [h.name for h in repo.heads]:
        raise HTTPException(404, "Branch not found")
    commits = []
    for c in repo.iter_commits(ref):
        diff = repo.git.show(c.hexsha, "--patch")
        commits.append({
            "hash": c.hexsha,
            "author": c.author.name,
            "message": c.message.strip(),
            "timestamp": c.committed_datetime.isoformat(),
            "diff": diff,
        })
    return commits
