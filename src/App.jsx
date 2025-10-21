// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import FileUpload from "./components/FileUpload.jsx";
import ExtractedData from "./components/ExtractedData.jsx";
import PDFViewer from "./components/PDFViewer.jsx";
import HistoryList from "./components/HistoryList.jsx";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [history, setHistory] = useState([]);

  const COLORS = ["#2563eb", "#9333ea", "#f97316", "#22c55e", "#ef4444"];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleUploadComplete = (resultsData, analyticsData, file) => {
    if (!file) return;
    const newFileUrl = URL.createObjectURL(file);
    setFileUrl(newFileUrl);
    setResults(resultsData || []);
    setAnalytics(analyticsData || {});
    setStep(2);

    const newDoc = {
      name: file.name || `Document ${history.length + 1}`,
      uploaded_at: new Date().toLocaleString(),
      results: resultsData,
      analytics: analyticsData,
      fileUrl: newFileUrl,
      pages: resultsData?.length || 1,
      names: resultsData?.flatMap((p) => p.names) || [],
      emails: resultsData?.flatMap((p) => p.emails) || [],
      phones: resultsData?.flatMap((p) => p.phones) || [],
      clauses_found: resultsData?.flatMap((p) => p.clauses_found) || [],
    };
    setHistory((prev) => [newDoc, ...prev]);
  };

  const handleDeleteHistory = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  };

  const clauseChartData = analytics.clause_summary
    ? Object.entries(analytics.clause_summary).map(([name, value]) => ({
        name,
        value,
      }))
    : [];
  const keywordChartData = analytics.keyword_frequency
    ? Object.entries(analytics.keyword_frequency).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="relative min-h-screen font-inter bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.15),transparent_60%)]"></div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <Sidebar
          activePage={
            step === 1
              ? "upload"
              : step === 2
              ? "data"
              : step === 3
              ? "analytics"
              : "history"
          }
          onMenuClick={(key) => {
            const stepMap = { upload: 1, data: 2, analytics: 3, history: 4 };
            setStep(stepMap[key] || 1);
          }}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col backdrop-blur-lg bg-white/5 rounded-l-3xl">
          <Header />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: File Upload */}
            {step === 1 && (
              <FileUpload
                onUploadComplete={handleUploadComplete}
                setLoading={setLoading}
                setProgress={setProgress}
              />
            )}

            {/* Step 2: PDF & Extracted Data */}
            {step === 2 && results && fileUrl && (
              <div
                className="flex flex-col md:flex-row gap-6"
                data-aos="fade-up"
              >
                <div className="md:w-1/2 h-full rounded-2xl overflow-hidden border border-gray-700 bg-white/10 backdrop-blur-md shadow-xl">
                  <PDFViewer fileUrl={fileUrl} />
                </div>
                <div className="md:w-1/2 h-full rounded-2xl overflow-y-auto border border-gray-700 bg-white/10 backdrop-blur-md shadow-xl">
                  <ExtractedData results={results} analytics={analytics} />
                </div>
              </div>
            )}

            {/* Step 3: Analytics */}
            {step === 3 && (
              <div
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 max-w-6xl mx-auto"
                data-aos="fade-up"
              >
                <h2 className="text-3xl font-bold mb-6 text-center text-cyan-300">
                  📊 Document Analytics
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Stats */}
                  <div className="bg-black/30 p-4 rounded-lg shadow space-y-2">
                    <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                      Key Stats
                    </h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>📄 Pages: {analytics.total_pages || 1}</li>
                      <li>👤 Names Found: {analytics.total_names || 0}</li>
                      <li>📧 Emails: {analytics.total_emails || 0}</li>
                      <li>📞 Phones: {analytics.total_phones || 0}</li>
                      <li>⚖️ Clauses: {analytics.total_clauses || 0}</li>
                    </ul>
                  </div>

                  {/* Clause Distribution */}
                  <div className="bg-black/30 p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                      Clause Distribution
                    </h3>
                    {clauseChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={clauseChartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {clauseChartData.map((entry, idx) => (
                              <Cell
                                key={idx}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-400">No clause data.</p>
                    )}
                  </div>
                </div>

                {/* Keyword Frequency */}
                <div className="bg-black/30 p-4 mt-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                    Keyword Frequency
                  </h3>
                  {keywordChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={keywordChartData}>
                        <XAxis dataKey="name" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={6} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400">No keyword data.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: History */}
            {step === 4 && (
              <HistoryList
                history={history}
                onSelect={(doc) => {
                  if (!doc.fileUrl) return alert("Missing preview link.");
                  setResults(doc.results || []);
                  setAnalytics(doc.analytics || {});
                  setFileUrl(doc.fileUrl);
                  setStep(2);
                }}
                onDelete={handleDeleteHistory}
              />
            )}
          </main>

          {/* Navigation Buttons */}
          <div className="sticky bottom-0 bg-white/10 backdrop-blur-lg p-4 flex justify-end gap-4 shadow-inner border-t border-white/20">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-700 text-gray-100 rounded-lg shadow hover:bg-gray-600 transition"
              >
                ← Previous
              </button>
            )}
            {step < 4 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg shadow hover:from-blue-600 hover:to-cyan-500 transition"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
