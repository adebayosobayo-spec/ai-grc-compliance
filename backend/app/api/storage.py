"""File storage API — signed upload/download URLs for evidence files."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.auth import CurrentUser, get_current_user
from app.services import storage_service

router = APIRouter(prefix="/storage", tags=["storage"])


class UploadUrlRequest(BaseModel):
    session_id: str
    evidence_id: str
    filename: str


class DownloadUrlRequest(BaseModel):
    path: str


@router.post("/upload-url")
async def get_upload_url(
    request: UploadUrlRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Generate a signed upload URL for direct browser-to-storage upload."""
    try:
        return storage_service.create_signed_upload_url(
            user_id=user.id,
            session_id=request.session_id,
            evidence_id=request.evidence_id,
            filename=request.filename,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload URL generation failed: {str(e)}")


@router.post("/download-url")
async def get_download_url(
    request: DownloadUrlRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Generate a signed download URL for an existing file."""
    try:
        return storage_service.create_signed_download_url(request.path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download URL generation failed: {str(e)}")
