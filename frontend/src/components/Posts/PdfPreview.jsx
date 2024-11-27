import * as pdfjsLib from "pdfjs-dist/webpack";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";

import { useEffect, useRef } from "react";

const PdfPreview = ({ fileUrl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!fileUrl) return;

      const pdf = await pdfjsLib.getDocument(fileUrl).promise;

      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clear existing content
        containerRef.current.appendChild(canvas); // Add the rendered page
      }
    };

    loadPdf();
  }, [fileUrl]);

  return <div ref={containerRef} className="pdf-preview" />;
};

export default PdfPreview;
