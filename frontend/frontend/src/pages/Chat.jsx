import React, { useState, useEffect, useRef } from "react";
import API from "../services/api.js";
import { askDocument, uploadDocument } from "../services/document.service.js";
import { getCurrentUser, logoutUser } from "../services/auth.service.js";
import {
  getThreads,
  getSingleThread,
  deleteThread,
  searchThreads,
} from "../services/ai.service.js";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import ChatInput from "../components/ChatInput.jsx";

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

  const [chatMode, setChatMode] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      await uploadDocument(formData);

      setDocumentReady(true);
      setUploadedFileName(file.name);

      toast.success("PDF ready for questioning");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "PDF upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    if (chatMode === "rag" && !documentReady) {
      toast.error("Upload a PDF first");
      return;
    }

    const currentMessage = message;

    const userMessage = {
      role: "user",
      content: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setLoading(true);

      let aiReply = "";
      let sources = [];

      if (chatMode === "general") {
        const response = await API.post("/ai/message", {
          threadId,
          message: currentMessage,
        });

        if (!threadId) {
          setThreadId(response.data.data.threadId);
        }

        aiReply = response.data.data.reply;
        await fetchThreads();
      }

      if (chatMode === "rag") {
        const response = await askDocument(currentMessage);

        aiReply = response.data.answer;
        sources = response.data.sources;
      }

      const aiMessage = {
        role: "assistant",
        content: aiReply,
        sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "AI couldn't generate a response"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setThreadId(null);
    setDocumentReady(false);
    setUploadedFileName("");
    setChatMode("general");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    } finally {
      navigate("/login");
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await getThreads();
      setThreads(response.data);
    } catch {
      toast.error("Couldn't load recent chats");
    }
  };

  const handleThreadClick = async (thread) => {
    try {
      const response = await getSingleThread(thread._id);
      setMessages(response.data.messages);
      setThreadId(response.data._id);
    } catch {
      toast.error("Couldn't open chat");
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await deleteThread(threadId);

      setThreads((prev) =>
        prev.filter((thread) => thread._id !== threadId)
      );

      toast.success("Chat deleted");
    } catch {
      toast.error("Cannot delete thread");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getCurrentUser();
        setUser(userResponse.data);

        const threadsResponse = await getThreads();
        setThreads(threadsResponse.data);
      } catch {
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

        if (results.length > 0) {
          setSidebarOpen(true);
        }
      } finally {
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
        setSearchLoading={setSearchLoading}
      />

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gradient-to-b from-[#070B14] to-[#050816]">
        <Navbar
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
        />

        <ChatWindow
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
          chatMode={chatMode}
        />

        <ChatInput
          loading={loading}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          chatMode={chatMode}
          setChatMode={setChatMode}
          handlePdfUpload={handlePdfUpload}
          uploading={uploading}
          documentReady={documentReady}
          uploadedFileName={uploadedFileName}
        />
      </main>
    </div>
  );
};

export default Chat;