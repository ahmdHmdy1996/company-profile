import React, { useState, createContext, useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CogIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import PDFViewer from "./PDFViewer";

// Create PDF Viewer Context
const PDFViewerContext = createContext();

export const usePDFViewer = () => {
  const context = useContext(PDFViewerContext);
  if (!context) {
    throw new Error("usePDFViewer must be used within a PDFViewerProvider");
  }
  return context;
};

const Dashboard = ({ onLogout }) => {
  const location = useLocation();
  const [pdfViewer, setPdfViewer] = useState({
    isVisible: true, // Always visible
    pdfData: null,
    pdfName: null,
  });

  const showPDF = (pdfData, pdfName) => {
    setPdfViewer({
      isVisible: true,
      pdfData,
      pdfName,
    });
  };

  const hidePDF = () => {
    // PDF viewer is always visible, just clear the data
    setPdfViewer({
      isVisible: true,
      pdfData: null,
      pdfName: null,
    });
  };

  const menuItems = [
    {
      name: "إنشاء PDF",
      path: "/pdf-creator",
      icon: DocumentTextIcon,
    },
    {
      name: "الإعدادات العامة",
      path: "/general-settings",
      icon: Cog6ToothIcon,
    },
    {
      name: "من نحن",
      path: "/modules/about-us",
      icon: BuildingOfficeIcon,
    },
    {
      name: "فريق العمل",
      path: "/modules/our-staff",
      icon: UserGroupIcon,
    },
    {
      name: "العملاء الرئيسيين",
      path: "/modules/key-clients",
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "خدماتنا",
      path: "/modules/services",
      icon: CogIcon,
    },
    {
      name: "مشاريعنا",
      path: "/modules/projects",
      icon: BriefcaseIcon,
    },
    {
      name: "الأدوات والمعدات",
      path: "/modules/tools-instruments",
      icon: WrenchScrewdriverIcon,
    },
  ];

  return (
    <PDFViewerContext.Provider value={{ showPDF, hidePDF, pdfViewer }}>
      <div className="flex h-screen bg-gray-100">
        {/* PDF Viewer - Always Visible */}
        <PDFViewer
          isVisible={true}
          onClose={hidePDF}
          pdfData={pdfViewer.pdfData}
          pdfName={pdfViewer.pdfName}
        />

        {/* Sidebar */}
        <div className={`w-64 bg-white shadow-lg transition-all duration-300 `}>
          <div className={`p-6 `}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden me-[40rem]">
          <div className="h-full overflow-y-auto">
            <div className="p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </PDFViewerContext.Provider>
  );
};

export default Dashboard;
