from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from db.chroma_client import get_chroma_client, get_or_create_collection
from config import MAX_CHUNK_SIZE, CHUNK_OVERLAP
from typing import List, Dict
import uuid

embeddings_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

def chunk_and_embed(pages: List[Dict], document_id: str):
    """
    Takes extracted pages, splits into chunks, embeds them,
    and stores in ChromaDB.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=MAX_CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    all_chunks = []
    all_metadatas = []
    all_ids = []

    for page in pages:
        chunks = splitter.split_text(page["text"])
        for chunk in chunks:
            all_chunks.append(chunk)
            all_metadatas.append({
                "document_id": document_id,
                "page_number": page["page_number"]
            })
            all_ids.append(str(uuid.uuid4()))

    # Generate embeddings
    vectors = embeddings_model.embed_documents(all_chunks)

    # Store in ChromaDB
    client = get_chroma_client()
    collection = get_or_create_collection(client, document_id)

    collection.add(
        documents=all_chunks,
        embeddings=vectors,
        metadatas=all_metadatas,
        ids=all_ids
    )

    return {"chunks_stored": len(all_chunks)}
