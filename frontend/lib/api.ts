import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 2200,
});

export interface PageContent {
  page: number;
  title: string;
  summaryAnswer: string;
  excerpt: string;
  keywords: string[];
}

export interface StudyDocument {
  id: string;
  filename: string;
  title: string;
  tag: string;
  pagesCount: number;
  pages: PageContent[];
  quickQuestions: string[];
  mode: "fastapi" | "browser";
}

export interface QueryResult {
  answer: string;
  sources: number[];
  matchedPages: PageContent[];
}

export const SAMPLE_DOCUMENTS: StudyDocument[] = [
  {
    id: "documind-overview",
    filename: "DocuMind_Product_Guide.pdf",
    title: "DocuMind Product & RAG Guide",
    tag: "AI Architecture · 5 Pages",
    pagesCount: 5,
    mode: "browser",
    quickQuestions: [
      "How does DocuMind answer questions from a PDF?",
      "Which AI models are used under the hood?",
      "How does it avoid making up fake answers?",
      "How fast is the search and response time?",
    ],
    pages: [
      {
        page: 1,
        title: "Overview & Core Purpose",
        summaryAnswer:
          "DocuMind reads your uploaded PDF page-by-page and answers questions using only the actual text inside your document, attaching exact page numbers to every answer.",
        excerpt:
          "DocuMind is a Retrieval-Augmented Generation (RAG) workspace built with Python FastAPI and Next.js. Every answer is linked directly to the page where the information was found.",
        keywords: ["overview", "what", "documind", "purpose", "work", "pdf", "answer", "questions"],
      },
      {
        page: 2,
        title: "PDF Reading & Smart Chunking",
        summaryAnswer:
          "When you upload a PDF, PyMuPDF extracts text from each page and splits it into 500-character passages with a 50-character overlap so sentences are never cut off mid-thought.",
        excerpt:
          "Uploaded files are parsed via PyMuPDF (fitz) to preserve 1-indexed page numbers, then segmented with LangChain's RecursiveCharacterTextSplitter (500 chars, 50-char overlap).",
        keywords: ["upload", "chunk", "chunking", "split", "pymupdf", "read", "parse", "ingest", "pdf"],
      },
      {
        page: 3,
        title: "Local Vector Search (ChromaDB)",
        summaryAnswer:
          "Each passage is converted into a 384-dimensional vector using HuggingFace's all-MiniLM-L6-v2 model locally and stored in ChromaDB for instant semantic search without extra API costs.",
        excerpt:
          "Text passages are encoded locally using sentence-transformers (all-MiniLM-L6-v2) into 384-d embeddings and indexed in per-document ChromaDB collections.",
        keywords: ["model", "models", "embedding", "vector", "chromadb", "minilm", "huggingface", "database", "under", "hood"],
      },
      {
        page: 4,
        title: "Zero-Hallucination Grounding",
        summaryAnswer:
          "To prevent fake or guessed answers, Groq Llama 3.1 runs at temperature 0.0 and is strictly instructed to answer only from the top-4 retrieved passages—or politely say if the topic isn't in the PDF.",
        excerpt:
          "At query time, the top-4 matching passages are passed to Groq (llama-3.1-8b-instant, temperature = 0). Strict system instructions forbid answering outside the retrieved text.",
        keywords: ["hallucination", "fake", "accurate", "grounding", "groq", "llama", "avoid", "prevent", "truth", "temperature"],
      },
      {
        page: 5,
        title: "Speed & API Performance",
        summaryAnswer:
          "Combining local MiniLM embeddings with Groq LPU inference delivers answers in roughly 350–450 milliseconds end-to-end.",
        excerpt:
          "Local vector lookup in ChromaDB completes in ~25 ms and Groq Llama 3.1 synthesis finishes in ~350 ms, delivering sub-second responses across 40+ page documents.",
        keywords: ["fast", "speed", "latency", "time", "performance", "api", "seconds", "ms"],
      },
    ],
  },
  {
    id: "crickconnect-guide",
    filename: "CrickConnect_Scouting_Report.pdf",
    title: "CrickConnect AI Scouting System",
    tag: "Sports AI · 4 Pages",
    pagesCount: 4,
    mode: "browser",
    quickQuestions: [
      "How are cricket players ranked in the app?",
      "How does the AI analyze bowling and batting video?",
      "How does the app stop fake stats?",
    ],
    pages: [
      {
        page: 1,
        title: "Mobile Scouting Platform",
        summaryAnswer:
          "CrickConnect is a React Native mobile platform that helps scouts discover grassroots cricket talent across Pakistan using objective AI video analysis and verified match records.",
        excerpt:
          "Built with React Native (Expo), TypeScript, FastAPI, and Supabase, CrickConnect replaces subjective trial selection with transparent regional and national leaderboards.",
        keywords: ["crickconnect", "what", "platform", "app", "mobile", "scout", "cricket"],
      },
      {
        page: 2,
        title: "MediaPipe 33-Joint Video Analysis",
        summaryAnswer:
          "Google MediaPipe tracks 33 body joints from practice videos to measure batting backlift angle, bowling arm release angle, and follow-through balance.",
        excerpt:
          "The FastAPI backend processes video frames with Google MediaPipe Pose, extracting 33 3D skeletal keypoints to score biomechanical form against coaching benchmarks.",
        keywords: ["video", "ai", "analyze", "mediapipe", "bowling", "batting", "joints", "pose", "camera"],
      },
      {
        page: 3,
        title: "60/40 Smart Ranking Formula",
        summaryAnswer:
          "Every player's score combines 60% AI biomechanical video evaluation with 40% verified match statistics, automatically awarding Gold, Silver, or Bronze badges via PostgreSQL triggers.",
        excerpt:
          "Supabase PostgreSQL triggers compute a weighted composite score (60% AI biomechanics + 40% match stats) and assign Gold (85+), Silver (70–84), or Bronze (50–69) tiers.",
        keywords: ["rank", "ranked", "ranking", "score", "formula", "badge", "gold", "silver", "60", "40"],
      },
      {
        page: 4,
        title: "Anti-Cheat Profile Locking",
        summaryAnswer:
          "Biomechanical scores are locked at the database level so players cannot manually edit their AI ratings, keeping leaderboards tamper-proof for coaches.",
        excerpt:
          "Row-Level Security (RLS) policies in Supabase lock AI metric columns to read-only for clients, allowing updates only from the verified FastAPI evaluation worker.",
        keywords: ["fake", "cheat", "anti-cheat", "security", "stop", "lock", "stats", "tamper"],
      },
    ],
  },
  {
    id: "lacey-guide",
    filename: "Lacey_Storefront_Overview.pdf",
    title: "Lacey Footwear Storefront & Edge AI",
    tag: "E-Commerce · 3 Pages",
    pagesCount: 3,
    mode: "browser",
    quickQuestions: [
      "How does browser background removal work?",
      "How does the cart handle one-of-one thrifted shoes?",
      "How is the storefront tested?",
    ],
    pages: [
      {
        page: 1,
        title: "One-of-One Thrifted Inventory",
        summaryAnswer:
          "Because every pre-owned pair is unique (quantity = 1), Lacey tracks real-time Available, Reserved, and Sold states along with an honest per-pair condition grade.",
        excerpt:
          "Built with Next.js 16 and React 19, Lacey manages single-pair inventory with transparent wear grading (Like New, Gently Used, Vintage) and instant Cmd+K search.",
        keywords: ["cart", "inventory", "one", "thrifted", "shoes", "condition", "storefront", "lacey"],
      },
      {
        page: 2,
        title: "In-Browser ONNX Background Removal",
        summaryAnswer:
          "When admins upload shoe photos, an ONNX AI model runs directly inside the web browser to cut out the background automatically—costing $0 in server GPUs.",
        excerpt:
          "The /admin dashboard executes @imgly/background-removal via ONNX Runtime Web (WASM/WebGL) in the browser before storing clean cutouts in Vercel Blob.",
        keywords: ["background", "removal", "onnx", "photo", "image", "admin", "ai", "browser", "gpu"],
      },
      {
        page: 3,
        title: "Automated Playwright E2E Testing",
        summaryAnswer:
          "A Playwright end-to-end test suite automatically checks collection filters, product condition pages, and checkout flows on every code change.",
        excerpt:
          "Playwright tests verify catalog search, one-of-one cart reservation locks, and mobile checkout responsiveness across desktop and mobile viewports.",
        keywords: ["test", "tested", "testing", "playwright", "quality", "e2e"],
      },
    ],
  },
];

