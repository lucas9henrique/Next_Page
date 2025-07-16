from pycrdt import Text
from uuid import uuid4
import json


class CRDTDocument:
    """
    Envolve um CRDT de texto (`pycrdt.text.Text`)  
    e expõe utilitários de patch/snapshot.
    """

    def __init__(self):
        self.id = str(uuid4())
        self._text = Text()                 

    # --- acessores -------------------------------------------------
    @property
    def text(self) -> str:
        return str(self._text)

    # --- operações -------------------------------------------------
    def apply_patch(self, patch_json: str) -> None:
        """
        Recebe JSON do front-end no formato:
        ```json
        [{"op":"insert","pos":13,"chars":"foo"}, {"op":"delete","pos":7,"length":3}]
        ```
        Ajuste no front conforme a lib de editor que usar.
        """
        for op in json.loads(patch_json):
            if op["op"] == "insert":
                self._text.insert(op["pos"], op["chars"])
            elif op["op"] == "delete":
                self._text.delete(op["pos"], op["length"])

    def apply_snapshot(self, text: str) -> None:
        """Substitui o estado inteiro (recuperado do Git)."""
        self._text.clear()
        self._text.insert(0, text)
