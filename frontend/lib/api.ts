import axios from "axios";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 180000,
});

// Ephemeral per-tab session token kept strictly in JS memory.
// Opening another browser, incognito window, or even a new tab creates a fresh isolated session.
let ephemeralSessionToken: string | null = null;

export function getSessionToken(): string {
  if (ephemeralSessionToken) return ephemeralSessionToken;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    ephemeralSessionToken = `${crypto.randomUUID()}-${crypto.randomUUID().slice(0, 8)}`;
  } else {
    ephemeralSessionToken = `sess-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }
  return ephemeralSessionToken;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_ORIGIN}/health`, { timeout: 1200 });
    return res.status === 200;
  } catch {
    return false;
  }
}

export interface PageContent {
  page: number;
  title: string;
  summaryAnswer: string;
  excerpt: string;
  fullText: string;
  keywords: string[];
}

export interface StudyDocument {
  id: string;
  filename: string;
  title: string;
  sizeBytes: number;
  pagesCount: number;
  chunksStored?: number;
  uploadedAt: number;
  pages: PageContent[];
  quickQuestions: string[];
  mode: "fastapi" | "browser";
}

export interface QueryResult {
  answer: string;
  sources: number[];
  matchedPages: PageContent[];
}

// Strict in-memory per-tab document store — starts completely empty.
const docStore = new Map<string, StudyDocument>();

export function listDocuments(): StudyDocument[] {
  return Array.from(docStore.values()).sort((a, b) => b.uploadedAt - a.uploadedAt);
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
  "have", "has", "had", "what", "when", "where", "which", "who", "how", "why",
  "can", "could", "would", "should", "about", "into", "your", "their", "there",
  "here", "document", "file", "pdf", "page", "pages", "tell", "give", "show",
  "explain", "list", "please", "does", "did", "not", "but", "all", "any",
  "more", "some", "than", "then", "them", "they", "been", "being", "also",
]);

function extractKeywords(text: string): string[] {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  for (const w of words) {
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 60)
    .map(([w]) => w);
}

function truncateCleanly(text: string, maxLen: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  const slice = normalized.slice(0, maxLen);
  const lastBreak = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf(" | "),
    slice.lastIndexOf(", "),
    slice.lastIndexOf(" ")
  );
  return `${(lastBreak > maxLen * 0.6 ? slice.slice(0, lastBreak) : slice).trim()}…`;
}

function buildPageContent(pageNumber: number, rawText: string): PageContent {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const fullText = lines.join("\n");
  const firstHeading =
    lines.find((l) => l.length >= 4 && l.length <= 72) ||
    `Page ${pageNumber}`;

  const previewLines = lines.slice(0, 8).join(" · ");
  const summaryAnswer = truncateCleanly(previewLines || fullText, 460);
  const excerpt = truncateCleanly(fullText, 1200);

  return {
    page: pageNumber,
    title: firstHeading,
    summaryAnswer,
    excerpt,
    fullText,
    keywords: extractKeywords(fullText),
  };
}

