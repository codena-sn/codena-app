from pathlib import Path
from fastapi import UploadFile
from .config import settings

def save_upload(file: UploadFile) -> str:
    base = Path(settings.media_local_dir)
    base.mkdir(parents=True, exist_ok=True)
    safe = file.filename.replace("..","").replace("/","_")
    path = base / safe
    with path.open("wb") as f:
        f.write(file.file.read())
    return f"/media/{safe}"
