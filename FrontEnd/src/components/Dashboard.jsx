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
    {
      name: "الإعدادات العامة",
      path: "/general-settings",
      icon: Cog6ToothIcon,
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
        <div
          className={`w-64 py-2 pb-6 bg-white flex flex-col justify-between shadow-lg transition-all duration-300 `}
        >
          <div className={`p-6 `}>
            <div className="flex justify-between items-center mb-8">
              
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  أدارة الملف التعريفي
                </h1>
                <span className="text-sm text-gray-500">Team Arabia Company</span>
              </div>
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
                        ? "bg-blue-700 text-white hover:text-white focus:outline-none"
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
          <div className="px-6">
            <button
              onClick={onLogout}
              className="flex items-center justify-start  text-red-600 hover:text-red-800 transition-colors group"
              title="تسجيل الخروج"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 mr-2 group-hover:scale-110 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <span className="sr-only">تسجيل الخروج</span>
            </button>
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
