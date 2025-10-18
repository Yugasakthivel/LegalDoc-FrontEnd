// src/components/HistoryList.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";

export default function HistoryList({ history, onSelect, onDelete }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg font-medium">
        📂 No history found. Upload a document to see previous analyses.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/90 p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all"
        >
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(index)}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800">{item.name || `Document ${index + 1}`}</span>
            </div>
            <div className="flex items-center gap-2">
              {expandedIndex === index ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              <button onClick={(e) => { e.stopPropagation(); onDelete?.(index); }} className="p-1 rounded-full hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 text-gray-600 text-sm"
              >
                <p><strong>Pages:</strong> {item.pages || 1}</p>
                <p><strong>Names Found:</strong> {item.names?.length || 0}</p>
                <p><strong>Emails:</strong> {item.emails?.length || 0}</p>
                <p><strong>Phones:</strong> {item.phones?.length || 0}</p>
                <p><strong>Clauses:</strong> {item.clauses_found?.length || 0}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
