"use client";

import React, { useState, useRef } from "react";
import {
  SAMPLE_DOCUMENTS,
  StudyDocument,
  askDocument,
  listDocuments,
  uploadCustomPdf,
} from "@/lib/api";

interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  sources: number[];
}

const DEFAULT_TURN: Record<string, ChatTurn> = {
  "documind-overview": {
    id: "d1",
    question: "How does DocuMind answer questions from a PDF?",
    answer:
      "When you upload a PDF, PyMuPDF extracts text from each page and splits it into 500-character passages with a 50-character overlap so sentences are never cut off mid-thought. [Page 2] Each passage is converted into a 384-dimensional vector using HuggingFace's all-MiniLM-L6-v2 model locally and stored in ChromaDB for instant semantic search without extra API costs. [Page 3]",
    sources: [2, 3],
  },
  "crickconnect-guide": {
    id: "d2",
    question: "How are cricket players ranked in the app?",
    answer:
      "Every player's score combines 60% AI biomechanical video evaluation with 40% verified match statistics, automatically awarding Gold, Silver, or Bronze badges via PostgreSQL triggers. [Page 3] Biomechanical scores are locked at the database level so players cannot manually edit their AI ratings, keeping leaderboards tamper-proof for coaches. [Page 4]",
    sources: [3, 4],
  },
  "lacey-guide": {
    id: "d3",
    question: "How does browser background removal work?",
    answer:
      "When admins upload shoe photos, an ONNX AI model runs directly inside the web browser to cut out the background automatically—costing $0 in server GPUs. [Page 2]",
    sources: [2],
  },
};

const APPLE_UI_CSS = `
.ap-page {
  min-height: 100dvh;
  background: var(--bg-page);
  color: var(--ink-primary);
  display: flex;
  flex-direction: column;
}

/* ── Slim Apple Frosted Top Nav ── */
.ap-nav {
  height: 52px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--hairline);
  position: sticky;
  top: 0;
  z-index: 20;
}

.ap-nav-inner {
  max-width: 860px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ap-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
}

.ap-logo-badge {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--lead-teal-dark);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ap-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-upload-pill {
  appearance: none;
  border: none;
  background: var(--spark-coral);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 9999px;
  cursor: pointer;
  transition: transform 120ms ease, opacity 150ms ease;
}

.ap-upload-pill:hover {
  opacity: 0.92;
}

.ap-upload-pill:active {
  transform: scale(0.96);
}

.ap-gh-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 9999px;
  transition: color 150ms ease, background 150ms ease;
}

.ap-gh-link:hover {
  color: var(--ink-primary);
  background: rgba(0, 0, 0, 0.04);
}

/* ── Centered Single-Column Stage ── */
.ap-stage {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 40px 20px 64px;
  flex: 1;
}

/* ── Hero Headline ── */
.ap-hero {
  text-align: center;
  margin-bottom: 28px;
}

.ap-hero-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--ink-primary);
  margin-bottom: 8px;
}

.ap-hero-sub {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.47;
  letter-spacing: -0.01em;
  color: var(--ink-secondary);
}

/* ── Document Switcher Pills ── */
.ap-doc-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.ap-doc-pill {
  appearance: none;
  border: 1px solid var(--hairline);
  background: var(--bg-card);
  color: var(--ink-secondary);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 500;
  padding: 9px 16px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 150ms ease;
}

.ap-doc-pill:hover {
  color: var(--ink-primary);
  border-color: rgba(0, 0, 0, 0.18);
}

.ap-doc-pill.active {
  background: var(--lead-teal-dark);
  color: #ffffff;
  border-color: var(--lead-teal-dark);
}

.ap-doc-pill-count {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.06);
}

.ap-doc-pill.active .ap-doc-pill-count {
  background: rgba(255, 255, 255, 0.16);
  color: #e6f4f1;
}

/* ── Main Apple 18px Card ── */
.ap-card {
  background: var(--bg-card);
  border-radius: 18px;
  border: 1px solid var(--hairline);
  overflow: hidden;
}

/* ── Deep Teal Document Banner ("One Field, One Spark") ── */
.ap-banner {
  background: var(--lead-teal-dark);
  color: #ffffff;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.ap-banner-label {
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8ce0ce;
  margin-bottom: 3px;
}

.ap-banner-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.ap-page-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-page-dot {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 140ms ease;
}

.ap-page-dot:hover {
  background: rgba(255, 255, 255, 0.18);
}

.ap-page-dot.active {
  background: var(--spark-coral);
  border-color: var(--spark-coral);
  color: #ffffff;
}

/* ── Clean Answer Area ── */
.ap-body {
  padding: 28px;
}

.ap-turn {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--hairline);
}

.ap-turn:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.ap-question {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  margin-bottom: 10px;
}

.ap-answer {
  font-size: 16.5px;
  font-weight: 400;
  line-height: 1.58;
  letter-spacing: -0.01em;
  color: #2c2c2e;
}

.ap-cite-badge {
  appearance: none;
  border: none;
  background: var(--spark-coral-soft);
  color: var(--spark-coral);
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  margin: 0 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 140ms ease, transform 100ms ease;
}

.ap-cite-badge:hover {
  background: #ffe0d9;
}

.ap-cite-badge:active {
  transform: scale(0.95);
}

/* ── Clean Source Page Drawer (Only 1 focused page shown!) ── */
.ap-source-drawer {
  margin-top: 22px;
  background: var(--lead-teal-soft);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-source-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ap-source-badge {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--lead-teal);
}

.ap-source-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--lead-teal-dark);
}

.ap-source-excerpt {
  font-size: 14.5px;
  line-height: 1.55;
  color: #1f3a34;
}

/* ── Bottom Ask Area ── */
.ap-ask-zone {
  padding: 20px 28px 26px;
  background: #fafafc;
  border-top: 1px solid var(--hairline);
}

.ap-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 14px;
}

.ap-suggestion-chip {
  appearance: none;
  border: 1px solid var(--hairline);
  background: var(--bg-card);
  color: var(--ink-secondary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 140ms ease;
}

.ap-suggestion-chip:hover {
  color: var(--lead-teal-dark);
  border-color: var(--lead-teal);
  background: var(--lead-teal-soft);
}

.ap-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 9999px;
  padding: 6px 6px 6px 20px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.ap-input-bar:focus-within {
  border-color: var(--lead-teal);
  box-shadow: 0 0 0 3px rgba(17, 94, 80, 0.12);
}

.ap-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 15.5px;
  color: var(--ink-primary);
  min-width: 0;
}

.ap-input::placeholder {
  color: var(--ink-tertiary);
}

.ap-ask-btn {
  appearance: none;
  border: none;
  background: var(--lead-teal-dark);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  padding: 11px 22px;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 120ms ease, background 150ms ease;
}

.ap-ask-btn:hover:not(:disabled) {
  background: var(--lead-teal);
}

.ap-ask-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ap-ask-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .ap-stage {
    padding: 24px 14px 44px;
  }
  .ap-banner,
  .ap-body,
  .ap-ask-zone {
    padding: 18px;
  }
  .ap-question {
    font-size: 17px;
  }
  .ap-answer {
    font-size: 15px;
  }
}
`;

