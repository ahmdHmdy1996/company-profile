import React from 'react';

const HeaderDesignTemplates = ({ onSelectDesign, selectedDesign }) => {
  const headerDesigns = [
    {
      id: 'modern',
      name: 'تصميم عصري',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdlZWEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNzY0YmEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZ3JhZGllbnQxKSIvPgo8dGV4dCB4PSIxNTAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPti02LHZg9ipINin2YTZhdiz2KrZgtio2YQ8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj7Zhtit2Ygg2YXYs9iq2YLYqNmEINij2YHYttmEPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; font-family: Arial, sans-serif;"><h1 style="margin: 0; font-size: 24px; font-weight: bold;">شركة المستقبل</h1><p style="margin: 5px 0 0 0; font-size: 14px;">نحو مستقبل أفضل</p></div>'
    },
    {
      id: 'classic',
      name: 'تصميم كلاسيكي',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMmMzZTUwIi8+CjxyZWN0IHg9IjAiIHk9Ijg1IiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMiIGZpbGw9IiMzNDk4ZGIiLz4KPHRleHQgeD0iMjAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPti02LHZg9ipINin2YTZhdiz2KrZgtio2YQ8L3RleHQ+Cjx0ZXh0IHg9IjI2MCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0iZW5kIj7Yqtin2LHZitmOOiAyMDI0PC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: #2c3e50; color: white; padding: 15px; border-bottom: 3px solid #3498db; font-family: Arial, sans-serif;"><div style="display: flex; justify-content: space-between; align-items: center;"><h1 style="margin: 0; font-size: 22px; font-weight: bold;">شركة المستقبل</h1><div style="font-size: 12px;">تاريخ: ' + new Date().toLocaleDateString('ar-SA') + '</div></div></div>'
    },
    {
      id: 'minimal',
      name: 'تصميم بسيط',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNkZGRkZGQiLz4KPHRleHQgeD0iMTUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjMwMCI+2LTYsdmD2Kkg2KfZhNmF2LPYqtmC2KjZhDwvdGV4dD4KPGxpbmUgeDE9IjAiIHkxPSI4NSIgeDI9IjMwMCIgeTI9Ijg1IiBzdHJva2U9IiNkZGRkZGQiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=',
      htmlCode: '<div style="padding: 20px; border-bottom: 1px solid #ddd; text-align: center; background: white; font-family: Arial, sans-serif;"><h2 style="margin: 0; color: #333; font-weight: 300; font-size: 20px;">شركة المستقبل</h2></div>'
    },
    {
      id: 'corporate',
      name: 'تصميم مؤسسي',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMWEyMzJlIi8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzE2YTI0NSIvPgo8dGV4dCB4PSIzMCIgeT0iMzUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCI+2LTYsdmD2Kkg2KfZhNmF2LPYqtmC2KjZhDwvdGV4dD4KPHRleHQgeD0iMzAiIHk9IjU1IiBmaWxsPSIjMTZhMjQ1IiBmb250LXNpemU9IjEyIj7Yp9mE2LHZitin2K/YqSDZgdmKINin2YTYqtmD2YbZiNmE2YjYrNmK2KcgJiDYp9mE2KXYr9in2LHYqTwvdGV4dD4KPHRleHQgeD0iMzAiIHk9IjcwIiBmaWxsPSIjY2NjY2NjIiBmb250LXNpemU9IjEwIj53d3cuZnV0dXJlLWNvbXBhbnkuY29tPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: #1a232e; color: white; padding: 20px; border-left: 8px solid #16a245; font-family: Arial, sans-serif;"><h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">شركة المستقبل</h1><p style="margin: 0 0 5px 0; color: #16a245; font-size: 12px;">الريادة في التكنولوجيا & الإدارة</p><p style="margin: 0; color: #cccccc; font-size: 10px;">www.future-company.com</p></div>'
    },
    {
      id: 'elegant',
      name: 'تصميم أنيق',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjhmOWZhIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2U5ZWNlZiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI1MCIgcj0iMTUiIGZpbGw9IiM2MzY2ZjEiLz4KPHRleHQgeD0iNDAiIHk9IjU1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPkY8L3RleHQ+Cjx0ZXh0IHg9IjcwIiB5PSI0NSIgZmlsbD0iIzM3NDE1MSIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPti02LHZg9ipINin2YTZhdiz2KrZgtio2YQ8L3RleHQ+Cjx0ZXh0IHg9IjcwIiB5PSI2NSIgZmlsbD0iIzY2NzNkYiIgZm9udC1zaXplPSIxMiI+2KfZhNiq2YXZitmF2LIg2YHZiiDYp9mE2K7Yr9mF2KfYqiDYp9mE2YXYqtmC2K/ZhdipPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; display: flex; align-items: center; font-family: Arial, sans-serif;"><div style="width: 40px; height: 40px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 15px;"><span style="color: white; font-weight: bold; font-size: 18px;">F</span></div><div><h1 style="margin: 0 0 5px 0; color: #374151; font-size: 20px; font-weight: bold;">شركة المستقبل</h1><p style="margin: 0; color: #6b7280; font-size: 12px;">التميز في الخدمات المتقدمة</p></div></div>'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر تصميم الهيدر</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {headerDesigns.map((design) => (
          <div
            key={design.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedDesign === design.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectDesign(design.id, design.htmlCode)}
          >
            <div className="mb-3">
              <img
                src={design.preview}
                alt={design.name}
                className="w-full h-20 object-cover rounded border"
              />
            </div>
            <h4 className="font-medium text-gray-800 text-center">{design.name}</h4>
            {selectedDesign === design.id && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p className="text-gray-600 mb-1">كود HTML:</p>
                <code className="text-gray-800 break-all">
                  {design.htmlCode.substring(0, 100)}...
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderDesignTemplates;