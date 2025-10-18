// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import FileUpload from "./components/FileUpload.jsx";
import ExtractedData from "./components/ExtractedData.jsx";
import PDFViewer from "./components/PDFViewer.jsx";
import HistoryList from "./components/HistoryList.jsx";

import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { FileText, Mail, Phone, ListChecks } from "lucide-react";

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
    ? Object.entries(analytics.clause_summary).map(([name, value]) => ({ name, value }))
    : [];
  const keywordChartData = analytics.keyword_frequency
    ? Object.entries(analytics.keyword_frequency).map(([name, value]) => ({ name, value }))
    : [];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="relative min-h-screen font-inter bg-gray-50 text-gray-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          activePage={step === 1 ? "upload" : step === 2 ? "data" : step === 3 ? "analytics" : "history"}
          onMenuClick={(key) => {
            const stepMap = { upload: 1, data: 2, analytics: 3, history: 4 };
            setStep(stepMap[key] || 1);
          }}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* File Upload */}
            {step === 1 && (
              <FileUpload
                onUploadComplete={handleUploadComplete}
                setLoading={setLoading}
                setProgress={setProgress}
              />
            )}

            {/* PDF & Extracted Data */}
            {step === 2 && results && fileUrl && (
              <div className="flex flex-col md:flex-row gap-6" data-aos="fade-up">
                <div className="md:w-1/2 h-full rounded-lg overflow-hidden border border-gray-200 shadow bg-white">
                  <PDFViewer fileUrl={fileUrl} />
                </div>
                <div className="md:w-1/2 h-full rounded-lg overflow-y-auto border border-gray-200 shadow bg-white">
                  <ExtractedData results={results} analytics={analytics} />
                </div>
              </div>
            )}

            {/* Analytics */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-6xl mx-auto" data-aos="fade-up">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">📊 Document Analytics</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Stats */}
                  <div className="bg-gray-100 p-4 rounded-lg shadow space-y-2">
                    <h3 className="text-xl font-semibold mb-2">Key Stats</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>📄 Pages: {analytics.total_pages || 1}</li>
                      <li>👤 Names Found: {analytics.total_names || 0}</li>
                      <li>📧 Emails: {analytics.total_emails || 0}</li>
                      <li>📞 Phones: {analytics.total_phones || 0}</li>
                      <li>⚖️ Clauses: {analytics.total_clauses || 0}</li>
                    </ul>
                  </div>

                  {/* Clause Distribution */}
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2">Clause Distribution</h3>
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
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-500">No clause data.</p>
                    )}
                  </div>
                </div>

                {/* Keyword Frequency */}
                <div className="bg-gray-100 p-4 mt-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">Keyword Frequency</h3>
                  {keywordChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={keywordChartData}>
                        <XAxis dataKey="name" stroke="#333" />
                        <YAxis stroke="#333" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={6} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No keyword data.</p>
                  )}
                </div>
              </div>
            )}

            {/* History */}
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
          <div className="sticky bottom-0 bg-gray-50 p-4 flex justify-end gap-4 shadow-inner z-50">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
              >
                ← Previous
              </button>
            )}
            {step < 4 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
