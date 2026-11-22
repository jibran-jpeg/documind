# DocuMind — RAG Document Q&A System

An end-to-end Retrieval-Augmented Generation (RAG) web application for uploading PDF documents and asking natural-language questions with strict retrieval grounding and exact source page citations.

## Architecture

1. **PDF Ingestion (`backend/services/pdf_parser.py`):** Extracts text per page using PyMuPDF (`fitz`), preserving exact 1-indexed page numbers.
2. **Chunking & Local Embeddings (`backend/services/embedder.py`):** Splits pages with LangChain's `RecursiveCharacterTextSplitter` and encodes chunks locally using HuggingFace `all-MiniLM-L6-v2` (`sentence-transformers`), storing vectors and page metadata in persistent ChromaDB collections.
3. **Grounded Retrieval & Citations (`backend/services/retriever.py`):** Performs cosine similarity search in ChromaDB for the top-`k` chunks and invokes Groq (`llama-3.1-8b-instant`, `temperature=0`) with a strict system prompt that refuses unsupported claims and returns sorted source page numbers.
4. **Frontend (`frontend/`):** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, drag-and-drop PDF upload (`react-dropzone`), and interactive Q&A interface with page citation badges.

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn, LangChain, PyMuPDF (`fitz`), ChromaDB
- **Models:** HuggingFace `all-MiniLM-L6-v2` (local embeddings), Groq `llama-3.1-8b-instant` (inference)
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to backend/.env
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, upload a PDF, and ask questions with page-level citations.
