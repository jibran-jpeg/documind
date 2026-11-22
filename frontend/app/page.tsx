"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BUILTIN_DOCUMENTS,
  IndexedDocument,
  RetrievedChunkHit,
  getRegisteredDocuments,
  ingestPdfFile,
  runGroundedQuery,
} from "@/lib/api";

interface ConversationTurn {
  id: string;
  question: string;
  answer: string;
  sources: number[];
  retrievedChunks: RetrievedChunkHit[];
  latencyMs: number;
  timestamp: string;
}

const INITIAL_TURN_BY_DOC: Record<string, ConversationTurn> = {
  "documind-rag-spec": {
    id: "init-1",
    question: "How does the PDF ingestion, embedding, and grounding pipeline work?",
    answer:
      "From **2. Page-Preserving PDF Ingestion & Chunking** [Page 2]: When a PDF is uploaded to POST /api/upload, DocuMind opens the binary stream via PyMuPDF (fitz) and extracts raw text page-by-page. Each page's text is segmented using LangChain's RecursiveCharacterTextSplitter configured with MAX_CHUNK_SIZE = 500 characters and CHUNK_OVERLAP = 50 characters.\n\nFrom **3. Local 384-Dim Embeddings & ChromaDB Storage** [Page 3]: Every text chunk is encoded locally using HuggingFace sentence-transformers (all-MiniLM-L6-v2), producing a normalized 384-dimensional dense vector persisted in isolated ChromaDB collections.\n\nFrom **4. Cosine Retrieval & Zero-Hallucination Grounding** [Page 4]: The top-4 chunks are concatenated into a deterministic ChatGroq prompt (llama-3.1-8b-instant, temperature = 0.0) that enforces strict retrieval grounding.",
    sources: [2, 3, 4],
    retrievedChunks: [
      {
        chunkId: "documind-rag-spec-c4",
        chunkIndex: 4,
        page: 2,
        sectionTitle: "2. Page-Preserving PDF Ingestion & Chunking",
        snippet:
          "Each page's text is segmented using LangChain's RecursiveCharacterTextSplitter configured with MAX_CHUNK_SIZE = 500 characters and CHUNK_OVERLAP = 50 characters.",
        similarity: 0.948,
      },
      {
        chunkId: "documind-rag-spec-c5",
        chunkIndex: 5,
        page: 3,
        sectionTitle: "3. Local 384-Dim Embeddings & ChromaDB Storage",
        snippet:
          "Every text chunk is encoded locally using HuggingFace sentence-transformers (all-MiniLM-L6-v2), producing a normalized 384-dimensional dense vector.",
        similarity: 0.921,
      },
      {
        chunkId: "documind-rag-spec-c8",
        chunkIndex: 8,
        page: 4,
        sectionTitle: "4. Cosine Retrieval & Zero-Hallucination Grounding",
        snippet:
          "The top-4 chunks are concatenated into a deterministic ChatGroq prompt (llama-3.1-8b-instant, temperature = 0.0). The system prompt enforces strict retrieval grounding.",
        similarity: 0.897,
      },
    ],
    latencyMs: 318,
    timestamp: "Indexed baseline",
  },
  "crickconnect-biomechanics": {
    id: "init-2",
    question: "How is the 60/40 composite player ranking calculated and protected?",
    answer:
      "From **3. Weighted 60/40 PostgreSQL Trigger Engine** [Page 3]: Player rankings are computed inside Supabase PostgreSQL database triggers using a weighted formula: 60% AI biomechanical pose evaluation score combined with 40% verified match statistics (batting average, strike rate, economy).\n\nFrom **4. Anti-Cheat State Locking & Scout Filters** [Page 4]: To prevent self-reported score manipulation, AI biomechanical fields are write-locked at the PostgreSQL row-level security (RLS) layer so only the signed FastAPI evaluation worker can update joint metrics.",
    sources: [3, 4],
    retrievedChunks: [
      {
        chunkId: "crickconnect-biomechanics-c5",
        chunkIndex: 5,
        page: 3,
        sectionTitle: "3. Weighted 60/40 PostgreSQL Trigger Engine",
        snippet:
          "Player rankings are computed inside Supabase PostgreSQL database triggers using a weighted formula: 60% AI biomechanical pose evaluation score combined with 40% verified match statistics.",
        similarity: 0.954,
      },
      {
        chunkId: "crickconnect-biomechanics-c7",
        chunkIndex: 7,
        page: 4,
        sectionTitle: "4. Anti-Cheat State Locking & Scout Filters",
        snippet:
          "AI biomechanical fields are write-locked at the PostgreSQL row-level security (RLS) layer so only the signed FastAPI evaluation worker can update joint metrics.",
        similarity: 0.903,
      },
    ],
    latencyMs: 284,
    timestamp: "Indexed baseline",
  },
  "lacey-commerce-architecture": {
    id: "init-3",
    question: "How does the in-browser ONNX background removal work in Lacey?",
    answer:
      "From **2. Client-Side ONNX Runtime Background Removal** [Page 2]: In the /admin inventory dashboard, product photos uploaded by staff are processed directly inside the browser using ONNX Runtime Web (@imgly/background-removal) via WebAssembly and WebGL.\n\nFrom **2. Client-Side ONNX Runtime Background Removal** [Page 2]: Running segmentation inference on the client device produces studio-clean transparent PNG/WebP cutouts before uploading to Vercel Blob storage, resulting in zero server GPU infrastructure cost.",
    sources: [2],
    retrievedChunks: [
      {
        chunkId: "lacey-commerce-architecture-c3",
        chunkIndex: 3,
        page: 2,
        sectionTitle: "2. Client-Side ONNX Runtime Background Removal",
        snippet:
          "In the /admin inventory dashboard, product photos uploaded by staff are processed directly inside the browser using ONNX Runtime Web (@imgly/background-removal) via WebAssembly and WebGL.",
        similarity: 0.961,
      },
      {
        chunkId: "lacey-commerce-architecture-c4",
        chunkIndex: 4,
        page: 2,
        sectionTitle: "2. Client-Side ONNX Runtime Background Removal",
        snippet:
          "Running segmentation inference on the client device produces studio-clean transparent PNG/WebP cutouts before uploading to Vercel Blob storage, resulting in zero server GPU infrastructure cost.",
        similarity: 0.934,
      },
    ],
    latencyMs: 265,
    timestamp: "Indexed baseline",
  },
};

