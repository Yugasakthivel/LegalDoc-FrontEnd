// src/components/ExtractedData.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FileText,
  Mail,
  Phone,
  ListChecks,
  FileSignature,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  Sparkles,
  Copy,
  Download,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// ---------------- Helpers ----------------
const escapeHtml = (str = "") =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const highlightHtml = (text = "", query = "") => {
  if (!query) return escapeHtml(text);
  const safe = escapeHtml(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return safe.replace(
    re,
    '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>'
  );
};

export default function ExtractedData({ results, analytics }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [globalCollapsed, setGlobalCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const filteredResults = useMemo(() => {
    if (!searchQuery) return results;
    return results.map((page) => ({
      ...page,
      names: page.names.filter((n) => n.toLowerCase().includes(searchQuery.toLowerCase())),
      emails: page.emails.filter((e) => e.toLowerCase().includes(searchQuery.toLowerCase())),
      phones: page.phones.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase())),
      clauses_found: page.clauses_found.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      text: page.text,
    }));
  }, [searchQuery, results]);

  useEffect(() => setGlobalCollapsed(false), [results]);

  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-16 text-lg font-medium">
        📄 No extracted data available. Please upload a document first.
      </div>
    );
  }

  const selectedPage = filteredResults[currentPage];

  // ---------------- Copy / Highlight ----------------
  const [lastCopied, setLastCopied] = useState("");
  const handleCopy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setLastCopied(text);
    setTimeout(() => setLastCopied(""), 1800);
  };
  const highlightTextInline = (text) => {
    if (!searchQuery) return text;
    const re = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    return text.split(re).map((part, i) =>
      re.test(part) ? <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
    );
  };

  const downloadText = (filename = `page-${selectedPage.page}.txt`) => {
    const blob = new Blob([selectedPage.text || ""], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportJSON = (filename = `page-${selectedPage.page}.json`) => {
    const blob = new Blob([JSON.stringify(selectedPage, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ---------------- AI Summary ----------------
  const [sectionsOpen, setSectionsOpen] = useState({
    names: true,
    emails: true,
    phones: true,
    clauses: true,
    text: true,
    ai: false,
    signers: true,
  });
  const [aiSummary, setAiSummary] = useState(localStorage.getItem(`ai_summary_page_${selectedPage.page}`) || "");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  useEffect(() => {
    if (globalCollapsed) setSectionsOpen({
      names: false, emails: false, phones: false, clauses: false, text: false, ai: false, signers: false
    });
  }, [globalCollapsed]);

  const toggleSection = (section) => setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai-response`, { text: selectedPage.text || "" });
      setAiSummary(res.data.answer || "No response.");
      localStorage.setItem(`ai_summary_page_${selectedPage.page}`, res.data.answer || "");
      setSectionsOpen((prev) => ({ ...prev, ai: true }));
    } catch {
      setAiSummary("⚠️ Failed to get AI summary.");
    }
    setLoading(false);
  };

  const handleAskQuestion = async () => {
    if (!aiQuestion.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai-response`, { text: selectedPage.text || "", question: aiQuestion });
      setAiAnswer(res.data.answer || "No response.");
      setSectionsOpen((prev) => ({ ...prev, ai: true }));
    } catch {
      setAiAnswer("⚠️ Failed to get AI answer.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="relative w-full max-w-md flex-1">
          <input
            type="text"
            placeholder="Search names, emails, phones, clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 flex-wrap">
          <button onClick={() => setGlobalCollapsed((s) => !s)} className="px-4 py-2 bg-gray-100 rounded-xl border hover:bg-gray-200 transition">
            {globalCollapsed ? "Expand All" : "Collapse All"}
          </button>
          <select className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {filteredResults.map((_, idx) => <option key={idx} value={idx}>Page {idx + 1}</option>)}
          </select>
        </div>
      </div>

      {/* Page Card */}
      <FullWidthPageCard
        page={selectedPage}
        collapsed={globalCollapsed}
        query={searchQuery}
        sectionsOpen={sectionsOpen}
        toggleSection={toggleSection}
        aiSummary={aiSummary}
        setAiSummary={setAiSummary}
        aiQuestion={aiQuestion}
        setAiQuestion={setAiQuestion}
        aiAnswer={aiAnswer}
        setAiAnswer={setAiAnswer}
        handleSummarize={handleSummarize}
        handleAskQuestion={handleAskQuestion}
        downloadText={downloadText}
        exportJSON={exportJSON}
        handleCopy={handleCopy}
        lastCopied={lastCopied}
        highlightTextInline={highlightTextInline}
        loading={loading}
      />

      {lastCopied && <div className="mt-3 text-xs text-green-600">Copied to clipboard ✓</div>}
    </div>
  );
}

// ---------------- Section Card ----------------
function SectionCard({ title, icon, isOpen, toggle, children }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden w-full">
      <button onClick={toggle} className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 transition-colors font-medium text-blue-700">
        <div className="flex items-center gap-2">{icon} {title}</div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} className="p-2 w-full">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Page Card ----------------
function FullWidthPageCard({
  page, collapsed, query, sectionsOpen, toggleSection, aiSummary, aiQuestion, aiAnswer,
  handleSummarize, handleAskQuestion, downloadText, exportJSON, handleCopy, highlightTextInline, loading
}) {
  const renderList = (items) => items && items.length ? items.map((item, i) => (
    <li key={i} className="text-gray-800 font-medium break-words flex justify-between items-start gap-3">
      <span onClick={() => handleCopy(item)} className="cursor-pointer select-text">{highlightTextInline(item)}</span>
      <button onClick={() => handleCopy(item)} className="ml-2 text-gray-400 hover:text-gray-700"><Copy className="w-4 h-4" /></button>
    </li>
  )) : <li className="text-gray-400 italic">None</li>;

  return (
    <motion.div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg border border-blue-200 p-6 hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-900">Page {page.page}</h3>
          <div className="text-sm text-gray-500 mt-1 flex gap-3 flex-wrap">
            <span>👤 {page.names?.length || 0} names</span>
            <span>📧 {page.emails?.length || 0} emails</span>
            <span>📞 {page.phones?.length || 0} phones</span>
            <span>⚖️ {page.clauses_found?.length || 0} clauses</span>
            <span>✍️ {page.signers?.length || 0} signers</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleCopy(page.text || "")} title="Copy full page text" className="p-2 rounded-lg bg-white/80 border hover:shadow"><Copy className="w-4 h-4" /></button>
          <button onClick={downloadText} title="Download page text" className="p-2 rounded-lg bg-white/80 border hover:shadow"><Download className="w-4 h-4" /></button>
          <button onClick={exportJSON} title="Export page JSON" className="px-3 py-1 rounded-lg bg-white/80 border text-sm hover:shadow">Export</button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 text-sm text-gray-700">
        {["names", "emails", "phones", "clauses", "signers"].map((section) => {
          const icons = { names: <FileSignature className="w-4 h-4" />, emails: <Mail className="w-4 h-4" />, phones: <Phone className="w-4 h-4" />, clauses: <ListChecks className="w-4 h-4" />, signers: <FileSignature className="w-4 h-4" /> };
          const items = { names: page.names, emails: page.emails, phones: page.phones, clauses: page.clauses_found, signers: page.signers };
          return <SectionCard key={section} title={section.charAt(0).toUpperCase() + section.slice(1)} icon={icons[section]} isOpen={sectionsOpen[section]} toggle={() => toggleSection(section)}>
            <ul className="bg-white/80 p-3 rounded-xl border border-blue-200 shadow-inner max-h-32 overflow-y-auto">{renderList(items[section])}</ul>
          </SectionCard>;
        })}

        {/* Full Text */}
        <SectionCard title="Full Text" icon={<FileText className="w-4 h-4" />} isOpen={sectionsOpen.text} toggle={() => toggleSection("text")}>
          <div className="bg-white/90 p-4 rounded-2xl text-gray-700 text-sm whitespace-pre-line border border-gray-300 shadow-inner w-full max-h-[500px] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: highlightHtml(page.text || "No text content found.", query) }} />
        </SectionCard>

        {/* AI Summary */}
        <SectionCard title="AI Summary & Ask" icon={<Sparkles className="w-4 h-4 text-yellow-500" />} isOpen={sectionsOpen.ai} toggle={() => toggleSection("ai")}>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleSummarize} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin w-4 h-4" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate AI Summary</>}
              </button>
              <button onClick={() => { setAiSummary(""); setAiAnswer(""); localStorage.removeItem(`ai_summary_page_${page.page}`); }} className="px-3 py-2 rounded-xl border bg-white text-sm">Clear AI</button>
            </div>
            {aiSummary && <p className="bg-white/90 p-4 rounded-2xl text-gray-700 text-sm border border-gray-300 shadow-inner w-full">{aiSummary}</p>}
            <div className="flex gap-2 flex-wrap w-full">
              <input type="text" placeholder="Ask a question..." value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
              <button onClick={handleAskQuestion} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Ask"}
              </button>
            </div>
            {aiAnswer && <p className="bg-white/90 p-4 rounded-2xl text-gray-700 text-sm border border-gray-300 shadow-inner w-full">{aiAnswer}</p>}
          </div>
        </SectionCard>
      </div>
    </motion.div>
  );
}
