"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Upload,
  Send,
  Trash2,
  ShieldCheck,
  Copy,
  Check,
  PanelRightClose,
  PanelRightOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import {
  StudyDocument,
  askDocument,
  checkBackendHealth,
  cleanupAllDocumentsOnUnload,
  clearAllDocuments,
  deleteDocument,
  listDocuments,
  uploadCustomPdf,
} from "@/lib/api";

interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  sources: number[];
  timestamp: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function highlightMatches(text: string, query: string): React.ReactNode {
  const terms = Array.from(
    new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4)
    )
  ).slice(0, 6);

  if (terms.length === 0) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="dm-highlight">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const WORKSPACE_CSS = `
.dm-shell {
  /* Symmetrical Cool Slate Side Panels + Crisp White Center (Zero Green) */
  --bg-canvas: #ffffff;
  --bg-center: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f1f5f9;

  --ink-primary: #0f172a;
  --ink-secondary: #475569;
  --ink-muted: #64748b;

  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;

  /* Matching Left & Right Side Panels: Cool Neutral Slate */
  --side-bg: #e9eef3;
  --side-head: #dfe6ee;
  --side-border: #cfd8e3;
  --side-hover: #dce4ec;
  --side-card: #ffffff;

  /* Primary Charcoal Accent + Coral Page Citations */
  --accent-dark: #18181b;
  --accent-hover: #27272a;
  --accent-soft: #f1f5f9;

  --pop-600: #d94b34;
  --pop-100: #fff0ec;
  --pop-border: rgba(217, 75, 52, 0.3);

  --danger-600: #dc2626;
  --danger-50: #fef2f2;

  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-center);
  color: var(--ink-primary);
  overflow: hidden;
}

/* ── Top Navigation Bar ── */
.dm-header {
  height: 58px;
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 20;
}

.dm-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.dm-brand {
  display: inline-flex;
  align-items: center;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #0f172a;
  user-select: none;
}

.dm-privacy-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  padding-left: 12px;
  border-left: 1px solid #e2e8f0;
  white-space: nowrap;
}

.dm-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dm-engine-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  padding: 0 6px;
  white-space: nowrap;
}

.dm-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94a3b8;
}

.dm-status-dot.online {
  background: #2563eb;
}

.dm-btn {
  appearance: none;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  height: 35px;
  padding: 0 14px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 140ms ease, border-color 140ms ease, transform 100ms ease;
}

.dm-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.dm-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.dm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.dm-btn-primary {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
  color: #ffffff;
}

.dm-btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.dm-btn-danger {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}

.dm-btn-danger:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
}

.dm-btn-ghost {
  border-color: transparent;
  background: transparent;
  color: #475569;
}

.dm-btn-ghost:hover:not(:disabled) {
  background: #dce4ec;
  border-color: transparent;
  color: #0f172a;
}

/* ── Error Banner ── */
.dm-error-bar {
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.dm-error-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Empty / First-Run Upload Canvas ── */
.dm-empty-stage {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 56px;
  background: #f8fafc;
}

.dm-empty-inner {
  width: 100%;
  max-width: 680px;
}

.dm-empty-heading {
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #0f172a;
  margin: 0 0 10px;
}

.dm-empty-sub {
  font-size: 15px;
  line-height: 1.55;
  color: #475569;
  margin: 0 0 28px;
  max-width: 560px;
}

.dm-dropzone {
  background: #ffffff;
  border: 1.5px dashed #94a3b8;
  border-radius: 14px;
  padding: 44px 28px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  transition: border-color 160ms ease, background 160ms ease;
}

.dm-dropzone:hover,
.dm-dropzone.active {
  border-color: #18181b;
  background: #f1f5f9;
}

.dm-drop-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: #e9eef3;
  color: #18181b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.dm-drop-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 6px;
}

.dm-drop-hint {
  font-size: 13.5px;
  color: #475569;
  margin: 0 0 20px;
}

.dm-capabilities {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #dbe2ea;
}

.dm-cap-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px;
}

.dm-cap-desc {
  font-size: 12.5px;
  line-height: 1.48;
  color: #64748b;
  margin: 0;
}

/* ── Active 3-Pane Split Workspace ── */
.dm-workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

/* ── LEFT PANEL: Cool Neutral Slate (Matches Right Panel) ── */
.dm-sidebar {
  width: 264px;
  flex-shrink: 0;
  background: var(--side-bg);
  color: var(--ink-primary);
  border-right: 1px solid var(--side-border);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dm-sidebar-head {
  padding: 15px 16px 12px;
  background: var(--side-head);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--side-border);
}

.dm-sidebar-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.dm-sidebar-count {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 1px 7px;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

.dm-doc-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dm-doc-item {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 9px;
  padding: 10px 11px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  text-align: left;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease;
  position: relative;
}

.dm-doc-item:hover {
  background: var(--side-hover);
}

.dm-doc-item.active {
  background: var(--side-card);
  border-color: #cbd5e1;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.dm-doc-icon {
  color: #64748b;
  margin-top: 2px;
  flex-shrink: 0;
}

.dm-doc-item.active .dm-doc-icon {
  color: #0f172a;
}

.dm-doc-meta {
  flex: 1;
  min-width: 0;
}

.dm-doc-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.dm-doc-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.dm-doc-del {
  appearance: none;
  border: none;
  background: transparent;
  color: #64748b;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.72;
  flex-shrink: 0;
  transition: background 120ms ease, color 120ms ease, opacity 120ms ease;
}

.dm-doc-del:hover {
  opacity: 1;
  background: #fee2e2;
  color: #dc2626;
}

.dm-sidebar-drop {
  margin: 10px;
  padding: 12px;
  border: 1.5px dashed #94a3b8;
  background: #f4f7fa;
  border-radius: 10px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
}

.dm-sidebar-drop:hover,
.dm-sidebar-drop.active {
  border-color: #18181b;
  background: #ffffff;
  color: #0f172a;
}

.dm-sidebar-foot {
  padding: 11px 14px;
  background: var(--side-head);
  border-top: 1px solid var(--side-border);
  font-size: 11.5px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── CENTER PANEL: Crisp Bright Light Conversation Area ── */
.dm-chat-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fafbfc;
}

.dm-chat-topbar {
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.dm-active-doc-info {
  min-width: 0;
}

.dm-active-filename {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dm-active-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dm-mode-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  background: #f1f5f9;
  padding: 1px 7px;
  border-radius: 4px;
}

.dm-chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dm-chat-feed {
  max-width: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dm-chat-welcome {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.dm-welcome-title {
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.dm-welcome-desc {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.55;
  margin: 0 0 16px;
}

.dm-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dm-chip {
  appearance: none;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #1e293b;
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 500;
  padding: 8px 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}

.dm-chip:hover:not(:disabled) {
  background: #e9eef3;
  border-color: #475569;
  color: #0f172a;
}

.dm-turn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dm-user-bubble {
  align-self: flex-end;
  max-width: 82%;
  background: #18181b;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  padding: 10px 16px;
  border-radius: 14px 14px 3px 14px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.14);
}

.dm-ai-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}

.dm-ai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.dm-ai-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dm-ai-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #64748b;
}

.dm-ai-body {
  font-size: 14.5px;
  line-height: 1.7;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dm-ai-body strong {
  font-weight: 700;
  color: #0f172a;
}

.dm-ans-h3 {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f172a;
  margin: 10px 0 2px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eef2f6;
}

.dm-ai-body > .dm-ans-h3:first-child {
  margin-top: 0;
}

.dm-ans-p {
  margin: 0;
  line-height: 1.7;
  color: #1e293b;
}

.dm-ans-list,
.dm-ans-ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dm-ans-list li {
  position: relative;
  padding-left: 18px;
  line-height: 1.65;
  color: #1e293b;
}

.dm-ans-list li::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 10px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #64748b;
}

.dm-ans-ol {
  counter-reset: dm-ol-counter;
}

.dm-ans-ol li {
  counter-increment: dm-ol-counter;
  position: relative;
  padding-left: 24px;
  line-height: 1.65;
  color: #1e293b;
}

.dm-ans-ol li::before {
  content: counter(dm-ol-counter) ".";
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
}

.dm-ans-code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  background: #f1f5f9;
  color: #0f172a;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.dm-cite-pill {
  appearance: none;
  border: 1px solid rgba(217, 75, 52, 0.3);
  background: #fff0ec;
  color: #c83e26;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 5px;
  margin-left: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  transition: background 120ms ease, transform 100ms ease;
}

.dm-cite-pill:hover {
  background: #fde0d8;
}

.dm-cite-pill:active {
  transform: scale(0.95);
}

.dm-sources-row {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eef2f6;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.dm-skeleton {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dm-skel-line {
  height: 12px;
  border-radius: 6px;
  background: #e9eef4;
}

/* Composer */
.dm-composer-wrap {
  padding: 14px 24px 18px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.dm-composer-inner {
  max-width: 740px;
  margin: 0 auto;
}

.dm-composer-form {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px 8px 8px 14px;
  transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
}

.dm-composer-form:focus-within {
  border-color: #18181b;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.08);
}

.dm-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 14.5px;
  line-height: 1.45;
  color: #0f172a;
  max-height: 120px;
  min-height: 24px;
  padding: 4px 0;
}

.dm-textarea::placeholder {
  color: #64748b;
}

.dm-composer-hint {
  margin-top: 6px;
  font-size: 11.5px;
  color: #64748b;
  display: flex;
  justify-content: space-between;
}

/* ── RIGHT PANEL: Cool Neutral Slate (Matches Left Panel) ── */
.dm-inspector {
  width: 400px;
  flex-shrink: 0;
  background: var(--side-bg);
  border-left: 1px solid var(--side-border);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dm-inspector-head {
  padding: 13px 16px;
  background: var(--side-head);
  border-bottom: 1px solid var(--side-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dm-inspector-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.dm-page-nav {
  padding: 10px 16px;
  border-bottom: 1px solid var(--side-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--side-bg);
}

.dm-page-pills {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.dm-page-num {
  appearance: none;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  min-width: 28px;
  height: 28px;
  padding: 0 7px;
  border-radius: 6px;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  transition: all 120ms ease;
}

.dm-page-num:hover {
  border-color: #64748b;
  color: #0f172a;
}

.dm-page-num.active {
  background: #18181b;
  border-color: #18181b;
  color: #ffffff;
}

.dm-page-step {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.dm-inspector-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 28px;
}

.dm-source-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dm-source-page-label {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dm-source-heading {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.dm-source-text {
  font-family: var(--font-sans);
  font-size: 13.5px;
  line-height: 1.68;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
  background: #ffffff;
  border: 1px solid #d3dce6;
  border-radius: 10px;
  padding: 16px 18px;
  margin: 0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
}

.dm-highlight {
  background: #fde68a;
  color: #0f172a;
  padding: 0 2px;
  border-radius: 3px;
}

.dm-spin {
  animation: dm-rotate 0.8s linear infinite;
}

@keyframes dm-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile Responsive */
@media (max-width: 1080px) {
  .dm-inspector {
    position: fixed;
    top: 58px;
    right: 0;
    bottom: 0;
    width: min(92vw, 400px);
    z-index: 30;
    box-shadow: -8px 0 28px rgba(15, 23, 42, 0.16);
  }
}

@media (max-width: 780px) {
  .dm-privacy-chip,
  .dm-engine-status {
    display: none;
  }
  .dm-workspace {
    flex-direction: column;
  }
  .dm-sidebar {
    width: 100%;
    height: auto;
    max-height: 120px;
    border-right: none;
    border-bottom: 1px solid var(--side-border);
  }
  .dm-sidebar-head,
  .dm-sidebar-drop,
  .dm-sidebar-foot {
    display: none;
  }
  .dm-doc-list {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 12px;
  }
  .dm-doc-item {
    width: auto;
    min-width: 180px;
    max-width: 240px;
  }
  .dm-capabilities {
    grid-template-columns: 1fr;
  }
  .dm-chat-scroll,
  .dm-composer-wrap,
  .dm-chat-topbar {
    padding-left: 14px;
    padding-right: 14px;
  }
}
`;

