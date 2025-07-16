from git import Repo
from pathlib import Path
import time


class GitRepository:
    """
    Salva cada “snapshot” do documento em um repositório Git
    próprio dentro de `repos/<doc_id>/`.
    """
    BASE = Path("repos")

    def __init__(self, doc_id: str):
        self.path = self.BASE / doc_id
        self.path.mkdir(parents=True, exist_ok=True)
        self.repo = Repo.init(self.path) if not (self.path / ".git").exists() else Repo(self.path)

    # ----------------------------------------------------------------
    def commit_snapshot(self, text: str) -> str:
        file_path = self.path / "content.txt"
        file_path.write_text(text, encoding="utf-8")

        self.repo.index.add(["content.txt"])
        commit = self.repo.index.commit(f"snapshot {time.time():.0f}")
        return commit.hexsha

    def latest_snapshot(self) -> str:
        snap = self.path / "content.txt"
        return snap.read_text(encoding="utf-8") if snap.exists() else ""

    def exists(self) -> bool:
        return (self.path / ".git").exists()