async function extractPagesWithPdfJs(
  filename: string,
  bytes: Uint8Array
): Promise<PageContent[]> {
  const pdfjs = await import("pdfjs-dist");
  const basePath =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/documind")
      ? "/documind"
      : "";
  pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.mjs`;

  const loadingTask = pdfjs.getDocument({ data: bytes.slice() });
  const pdf = await loadingTask.promise;
  const pages: PageContent[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let currentLine = "";
    let lastY: number | null = null;

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const text = item.str;
      const y = Array.isArray(item.transform) ? item.transform[5] : null;

      if (
        lastY !== null &&
        y !== null &&
        Math.abs(y - lastY) > 4 &&
        currentLine.trim()
      ) {
        lines.push(currentLine.trim());
        currentLine = "";
      }

      if (text) {
        if (
          currentLine &&
          !currentLine.endsWith(" ") &&
          !text.startsWith(" ")
        ) {
          currentLine += " ";
        }
        currentLine += text;
      }

      if (item.hasEOL && currentLine.trim()) {
        lines.push(currentLine.trim());
        currentLine = "";
      }
      if (y !== null) lastY = y;
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    const pageText = lines.join("\n").trim();
    if (pageText) {
      pages.push(buildPageContent(p, pageText));
    }
  }

  if (pages.length === 0) {
    throw new Error(
      `No selectable text found in "${filename}". It may be a scanned image-only PDF.`
    );
  }

  return pages;
}

export async function uploadCustomPdf(file: File): Promise<StudyDocument> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please select a valid PDF (.pdf) file.");
  }

  const token = getSessionToken();
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const backendUp = await checkBackendHealth();

  if (backendUp) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Session-Token": token,
        },
      });
      const data = res.data;
      const backendPages: PageContent[] =
        Array.isArray(data.pages) && data.pages.length > 0
          ? data.pages.map((p: { page_number: number; text: string }) =>
              buildPageContent(p.page_number, p.text)
            )
          : await extractPagesWithPdfJs(file.name, bytes);

      const pagesCount = data.pages_processed || backendPages.length;
      const doc: StudyDocument = {
        id: data.document_id,
        filename: file.name,
        title: file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim(),
        sizeBytes: file.size,
        pagesCount,
        chunksStored: data.chunks_stored,
        uploadedAt: Date.now(),
        pages: backendPages,
        quickQuestions: [
          "Summarize the key points of this document",
          "What is covered on Page 1?",
          "List the main skills, facts, or takeaways mentioned",
        ],
        mode: "fastapi",
      };
      docStore.set(doc.id, doc);
      return doc;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        throw new Error(
          err.response.data?.detail ||
            "Could not extract text from this PDF. It may be scanned or image-based."
        );
      }
      console.warn("FastAPI upload failed, falling back to browser PDF.js:", err);
    }
  }

  const pages = await extractPagesWithPdfJs(file.name, bytes);
  const doc: StudyDocument = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    filename: file.name,
    title: file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim(),
    sizeBytes: file.size,
    pagesCount: pages.length,
    uploadedAt: Date.now(),
    pages,
    quickQuestions: [
      "Summarize the key points of this document",
      "What is covered on Page 1?",
      ...(pages.length > 1 ? ["What is covered on Page 2?"] : []),
    ],
    mode: "browser",
  };
  docStore.set(doc.id, doc);
  return doc;
}

export async function deleteDocument(docId: string): Promise<void> {
  const doc = docStore.get(docId);
  docStore.delete(docId);

  if (doc?.mode === "fastapi") {
    try {
      await api.delete(`/documents/${docId}`, {
        headers: { "X-Session-Token": getSessionToken() },
        timeout: 4000,
      });
    } catch {
      // Ignore cleanup errors if backend is offline
    }
  }
}

export async function clearAllDocuments(): Promise<void> {
  const ids = Array.from(docStore.keys());
  await Promise.all(ids.map((id) => deleteDocument(id)));
}

export function cleanupAllDocumentsOnUnload(): void {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
  const token = getSessionToken();
  for (const doc of docStore.values()) {
    if (doc.mode === "fastapi") {
      const blob = new Blob([JSON.stringify({ session_token: token })], {
        type: "application/json",
      });
      navigator.sendBeacon(`${API_BASE}/documents/${doc.id}/cleanup`, blob);
    }
  }
}

export async function askDocument(
  docId: string,
  question: string
): Promise<QueryResult> {
  const doc = docStore.get(docId);
  if (!doc) {
    throw new Error("Document is no longer in this session. Please upload it again.");
  }

  if (doc.mode === "fastapi") {
    try {
      const res = await api.post(
        "/query",
        {
          document_id: docId,
          question,
        },
        {
          headers: { "X-Session-Token": getSessionToken() },
        }
      );
      const sources: number[] =
        Array.isArray(res.data.sources) && res.data.sources.length > 0
          ? res.data.sources
          : [1];
      let answer: string = (res.data.answer || "").trim();
      if (answer && !/[\[\u3010]Page[\s\u00a0\u202f]+\d+[\]\u3011]/i.test(answer)) {
        const badges = sources.map((s) => `[Page ${s}]`).join(" ");
        answer = `${answer} ${badges}`;
      }
      return {
        answer,
        sources,
        matchedPages: doc.pages.filter((p) => sources.includes(p.page)),
      };
    } catch (err) {
      console.warn("FastAPI query failed, falling back to browser search:", err);
    }
  }

  await new Promise((r) => setTimeout(r, 140));

  const qLower = question.toLowerCase();

  // 1. Direct page inspection question (single page or page range)
  const pageMatch = qLower.match(/\bpages?\s+(\d+)(?:\s*(?:-|to|through|and)\s*(\d+))?\b/);
  if (pageMatch) {
    const startPage = parseInt(pageMatch[1], 10);
    const endPage = pageMatch[2] ? parseInt(pageMatch[2], 10) : startPage;
    const targets = doc.pages.filter(
      (p) => p.page >= Math.min(startPage, endPage) && p.page <= Math.max(startPage, endPage)
    );
    if (targets.length > 0) {
      const answer = targets
        .map((t) => `### Page ${t.page}: ${t.title}\n${t.fullText} [Page ${t.page}]`)
        .join("\n\n");
      return {
        answer,
        sources: targets.map((t) => t.page),
        matchedPages: targets,
      };
    }
  }

  // 2. Document summary / overview / A-to-Z request across ALL pages
  if (
    /\b(summary|summarize|summarise|overview|highlights|key points|takeaways|complete|everything|all topics|a to z|whole|entire|syllabus|outline)\b/.test(
      qLower
    )
  ) {
    const perPageLimit = doc.pages.length <= 5 ? 900 : doc.pages.length <= 20 ? 380 : 200;
    const answer = doc.pages
      .map(
        (p) =>
          `### Page ${p.page}: ${p.title}\n- ${truncateCleanly(p.fullText, perPageLimit)} [Page ${p.page}]`
      )
      .join("\n\n");
    return {
      answer,
      sources: doc.pages.map((p) => p.page),
      matchedPages: doc.pages,
    };
  }

  // 3. Paragraph / sentence-level keyword retrieval
  const queryWords = qLower
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

  if (queryWords.length > 0) {
    const candidateLines: { page: number; line: string; score: number }[] = [];

    for (const p of doc.pages) {
      const units = p.fullText
        .split(/\n{2,}|\n(?=[•\-*]|\d+[.)])/)
        .map((u) => u.replace(/\s+/g, " ").trim())
        .filter((u) => u.length >= 12);

      for (const unit of units) {
        const lower = unit.toLowerCase();
        let score = 0;
        let matchedTerms = 0;
        for (const w of queryWords) {
          if (lower.includes(w)) {
            matchedTerms += 1;
            score += w.length >= 5 ? 3 : 2;
          }
        }
        if (score > 0) {
          score *= 1 + (matchedTerms - 1) * 0.25;
          candidateLines.push({ page: p.page, line: unit, score });
        }
      }
    }

    candidateLines.sort((a, b) => b.score - a.score);
    const topLines = candidateLines.slice(0, 10);

    if (topLines.length > 0) {
      const sources = Array.from(new Set(topLines.map((t) => t.page))).sort(
        (a, b) => a - b
      );
      const answer = topLines
        .map((t) => `- ${t.line} [Page ${t.page}]`)
        .join("\n");
      return {
        answer,
        sources,
        matchedPages: doc.pages.filter((p) => sources.includes(p.page)),
      };
    }
  }

  const first = doc.pages[0];
  return {
    answer: `No exact match was found for "${question}" in ${doc.filename}. Try asking with terms from the document, or check Page 1 in the Source Inspector. [Page 1]`,
    sources: [1],
    matchedPages: [first],
  };
}
