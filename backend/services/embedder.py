from langchain_text_splitters import RecursiveCharacterTextSplitter
from db.chroma_client import get_chroma_client, get_or_create_collection
from config import MAX_CHUNK_SIZE, CHUNK_OVERLAP
from typing import List, Dict

BATCH_SIZE = 100


def chunk_and_embed(pages: List[Dict], document_id: str) -> Dict:
    """
    Takes extracted pages, splits them into semantic chunks while preserving
    page numbers and sequential chunk order, embeds them locally via ChromaDB's
    ONNX all-MiniLM-L6-v2 embeddings, and stores them in batches so both tiny
    1-page PDFs and massive 500+ page PDFs index reliably.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=MAX_CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    total_pages = len(pages)
    all_chunks: List[str] = []
    all_metadatas: List[Dict] = []
    all_ids: List[str] = []

    chunk_index = 0
    for page in pages:
        page_num = page["page_number"]
        page_text = (page.get("text") or "").strip()
        if not page_text:
            continue

        chunks = splitter.split_text(page_text)
        for sub_idx, chunk in enumerate(chunks):
            cleaned_chunk = chunk.strip()
            if not cleaned_chunk:
                continue
            # Prefix each stored chunk with its page header so embeddings
            # capture page-number queries and section context
            annotated_chunk = f"[Page {page_num} of {total_pages}]\n{cleaned_chunk}"
            all_chunks.append(annotated_chunk)
            all_metadatas.append({
                "document_id": document_id,
                "page_number": page_num,
                "chunk_index": chunk_index,
                "page_chunk_index": sub_idx,
                "total_pages": total_pages,
            })
            all_ids.append(f"{document_id}_p{page_num}_c{chunk_index}")
            chunk_index += 1

    if not all_chunks:
        return {"chunks_stored": 0}

    client = get_chroma_client()
    collection = get_or_create_collection(client, document_id)

    for start in range(0, len(all_chunks), BATCH_SIZE):
        end = start + BATCH_SIZE
        collection.add(
            documents=all_chunks[start:end],
            metadatas=all_metadatas[start:end],
            ids=all_ids[start:end],
        )

    return {"chunks_stored": len(all_chunks)}
