"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocument, UploadResponse } from "@/lib/api";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";

export default function FileUploader({ onUploadSuccess }: { onUploadSuccess: (res: UploadResponse) => void }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setStatus("uploading");
    setError("");
    try {
      const result = await uploadDocument(file);
      onUploadSuccess(result);
    } catch (err: any) {
      setStatus("error");
      setError(err.response?.data?.detail || "An error occurred during upload.");
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: status === "uploading",
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full bg-white rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm
        ${isDragActive ? "border-slate-900 bg-slate-50 scale-[1.01]" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}
        ${status === "error" ? "border-red-300 bg-red-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      {status === "uploading" ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-4" />
          <h3 className="text-[15px] font-medium text-slate-900">Processing document...</h3>
          <p className="text-[13px] text-slate-500 mt-1">This will only take a moment</p>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <UploadCloud className={`w-6 h-6 ${isDragActive ? "text-slate-900" : "text-slate-500"}`} />
          </div>
          <h3 className="text-[16px] font-medium text-slate-900 mb-1 tracking-tight">
            {isDragActive ? "Drop PDF here" : "Click or drag file to this area"}
          </h3>
          <p className="text-[13px] text-slate-500">Supports strictly PDF files up to 50MB</p>

          {status === "error" && (
            <div className="mt-6 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-[13px] text-red-700 font-medium">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
