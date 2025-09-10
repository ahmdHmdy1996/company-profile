import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Edit3,
  Users,
  Building,
  Briefcase,
  Award,
  Wrench,
  Paperclip,
  LogOut,
  User
} from 'lucide-react';

const MainSidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isContentManagementOpen, setIsContentManagementOpen] = useState(false);

  const menuItems = [
    {
      id: 'home',
      label: 'الصفحة الرئيسية',
      icon: Home,
      path: '/home',
      action: () => navigate('/home')
    },
    {
      id: 'content-management',
      label: 'إدارة محتوى الصفحات',
      icon: FileText,
      hasDropdown: true,
      isOpen: isContentManagementOpen,
      toggle: () => setIsContentManagementOpen(!isContentManagementOpen),
      children: [
        {
          id: 'about-page',
          label: 'صفحة نبذة عنا',
          icon: Building,
          path: '/content/about',
          action: () => navigate('/content/about')
        },
        {
          id: 'staff-page',
          label: 'صفحة الموظفين',
          icon: Users,
          path: '/content/staff',
          action: () => navigate('/content/staff')
        },
        {
          id: 'clients-page',
          label: 'صفحة العملاء',
          icon: Briefcase,
          path: '/content/clients',
          action: () => navigate('/content/clients')
        },
        {
          id: 'services-page',
          label: 'صفحة الخدمات',
          icon: Wrench,
          path: '/content/services',
          action: () => navigate('/content/services')
        },
        {
          id: 'projects-page',
          label: 'صفحة المشاريع',
          icon: Award,
          path: '/content/projects',
          action: () => navigate('/content/projects')
        }
      ]
    },
    {
      id: 'attachments',
      label: 'المرفقات',
      icon: Paperclip,
      path: '/attachments',
      action: () => navigate('/attachments')
    },
    {
      id: 'settings',
      label: 'الإعدادات العامة',
      icon: Settings,
      path: '/settings',
      action: () => navigate('/settings')
    }
  ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || 
                     (item.path === '/content' && location.pathname.startsWith('/content/')) ||
                     (item.path === '/home' && location.pathname === '/');

    if (item.hasDropdown) {
      return (
        <div key={item.id} className="mb-2">
          <button
            onClick={item.toggle}
            className={`w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {item.isOpen && (
            <div className="mt-2 mr-6 space-y-1">
              {item.children.map(renderMenuItem)}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={item.action}
        className={`w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg transition-all duration-200 mb-2 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">إدارة الملف التعريفي</h1>
            <p className="text-sm text-gray-500">Team Arabia Company</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </div>
      </nav>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>نظام إدارة الملف التعريفي</p>
          <p className="mt-1">الإصدار 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;