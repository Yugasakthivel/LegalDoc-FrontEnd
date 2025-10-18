import React from "react";
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Notifications & User */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        <div className="text-gray-800 font-medium px-3 py-1 rounded-full bg-gray-100 shadow-sm">
          Admin
        </div>
      </div>
    </header>
  );
}
