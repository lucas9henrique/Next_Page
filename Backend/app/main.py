from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .models import DocumentCreate, DocumentMeta
from .versioning import GitRepository
from .crdt import CRDTDocument

app = FastAPI(title="Collaborative Editor API")

# --- memória volátil -------------------------------------------
active_docs: dict[str, CRDTDocument] = {}
active_connections: dict[str, list[WebSocket]] = {}
# ---------------------------------------------------------------


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/documents", response_model=DocumentMeta)
async def create_document(payload: DocumentCreate):
    """
    Cria um novo documento e um repositório Git vazio associado.
    """
    doc = CRDTDocument()                     # Documento inicial em branco
    active_docs[doc.id] = doc
    GitRepository(doc.id).commit_snapshot(doc.text)  # Primeiro commit

    meta = DocumentMeta(id=doc.id, title=payload.title)
    meta.save()                              # Persiste metadados em JSON
    return meta


@app.websocket("/ws/{doc_id}")
async def websocket_endpoint(websocket: WebSocket, doc_id: str):
    """
    Canal de edição colaborativa.  
    - Recebe *patches* JSON do front (Tiptap/Slate/etc.).  
    - Aplica ao CRDT local.  
    - Retransmite aos demais clientes.  
    - Faz snapshot em Git a cada alteração (pode colocar debounce depois).
    """
    await websocket.accept()

    # Recupera ou cria o documento em memória
    if doc_id not in active_docs:
        repo = GitRepository(doc_id)
        doc = CRDTDocument()
        if repo.exists():                    # Carrega última versão, se houver
            doc.apply_snapshot(repo.latest_snapshot())
        active_docs[doc_id] = doc

    conns = active_connections.setdefault(doc_id, [])
    conns.append(websocket)

    # Envia o estado inicial para quem acabou de entrar
    await websocket.send_text(active_docs[doc_id].text)

    try:
        while True:
            patch = await websocket.receive_text()
            doc = active_docs[doc_id]
            doc.apply_patch(patch)

            # Re-envia a patch para todos os outros clientes
            for conn in conns:
                if conn is not websocket:
                    await conn.send_text(patch)

            # Snapshot → Git
            GitRepository(doc_id).commit_snapshot(doc.text)

    except WebSocketDisconnect:
        conns.remove(websocket)
        if not conns:                        # ninguém mais editando
            active_docs.pop(doc_id, None)