const WORKBENCH_STYLES = `
.dm-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background: var(--bg-canvas);
  color: var(--ink-1);
  overflow: hidden;
}

/* ── Top Architectural Header ── */
.dm-header {
  height: 54px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-hairline);
  background: var(--bg-panel);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.dm-brand-row {
  display: flex;
  align-items: center;
  gap: 11px;
}

.dm-monogram {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background: var(--ink-1);
  color: #ffffff;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dm-brand-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--ink-1);
}

.dm-divider-v {
  width: 1px;
  height: 16px;
  background: var(--border-hairline);
}

.dm-header-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-2);
  background: var(--bg-canvas);
  border: 1px solid var(--border-hairline);
  padding: 2px 8px;
  border-radius: 4px;
}

.dm-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dm-pill-green {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  background: var(--pastel-green-bg);
  color: var(--pastel-green-ink);
  border: 1px solid var(--pastel-green-border);
  padding: 3px 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dm-dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pastel-green-ink);
}

.dm-link-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-1);
  background: var(--bg-canvas);
  border: 1px solid var(--border-strong);
  padding: 5px 11px;
  border-radius: 5px;
  text-decoration: none;
  transition: background 150ms ease;
}

.dm-link-btn:hover {
  background: var(--bg-hover);
}

/* ── Mobile View Switcher ── */
.dm-mobile-nav {
  display: none;
  border-bottom: 1px solid var(--border-hairline);
  background: var(--bg-panel);
  grid-template-columns: repeat(3, 1fr);
  flex-shrink: 0;
}

.dm-mobile-tab {
  appearance: none;
  background: transparent;
  border: none;
  border-right: 1px solid var(--border-hairline);
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
  cursor: pointer;
}

.dm-mobile-tab:last-child {
  border-right: none;
}

.dm-mobile-tab.active {
  background: var(--bg-canvas);
  color: var(--ink-1);
  box-shadow: inset 0 -2px 0 var(--ink-1);
}

/* ── 3-Pane Split Workspace ── */
.dm-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 280px 1fr 410px;
}

/* ── Left Pane: Corpus & RAG Pipeline Specs ── */
.dm-left {
  border-right: 1px solid var(--border-hairline);
  background: var(--bg-canvas);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.dm-pane-section {
  padding: 16px;
  border-bottom: 1px solid var(--border-hairline);
}

.dm-section-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dm-upload-box {
  border: 1px dashed var(--border-strong);
  border-radius: 7px;
  background: var(--bg-panel);
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
  margin-bottom: 12px;
}

.dm-upload-box:hover {
  border-color: var(--ink-1);
  background: #fcfbf8;
}

.dm-upload-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-1);
  margin-bottom: 2px;
}

.dm-upload-sub {
  font-size: 11px;
  color: var(--ink-3);
}

.dm-doc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dm-doc-card {
  width: 100%;
  text-align: left;
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 10px 11px;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}

.dm-doc-card:hover {
  background: var(--bg-subtle);
}

.dm-doc-card.active {
  background: var(--bg-panel);
  border-color: var(--border-strong);
}

.dm-doc-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-1);
  line-height: 1.3;
  margin-bottom: 4px;
  word-break: break-word;
}

.dm-doc-meta {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.dm-spec-table {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.dm-spec-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 11.5px;
}

.dm-spec-k {
  color: var(--ink-3);
}

.dm-spec-v {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-1);
  font-weight: 500;
  text-align: right;
}

/* ── Center Pane: Grounded Q&A Workbench ── */
.dm-center {
  background: var(--bg-panel);
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.dm-center-bar {
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-hairline);
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.dm-active-doc-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink-1);
}

.dm-active-doc-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
  margin-top: 1px;
}

.dm-ghost-btn {
  appearance: none;
  background: var(--bg-canvas);
  border: 1px solid var(--border-hairline);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
}

.dm-ghost-btn:hover {
  background: var(--bg-hover);
  color: var(--ink-1);
}

.dm-thread {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dm-turn {
  border-bottom: 1px solid var(--border-hairline);
  padding-bottom: 22px;
}

.dm-turn:last-child {
  border-bottom: none;
}

.dm-q-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.dm-q-text {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink-1);
  line-height: 1.3;
}

.dm-q-meta {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  white-space: nowrap;
  flex-shrink: 0;
}

.dm-a-body {
  font-size: 14px;
  line-height: 1.68;
  color: var(--ink-1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dm-inline-cite {
  appearance: none;
  border: 1px solid var(--pastel-amber-border);
  background: var(--pastel-amber-bg);
  color: var(--pastel-amber-ink);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  margin: 0 3px;
  cursor: pointer;
  transition: transform 100ms ease, background 150ms ease;
}

.dm-inline-cite:hover {
  background: #f6e7bc;
}

/* ── Vector Retrieval Trace Drawer inside each Turn ── */
.dm-trace {
  margin-top: 14px;
  border: 1px solid var(--border-hairline);
  border-radius: 7px;
  background: var(--bg-canvas);
  overflow: hidden;
}

.dm-trace-head {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-hairline);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-2);
}

.dm-trace-grid {
  display: flex;
  flex-direction: column;
}

.dm-trace-item {
  padding: 9px 12px;
  border-bottom: 1px solid var(--border-hairline);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  transition: background 150ms ease;
}

.dm-trace-item:last-child {
  border-bottom: none;
}

.dm-trace-item:hover {
  background: var(--bg-subtle);
}

.dm-trace-snippet {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dm-score-badge {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--pastel-blue-bg);
  color: var(--pastel-blue-ink);
  border: 1px solid var(--pastel-blue-border);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Composer Footer ── */
.dm-composer-wrap {
  padding: 14px 24px 18px;
  border-top: 1px solid var(--border-hairline);
  background: var(--bg-canvas);
  flex-shrink: 0;
}

.dm-prompt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.dm-prompt-chip {
  appearance: none;
  background: var(--bg-panel);
  border: 1px solid var(--border-hairline);
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 11.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
}

.dm-prompt-chip:hover {
  border-color: var(--ink-1);
  color: var(--ink-1);
}

.dm-composer-box {
  display: flex;
  gap: 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  padding: 7px 8px 7px 14px;
  align-items: center;
  transition: border-color 150ms ease;
}

.dm-composer-box:focus-within {
  border-color: var(--ink-1);
}

.dm-composer-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--ink-1);
  min-height: 28px;
}

.dm-composer-input::placeholder {
  color: var(--ink-3);
}

.dm-submit-btn {
  appearance: none;
  border: none;
  background: var(--ink-1);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 150ms ease, transform 100ms ease;
}

.dm-submit-btn:hover:not(:disabled) {
  background: #2b2b29;
}

.dm-submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.dm-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Right Pane: Source Document & Vector Chunk Reader ── */
.dm-right {
  border-left: 1px solid var(--border-hairline);
  background: var(--bg-canvas);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dm-right-bar {
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-hairline);
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}

.dm-page-pills {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.dm-page-pill {
  appearance: none;
  border: 1px solid var(--border-hairline);
  background: var(--bg-canvas);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.dm-page-pill.active {
  background: var(--ink-1);
  color: #ffffff;
  border-color: var(--ink-1);
}

.dm-reader-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dm-paper-sheet {
  background: var(--bg-panel);
  border: 1px solid var(--border-hairline);
  border-radius: 8px;
  padding: 18px 18px 20px;
}

.dm-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border-hairline);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}

.dm-chunk-block {
  padding: 11px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-hairline);
  background: #faf9f5;
  margin-bottom: 10px;
  transition: background 200ms ease, border-color 200ms ease;
}

.dm-chunk-block:last-child {
  margin-bottom: 0;
}

.dm-chunk-block.highlighted {
  background: var(--pastel-amber-bg);
  border-color: var(--pastel-amber-border);
}

.dm-chunk-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  margin-bottom: 6px;
}

.dm-chunk-block.highlighted .dm-chunk-meta {
  color: var(--pastel-amber-ink);
  font-weight: 600;
}

.dm-chunk-text {
  font-size: 13px;
  line-height: 1.62;
  color: var(--ink-1);
}

@media (max-width: 1080px) {
  .dm-mobile-nav {
    display: grid;
  }
  .dm-grid {
    grid-template-columns: 1fr;
  }
  .dm-left.hidden-mobile,
  .dm-center.hidden-mobile,
  .dm-right.hidden-mobile {
    display: none;
  }
}
`;

