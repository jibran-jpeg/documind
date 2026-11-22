from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from pydantic import BaseModel
from services.pdf_parser import extract_text_by_page
from services.embedder import chunk_and_embed
from db.chroma_client import (
    get_chroma_client,
    make_scoped_collection_name,
    delete_collection_safe,
    cleanup_expired_collections,
)
import os
import uuid
import shutil
from typing import Optional

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class CleanupRequest(BaseModel):
    session_token: str


def _validate_session_token(session_token: Optional[str]) -> str:
    if not session_token or len(session_token.strip()) < 16:
        raise HTTPException(status_code=400, detail="Valid X-Session-Token header is required")
    return session_token.strip()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    session_token: Optional[str] = Header(default=None, alias="X-Session-Token"),
):
    """
    Upload a PDF, extract text, chunk it, embed it, store in a session-isolated ChromaDB collection.
    Returns a document_id bound strictly to the caller's session_token.
    """
    token = _validate_session_token(session_token)

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Opportunistic TTL cleanup of expired session collections
    cleanup_expired_collections(get_chroma_client())

    # Generate unique document ID & session-scoped collection name
    document_id = str(uuid.uuid4()).replace("-", "")[:16]
    scoped_collection = make_scoped_collection_name(token, document_id)

    # Save file temporarily
    file_path = os.path.join(UPLOAD_DIR, f"{document_id}.pdf")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract text page by page
        pages = extract_text_by_page(file_path)

        if not pages:
            raise HTTPException(status_code=422, detail="Could not extract text from PDF. It may be scanned or image-based.")

        # Chunk, embed, and store in session-scoped collection
        result = chunk_and_embed(pages, scoped_collection)

        return {
            "document_id": document_id,
            "filename": file.filename,
            "pages_processed": len(pages),
            "chunks_stored": result["chunks_stored"],
            "pages": pages,
            "status": "ready"
        }

    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Always delete the raw PDF immediately after extraction
        if os.path.exists(file_path):
            os.remove(file_path)


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    session_token: Optional[str] = Header(default=None, alias="X-Session-Token"),
):
    """Permanently delete a document's vectors for the caller's session."""
    token = _validate_session_token(session_token)
    scoped_collection = make_scoped_collection_name(token, document_id)
    deleted = delete_collection_safe(get_chroma_client(), scoped_collection)
    return {"deleted": deleted, "document_id": document_id}


@router.post("/documents/{document_id}/cleanup")
async def cleanup_document_beacon(document_id: str, payload: CleanupRequest):
    """Beacon-friendly cleanup endpoint called when a browser tab closes."""
    token = _validate_session_token(payload.session_token)
    scoped_collection = make_scoped_collection_name(token, document_id)
    deleted = delete_collection_safe(get_chroma_client(), scoped_collection)
    return {"deleted": deleted, "document_id": document_id}
