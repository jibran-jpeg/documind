import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
MAX_CHUNK_SIZE = max(int(os.getenv("MAX_CHUNK_SIZE", 1500)), 1400)
CHUNK_OVERLAP = max(int(os.getenv("CHUNK_OVERLAP", 250)), 200)
TOP_K_RESULTS = max(int(os.getenv("TOP_K_RESULTS", 16)), 14)
