import React from "react";
import { motion } from "framer-motion";
import { Eye, FileText, Palette, Image, Layers } from "lucide-react";
import { TEMPLATES, mergeTemplateData } from "../templates/templateRegistry.jsx";
import { useLanguage } from "../contexts/LanguageContext";

export default function TemplateRenderer({ page, templateId, data, style, globalSettings, isEditing = false, onDataChange }) {
  const { isRTL, currentLanguage } = useLanguage();
  
  // Handle both prop formats: {page, style} or {templateId, data, style}
  const actualTemplateId = page?.templateId || templateId;
  const actualData = page?.data || data;
  const actualStyle = page?.style || style;

  if (!actualTemplateId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-blue-200">
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 bg-white rounded-full w-fit mx-auto mb-6 border border-blue-200">
            <FileText size={48} className="text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-700 mb-3">
            No Template Selected
          </div>
          <div className="text-sm text-blue-500">
            Choose a template to start editing your page
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle case mismatch: template IDs are lowercase but TEMPLATES keys are capitalized
  const capitalizedTemplateId = actualTemplateId.charAt(0).toUpperCase() + actualTemplateId.slice(1);
  const template = TEMPLATES[capitalizedTemplateId];

  if (!template) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xl font-bold text-red-700 mb-3">
            Template Not Found
          </div>
          <div className="text-sm text-red-500">
            Template ID: {actualTemplateId} (looking for: {capitalizedTemplateId})
          </div>
        </motion.div>
      </div>
    );
  }

  const TemplateComponent = template.Component;
  const pageStyle = {
    ...actualStyle,
  };

  return (
    <div className="w-full h-full overflow-auto bg-white ">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page Preview Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          

          {/* Template Preview */}
          <div className="relative bg-white">
            <motion.div
              className="bg-white rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                aspectRatio: "210/297", // A4 aspect ratio
              }}
            >
              <TemplateComponent
                data={mergeTemplateData(actualTemplateId, actualData, template.defaultData)}
                style={pageStyle}
                globalSettings={globalSettings}
                isEditing={isEditing}
                onDataChange={onDataChange}
                isRTL={isRTL}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Error Boundary Component for Template Rendering
export function TemplateErrorBoundary({ children, fallback }) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Template rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
            <div className="text-center text-red-500">
              <div className="text-lg font-medium mb-2">Rendering Error</div>
              <div className="text-sm">
                {this.state.error?.message || "Unknown error occurred"}
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
