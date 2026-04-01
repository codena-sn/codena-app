from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from ..deps import require_role
from ..storage import save_upload
from ..config import settings

router = APIRouter(prefix="/media", tags=["media"])

@router.post("/upload", dependencies=[Depends(require_role("admin"))])
def upload(file: UploadFile = File(...)):
    url = save_upload(file)
    return {"url": url}

@router.get("/{filename}")
def get_media(filename: str):
    p = Path(settings.media_local_dir) / filename
    if not p.exists():
        raise HTTPException(404, "Not found")
    return FileResponse(str(p))
