import hashlib
import time
import chromadb
from config import CHROMA_PERSIST_DIR

SESSION_TTL_SECONDS = 3600  # 1 hour max lifetime for session vectors

def get_chroma_client():
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return client

def make_scoped_collection_name(session_token: str, document_id: str) -> str:
    """
    Derive an unguessable, session-isolated ChromaDB collection name.
    Another browser or user with a different session_token cannot access this collection.
    """
    digest = hashlib.sha256(f"{session_token}:{document_id}".encode("utf-8")).hexdigest()
    return f"doc_{digest[:32]}"

def get_or_create_collection(client, collection_name: str):
    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={
            "hnsw:space": "cosine",
            "created_at": int(time.time()),
        }
    )
    return collection

def get_existing_collection(client, collection_name: str):
    return client.get_collection(name=collection_name)

def delete_collection_safe(client, collection_name: str) -> bool:
    try:
        client.delete_collection(name=collection_name)
        return True
    except Exception:
        return False

def cleanup_expired_collections(client, max_age_seconds: int = SESSION_TTL_SECONDS) -> int:
    """Delete session collections older than max_age_seconds to prevent stale data retention."""
    now = int(time.time())
    removed = 0
    try:
        for col in client.list_collections():
            meta = getattr(col, "metadata", None) or {}
            created_at = meta.get("created_at")
            if isinstance(created_at, (int, float)) and (now - created_at) > max_age_seconds:
                if delete_collection_safe(client, col.name):
                    removed += 1
    except Exception:
        pass
    return removed
