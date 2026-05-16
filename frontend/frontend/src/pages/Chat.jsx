import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { getCurrentUser, logoutUser } from "../services/auth.service.js";
import {
  getThreads,
  getSingleThread,
  deleteThread,
  searchThreads,
} from "../services/ai.service.js";
import { Send, User, Sparkles, LoaderCircle, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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
      console.log(error);
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
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

useEffect(() => {
  const currentQuery = searchQuery.trim();

  if (!currentQuery) {
    setSearchResults([]);
    setSearchLoading(false);
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setSearchLoading(true);
      const results = await searchThreads(currentQuery);

      setSearchResults(results);

      // open only after actual search finishes
      if (results.length > 0) {
        setSidebarOpen(true);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setSearchLoading(false);
    }
  }, 500);

  return () => clearTimeout(timeout);
}, [searchQuery]);

  return (
    <div className="h-svh bg-[#070B14] text-white flex overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showRecentChats={showRecentChats}
        setShowRecentChats={setShowRecentChats}
        threads={searchQuery.trim() ? searchResults : threads}
        handleThreadClick={handleThreadClick}
        handleDeleteThread={handleDeleteThread}
        handleNewChat={handleNewChat}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchLoading={searchLoading}
      />

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gradient-to-b from-[#070B14] to-[#050816]">
        <Navbar
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
        />

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
                Welcome to Codexa
              </h2>

              <p className="text-zinc-500 text-xl">
                Ask anything about DSA, Java, DBMS or interviews.
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