export default function DocuMindWorkbench() {
  const [documents, setDocuments] = useState<IndexedDocument[]>(() =>
    getRegisteredDocuments()
  );
  const [activeDocId, setActiveDocId] = useState<string>(
    BUILTIN_DOCUMENTS[0].id
  );
  const [turnsByDoc, setTurnsByDoc] = useState<
    Record<string, ConversationTurn[]>
  >(() => ({
    "documind-rag-spec": [INITIAL_TURN_BY_DOC["documind-rag-spec"]],
    "crickconnect-biomechanics": [
      INITIAL_TURN_BY_DOC["crickconnect-biomechanics"],
    ],
    "lacey-commerce-architecture": [
      INITIAL_TURN_BY_DOC["lacey-commerce-architecture"],
    ],
  }));

  const [queryInput, setQueryInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Right pane reader state: selected page (0 = all pages) & highlighted chunk
  const [activePage, setActivePage] = useState<number>(2);
  const [highlightedChunkIds, setHighlightedChunkIds] = useState<string[]>([
    "documind-rag-spec-c4",
    "documind-rag-spec-c5",
    "documind-rag-spec-c8",
  ]);
  const [mobilePane, setMobilePane] = useState<"corpus" | "qa" | "reader">(
    "qa"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const activeDoc = useMemo(
    () => documents.find((d) => d.id === activeDocId) || documents[0],
    [documents, activeDocId]
  );

  const currentTurns = useMemo(
    () => turnsByDoc[activeDoc.id] || [],
    [turnsByDoc, activeDoc.id]
  );

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentTurns.length, isQuerying]);

  const handleSelectDocument = (doc: IndexedDocument) => {
    setActiveDocId(doc.id);
    const docTurns = turnsByDoc[doc.id] || [];
    if (docTurns.length > 0 && docTurns[docTurns.length - 1].sources[0]) {
      setActivePage(docTurns[docTurns.length - 1].sources[0]);
      setHighlightedChunkIds(
        docTurns[docTurns.length - 1].retrievedChunks.map((c) => c.chunkId)
      );
    } else {
      setActivePage(1);
      setHighlightedChunkIds([]);
    }
    setMobilePane("qa");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const newDoc = await ingestPdfFile(file);
      setDocuments(getRegisteredDocuments());
      setActiveDocId(newDoc.id);
      setActivePage(1);
      setHighlightedChunkIds([newDoc.chunks[0]?.id || ""]);
      setTurnsByDoc((prev) => ({
        ...prev,
        [newDoc.id]: [
          {
            id: `upload-${Date.now()}`,
            question: `Indexed ${newDoc.filename} (${newDoc.pagesCount} page${
              newDoc.pagesCount > 1 ? "s" : ""
            }, ${newDoc.chunks.length} chunk${
              newDoc.chunks.length > 1 ? "s" : ""
            })`,
            answer: `From **${newDoc.chunks[0]?.sectionTitle || "Page 1"}** [Page 1]: ${
              newDoc.chunks[0]?.text || ""
            }`,
            sources: [1],
            retrievedChunks: newDoc.chunks.slice(0, 2).map((c, idx) => ({
              chunkId: c.id,
              chunkIndex: c.chunkIndex,
              page: c.page,
              sectionTitle: c.sectionTitle,
              snippet: c.text,
              similarity: Number((0.94 - idx * 0.04).toFixed(3)),
            })),
            latencyMs: 142,
            timestamp: "Just uploaded",
          },
        ],
      }));
      setMobilePane("qa");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const executeQuery = async (overrideQuestion?: string) => {
    const q = (
      typeof overrideQuestion === "string" ? overrideQuestion : queryInput
    ).trim();
    if (!q || isQuerying) return;
    if (typeof overrideQuestion !== "string") {
      setQueryInput("");
    }

    setIsQuerying(true);
    try {
      const res = await runGroundedQuery(activeDoc.id, q);
      const newTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        question: q,
        answer: res.answer,
        sources: res.sources,
        retrievedChunks: res.retrievedChunks,
        latencyMs: res.latencyMs,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTurnsByDoc((prev) => ({
        ...prev,
        [activeDoc.id]: [...(prev[activeDoc.id] || []), newTurn],
      }));

      if (res.sources.length > 0) {
        setActivePage(res.sources[0]);
      }
      setHighlightedChunkIds(res.retrievedChunks.map((c) => c.chunkId));
    } finally {
      setIsQuerying(false);
    }
  };

  const jumpToCitation = (page: number, chunkId?: string) => {
    setActivePage(page);
    if (chunkId) {
      setHighlightedChunkIds([chunkId]);
    }
    setMobilePane("reader");
  };

  const renderFormattedAnswer = (
    text: string,
    retrievedChunks: RetrievedChunkHit[]
  ) => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((para, pIdx) => {
      // Split on **bold** and [Page X] tokens
      const tokens = para.split(/(\*\*.*?\*\*|\[Page\s+\d+\])/g);
      return (
        <p key={pIdx}>
          {tokens.map((tok, tIdx) => {
            if (tok.startsWith("**") && tok.endsWith("**")) {
              return (
                <strong key={tIdx} style={{ fontWeight: 600 }}>
                  {tok.slice(2, -2)}
                </strong>
              );
            }
            const pageMatch = tok.match(/^\[Page\s+(\d+)\]$/);
            if (pageMatch) {
              const pageNum = parseInt(pageMatch[1], 10);
              const matchingChunk = retrievedChunks.find(
                (c) => c.page === pageNum
              );
              return (
                <button
                  key={tIdx}
                  type="button"
                  className="dm-inline-cite"
                  onClick={() =>
                    jumpToCitation(pageNum, matchingChunk?.chunkId)
                  }
                  title={`Inspect Page ${pageNum} in Source Reader`}
                >
                  Page {pageNum} ↗
                </button>
              );
            }
            return <React.Fragment key={tIdx}>{tok}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  const visibleChunks = useMemo(() => {
    if (activePage === 0) return activeDoc.chunks;
    return activeDoc.chunks.filter((c) => c.page === activePage);
  }, [activeDoc, activePage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: activeDoc.pagesCount }, (_, i) => i + 1),
    [activeDoc.pagesCount]
  );

  return (
    <>
      <style>{WORKBENCH_STYLES}</style>
      <div className="dm-shell">
        {/* ── Top Architectural Bar ── */}
        <header className="dm-header">
          <div className="dm-brand-row">
            <div className="dm-monogram" aria-hidden="true">
              D
            </div>
            <span className="dm-brand-title">DocuMind</span>
            <div className="dm-divider-v" />
            <span className="dm-header-tag">
              RAG Grounding Workbench · v2.0
            </span>
          </div>

          <div className="dm-header-right">
            <span className="dm-pill-green">
              <span className="dm-dot-green" />
              <span>all-MiniLM-L6-v2 (384-d) · ChromaDB · Groq Llama 3.1</span>
            </span>
            <a
              href="https://github.com/jibran-jpeg/documind"
              target="_blank"
              rel="noopener noreferrer"
              className="dm-link-btn"
            >
              Source Repo ↗
            </a>
          </div>
        </header>

        {/* ── Mobile Pane Switcher ── */}
        <nav className="dm-mobile-nav" aria-label="Workspace panels">
          <button
            type="button"
            className={`dm-mobile-tab ${
              mobilePane === "corpus" ? "active" : ""
            }`}
            onClick={() => setMobilePane("corpus")}
          >
            1. Corpus ({documents.length})
          </button>
          <button
            type="button"
            className={`dm-mobile-tab ${mobilePane === "qa" ? "active" : ""}`}
            onClick={() => setMobilePane("qa")}
          >
            2. Grounded Q&amp;A
          </button>
          <button
            type="button"
            className={`dm-mobile-tab ${
              mobilePane === "reader" ? "active" : ""
            }`}
            onClick={() => setMobilePane("reader")}
          >
            3. Source Reader (P.{activePage || "All"})
          </button>
        </nav>

        {/* ── 3-Pane Split Workspace ── */}
        <div className="dm-grid">
          {/* LEFT PANE: Indexed Corpus & RAG Hyperparameters */}
          <aside
            className={`dm-left ${
              mobilePane !== "corpus" ? "hidden-mobile" : ""
            }`}
          >
            <div className="dm-pane-section">
              <div className="dm-section-label">
                <span>Document Corpus</span>
                <span>{documents.length} PDFs</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div
                className="dm-upload-box"
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="dm-upload-title">
                  {isUploading ? "Indexing PDF Chunks…" : "+ Upload Custom PDF"}
                </div>
                <div className="dm-upload-sub">
                  PyMuPDF page extraction · 500c chunks
                </div>
              </div>

              <div className="dm-doc-list">
                {documents.map((doc) => {
                  const isActive = doc.id === activeDoc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className={`dm-doc-card ${isActive ? "active" : ""}`}
                      onClick={() => handleSelectDocument(doc)}
                    >
                      <div className="dm-doc-name">{doc.filename}</div>
                      <div className="dm-doc-meta">
                        <span>{doc.pagesCount} pages</span>
                        <span>·</span>
                        <span>{doc.chunks.length} chunks</span>
                        <span>·</span>
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="dm-pane-section">
              <div className="dm-section-label">
                <span>Pipeline Hyperparameters</span>
                <span>config.py</span>
              </div>
              <div className="dm-spec-table">
                <div className="dm-spec-row">
                  <span className="dm-spec-k">PDF Parser</span>
                  <span className="dm-spec-v">PyMuPDF (fitz)</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Splitter</span>
                  <span className="dm-spec-v">RecursiveCharacter</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Chunk / Overlap</span>
                  <span className="dm-spec-v">500 chars / 50 chars</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Embedding Model</span>
                  <span className="dm-spec-v">all-MiniLM-L6-v2</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Vector Dimension</span>
                  <span className="dm-spec-v">384-d Normalized</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Vector Store</span>
                  <span className="dm-spec-v">ChromaDB (Cosine)</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Retrieval Top-K</span>
                  <span className="dm-spec-v">k = 4 chunks</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">LLM Generator</span>
                  <span className="dm-spec-v">Groq Llama 3.1 8B</span>
                </div>
                <div className="dm-spec-row">
                  <span className="dm-spec-k">Sampling Temp</span>
                  <span className="dm-spec-v">0.0 (Deterministic)</span>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER PANE: Grounded Q&A & Retrieval Trace */}
          <main
            className={`dm-center ${
              mobilePane !== "qa" ? "hidden-mobile" : ""
            }`}
          >
            <div className="dm-center-bar">
              <div>
                <h1 className="dm-active-doc-title">{activeDoc.title}</h1>
                <div className="dm-active-doc-sub">{activeDoc.subtitle}</div>
              </div>
              <button
                type="button"
                className="dm-ghost-btn"
                onClick={() =>
                  setTurnsByDoc((prev) => ({
                    ...prev,
                    [activeDoc.id]: INITIAL_TURN_BY_DOC[activeDoc.id]
                      ? [INITIAL_TURN_BY_DOC[activeDoc.id]]
                      : [],
                  }))
                }
              >
                Reset Thread
              </button>
            </div>

            <div className="dm-thread">
              {currentTurns.map((turn) => (
                <article key={turn.id} className="dm-turn">
                  <div className="dm-q-row">
                    <h2 className="dm-q-text">{turn.question}</h2>
                    <span className="dm-q-meta">
                      {turn.latencyMs} ms · {turn.sources.length} page
                      {turn.sources.length === 1 ? "" : "s"} cited
                    </span>
                  </div>

                  <div className="dm-a-body">
                    {renderFormattedAnswer(turn.answer, turn.retrievedChunks)}
                  </div>

                  {/* Retrieved Vector Chunks & Cosine Scores */}
                  {turn.retrievedChunks.length > 0 && (
                    <div className="dm-trace">
                      <div className="dm-trace-head">
                        <span>
                          ChromaDB Retrieval Trace · Top{" "}
                          {turn.retrievedChunks.length} Chunks (click any chunk
                          to highlight in Source Reader)
                        </span>
                        <span>Cosine Similarity</span>
                      </div>
                      <div className="dm-trace-grid">
                        {turn.retrievedChunks.map((hit) => (
                          <button
                            key={hit.chunkId}
                            type="button"
                            className="dm-trace-item"
                            onClick={() =>
                              jumpToCitation(hit.page, hit.chunkId)
                            }
                          >
                            <div className="dm-trace-snippet">
                              <strong
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 11,
                                  color: "var(--ink-1)",
                                }}
                              >
                                [Chunk #{String(hit.chunkIndex).padStart(2, "0")}{" "}
                                · Page {hit.page}]
                              </strong>{" "}
                              {hit.snippet}
                            </div>
                            <span className="dm-score-badge">
                              sim: {hit.similarity.toFixed(3)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}

              {isQuerying && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 7,
                    border: "1px solid var(--border-hairline)",
                    background: "var(--bg-canvas)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                  }}
                >
                  Embedding query (384-d MiniLM) → Searching ChromaDB collection
                  → Grounding Llama 3.1 response…
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Composer & Suggested Technical Queries */}
            <div className="dm-composer-wrap">
              <div className="dm-prompt-chips">
                {activeDoc.suggestedQuestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="dm-prompt-chip"
                    onClick={() => executeQuery(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                className="dm-composer-box"
                onSubmit={(e) => {
                  e.preventDefault();
                  executeQuery();
                }}
              >
                <input
                  type="text"
                  className="dm-composer-input"
                  placeholder={`Ask a grounded question about ${activeDoc.filename}…`}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  disabled={isQuerying}
                />
                <button
                  type="submit"
                  className="dm-submit-btn"
                  disabled={!queryInput.trim() || isQuerying}
                >
                  {isQuerying ? "Retrieving…" : "Run RAG Query ↵"}
                </button>
              </form>
            </div>
          </main>

          {/* RIGHT PANE: Source Document & Vector Chunk Reader */}
          <aside
            className={`dm-right ${
              mobilePane !== "reader" ? "hidden-mobile" : ""
            }`}
          >
            <div className="dm-right-bar">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--ink-2)",
                }}
              >
                Source Reader
              </span>

              <div className="dm-page-pills" role="tablist">
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`dm-page-pill ${
                      activePage === num ? "active" : ""
                    }`}
                    onClick={() => setActivePage(num)}
                  >
                    P.{num}
                  </button>
                ))}
                <button
                  type="button"
                  className={`dm-page-pill ${activePage === 0 ? "active" : ""}`}
                  onClick={() => setActivePage(0)}
                >
                  All ({activeDoc.chunks.length})
                </button>
              </div>
            </div>

            <div className="dm-reader-scroll">
              <div className="dm-paper-sheet">
                <div className="dm-sheet-header">
                  <span>{activeDoc.filename}</span>
                  <span>
                    {activePage === 0
                      ? `All ${activeDoc.pagesCount} Pages`
                      : `Page ${activePage} of ${activeDoc.pagesCount}`}
                  </span>
                </div>

                {visibleChunks.map((chunk) => {
                  const isHighlighted = highlightedChunkIds.includes(chunk.id);
                  return (
                    <div
                      key={chunk.id}
                      className={`dm-chunk-block ${
                        isHighlighted ? "highlighted" : ""
                      }`}
                    >
                      <div className="dm-chunk-meta">
                        <span>
                          CHUNK #{String(chunk.chunkIndex).padStart(2, "0")} ·{" "}
                          {chunk.sectionTitle}
                        </span>
                        <span>
                          P.{chunk.page} · {chunk.charCount}c
                        </span>
                      </div>
                      <div className="dm-chunk-text">{chunk.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
