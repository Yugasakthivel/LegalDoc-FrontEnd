import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, FileText, Hash, TrendingUp } from "lucide-react";

export default function AnalyticsDashboard({ analytics }) {
  if (!analytics) return null;

  const {
    total_pages,
    total_names,
    total_emails,
    total_phones,
    total_clauses,
    clause_summary,
    summary,
    legality_score,
  } = analytics;

  // Prepare PieChart data
  const pieData = [
    { name: "Names", value: total_names },
    { name: "Emails", value: total_emails },
    { name: "Phones", value: total_phones },
    { name: "Clauses", value: total_clauses },
  ];

  const COLORS = ["#3b82f6", "#f97316", "#10b981", "#6366f1"];

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Document Analytics Overview
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Pages" value={total_pages} icon={<FileText />} />
        <StatCard title="Names Found" value={total_names} icon={<Hash />} />
        <StatCard title="Emails Found" value={total_emails} icon={<Hash />} />
        <StatCard title="Clauses Found" value={total_clauses} icon={<TrendingUp />} />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-center">
            Entity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clause Summary */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-center">
            Clause Frequency
          </h3>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {Object.entries(clause_summary || {}).map(([clause, count], idx) => (
              <div
                key={idx}
                className="flex justify-between bg-white px-3 py-2 rounded-lg border border-gray-200"
              >
                <span className="text-gray-700 font-medium">{clause}</span>
                <span className="text-blue-600 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legality Score */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Legality Score
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${legality_score || 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Score: {legality_score ? `${legality_score.toFixed(2)}%` : "N/A"}
        </p>
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          AI Summary
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {summary || "No summary generated."}
        </p>
      </div>
    </motion.div>
  );
}

// --------- Sub Component: StatCard ---------
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col items-center">
      <div className="text-blue-600 mb-2">{icon}</div>
      <h4 className="text-gray-700 font-semibold">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
    </div>
  );
}
