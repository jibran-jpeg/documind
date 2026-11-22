import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 2200,
});

export interface UploadResponse {
  document_id: string;
  filename: string;
  message: string;
  pages_processed: number;
  mode?: "fastapi" | "browser";
}

export interface QueryResponse {
  answer: string;
  sources: number[];
  mode?: "fastapi" | "browser";
}

interface PageChunk {
  page: number;
  text: string;
}

const localDocStore = new Map<string, PageChunk[]>();

const SAMPLE_WHITEPAPER_PAGES: PageChunk[] = [
  {
    page: 1,
    text: "DocuMind Architecture Whitepaper. DocuMind is a Retrieval-Augmented Generation (RAG) document Q&A system built with Python FastAPI, LangChain, ChromaDB, HuggingFace all-MiniLM-L6-v2 embeddings, Groq Llama 3.1 inference, and Next.js 16. The core goal is verifiable question answering where every claim is strictly grounded in retrieved PDF chunks with exact page-level citations.",
  },
  {
    page: 2,
    text: "Ingestion and Chunking Pipeline. Uploaded PDF files are parsed page-by-page using PyMuPDF (fitz) to preserve 1-indexed page numbers. Each page is split using LangChain's RecursiveCharacterTextSplitter with a default chunk size of 500 characters and 50-character overlap to keep semantic continuity across paragraph boundaries.",
  },
  {
    page: 3,
    text: "Vector Embeddings and ChromaDB Storage. Each text chunk is encoded into a 384-dimensional dense vector using HuggingFace sentence-transformers (all-MiniLM-L6-v2) running locally with zero external embedding API cost. Vectors, raw chunk text, and page_number metadata are persisted in isolated per-document ChromaDB collections.",
  },
  {
    page: 4,
    text: "Retrieval Grounding and Hallucination Control. At query time, the user's question is embedded with the same all-MiniLM-L6-v2 model and matched against ChromaDB via cosine similarity (top-k = 4). Retrieved passages are injected into a temperature-0 Groq Llama 3.1 prompt that explicitly refuses to answer if supporting evidence is absent from the retrieved context.",
  },
  {
    page: 5,
    text: "Deployment and Performance Metrics. Running local MiniLM embeddings paired with Groq LPU inference delivers sub-second query latency (~450ms end-to-end) while maintaining zero embedding spend. The FastAPI backend exposes /api/upload, /api/query, and /health endpoints with strict CORS controls, paired with a Next.js App Router frontend.",
  },
];

function extractReadableTextFromPdfBytes(bytes: Uint8Array): PageChunk[] {
  const decoder = new TextDecoder("latin1");
  const raw = decoder.decode(bytes);
  const chunks: PageChunk[] = [];

  // Extract parenthesized PDF text literal segments inside BT...ET blocks
  const textRuns = raw.match(/\(([^()\\]{4,240})\)/g) || [];
  const cleaned = textRuns
    .map((s) => s.slice(1, -1).replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 4 && /[A-Za-z]{3,}/.test(s));

  if (cleaned.length >= 6) {
    const joined = cleaned.join(" ");
    const perPage = Math.max(450, Math.ceil(joined.length / Math.max(1, Math.min(8, Math.ceil(joined.length / 700)))));
    let page = 1;
    for (let i = 0; i < joined.length; i += perPage) {
      chunks.push({ page: page++, text: joined.slice(i, i + perPage) });
    }
    return chunks;
  }

  return [];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function queryLocalChunks(documentId: string, query: string): QueryResponse {
  const pages = localDocStore.get(documentId) || SAMPLE_WHITEPAPER_PAGES;
  const queryTokens = tokenize(query);

  const scored = pages
    .map((p) => {
      const lower = p.text.toLowerCase();
      let score = 0;
      for (const tok of queryTokens) {
        if (lower.includes(tok)) {
          score += tok.length >= 5 ? 3 : 1.5;
        }
      }
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score);

  const topHits = scored.filter((s) => s.score > 0).slice(0, 2);

  if (topHits.length === 0) {
    return {
      answer:
        "I could not find direct supporting context for that question in the indexed chunks of this document. Try asking about the architecture, chunking parameters, embeddings, ChromaDB retrieval, or latency.",
      sources: [],
      mode: "browser",
    };
  }

  const sources = Array.from(new Set(topHits.map((h) => h.page))).sort(
    (a, b) => a - b
  );
  const answer = topHits
    .map((h) => `**Page ${h.page}:** ${h.text}`)
    .join("\n\n");

  return {
    answer,
    sources,
    mode: "browser",
  };
}

export const loadSampleDocument = async (): Promise<UploadResponse> => {
  const docId = `sample-rag-${Date.now()}`;
  localDocStore.set(docId, SAMPLE_WHITEPAPER_PAGES);
  await new Promise((r) => setTimeout(r, 350));
  return {
    document_id: docId,
    filename: "DocuMind_RAG_Architecture.pdf",
    message: "Loaded interactive sample whitepaper in browser RAG mode.",
    pages_processed: SAMPLE_WHITEPAPER_PAGES.length,
    mode: "browser",
  };
};

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ...response.data, mode: "fastapi" };
  } catch {
    // Graceful browser-side fallback when deployed as a static GitHub Pages demo
    const buffer = await file.arrayBuffer();
    const extracted = extractReadableTextFromPdfBytes(new Uint8Array(buffer));
    const docId = `local-${Date.now()}`;
    const pages =
      extracted.length > 0
        ? extracted
        : [
            {
              page: 1,
              text: `Uploaded "${file.name}" (${Math.max(1, Math.round(file.size / 1024))} KB). This PDF uses compressed streams requiring the Python FastAPI PyMuPDF backend (uvicorn main:app) for full OCR/stream extraction. In static GitHub Pages demo mode, you can also load the sample RAG Architecture PDF to test live multi-page semantic citations.`,
            },
          ];

    localDocStore.set(docId, pages);
    return {
      document_id: docId,
      filename: file.name,
      message: "Indexed locally in browser demo mode.",
      pages_processed: pages.length,
      mode: "browser",
    };
  }
};

export const queryDocument = async (
  documentId: string,
  query: string
): Promise<QueryResponse> => {
  if (localDocStore.has(documentId)) {
    await new Promise((r) => setTimeout(r, 260));
    return queryLocalChunks(documentId, query);
  }

  try {
    const response = await api.post("/query", {
      document_id: documentId,
      query,
    });
    return { ...response.data, mode: "fastapi" };
  } catch {
    await new Promise((r) => setTimeout(r, 220));
    return queryLocalChunks(documentId, query);
  }
};
