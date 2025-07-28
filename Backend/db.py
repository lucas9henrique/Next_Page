# db.py
from dotenv import load_dotenv
load_dotenv()   # carrega MONGO_URL e MONGO_DB do .env para os.environ

import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict

from pydantic import BaseModel, Field
from pymongo import MongoClient, ReturnDocument
from pymongo.collection import Collection
from pymongo.results import InsertOneResult, UpdateResult

# não precisa de fallback com senha hard‑code!
MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB  = os.getenv("MONGO_DB", "next_page")

class Project(BaseModel):
    nomeProjeto: str
    codigo: str
    ultimaModificacao: datetime = Field(default_factory=datetime.utcnow)
    dono: str
    permissions: List[str] = Field(default_factory=list)
    Texto: str = ""
    branch: str = "main"
    branches: List[Dict] = Field(default_factory=list)

class MongoDB:
    def __init__(self):
        self.client: MongoClient = MongoClient(MONGO_URL)
        self.db = self.client[MONGO_DB]
        self.projects: Collection = self.db["NextPage"]
        self.counters: Collection = self.db["counters"]

    def next_sequence(self) -> int:
        doc = self.counters.find_one_and_update(
            {"_id": "project"},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        seq = doc.get("seq", 0) % 1000
        self.counters.update_one({"_id": "project"}, {"$set": {"seq": seq}})
        return seq

    def insert_project(self, proj: Project) -> str:
        if self.projects.find_one({"codigo": proj.codigo}):
            raise ValueError(f"Código '{proj.codigo}' já existe.")
        res: InsertOneResult = self.projects.insert_one(proj.dict())
        return str(res.inserted_id)

    def get_project(self, codigo: str) -> Optional[dict]:
        proj = self.projects.find_one({"codigo": codigo})
        if proj:
            proj["_id"] = str(proj["_id"])
        return proj

    def list_projects_for_user(self, user: str) -> List[dict]:
        projs = list(self.projects.find({
            "$or": [
                {"dono": user},
                {"permissions": user},
            ]
        }))
        for p in projs:
            p["_id"] = str(p["_id"])
        return projs

    def add_permission(self, codigo: str, user: str) -> None:
        self.projects.update_one({"codigo": codigo}, {"$addToSet": {"permissions": user}})


    def remove_permission(self, codigo: str, user: str) -> None:
        self.projects.update_one({"codigo": codigo}, {"$pull": {"permissions": user}})

    def update_project(self, codigo: str, data: dict) -> int:
        data["ultimaModificacao"] = datetime.utcnow()
        res: UpdateResult = self.projects.update_one(
            {"codigo": codigo},
            {"$set": data}
        )
        return res.modified_count
    
    def delete_project(self, codigo: str) -> int:
        """Remove um projeto e retorna o número de documentos excluídos."""
        res = self.projects.delete_one({"codigo": codigo})
        return res.deleted_count
    def delete(self, codigo: str) -> int:
        return self.delete_project(codigo)

# dependency para FastAPI
def get_mongo() -> MongoDB:
    return MongoDB()
