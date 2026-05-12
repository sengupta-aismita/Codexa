import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { useEffect, useRef } from "react";
import { getCurrentUser, logoutUser } from "../services/auth.service.js";
import {
  getThreads,
  getSingleThread,
  deleteThread,
} from "../services/ai.service.js";
import {
  Menu,
  Send,
  Plus,
  Trash2,
  User,
  Sparkles,
  LoaderCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bot,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRecentChats, setShowRecentChats] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
};

  const handleSend = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    const userMessage = {
      role: "user",
      content: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/ai/message", {
        threadId,
        message: currentMessage,
      });

      if (!threadId) {
        setThreadId(response.data.data.threadId);
      }

      const aiMessage = {
        role: "assistant",
        content: response.data.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
      await fetchThreads();
    } catch (error) {
      toast.error("AI couldn't generate a response");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);

    setThreadId(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      navigate("/login");
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await getThreads();

      setThreads(response.data);
    } catch (error) {
      toast.error("Couldn't load recent chats");
    }
  };

  const handleThreadClick = async (thread) => {
    try {
      const response = await getSingleThread(thread._id);

      setMessages(response.data.messages);

      setThreadId(response.data._id);
    } catch (error) {
      toast.error("Couldn't open chat");
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await deleteThread(threadId);

      setThreads((prev) => prev.filter((thread) => thread._id !== threadId));
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Cannot delete thread");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getCurrentUser();

        setUser(userResponse.data);

        const threadsResponse = await getThreads();

        setThreads(threadsResponse.data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  scrollToBottom();
}, [messages, loading]);

  return (
    <div className="h-screen bg-[#070B14] text-white flex overflow-hidden">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-screen w-72 border-r border-[#111827] bg-[#060C1B]/95 backdrop-blur-xl flex flex-col transition-transform duration-300

  ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="px-6 py-5 border-b border-[#111827] flex items-center gap-3">
          <img
            src="/codexa.svg"
            alt="Codexa Logo"
            className="w-10 h-10 flex-shrink-0"
          />

          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Codexa
          </h1>
        </div>

        {/* NEW CHAT */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition shadow-xl flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} className="flex-shrink-0" />

            <span>New Chat</span>
          </button>
        </div>

        {/* RECENT CHATS */}
        <div className="mt-6 px-4 flex-1 overflow-y-auto pb-6">
          <button
            onClick={() => setShowRecentChats(!showRecentChats)}
            className="flex items-center gap-2 text-sm text-zinc-400 mb-4 uppercase tracking-wider hover:text-white transition-all duration-200"
          >
            {showRecentChats ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}

            <span>Recent Chats</span>
          </button>

          {showRecentChats && (
            <div className="space-y-3">
              {threads.length === 0 && (
                <div className="text-zinc-500 text-sm">No recent chats</div>
              )}

              {threads.map((thread) => (
                <div
                  key={thread._id}
                  onClick={() => handleThreadClick(thread)}
                  className="bg-[#111827] rounded-2xl p-4 cursor-pointer hover:bg-[#1F2937] transition border border-transparent hover:border-indigo-500 flex items-center justify-between gap-3"
                >
                  <span className="truncate">{thread.title}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDeleteThread(thread._id);
                    }}
                    className="text-zinc-500 hover:text-red-400 transition flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 mx-2 mb-4 flex items-center justify-center gap-3 bg-[#111827] hover:bg-red-500/20 border border-[#1E293B] hover:border-red-500 text-zinc-300 hover:text-red-400 transition-all duration-200 rounded-2xl py-3 px-4"
        >
          <LogOut size={20} />

          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#070B14] to-[#050816]">
        {/* TOP BAR */}

        <header className="h-20 border-b border-[#111827] flex items-center justify-between px-4 md:px-8 bg-[#070B14]/80 backdrop-blur-xl">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-[#111827] transition flex-shrink-0"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold truncate">
                AI Study Assistant
              </h2>

              <p className="text-zinc-400 text-sm mt-1 hidden sm:block">
                Learn DSA, Java, DBMS and more
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-lg shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="font-medium truncate max-w-[120px]">
                {user?.username}
              </p>

              <p className="text-sm text-zinc-400">Codexa User</p>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <section className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-16 py-6 md:py-8 space-y-14">
          {messages.length === 0 && (
            <div className="min-h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-5 text-zinc-100">
                  Welcome to Codexa
                </h2>

                <p className="text-zinc-500 text-xl">
                  Ask anything about DSA, Java, DBMS or interviews.
                </p>
              </div>
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
                  className="  prose
    prose-invert
    prose-zinc
    max-w-none

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
                  <Sparkles
                    size={18}
                    className="text-indigo-400 animate-pulse"
                  />

                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse rounded-full"></div>
                </div>

                <div className="flex items-center gap-2 text-zinc-300 text-sm">
                  <LoaderCircle
                    size={16}
                    className="animate-spin text-indigo-400"
                  />

                  <span>Codexa is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* INPUT BAR */}
        <div className="border-t border-[#111827] bg-[#070B14] p-4 md:p-5">
          <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
            <input
              type="text"
              placeholder="Ask Codexa something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
              className="flex-1 min-w-0 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 md:px-6 py-4 outline-none focus:border-indigo-500 text-base md:text-lg placeholder:text-zinc-500 shadow-lg"
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="shrink-0 bg-indigo-500 hover:bg-indigo-400 transition rounded-2xl px-5 md:px-8 py-4 font-semibold"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
