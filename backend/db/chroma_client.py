import chromadb
from config import CHROMA_PERSIST_DIR

def get_chroma_client():
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return client

def get_or_create_collection(client, collection_name: str):
    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )
    return collection
