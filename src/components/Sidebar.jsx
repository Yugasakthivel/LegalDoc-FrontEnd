// src/components/Sidebar.jsx
import React from "react";
import { Upload, Database, BarChart3, Clock } from "lucide-react";

export default function Sidebar({ activePage, onMenuClick }) {
  const menuItems = [
    { key: "upload", label: "Upload", icon: <Upload className="w-5 h-5" /> },
    { key: "data", label: "Extracted Data", icon: <Database className="w-5 h-5" /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { key: "history", label: "History", icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 p-6 text-center">LegalDocAI</h1>

        <ul className="flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => onMenuClick && onMenuClick(item.key)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100 ${
                activePage === item.key ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-xs text-gray-500 p-4">
        © 2025 LegalDocAI
      </div>
    </aside>
  );
}
