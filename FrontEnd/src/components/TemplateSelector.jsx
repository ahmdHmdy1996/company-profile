import React from "react";
import { X, Sparkles, Layers, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "../templates/templateRegistry.jsx";

export default function TemplateSelector({ onSelect, onClose }) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-blue-200"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 bg-white border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Sparkles size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-600 tracking-wide">Choose a Template</h2>
            <p className="text-gray-600 mt-1">Select a professional template for your company profile</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-3 text-blue-500 hover:text-blue-700 hover:bg-white/80 rounded-xl transition-all border border-blue-200 hover:border-blue-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Template Grid */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {Object.values(TEMPLATES).map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TemplateCard
                    template={template}
                    onSelect={() => onSelect(template.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TemplateCard({ template, onSelect }) {
  return (
    <motion.div
      className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:border-gray-400 hover:-translate-y-2"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full transform scale-[0.15] origin-center">
            <template.Component
              data={template.defaultData}
              style={{ backgroundColor: getTemplatePreviewColor(template.id) }}
            />
          </div>
        </div>
        
        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Layers size={18} />
            Select Template
          </motion.div>
        </motion.div>
        
        {/* Template Type Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
            {template.name}
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-lg shadow-md">
            <FileText size={20} className="text-white" />
          </div>
          <h3 className="font-bold text-gray-800 text-xl">{template.name}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">{template.fields.length} customizable fields</span>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            Template ID: <span className="font-mono font-medium">{template.id}</span>
          </div>
        </div>
        
        {/* Field Types Preview */}
        <div className="mt-4 flex flex-wrap gap-2">
          {getUniqueFieldTypes(template.fields).map((type) => (
            <motion.span
              key={type}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200"
              whileHover={{ scale: 1.05, backgroundColor: "rgb(243 244 246)" }}
              transition={{ duration: 0.2 }}
            >
              {type}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to get preview colors for templates
function getTemplatePreviewColor(templateId) {
  const colors = {
    cover: "#1a1a1a",
    toc: "#244d86",
    about: "#1e40af",
    staff: "#f8fafc",
    content: "#244d86",
    projects: "#ffffff",
  };
  return colors[templateId] || "#000000";
}

// Helper function to get unique field types
function getUniqueFieldTypes(fields) {
  const types = new Set();
  
  fields.forEach((field) => {
    if (field.type) {
      types.add(field.type);
    } else {
      types.add('text');
    }
    
    // Add sub-field types for repeater fields
    if (field.type === 'repeater' && field.subFields) {
      field.subFields.forEach((subField) => {
        types.add(subField.type || 'text');
      });
    }
  });
  
  return Array.from(types);
}