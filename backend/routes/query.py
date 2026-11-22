from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.retriever import retrieve_and_answer

router = APIRouter()

class QueryRequest(BaseModel):
    document_id: str
    question: str

@router.post("/query")
async def query_document(request: QueryRequest):
    """
    Ask a question about an uploaded document.
    Returns the answer and source page numbers.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if not request.document_id.strip():
        raise HTTPException(status_code=400, detail="document_id is required")

    try:
        result = retrieve_and_answer(
            question=request.question,
            document_id=request.document_id
        )
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