const docStore = new Map<string, StudyDocument>(
  SAMPLE_DOCUMENTS.map((d) => [d.id, d])
);

export function listDocuments(): StudyDocument[] {
  return Array.from(docStore.values());
}

function extractReadableSegmentsFromPdf(
  filename: string,
  bytes: Uint8Array
): PageContent[] {
  const raw = new TextDecoder("latin1").decode(bytes);
  const literals = raw.match(/\(([^()\\]{4,240})\)/g) || [];
  const cleaned = literals
    .map((s) =>
      s
        .slice(1, -1)
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((s) => s.length >= 5 && /[A-Za-z]{3,}/.test(s));

  if (cleaned.length >= 6) {
    const joined = cleaned.join(" ");
    const segLen = 380;
    const pages: PageContent[] = [];
    let p = 1;
    for (let i = 0; i < joined.length && p <= 6; i += segLen) {
      const slice = joined.slice(i, i + segLen);
      pages.push({
        page: p,
        title: `Page ${p} Content`,
        summaryAnswer: slice,
        excerpt: slice,
        keywords: slice
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 3),
      });
      p++;
    }
    return pages;
  }

  const sizeKb = Math.max(1, Math.round(bytes.byteLength / 1024));
  return [
    {
      page: 1,
      title: `${filename} (${sizeKb} KB)`,
      summaryAnswer: `Uploaded "${filename}" (${sizeKb} KB). In live static preview mode, compressed PDF streams are indexed by filename; connect the local FastAPI PyMuPDF server (port 8000) for full binary decompression.`,
      excerpt: `File: ${filename} · Size: ${sizeKb} KB · Ready for inspection.`,
      keywords: ["summary", "overview", "file", "pdf", "page", "document"],
    },
  ];
}

