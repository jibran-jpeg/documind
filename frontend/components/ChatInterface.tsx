"use client";

import { useState, useRef, useEffect } from "react";
import { queryDocument } from "@/lib/api";
import { Send, FileText } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: number[];
}

export default function ChatInterface({ documentId, filename }: { documentId: string, filename: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I've prepared **${filename}**. Ask me anything about the document's contents.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSend = async (overrideQuery?: string) => {
    const q = (typeof overrideQuery === "string" ? overrideQuery : input).trim();
    if (!q || loading) return;
    if (typeof overrideQuery !== "string") setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const result = await queryDocument(documentId, q);
      setMessages((prev) => [...prev, { role: "assistant", content: result.answer, sources: result.sources }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong fetching the answer." }]);
    } finally {
      setLoading(false);
    }
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Scrollable Message History Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className="shrink-0 mt-0.5">
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                    <span className="text-[12px] font-bold text-slate-900 tracking-tight">AI</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center shadow-sm">
                    <span className="text-[12px] font-medium text-white">US</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 min-w-0 ${msg.role === "user" ? "flex justify-end" : ""}`}>
                <div className={`
                  ${msg.role === "user" 
                    ? "bg-slate-100 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%]" 
                    : "pt-1 max-w-[95%]"}
                `}>
                  <div className={`text-[15px] leading-[1.6] ${msg.role === "user" ? "text-slate-900" : "text-slate-700"}`}>
                    {formatText(msg.content)}
                  </div>
                  
                  {/* Sources Pill */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[12px] font-medium text-slate-600">
                        <FileText size={12} className="text-slate-400" />
                        Sources: Page {msg.sources.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Minimal Typing Indicator */}
          {loading && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                  <span className="text-[12px] font-bold text-slate-900 tracking-tight">AI</span>
                </div>
              </div>
              <div className="flex-1 pt-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Solid Input Area Fixed at Bottom */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="max-w-4xl mx-auto w-full relative">
          {messages.length === 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                "How does chunking and embedding work?",
                "How are hallucinations prevented?",
                "What are the latency and deployment specs?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <div className="bg-white border border-slate-300 shadow-sm rounded-xl p-1.5 flex items-end focus-within:border-slate-400 focus-within:shadow-md focus-within:ring-4 focus-within:ring-slate-100 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={autoResizeTextarea}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message DocuMind..."
              className="flex-1 max-h-[200px] min-h-[44px] bg-transparent text-slate-900 placeholder-slate-400 py-2.5 px-4 resize-none outline-none text-[15px] leading-relaxed"
              rows={1}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`shrink-0 w-9 h-9 mb-1 mr-1 rounded-lg flex items-center justify-center transition-colors ${
                loading || !input.trim() 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[11.5px] text-slate-500 font-medium">DocuMind can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
