import os
import uuid
import sqlite3
import hashlib
import shutil
from datetime import datetime, timedelta
from pathlib import Path   
from git import Repo, Actor
from git.exc import GitCommandError
from pathlib import Path
from collections import defaultdict
from typing import List
from fastapi import WebSocket, WebSocketDisconnect
import asyncio

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from git import Repo, Actor

from db import get_mongo, MongoDB, Project

repo_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

active_connections: dict[str, list[WebSocket]] = defaultdict(list)

class UserPermissionInfo(BaseModel):
    email: str
    role: str # 'owner' ou 'collaborator'

def remove_git_lock(path: str):
    lock_path = os.path.join(path, ".git", "index.lock")
    if os.path.exists(lock_path):
        try:
            os.remove(lock_path)
        except PermissionError:
            print(f"Não foi possível remover {lock_path} porque está em uso.")

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

def has_access(proj: dict, user: str) -> bool:
    """Check if the given user can access/modify the project."""
    return user == proj.get("dono") or user in proj.get("permissions", [])

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
    title: str | None = None

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
    # gera o código do projeto
    seq = mongo.next_sequence()
    code = f"{seq:03d}{uuid.uuid4().hex[:3].upper()}"

    # cria o repositório local já com a branch “main”
    repo_path = os.path.join(REPOS_ROOT, code)
    os.makedirs(repo_path, exist_ok=True)
    repo = Repo.init(repo_path, initial_branch="main")   # importante!

    # cria o arquivo de trabalho vazio + commit inicial
    file_path = Path(repo_path) / "document.txt"
    file_path.touch()               # apenas cria o arquivo
    repo.index.add(["document.txt"])
    actor = Actor(email, email)     # autor/committer = usuário dono
    repo.index.commit("Initial commit",
                      author=actor,
                      committer=actor)

    # cria registro no Mongo
    project = Project(nomeProjeto=doc.name, codigo=code, dono=email)
    mongo.insert_project(project)
    return {"codigo": code}

@app.get("/api/documents")
def list_documents(
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    projs = mongo.list_projects_for_user(email)
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
    if not proj or not has_access(proj, email):
        raise HTTPException(404, "Document not found")
    mongo.add_permission(codigo, new_user.email)
    return {"msg": "User added"}

@app.post("/api/branches")
def create_branch(
    data: BranchData,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(data.document)
    if not proj or not has_access(proj, email):
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
    if not proj or not has_access(proj, email):
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
    if not proj or not has_access(proj, email):
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
async def save_document(
    document: str,
    data: DocumentData,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or not has_access(proj, email):
        raise HTTPException(404, "Document not found")
    
    path = os.path.join(REPOS_ROOT, document)
    remove_git_lock(path)

    branch = data.branch or "main"
    repo = Repo(path)

    async with repo_locks[document]:           
        if repo.head.is_valid() and repo.active_branch.name != branch:
            try:
                repo.git.checkout(branch)
            except GitCommandError:
                repo.git.checkout(branch, force=True)
        elif branch not in repo.heads:
            repo.git.checkout("-b", branch)     

        file_path = Path(path) / "document.txt"
        file_path.write_text(data.content, encoding="utf-8")

        if repo.is_dirty(untracked_files=True):
            repo.index.add(["document.txt"])
            actor = Actor(email, email)
            repo.index.commit(data.message or "Update",
                              author=actor, committer=actor)

    update_fields: dict[str, str] = {"Texto": data.content}
    if data.title is not None:
        update_fields["nomeProjeto"] = data.title

    # Persist updated text and optional title in MongoDB
    if update_fields:
        mongo.update_project(document, update_fields)

    return {"msg": "Document saved"}



@app.get("/api/load/{document}")
def load_document(
    document: str,
    branch: str | None = None,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    # busca o projeto no Mongo
    proj = mongo.get_project(document)
    if not proj or not has_access(proj, email):
        raise HTTPException(status_code=404, detail="Document not found")

    # monta o path do repositório e faz checkout
    path = os.path.join(REPOS_ROOT, document)
    remove_git_lock(path)
    repo = Repo(path)
    ref = branch or "main"
    if ref in repo.heads:
        repo.git.checkout(ref)

    # lê o conteúdo do arquivo
    file_path = os.path.join(path, "document.txt")
    content = ""
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

    # aqui pegamos o título do projeto vindo do MongoDB
    # supondo que o campo se chame "nomeProjeto"
    title = proj.get("nomeProjeto", "Título do Documento")

    # retornamos ambos
    return {
        "content": content,
        "title": title,
    }

@app.post("/api/documents/{codigo}/remove_user")
def remove_user_from_document(
    codigo: str,
    user_to_remove: UserEmail,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),  
):

    proj = mongo.get_project(codigo)

    if not proj:
        raise HTTPException(status_code=404, detail="Document not found")

    if proj.get("dono") != email:
        raise HTTPException(status_code=403, detail="Forbidden: Only the document owner can remove users.")

    if user_to_remove.email not in proj.get("permissions", []):
        raise HTTPException(status_code=404, detail="User to be removed not found in this document's permissions.")

    mongo.remove_permission(codigo, user_to_remove.email)

    return {"msg": f"User {user_to_remove.email} removed successfully from document {codigo}."}


@app.delete("/api/documents/{codigo}")
def delete_document(
    codigo: str,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):

    proj = mongo.get_project(codigo)

    if not proj:
        raise HTTPException(status_code=404, detail="Document not found")

    if proj.get("dono") != email:
        raise HTTPException(status_code=403, detail="Forbidden: Only the document owner can delete the document.")

    mongo.db.projects.delete_one({"codigo": codigo})

    repo_path = os.path.join(REPOS_ROOT, codigo)
    if os.path.exists(repo_path):
        try:
            shutil.rmtree(repo_path)
        except Exception as e:
            print(f"CRITICAL: Failed to delete repository folder {repo_path}. Please remove manually. Error: {e}")
            return {"msg": "Document deleted from database, but failed to delete repository files."}

    return {"msg": f"Document {codigo} has been permanently deleted."}

@app.get("/api/documents/{codigo}/users", response_model=List[UserPermissionInfo])
def list_document_users(
    codigo: str,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
   
    proj = mongo.get_project(codigo)

    if not proj or not has_access(proj, email):
        raise HTTPException(status_code=404, detail="Document not found or access denied")

    users_list = []

    if proj.get("dono"):
        users_list.append({"email": proj["dono"], "role": "owner"})

    for collaborator_email in proj.get("permissions", []):
        users_list.append({"email": collaborator_email, "role": "collaborator"})

    return users_list

@app.get("/api/history/{document}")
def commit_history(
    document: str,
    branch: str | None = None,
    mongo: MongoDB = Depends(get_mongo),
    email: str = Depends(verify_token),
):
    proj = mongo.get_project(document)
    if not proj or not has_access(proj, email):
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
