import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/build/pdf.mjs';

interface PDFViewerProps {
  page: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ page }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Loading PDF...</p>}
      <Document 
        file="resume.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("Failed to load PDF file:", error)}
      >
        <Page pageNumber={page} />
      </Document>
      {!loading && numPages && (
        <p>Page {page} of {numPages}</p>
      )}
    </div>
  );
};