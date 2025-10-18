// src/components/PDFViewer.jsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goPrev = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goNext = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  if (!fileUrl) return <div className="p-6 text-center text-gray-500">No PDF selected.</div>;

  return (
    <div className="flex flex-col items-center h-full p-2">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-gray-400">Loading PDF...</div>}
        className="overflow-auto w-full flex-1"
      >
        <Page
          pageNumber={pageNumber}
          width={600}
          className="mx-auto rounded-lg border shadow-sm mb-4"
        />
      </Document>

      {/* Navigation */}
      {numPages > 1 && (
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-gray-700">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={goNext}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
