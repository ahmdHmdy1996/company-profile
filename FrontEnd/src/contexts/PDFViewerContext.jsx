import React, { createContext, useContext } from "react";

// Context for PDF Viewer
export const PDFViewerContext = createContext();

// Hook to use PDF Viewer context
export const usePDFViewer = () => {
  const context = useContext(PDFViewerContext);
  if (!context) {
    throw new Error("usePDFViewer must be used within a PDFViewerProvider");
  }
  return context;
};