export default function DocuMindWorkspace() {
  const [docs, setDocs] = useState<StudyDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [turnsByDoc, setTurnsByDoc] = useState<Record<string, ChatTurn[]>>({});
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeDoc = docs.find((d) => d.id === activeDocId) || null;
  const turns = activeDoc ? turnsByDoc[activeDoc.id] || [] : [];
  const lastQuestion = turns[turns.length - 1]?.question || "";
  const inspectedPage = activeDoc
    ? activeDoc.pages.find((p) => p.page === selectedPageNum) ||
      activeDoc.pages[0]
    : null;

  // Check backend engine health on mount + wipe backend vectors when tab closes
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((ok) => {
      if (mounted) setBackendOnline(ok);
    });

    const handleUnload = () => {
      cleanupAllDocumentsOnUnload();
    };
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      mounted = false;
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, loading]);

  const processFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setError(null);
    setUploading(true);
    setConfirmClear(false);

    let lastUploaded: StudyDocument | null = null;
    try {
      for (const file of files) {
        const uploaded = await uploadCustomPdf(file);
        lastUploaded = uploaded;
        setBackendOnline(uploaded.mode === "fastapi");
      }
      setDocs(listDocuments());
      if (lastUploaded) {
        setActiveDocId(lastUploaded.id);
        setSelectedPageNum(1);
        setInspectorOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not process the uploaded PDF. Please try another text-based PDF."
      );
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejections) => {
      if (rejections.length > 0) {
        setError("Only PDF (.pdf) files are supported.");
      }
      if (acceptedFiles.length > 0) {
        processFiles(acceptedFiles);
      }
    },
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    disabled: uploading,
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      processFiles(selected);
    }
    e.target.value = "";
  };

  const handleAsk = async (overrideQuestion?: string) => {
    if (!activeDoc || loading) return;
    const q = (
      typeof overrideQuestion === "string" ? overrideQuestion : input
    ).trim();
    if (!q) return;

    setError(null);
    if (typeof overrideQuestion !== "string") setInput("");
    setLoading(true);

    try {
      const res = await askDocument(activeDoc.id, q);
      const nextTurn: ChatTurn = {
        id: `t-${Date.now()}`,
        question: q,
        answer: res.answer,
        sources: res.sources,
        timestamp: formatTime(),
      };
      setTurnsByDoc((prev) => ({
        ...prev,
        [activeDoc.id]: [...(prev[activeDoc.id] || []), nextTurn],
      }));
      if (res.sources[0]) {
        setSelectedPageNum(res.sources[0]);
      }
    } catch (err) {
      if (typeof overrideQuestion !== "string") setInput(q);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to answer the question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDocument(docId);
    const remaining = listDocuments();
    setDocs(remaining);
    setTurnsByDoc((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
    if (activeDocId === docId) {
      setActiveDocId(remaining[0]?.id || null);
      setSelectedPageNum(1);
    }
  };

  const handleClearSession = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    await clearAllDocuments();
    setDocs([]);
    setActiveDocId(null);
    setTurnsByDoc({});
    setSelectedPageNum(1);
    setConfirmClear(false);
    setError(null);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const renderInlineTokens = (text: string) => {
    // Normalize awkward " [Page 1]." -> ". [Page 1]" so no floating punctuation appears after badges
    const normalized = text.replace(
      /\s*([\[\u3010]Page[\s\u00a0\u202f]+\d+[\]\u3011])\s*([.,;:!?])/gi,
      "$2 $1"
    );

    const parts = normalized.split(
      /([\[\u3010]Page[\s\u00a0\u202f]+\d+[\]\u3011]|\*\*[^*]+\*\*|`[^`]+`)/gi
    );
    return parts.map((part, idx) => {
      const pageMatch = part.match(
        /^[\[\u3010]Page[\s\u00a0\u202f]+(\d+)[\]\u3011]$/i
      );
      if (pageMatch) {
        const pageNum = parseInt(pageMatch[1], 10);
        return (
          <button
            key={idx}
            type="button"
            className="dm-cite-pill"
            onClick={() => {
              setSelectedPageNum(pageNum);
              setInspectorOpen(true);
            }}
            title={`Inspect Page ${pageNum}`}
          >
            Page {pageNum}
          </button>
        );
      }
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return <strong key={idx}>{boldMatch[1]}</strong>;
      }
      const codeMatch = part.match(/^`([^`]+)`$/);
      if (codeMatch) {
        return (
          <code key={idx} className="dm-ans-code">
            {codeMatch[1]}
          </code>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const renderStructuredAnswer = (text: string) => {
    const lines = text.split(/\r?\n/);
    const blocks: React.ReactNode[] = [];
    let bulletBuffer: string[] = [];
    let orderedBuffer: string[] = [];

    const flushBullets = (key: string) => {
      if (bulletBuffer.length === 0) return;
      blocks.push(
        <ul key={key} className="dm-ans-list">
          {bulletBuffer.map((item, i) => (
            <li key={i}>{renderInlineTokens(item)}</li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    };

    const flushOrdered = (key: string) => {
      if (orderedBuffer.length === 0) return;
      blocks.push(
        <ol key={key} className="dm-ans-ol">
          {orderedBuffer.map((item, i) => (
            <li key={i}>{renderInlineTokens(item)}</li>
          ))}
        </ol>
      );
      orderedBuffer = [];
    };

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      if (!line) {
        flushBullets(`ul-${idx}`);
        flushOrdered(`ol-${idx}`);
        return;
      }

      // Markdown heading (#, ##, ###) or standalone **Heading** line
      const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
      const boldHeadingMatch = line.match(/^\*\*([^*]{3,80})\*\*:?$/);
      if (headingMatch || boldHeadingMatch) {
        flushBullets(`ul-${idx}`);
        flushOrdered(`ol-${idx}`);
        const headingText = (headingMatch ? headingMatch[1] : boldHeadingMatch![1])
          .replace(/\*\*/g, "")
          .trim();
        blocks.push(
          <h3 key={`h-${idx}`} className="dm-ans-h3">
            {renderInlineTokens(headingText)}
          </h3>
        );
        return;
      }

      // Unordered bullet (-, *, •)
      const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        flushOrdered(`ol-${idx}`);
        bulletBuffer.push(bulletMatch[1]);
        return;
      }

      // Numbered list item (1., 2., ...)
      const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);
      if (orderedMatch) {
        flushBullets(`ul-${idx}`);
        orderedBuffer.push(orderedMatch[1]);
        return;
      }

      // Regular paragraph
      flushBullets(`ul-${idx}`);
      flushOrdered(`ol-${idx}`);
      blocks.push(
        <p key={`p-${idx}`} className="dm-ans-p">
          {renderInlineTokens(line)}
        </p>
      );
    });

    flushBullets("ul-end");
    flushOrdered("ol-end");
    return blocks;
  };

  return (
    <>
      <style>{WORKSPACE_CSS}</style>
      <div className="dm-shell">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        {/* ── Top Header Bar ── */}
        <header className="dm-header">
          <div className="dm-brand-group">
            <div className="dm-brand">DocuMind</div>

            <span
              className="dm-privacy-chip"
              title="Documents stay private to this browser tab and are deleted from the backend when cleared or closed."
            >
              <ShieldCheck size={13} strokeWidth={1.9} />
              Private Session
            </span>
          </div>

          <div className="dm-header-right">
            <span
              className="dm-engine-status"
              title={
                backendOnline
                  ? "Connected to FastAPI + ChromaDB + Groq AI backend"
                  : "Running privately inside your browser with PDF.js"
              }
            >
              <span
                className={`dm-status-dot ${backendOnline ? "online" : ""}`}
              />
              {backendOnline === null
                ? "Checking engine…"
                : backendOnline
                ? "AI Engine Ready"
                : "Browser Mode"}
            </span>

            {activeDoc && (
              <button
                type="button"
                className="dm-btn dm-btn-ghost"
                onClick={() => setInspectorOpen((v) => !v)}
                aria-label={
                  inspectorOpen
                    ? "Hide Source Inspector"
                    : "Show Source Inspector"
                }
                title={
                  inspectorOpen
                    ? "Hide Source Inspector"
                    : "Show Source Inspector"
                }
              >
                {inspectorOpen ? (
                  <PanelRightClose size={16} strokeWidth={1.75} />
                ) : (
                  <PanelRightOpen size={16} strokeWidth={1.75} />
                )}
                <span>Source</span>
              </button>
            )}

            <button
              type="button"
              className="dm-btn dm-btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 size={15} strokeWidth={2} className="dm-spin" />
              ) : (
                <Upload size={15} strokeWidth={2} />
              )}
              <span>{uploading ? "Indexing PDF…" : "Upload PDF"}</span>
            </button>

            {docs.length > 0 && (
              <button
                type="button"
                className={`dm-btn ${confirmClear ? "dm-btn-danger" : ""}`}
                onClick={handleClearSession}
                title="Delete all uploaded documents from this session"
              >
                <Trash2 size={14} strokeWidth={1.75} />
                <span>{confirmClear ? "Confirm Clear" : "Clear Session"}</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Error Feedback Banner ── */}
        {error && (
          <div className="dm-error-bar" role="alert">
            <div className="dm-error-left">
              <AlertCircle size={15} strokeWidth={2} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="dm-btn dm-btn-ghost"
              style={{ height: 26, padding: "0 6px" }}
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── State A: Clean Upload-First Empty Workspace (Zero personal docs) ── */}
        {!activeDoc ? (
          <main className="dm-empty-stage">
            <div className="dm-empty-inner">
              <h1 className="dm-empty-heading">
                Upload a PDF to ask grounded questions.
              </h1>
              <p className="dm-empty-sub">
                Get direct answers backed by clickable page citations. Uploaded
                files remain isolated to this browser tab and are never visible
                to other users or sessions.
              </p>

              <div
                {...getRootProps()}
                className={`dm-dropzone ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="dm-drop-icon">
                  {uploading ? (
                    <Loader2 size={22} strokeWidth={1.8} className="dm-spin" />
                  ) : (
                    <Upload size={22} strokeWidth={1.8} />
                  )}
                </div>
                <p className="dm-drop-title">
                  {uploading
                    ? "Extracting text and indexing pages…"
                    : isDragActive
                    ? "Drop your PDF files here"
                    : "Drop a PDF here, or click to browse"}
                </p>
                <p className="dm-drop-hint">
                  Supports multi-page PDF documents · Upload one or multiple
                  files
                </p>
                <button
                  type="button"
                  className="dm-btn dm-btn-primary"
                  disabled={uploading}
                >
                  Select PDF from Computer
                </button>
              </div>

              <div className="dm-capabilities">
                <div>
                  <h2 className="dm-cap-title">Session-Isolated Privacy</h2>
                  <p className="dm-cap-desc">
                    Each tab gets its own random session token. Opening another
                    browser never reveals your documents.
                  </p>
                </div>
                <div>
                  <h2 className="dm-cap-title">Clickable Page Citations</h2>
                  <p className="dm-cap-desc">
                    Click any cited page badge in an answer to read the exact
                    extracted source page side-by-side.
                  </p>
                </div>
                <div>
                  <h2 className="dm-cap-title">Automatic Cleanup</h2>
                  <p className="dm-cap-desc">
                    Raw PDFs are deleted right after extraction, and vectors are
                    cleared when you remove a file or close the tab.
                  </p>
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* ── State B: Active 3-Pane Document Intelligence Workspace ── */
          <div className="dm-workspace">
            {/* Left Sidebar: Current Session Documents */}
            <aside className="dm-sidebar" aria-label="Session documents">
              <div className="dm-sidebar-head">
                <span className="dm-sidebar-title">Your Session PDFs</span>
                <span className="dm-sidebar-count">{docs.length}</span>
              </div>

              <div className="dm-doc-list">
                {docs.map((doc) => {
                  const isActive = doc.id === activeDoc.id;
                  return (
                    <div
                      key={doc.id}
                      role="button"
                      tabIndex={0}
                      className={`dm-doc-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setActiveDocId(doc.id);
                        setSelectedPageNum(1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveDocId(doc.id);
                          setSelectedPageNum(1);
                        }
                      }}
                      title={doc.filename}
                    >
                      <FileText
                        size={16}
                        strokeWidth={1.75}
                        className="dm-doc-icon"
                      />
                      <div className="dm-doc-meta">
                        <div className="dm-doc-name">{doc.filename}</div>
                        <div className="dm-doc-sub">
                          {doc.pagesCount}p · {formatFileSize(doc.sizeBytes)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="dm-doc-del"
                        onClick={(e) => handleRemoveDoc(doc.id, e)}
                        aria-label={`Remove ${doc.filename}`}
                        title={`Remove ${doc.filename}`}
                      >
                        <X size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div
                {...getRootProps()}
                className={`dm-sidebar-drop ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                <Upload size={14} strokeWidth={1.8} />
                <span>{uploading ? "Uploading…" : "Drop or add PDF"}</span>
              </div>

              <div className="dm-sidebar-foot">
                <ShieldCheck size={13} strokeWidth={1.8} />
                <span>Private to this tab · Wiped on close</span>
              </div>
            </aside>

            {/* Center Pane: Grounded Multi-Turn Chat */}
            <main className="dm-chat-pane">
              <div className="dm-chat-topbar">
                <div className="dm-active-doc-info">
                  <div className="dm-active-filename" title={activeDoc.filename}>
                    {activeDoc.filename}
                  </div>
                  <div className="dm-active-sub">
                    <span>
                      {activeDoc.pagesCount} page
                      {activeDoc.pagesCount > 1 ? "s" : ""}
                    </span>
                    {activeDoc.chunksStored ? (
                      <span>· {activeDoc.chunksStored} indexed chunks</span>
                    ) : null}
                    <span>·</span>
                    <span className="dm-mode-tag">
                      {activeDoc.mode === "fastapi"
                        ? "FastAPI + Groq RAG"
                        : "Browser PDF.js"}
                    </span>
                  </div>
                </div>

                {turns.length > 0 && (
                  <button
                    type="button"
                    className="dm-btn dm-btn-ghost"
                    onClick={() =>
                      setTurnsByDoc((prev) => ({
                        ...prev,
                        [activeDoc.id]: [],
                      }))
                    }
                    title="Clear conversation for this document"
                  >
                    <RotateCcw size={14} strokeWidth={1.75} />
                    <span>New Chat</span>
                  </button>
                )}
              </div>

              <div className="dm-chat-scroll">
                <div className="dm-chat-feed">
                  {turns.length === 0 && !loading && (
                    <div className="dm-chat-welcome">
                      <h2 className="dm-welcome-title">
                        Ready to answer questions about {activeDoc.title}
                      </h2>
                      <p className="dm-welcome-desc">
                        Ask anything from this PDF. Every answer stays grounded
                        in the uploaded document and links directly to the
                        source page on the right.
                      </p>
                      <div className="dm-chip-row">
                        {activeDoc.quickQuestions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            className="dm-chip"
                            onClick={() => handleAsk(q)}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {turns.map((turn) => (
                    <div key={turn.id} className="dm-turn-group">
                      <div className="dm-user-bubble">{turn.question}</div>

                      <article className="dm-ai-card">
                        <div className="dm-ai-head">
                          <span className="dm-ai-label">DocuMind Answer</span>
                          <div className="dm-ai-meta">
                            <span>{turn.timestamp}</span>
                            <button
                              type="button"
                              className="dm-btn dm-btn-ghost"
                              style={{ height: 26, padding: "0 8px", fontSize: 12 }}
                              onClick={() => handleCopy(turn.id, turn.answer)}
                              aria-label="Copy answer"
                            >
                              {copiedId === turn.id ? (
                                <>
                                  <Check size={13} strokeWidth={2} />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} strokeWidth={1.75} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="dm-ai-body">
                          {renderStructuredAnswer(turn.answer)}
                        </div>

                        {turn.sources.length > 0 && (
                          <div className="dm-sources-row">
                            <span>Sources:</span>
                            {turn.sources.map((p) => (
                              <button
                                key={p}
                                type="button"
                                className="dm-cite-pill"
                                onClick={() => {
                                  setSelectedPageNum(p);
                                  setInspectorOpen(true);
                                }}
                              >
                                Page {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </article>
                    </div>
                  ))}

                  {loading && (
                    <div className="dm-skeleton" aria-busy="true">
                      <div className="dm-ai-label">
                        <Loader2 size={14} className="dm-spin" />
                        Searching document and generating grounded answer…
                      </div>
                      <div className="dm-skel-line" style={{ width: "92%" }} />
                      <div className="dm-skel-line" style={{ width: "78%" }} />
                      <div className="dm-skel-line" style={{ width: "54%" }} />
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>
              </div>

              {/* Docked Bottom Composer */}
              <div className="dm-composer-wrap">
                <div className="dm-composer-inner">
                  <form
                    className="dm-composer-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAsk();
                    }}
                  >
                    <textarea
                      rows={1}
                      className="dm-textarea"
                      aria-label={`Ask a question about ${activeDoc.filename}`}
                      placeholder={`Ask a question about ${activeDoc.filename}…`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAsk();
                        }
                      }}
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="dm-btn dm-btn-primary"
                      disabled={!input.trim() || loading}
                    >
                      <Send size={14} strokeWidth={2} />
                      <span>Ask</span>
                    </button>
                  </form>
                  <div className="dm-composer-hint">
                    <span>Press Enter to send · Shift+Enter for new line</span>
                    <span>Answers are restricted to this document</span>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Pane: Live Source Page Inspector */}
            {inspectorOpen && inspectedPage && (
              <aside className="dm-inspector" aria-label="Source Inspector">
                <div className="dm-inspector-head">
                  <span className="dm-inspector-title">
                    <FileText size={15} strokeWidth={1.8} />
                    Source Inspector
                  </span>
                  <button
                    type="button"
                    className="dm-btn dm-btn-ghost"
                    style={{ height: 28, padding: "0 8px" }}
                    onClick={() => setInspectorOpen(false)}
                    aria-label="Close Source Inspector"
                  >
                    <X size={15} strokeWidth={1.75} />
                  </button>
                </div>

                <div className="dm-page-nav">
                  <div className="dm-page-pills">
                    {activeDoc.pages.map((p) => (
                      <button
                        key={p.page}
                        type="button"
                        className={`dm-page-num ${
                          inspectedPage.page === p.page ? "active" : ""
                        }`}
                        onClick={() => setSelectedPageNum(p.page)}
                      >
                        {p.page}
                      </button>
                    ))}
                  </div>

                  <div className="dm-page-step">
                    <button
                      type="button"
                      className="dm-btn dm-btn-ghost"
                      style={{ height: 28, width: 28, padding: 0 }}
                      disabled={inspectedPage.page <= 1}
                      onClick={() =>
                        setSelectedPageNum((p) => Math.max(1, p - 1))
                      }
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      type="button"
                      className="dm-btn dm-btn-ghost"
                      style={{ height: 28, width: 28, padding: 0 }}
                      disabled={inspectedPage.page >= activeDoc.pagesCount}
                      onClick={() =>
                        setSelectedPageNum((p) =>
                          Math.min(activeDoc.pagesCount, p + 1)
                        )
                      }
                      aria-label="Next page"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="dm-inspector-body">
                  <div className="dm-source-meta">
                    <span className="dm-source-page-label">
                      Page {inspectedPage.page} of {activeDoc.pagesCount}
                    </span>
                    <button
                      type="button"
                      className="dm-btn dm-btn-ghost"
                      style={{ height: 26, padding: "0 8px", fontSize: 12 }}
                      onClick={() =>
                        handleCopy(
                          `page-${inspectedPage.page}`,
                          inspectedPage.fullText
                        )
                      }
                    >
                      {copiedId === `page-${inspectedPage.page}` ? (
                        <>
                          <Check size={13} strokeWidth={2} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} strokeWidth={1.75} />
                          <span>Copy page</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="dm-source-heading">{inspectedPage.title}</h3>
                  <pre className="dm-source-text">
                    {highlightMatches(inspectedPage.fullText, lastQuestion)}
                  </pre>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </>
  );
}
