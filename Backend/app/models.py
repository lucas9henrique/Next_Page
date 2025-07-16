"""
Modelos Pydantic + persistência simples (JSON) para o MVP.
Coloque este arquivo em backend/app/models.py
"""

from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import json

# --- caminho do arquivo de metadados ------------------------------
#  ../documents.json  (fica na raiz do repositório, um nível acima da pasta app)
_DOCS_META = Path(__file__).resolve().parent.parent / "documents.json"
# ------------------------------------------------------------------


class DocumentCreate(BaseModel):
    """
    Payload recebido em POST /documents
    """
    title: str


class DocumentMeta(BaseModel):
    """
    Retorno de POST /documents + armazenamento em disco.
    """
    id: str
    title: str
    last_commit: Optional[str] = None

    # ---------------------------- persistência ---------------------
    def save(self) -> None:
        """
        Grava/atualiza a entrada deste documento em `documents.json`.
        A ideia é ser bem simples para o protótipo; depois você pode
        trocar por SQLite ou SQLModel.
        """
        # Lê o JSON existente (ou cria objeto vazio)
        data: dict[str, dict] = {}
        if _DOCS_META.exists():
            data = json.loads(_DOCS_META.read_text(encoding="utf-8"))

        # Atualiza/insere
        data[self.id] = self.model_dump()

        # Garante diretório e escreve
        _DOCS_META.parent.mkdir(parents=True, exist_ok=True)
        _DOCS_META.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
