"""Supabase Storage service — signed upload/download URLs for evidence files.

Uses the Supabase Storage REST API with the service-role key so that
RLS policies don't need to be configured for server-side operations.
Path convention: {user_id}/{session_id}/{evidence_id}/{filename}
"""
import httpx
from app.core.config import settings

_BUCKET = "evidence-files"


def _base_url() -> str:
    return _base_url()_clean


def _headers() -> dict:
    key = settings.supabase_service_role_key_clean
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
    }


def create_signed_upload_url(
    user_id: str,
    session_id: str,
    evidence_id: str,
    filename: str,
) -> dict:
    """Return a short-lived signed URL the frontend can PUT to directly."""
    path = f"{user_id}/{session_id}/{evidence_id}/{filename}"
    url = f"{_base_url()}/storage/v1/object/upload/sign/{_BUCKET}/{path}"

    resp = httpx.post(url, headers=_headers(), timeout=10)
    resp.raise_for_status()
    data = resp.json()

    # Supabase returns a relative signedURL — make it absolute
    signed = data.get("signedURL") or data.get("url", "")
    if signed.startswith("/"):
        signed = f"{_base_url()}/storage/v1{signed}"

    return {"upload_url": signed, "path": f"{_BUCKET}/{path}"}


def create_signed_download_url(path: str, expires_in: int = 3600) -> dict:
    """Return a time-limited download URL for an existing file."""
    # Strip bucket prefix if caller included it
    clean = path.removeprefix(f"{_BUCKET}/")
    url = (
        f"{_base_url()}/storage/v1/object/sign/{_BUCKET}/{clean}"
    )
    resp = httpx.post(
        url,
        headers={**_headers(), "Content-Type": "application/json"},
        json={"expiresIn": expires_in},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    signed = data.get("signedURL") or data.get("url", "")
    if signed.startswith("/"):
        signed = f"{_base_url()}/storage/v1{signed}"

    return {"download_url": signed}