export async function uploadCustomPdf(file: File): Promise<StudyDocument> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res.data;
    const buf = await file.arrayBuffer();
    const pages = extractReadableSegmentsFromPdf(
      file.name,
      new Uint8Array(buf)
    );
    const doc: StudyDocument = {
      id: data.document_id,
      filename: file.name,
      title: file.name.replace(/\.pdf$/i, ""),
      tag: `Uploaded PDF · ${data.pages_processed || pages.length} Pages`,
      pagesCount: data.pages_processed || pages.length,
      pages,
      quickQuestions: [
        "Summarize the main points of this PDF.",
        "What is covered on Page 1?",
      ],
      mode: "fastapi",
    };
    docStore.set(doc.id, doc);
    return doc;
  } catch {
    const buf = await file.arrayBuffer();
    const pages = extractReadableSegmentsFromPdf(
      file.name,
      new Uint8Array(buf)
    );
    const doc: StudyDocument = {
      id: `custom-${Date.now()}`,
      filename: file.name,
      title: file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
      tag: `Uploaded · ${pages.length} Page${pages.length > 1 ? "s" : ""}`,
      pagesCount: pages.length,
      pages,
      quickQuestions: [
        "What is on Page 1 of this document?",
        "Give me a quick summary of this file.",
      ],
      mode: "browser",
    };
    docStore.set(doc.id, doc);
    return doc;
  }
}

export async function askDocument(
  docId: string,
  question: string
): Promise<QueryResult> {
  const doc = docStore.get(docId) || SAMPLE_DOCUMENTS[0];

  if (doc.mode === "fastapi") {
    try {
      const res = await api.post("/query", {
        document_id: docId,
        query: question,
      });
      const sources: number[] = res.data.sources || [1];
      return {
        answer: res.data.answer,
        sources,
        matchedPages: doc.pages.filter((p) => sources.includes(p.page)),
      };
    } catch {
      // Fallback to local matching
    }
  }

  await new Promise((r) => setTimeout(r, 220));

  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = doc.pages
    .map((p) => {
      const hay =
        `${p.title} ${p.summaryAnswer} ${p.excerpt} ${p.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (p.keywords.includes(w)) score += 4;
        else if (hay.includes(w)) score += 2;
      }
      return { page: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.filter((s) => s.score > 0).slice(0, 2);

  if (top.length === 0) {
    const first = doc.pages[0];
    return {
      answer: `${first.summaryAnswer} [Page ${first.page}]`,
      sources: [first.page],
      matchedPages: [first],
    };
  }

  const matchedPages = top.map((t) => t.page);
  const sources = matchedPages.map((p) => p.page);
  const answer = matchedPages
    .map((p) => `${p.summaryAnswer} [Page ${p.page}]`)
    .join(" ");

  return {
    answer,
    sources,
    matchedPages,
  };
}
