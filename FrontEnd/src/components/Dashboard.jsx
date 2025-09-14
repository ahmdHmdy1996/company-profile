import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
import { PDFViewerContext } from "../contexts/PDFViewerContext.js";

const Dashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  const [pdfViewer, setPdfViewer] = useState({
    isVisible: false, // Hidden by default, toggle on click
    pdfData: null,
    pdfName: null,
  });

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1290);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1290);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showPDF = (pdfData, pdfName) => {
    setPdfViewer({
      isVisible: true,
      pdfData,
      pdfName,
    });
  };

  const hidePDF = () => {
    setPdfViewer({
      isVisible: false,
      pdfData: null,
      pdfName: null,
    });
  };

  const togglePDF = () => {
    if (pdfViewer.isVisible) {
      hidePDF();
    } else {
      setPdfViewer((prev) => ({
        ...prev,
        isVisible: true,
      }));
    }
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
    <PDFViewerContext.Provider
      value={{ showPDF, hidePDF, pdfViewer, togglePDF }}
    >
      <div className="flex h-screen bg-gray-100">
        {/* PDF Viewer - Responsive positioning */}
        <PDFViewer
          isVisible={pdfViewer.isVisible}
          onClose={hidePDF}
          onToggle={togglePDF}
          pdfData={pdfViewer.pdfData}
          pdfName={pdfViewer.pdfName}
          isLargeScreen={isLargeScreen}
        />

        {/* Sidebar */}
        <div
          className={`w-64 py-2 pb-6 bg-white flex flex-col justify-between shadow-lg transition-all duration-300 ${
            isLargeScreen && pdfViewer.isVisible ? "z-40" : ""
          }`}
        >
          <div className={`p-6 `}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  أدارة الملف التعريفي
                </h1>
                <span className="text-sm text-gray-500">
                  Team Arabia Company
                </span>
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
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            isLargeScreen && pdfViewer.isVisible
              ? "me-[36rem]"
              : pdfViewer.isVisible && !isLargeScreen
              ? "hidden" // Hide main content on small screens when PDF is visible
              : ""
          }`}
        >
          <div className="h-full overflow-y-auto relative">
            {/* PDF Toggle button for large screens */}
            {isLargeScreen && (
              <button
                onClick={togglePDF}
                className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full  hover:bg-blue-700 transition-colors"
                title={
                  pdfViewer.isVisible ? "إخفاء عارض PDF" : "إظهار عارض PDF"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-6 h-6 transition-transform ${
                    pdfViewer.isVisible ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                  />
                </svg>
              </button>
            )}

            {/* Mobile PDF Toggle button */}
            {!isLargeScreen && !pdfViewer.isVisible && pdfViewer.pdfData && (
              <button
                onClick={togglePDF}
                className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                title="عرض PDF"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </button>
            )}

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