export default function DocuMindApplePage() {
  const [docs, setDocs] = useState<StudyDocument[]>(() => listDocuments());
  const [activeDocId, setActiveDocId] = useState<string>(
    SAMPLE_DOCUMENTS[0].id
  );
  const [turnsByDoc, setTurnsByDoc] =
    useState<Record<string, ChatTurn[]>>(DEFAULT_TURN ? {
      "documind-overview": [DEFAULT_TURN["documind-overview"]],
      "crickconnect-guide": [DEFAULT_TURN["crickconnect-guide"]],
      "lacey-guide": [DEFAULT_TURN["lacey-guide"]],
    } : {});

  const [selectedPageNum, setSelectedPageNum] = useState<number>(2);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const activeDoc =
    docs.find((d) => d.id === activeDocId) || SAMPLE_DOCUMENTS[0];
  const turns = turnsByDoc[activeDoc.id] || [];
  const inspectedPage =
    activeDoc.pages.find((p) => p.page === selectedPageNum) ||
    activeDoc.pages[0];

  const switchDoc = (doc: StudyDocument) => {
    setActiveDocId(doc.id);
    const existing = turnsByDoc[doc.id] || [];
    const firstCited = existing[existing.length - 1]?.sources?.[0] || 1;
    setSelectedPageNum(firstCited);
  };

  const handleAsk = async (overrideQ?: string) => {
    const q = (typeof overrideQ === "string" ? overrideQ : input).trim();
    if (!q || loading) return;
    if (typeof overrideQ !== "string") setInput("");

    setLoading(true);
    try {
      const res = await askDocument(activeDoc.id, q);
      const nextTurn: ChatTurn = {
        id: `t-${Date.now()}`,
        question: q,
        answer: res.answer,
        sources: res.sources,
      };
      setTurnsByDoc((prev) => ({
        ...prev,
        [activeDoc.id]: [nextTurn],
      }));
      if (res.sources[0]) {
        setSelectedPageNum(res.sources[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const newDoc = await uploadCustomPdf(file);
      setDocs(listDocuments());
      setActiveDocId(newDoc.id);
      setSelectedPageNum(1);
      setTurnsByDoc((prev) => ({
        ...prev,
        [newDoc.id]: [
          {
            id: `u-${Date.now()}`,
            question: `Summary of ${newDoc.filename}`,
            answer: `${newDoc.pages[0].summaryAnswer} [Page 1]`,
            sources: [1],
          },
        ],
      }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const renderAnswerWithBadges = (text: string) => {
    const parts = text.split(/(\[Page\s+\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/^\[Page\s+(\d+)\]$/);
      if (match) {
        const pageNum = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            type="button"
            className="ap-cite-badge"
            onClick={() => setSelectedPageNum(pageNum)}
            title={`Show Page ${pageNum} source`}
          >
            Page {pageNum}
          </button>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <>
      <style>{APPLE_UI_CSS}</style>
      <div className="ap-page">
        {/* ── Slim Apple Frosted Top Nav ── */}
        <header className="ap-nav">
          <div className="ap-nav-inner">
            <div className="ap-logo">
              <span className="ap-logo-badge">D</span>
              <span>DocuMind</span>
            </div>

            <div className="ap-nav-actions">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="ap-upload-pill"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "Reading PDF…" : "+ Upload PDF"}
              </button>
              <a
                href="https://github.com/jibran-jpeg/documind"
                target="_blank"
                rel="noopener noreferrer"
                className="ap-gh-link"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </header>

        {/* ── Single Focused Stage ── */}
        <main className="ap-stage">
          <div className="ap-hero">
            <h1 className="ap-hero-title">Ask your PDF anything.</h1>
            <p className="ap-hero-sub">
              Clear answers grounded in your document, with clickable page
              numbers.
            </p>
          </div>

          {/* ── Document Pill Switcher ── */}
          <div className="ap-doc-bar" role="tablist" aria-label="Sample PDFs">
            {docs.map((doc) => {
              const active = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`ap-doc-pill ${active ? "active" : ""}`}
                  onClick={() => switchDoc(doc)}
                >
                  <span>{doc.title}</span>
                  <span className="ap-doc-pill-count">
                    {doc.pagesCount}p
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Focused Apple Card ── */}
          <section className="ap-card">
            {/* Deep Botanical Teal Banner + Coral Active Page Dot */}
            <div className="ap-banner">
              <div>
                <div className="ap-banner-label">{activeDoc.tag}</div>
                <div className="ap-banner-title">{activeDoc.filename}</div>
              </div>

              <div className="ap-page-dots" aria-label="Inspect page">
                {activeDoc.pages.map((p) => (
                  <button
                    key={p.page}
                    type="button"
                    className={`ap-page-dot ${
                      selectedPageNum === p.page ? "active" : ""
                    }`}
                    onClick={() => setSelectedPageNum(p.page)}
                  >
                    Page {p.page}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Question & Answer */}
            <div className="ap-body">
              {turns.map((turn) => (
                <div key={turn.id} className="ap-turn">
                  <h2 className="ap-question">{turn.question}</h2>
                  <p className="ap-answer">
                    {renderAnswerWithBadges(turn.answer)}
                  </p>
                </div>
              ))}

              {/* Focused Single-Page Source Preview */}
              {inspectedPage && (
                <div className="ap-source-drawer">
                  <div className="ap-source-top">
                    <span className="ap-source-badge">
                      Verified Source · Page {inspectedPage.page} of{" "}
                      {activeDoc.pagesCount}
                    </span>
                  </div>
                  <div className="ap-source-title">{inspectedPage.title}</div>
                  <div className="ap-source-excerpt">
                    “{inspectedPage.excerpt}”
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Suggestion Chips & Apple Pill Input */}
            <div className="ap-ask-zone">
              <div className="ap-suggestions">
                {activeDoc.quickQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="ap-suggestion-chip"
                    onClick={() => handleAsk(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="ap-input-bar"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
              >
                <input
                  type="text"
                  className="ap-input"
                  placeholder={`Ask a question about ${activeDoc.title}…`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="ap-ask-btn"
                  disabled={!input.trim() || loading}
                >
                  {loading ? "Checking…" : "Ask PDF"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
