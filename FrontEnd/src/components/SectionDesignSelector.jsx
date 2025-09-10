import React from 'react';

const SectionDesignSelector = ({ moduleType, selectedDesign, onDesignSelect }) => {
  const getDesignsByModule = (type) => {
    const commonDesigns = {
      about_us: [
        {
          id: 'about_text_image',
          name: 'نص مع صورة',
          preview: '/images/sections/about_text_image.jpg',
          description: 'قسم يحتوي على نص وصورة جانبية',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' },
            { key: 'content', label: 'المحتوى', type: 'textarea', placeholder: 'أدخل المحتوى' },
            { key: 'image', label: 'الصورة', type: 'image' }
          ],
          defaultData: { title: '', content: '', image: null }
        },
        {
          id: 'about_timeline',
          name: 'الخط الزمني',
          preview: '/images/sections/about_timeline.jpg',
          description: 'عرض تاريخ الشركة في خط زمني',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'تاريخ الشركة' },
            { key: 'events', label: 'الأحداث', type: 'textarea', placeholder: 'أدخل الأحداث (كل حدث في سطر)' }
          ],
          defaultData: { title: 'تاريخ الشركة', events: '' }
        },
        {
          id: 'about_values',
          name: 'القيم والمبادئ',
          preview: '/images/sections/about_values.jpg',
          description: 'عرض قيم ومبادئ الشركة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'قيمنا ومبادئنا' },
            { key: 'values', label: 'القيم', type: 'textarea', placeholder: 'أدخل القيم (كل قيمة في سطر)' }
          ],
          defaultData: { title: 'قيمنا ومبادئنا', values: '' }
        }
      ],
      our_staff: [
        {
          id: 'staff_grid',
          name: 'شبكة الموظفين',
          preview: '/images/sections/staff_grid.jpg',
          description: 'عرض الموظفين في شبكة منظمة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'فريق العمل' },
            { key: 'subtitle', label: 'العنوان الفرعي', type: 'text', placeholder: 'تعرف على فريقنا المميز' }
          ],
          defaultData: { title: 'فريق العمل', subtitle: 'تعرف على فريقنا المميز' }
        },
        {
          id: 'staff_org_chart',
          name: 'الهيكل التنظيمي',
          preview: '/images/sections/staff_org_chart.jpg',
          description: 'عرض الهيكل التنظيمي للشركة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'الهيكل التنظيمي' }
          ],
          defaultData: { title: 'الهيكل التنظيمي' }
        },
        {
          id: 'staff_departments',
          name: 'الأقسام',
          preview: '/images/sections/staff_departments.jpg',
          description: 'عرض الموظفين مقسمين حسب الأقسام',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أقسام الشركة' }
          ],
          defaultData: { title: 'أقسام الشركة' }
        }
      ],
      key_clients: [
        {
          id: 'clients_logos',
          name: 'شعارات العملاء',
          preview: '/images/sections/clients_logos.jpg',
          description: 'عرض شعارات العملاء الرئيسيين',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'عملاؤنا الرئيسيون' }
          ],
          defaultData: { title: 'عملاؤنا الرئيسيون' }
        },
        {
          id: 'clients_testimonials',
          name: 'آراء العملاء',
          preview: '/images/sections/clients_testimonials.jpg',
          description: 'عرض آراء وتقييمات العملاء',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'ماذا يقول عملاؤنا' }
          ],
          defaultData: { title: 'ماذا يقول عملاؤنا' }
        },
        {
          id: 'clients_case_studies',
          name: 'دراسات الحالة',
          preview: '/images/sections/clients_case_studies.jpg',
          description: 'عرض دراسات حالة للمشاريع المنجزة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'دراسات الحالة' }
          ],
          defaultData: { title: 'دراسات الحالة' }
        }
      ],
      services: [
        {
          id: 'services_grid',
          name: 'شبكة الخدمات',
          preview: '/images/sections/services_grid.jpg',
          description: 'عرض الخدمات في شبكة منظمة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'خدماتنا' },
            { key: 'subtitle', label: 'العنوان الفرعي', type: 'text', placeholder: 'نقدم مجموعة شاملة من الخدمات' }
          ],
          defaultData: { title: 'خدماتنا', subtitle: 'نقدم مجموعة شاملة من الخدمات' }
        },
        {
          id: 'services_detailed',
          name: 'خدمات مفصلة',
          preview: '/images/sections/services_detailed.jpg',
          description: 'عرض تفصيلي للخدمات مع الوصف',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'خدماتنا المتخصصة' }
          ],
          defaultData: { title: 'خدماتنا المتخصصة' }
        },
        {
          id: 'services_process',
          name: 'عملية العمل',
          preview: '/images/sections/services_process.jpg',
          description: 'عرض خطوات عملية تقديم الخدمة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'كيف نعمل' }
          ],
          defaultData: { title: 'كيف نعمل' }
        }
      ],
      projects: [
        {
          id: 'projects_gallery',
          name: 'معرض المشاريع',
          preview: '/images/sections/projects_gallery.jpg',
          description: 'عرض المشاريع في معرض صور',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'مشاريعنا' },
            { key: 'subtitle', label: 'العنوان الفرعي', type: 'text', placeholder: 'استعرض أعمالنا المميزة' }
          ],
          defaultData: { title: 'مشاريعنا', subtitle: 'استعرض أعمالنا المميزة' }
        },
        {
          id: 'projects_timeline',
          name: 'خط زمني للمشاريع',
          preview: '/images/sections/projects_timeline.jpg',
          description: 'عرض المشاريع في خط زمني',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'رحلة مشاريعنا' }
          ],
          defaultData: { title: 'رحلة مشاريعنا' }
        },
        {
          id: 'projects_categories',
          name: 'فئات المشاريع',
          preview: '/images/sections/projects_categories.jpg',
          description: 'عرض المشاريع مقسمة حسب الفئات',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'مشاريعنا حسب الفئة' }
          ],
          defaultData: { title: 'مشاريعنا حسب الفئة' }
        }
      ],
      tools_instruments: [
        {
          id: 'tools_grid',
          name: 'شبكة الأدوات',
          preview: '/images/sections/tools_grid.jpg',
          description: 'عرض الأدوات والمعدات في شبكة',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدواتنا ومعداتنا' },
            { key: 'subtitle', label: 'العنوان الفرعي', type: 'text', placeholder: 'نستخدم أحدث الأدوات والتقنيات' }
          ],
          defaultData: { title: 'أدواتنا ومعداتنا', subtitle: 'نستخدم أحدث الأدوات والتقنيات' }
        },
        {
          id: 'tools_categories',
          name: 'فئات الأدوات',
          preview: '/images/sections/tools_categories.jpg',
          description: 'عرض الأدوات مقسمة حسب الفئات',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدواتنا حسب الفئة' }
          ],
          defaultData: { title: 'أدواتنا حسب الفئة' }
        },
        {
          id: 'tools_specifications',
          name: 'مواصفات الأدوات',
          preview: '/images/sections/tools_specifications.jpg',
          description: 'عرض تفصيلي لمواصفات الأدوات',
          fields: [
            { key: 'title', label: 'العنوان', type: 'text', placeholder: 'مواصفات أدواتنا' }
          ],
          defaultData: { title: 'مواصفات أدواتنا' }
        }
      ]
    };

    return commonDesigns[type] || [];
  };

  const designs = getDesignsByModule(moduleType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {designs.map((design) => (
        <div
          key={design.id}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
            selectedDesign?.id === design.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onDesignSelect(design)}
        >
          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <img
              src={design.preview}
              alt={design.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-gray-500">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{design.name}</h3>
          <p className="text-sm text-gray-600">{design.description}</p>
          {selectedDesign?.id === design.id && (
            <div className="mt-2 flex items-center text-blue-600">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">محدد</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionDesignSelector;