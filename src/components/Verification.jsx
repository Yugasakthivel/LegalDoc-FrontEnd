import React, { useState } from "react";

export default function Verification({ results }) {
  const [verifiedData, setVerifiedData] = useState({});

  if (!results || results.length === 0)
    return <p>No data to verify. Upload a document first.</p>;

  const toggleVerification = (page, type, value) => {
    setVerifiedData((prev) => {
      const pageKey = `page_${page}`;
      const updatedPage = prev[pageKey] ? { ...prev[pageKey] } : {};

      if (!updatedPage[type]) updatedPage[type] = new Set();

      if (updatedPage[type].has(value)) {
        updatedPage[type].delete(value);
      } else {
        updatedPage[type].add(value);
      }

      return { ...prev, [pageKey]: updatedPage };
    });
  };

  const isVerified = (page, type, value) => {
    const pageKey = `page_${page}`;
    return verifiedData[pageKey]?.[type]?.has(value) || false;
  };

  return (
    <div className="space-y-6">
      {results.map((page) => (
        <div key={page.page} className="border p-4 rounded shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2">Page {page.page}</h2>

          {/* Emails */}
          {page.emails.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold">Emails:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {page.emails.map((email, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleVerification(page.page, "emails", email)}
                    className={`px-2 py-1 rounded border ${
                      isVerified(page.page, "emails", email)
                        ? "bg-green-200 border-green-400"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {email}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phones */}
          {page.phones.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold">Phones:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {page.phones.map((phone, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleVerification(page.page, "phones", phone)}
                    className={`px-2 py-1 rounded border ${
                      isVerified(page.page, "phones", phone)
                        ? "bg-green-200 border-green-400"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {phone}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clauses */}
          {page.clauses_found.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold">Clauses:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {page.clauses_found.map((clause, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleVerification(page.page, "clauses", clause)}
                    className={`px-2 py-1 rounded border ${
                      isVerified(page.page, "clauses", clause)
                        ? "bg-green-200 border-green-400"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {clause}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Verified Summary */}
      <div className="mt-6 p-4 bg-blue-50 border rounded">
        <h3 className="font-bold mb-2">Verified Data Summary:</h3>
        <pre className="text-sm">{JSON.stringify(verifiedData, null, 2)}</pre>
      </div>
    </div>
  );
}
