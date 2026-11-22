from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from services.retriever import retrieve_and_answer
from db.chroma_client import make_scoped_collection_name
from typing import Optional

router = APIRouter()

class QueryRequest(BaseModel):
    document_id: str
    question: str

@router.post("/query")
async def query_document(
    request: QueryRequest,
    session_token: Optional[str] = Header(default=None, alias="X-Session-Token"),
):
    """
    Ask a question about a document owned by the caller's session.
    Returns the answer and source page numbers.
    """
    if not session_token or len(session_token.strip()) < 16:
        raise HTTPException(status_code=400, detail="Valid X-Session-Token header is required")

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if not request.document_id.strip():
        raise HTTPException(status_code=400, detail="document_id is required")

    scoped_collection = make_scoped_collection_name(session_token.strip(), request.document_id.strip())

    try:
        result = retrieve_and_answer(
            question=request.question,
            document_id=scoped_collection
        )
        return result

    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found in your session")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
