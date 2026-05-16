import React from "react";
import {
  Plus,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronRight, LoaderCircle
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  showRecentChats,
  setShowRecentChats,
  threads,
  handleThreadClick,
  handleDeleteThread,
  handleNewChat,
  handleLogout, searchQuery, searchLoading
}) => {
  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-screen w-72 border-r border-[#111827] bg-[#060C1B]/95 backdrop-blur-xl flex flex-col transition-transform duration-300

  ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
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

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition shadow-xl flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} className="flex-shrink-0" />
            <span>New Chat</span>
          </button>
        </div>

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
              {searchLoading && (
  <div className="flex items-center gap-2 text-zinc-400 text-sm px-2 py-3">
    <LoaderCircle size={16} className="animate-spin" />
    <span>Searching chats...</span>
  </div>
)}

{!searchLoading && searchQuery.trim() && threads.length === 0 && (
  <div className="text-zinc-500 text-sm px-2 py-3">
    No matching chats
  </div>
)}

{!searchLoading && !searchQuery.trim() && threads.length === 0 && (
  <div className="text-zinc-500 text-sm px-2 py-3">
    No recent chats
  </div>
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
    </>
  );
};

export default Sidebar;