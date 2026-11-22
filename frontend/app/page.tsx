"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import ChatInterface from "@/components/ChatInterface";
import { UploadResponse } from "@/lib/api";
import { BookText, PanelLeftClose } from "lucide-react";

export default function Home() {
  const [uploadedDoc, setUploadedDoc] = useState<UploadResponse | null>(null);

  return (
    <div className="h-full w-full flex bg-slate-50 overflow-hidden">
      
      {/* Sidebar (Optional/Fixed for SaaS look) */}
      <aside className="w-[280px] bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-[6px] flex items-center justify-center">
              <span className="text-white font-bold text-[12px]">D</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">DocuMind</span>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
            <PanelLeftClose size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={() => setUploadedDoc(null)}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-[13px] py-2 rounded-md shadow-sm transition-all"
          >
            New Document
          </button>
        </div>

        <div className="flex-1 px-3 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Current Session</div>
          {uploadedDoc ? (
            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-slate-100 text-slate-900 cursor-pointer border border-slate-200 shadow-sm">
              <BookText size={14} className="text-slate-500" />
              <span className="text-[13px] font-medium truncate">{uploadedDoc.filename}</span>
            </div>
          ) : (
            <div className="px-2 py-2 text-[13px] text-slate-500">No active document</div>
          )}
        </div>
      </aside>

      {/* Main Working Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {!uploadedDoc ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50">
            <div className="w-full max-w-xl">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Upload your document</h1>
                <p className="text-[15px] text-slate-500">DocuMind will read the PDF and prepare it for search.</p>
              </div>
              <FileUploader onUploadSuccess={setUploadedDoc} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full w-full">
            {/* Top Bar for Mobile / Context */}
            <div className="h-14 shrink-0 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 bg-white/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <span className="lg:hidden font-semibold text-[15px]">DocuMind</span>
                <div className="hidden lg:flex items-center gap-2 text-[13px] text-slate-500">
                  <BookText size={14} />
                  <span className="font-medium text-slate-700">{uploadedDoc.filename}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                  <span>{uploadedDoc.pages_processed} pages</span>
                </div>
              </div>
            </div>
            
            {/* Chat Area Container */}
            <div className="flex-1 min-h-0 bg-white">
              <ChatInterface documentId={uploadedDoc.document_id} filename={uploadedDoc.filename} />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
