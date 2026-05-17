import React from "react";
import ReactMarkdown from "react-markdown";
import { User, Bot, Sparkles, LoaderCircle } from "lucide-react";

const ChatWindow = ({ messages, loading, messagesEndRef, chatMode }) => {
  return (
    <section
      className={`flex-1 min-h-0 overflow-y-auto px-4 md:px-10 lg:px-16 ${
        messages.length === 0
          ? "flex items-center justify-center"
          : "py-6 md:py-8 space-y-14"
      }`}
    >
      {messages.length === 0 && (
        <div className="text-center w-full">
          <h2 className="text-5xl font-bold mb-5 text-zinc-100">
            Think. Build. Ship.
          </h2>

          <p className="text-zinc-500 text-xl">
            {chatMode === "rag"
              ? "Turn your PDFs into conversations."
              : "Code smarter, learn faster, and prepare"}
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`overflow-hidden rounded-2xl px-5 py-3.5 leading-7 text-[16px] shadow-2xl backdrop-blur-sm ${
              msg.role === "user"
                ? "max-w-fit md:max-w-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                : "w-full max-w-3xl bg-[#0F172A] border border-[#1E293B] text-zinc-100"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold mb-4 opacity-70 tracking-widest uppercase">
              {msg.role === "user" ? (
                <>
                  <User size={14} />
                  <span>You</span>
                </>
              ) : (
                <>
                  <Bot size={14} />
                  <span>Codexa</span>
                </>
              )}
            </div>

            <div
              className="prose prose-invert prose-zinc max-w-none
                  prose-headings:text-white
                  prose-headings:mb-8
                  prose-headings:font-bold
                  prose-p:text-zinc-200
                  prose-p:leading-9
                  prose-p:mb-7
                  prose-strong:text-white
                  prose-li:mb-4
                  prose-li:leading-8
                  prose-code:text-indigo-300
                  prose-code:before:content-none
                  prose-code:after:content-none
                  prose-pre:bg-[#111827]
                  prose-pre:border
                  prose-pre:border-[#1E293B]
                  prose-pre:p-6
                  prose-pre:rounded-2xl
                  prose-pre:overflow-x-auto
                  prose-pre:max-w-full
                  prose-pre:text-sm
                  prose-hr:border-zinc-700
                  break-words"
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">
            <div className="relative">
              <Sparkles size={18} className="text-indigo-400 animate-pulse" />

              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse rounded-full"></div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300 text-sm">
              <LoaderCircle
                size={16}
                className="animate-spin text-indigo-400"
              />

              <span>
                {chatMode === "rag"
                  ? "Searching your documents..."
                  : "Codexa is thinking..."}
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </section>
  );
};

export default ChatWindow;
