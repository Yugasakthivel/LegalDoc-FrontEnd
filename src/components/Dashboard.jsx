import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, BarChart3, Shield } from "lucide-react";

export default function Dashboard({ analytics }) {
  const stats = [
    { title: "Total Pages", value: analytics?.total_pages || 0, icon: <FileText /> },
    { title: "Names Found", value: analytics?.total_names || 0, icon: <Users /> },
    { title: "Emails Found", value: analytics?.total_emails || 0, icon: <BarChart3 /> },
    { title: "Clauses Found", value: analytics?.total_clauses || 0, icon: <Shield /> },
  ];

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow border border-gray-200 flex flex-col items-center">
          <div className="text-blue-600 mb-2">{stat.icon}</div>
          <h4 className="text-gray-700 font-semibold">{stat.title}</h4>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </motion.div>
  );
}
