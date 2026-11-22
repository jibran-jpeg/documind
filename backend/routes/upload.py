from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_parser import extract_text_by_page
from services.embedder import chunk_and_embed
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF, extract text, chunk it, embed it, store in ChromaDB.
    Returns a document_id for future queries.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Generate unique document ID
    document_id = str(uuid.uuid4()).replace("-", "")[:16]

    # Save file temporarily
    file_path = os.path.join(UPLOAD_DIR, f"{document_id}.pdf")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract text page by page
        pages = extract_text_by_page(file_path)

        if not pages:
            raise HTTPException(status_code=422, detail="Could not extract text from PDF. It may be scanned or image-based.")

        # Chunk, embed, and store
        result = chunk_and_embed(pages, document_id)

        return {
            "document_id": document_id,
            "filename": file.filename,
            "pages_processed": len(pages),
            "chunks_stored": result["chunks_stored"],
            "status": "ready"
        }

    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Always cleanup uploaded file after processing
        if os.path.exists(file_path):
            os.remove(file_path)
