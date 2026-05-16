import React from "react";
import { Menu, Search } from "lucide-react";

const Navbar = ({
  user,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="h-20 border-b border-[#111827] flex items-center justify-between px-4 md:px-8 bg-[#070B14]/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl hover:bg-[#111827] transition flex-shrink-0"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 flex-1 max-w-[350px] mx-2 md:mx-6">
       <Search size={16} className="text-zinc-500 mr-2 md:mr-3 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-white placeholder:text-zinc-500"
        />
      </div>

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
  );
};

export default Navbar;