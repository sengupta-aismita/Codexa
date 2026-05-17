import React from "react";
import { Send, FileText } from "lucide-react";

const ChatInput = ({
  handleSend,
  loading,
  message,
  setMessage,
  chatMode,
  setChatMode,
  handlePdfUpload,
  uploading,
  documentReady,
  uploadedFileName,
}) => {
  return (
    <div className="border-t border-[#111827] bg-[#070B14] p-4 md:p-5">
      <div className="max-w-6xl mx-auto w-full">
        {/* Mode Toggle */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setChatMode("general")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              chatMode === "general"
                ? "bg-indigo-500 text-white"
                : "bg-[#0F172A] border border-[#1E293B] text-zinc-400"
            }`}
          >
            General AI
          </button>

          <button
            onClick={() => setChatMode("rag")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              chatMode === "rag"
                ? "bg-indigo-500 text-white"
                : "bg-[#0F172A] border border-[#1E293B] text-zinc-400"
            }`}
          >
            Study with PDF
          </button>
        </div>

        {chatMode === "rag" && documentReady && (
          <div className="mb-3 text-sm text-emerald-400">
            PDF ready: {uploadedFileName}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* PDF Upload */}
          {chatMode === "rag" && (
            <label className="cursor-pointer shrink-0 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-4 hover:border-indigo-500 transition flex items-center justify-center gap-2">
              <FileText size={18} />

              <span className="hidden md:inline text-sm">
                {uploading ? "Uploading..." : "Upload PDF"}
              </span>

              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={handlePdfUpload}
              />
            </label>
          )}

          {/* Input */}
          <input
            type="text"
            placeholder={
              chatMode === "rag"
                ? "Ask your PDF..."
                : "Ask Codexa something..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleSend();
              }
            }}
            className="flex-1 min-w-0 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 md:px-6 py-4 outline-none focus:border-indigo-500 text-base md:text-lg placeholder:text-zinc-500 shadow-lg"
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={loading || uploading}
            className="shrink-0 bg-indigo-500 hover:bg-indigo-400 transition rounded-2xl px-5 md:px-8 py-4 font-semibold disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
