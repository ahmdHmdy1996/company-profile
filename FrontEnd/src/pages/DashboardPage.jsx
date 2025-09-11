import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Building2, 
  Briefcase, 
  FolderOpen, 
  Wrench,
  Plus,
  Settings,
  Search,
  Bell,
  User
} from 'lucide-react';

const DashboardPage = () => {
  const [activeModule, setActiveModule] = useState('pdf-management');
  const [searchTerm, setSearchTerm] = useState('');

  const modules = [
    {
      id: 'pdf-management',
      name: 'إدارة ملفات PDF',
      icon: FileText,
      description: 'إنشاء وتعديل ملفات PDF',
      color: 'bg-blue-500',
      count: 12
    },
    {
      id: 'about-us',
      name: 'من نحن',
      icon: Building2,
      description: 'معلومات الشركة',
      color: 'bg-green-500',
      count: 5
    },
    {
      id: 'our-staff',
      name: 'فريق العمل',
      icon: Users,
      description: 'إدارة الموظفين',
      color: 'bg-purple-500',
      count: 25
    },
    {
      id: 'key-clients',
      name: 'العملاء الرئيسيين',
      icon: Briefcase,
      description: 'قائمة العملاء المهمين',
      color: 'bg-orange-500',
      count: 18
    },
    {
      id: 'our-services',
      name: 'خدماتنا',
      icon: FolderOpen,
      description: 'الخدمات المقدمة',
      color: 'bg-red-500',
      count: 8
    },
    {
      id: 'our-projects',
      name: 'مشاريعنا',
      icon: FolderOpen,
      description: 'المشاريع المنجزة',
      color: 'bg-indigo-500',
      count: 32
    },
    {
      id: 'tools-instruments',
      name: 'الأدوات والمعدات',
      icon: Wrench,
      description: 'الأدوات والمعدات المستخدمة',
      color: 'bg-yellow-500',
      count: 15
    }
  ];

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المديولات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              
              {/* Profile */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي ملفات PDF</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold text-gray-900">125</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المشاريع النشطة</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">العملاء النشطين</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">المديولات</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 ml-2" />
              إضافة مديول جديد
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                    activeModule === module.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${module.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {module.count}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {module.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {module.description}
                    </p>
                    
                    <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                      إدارة المديول
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تم إنشاء ملف PDF جديد</p>
                  <p className="text-sm text-gray-500">منذ 5 دقائق</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تم إضافة موظف جديد</p>
                  <p className="text-sm text-gray-500">منذ 15 دقيقة</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تم تحديث معلومات مشروع</p>
                  <p className="text-sm text-gray-500">منذ 30 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;