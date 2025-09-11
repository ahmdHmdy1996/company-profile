const SectionTemplatesData = {
  about_us: [
    {
      id: "text_paragraph",
      name: "نص فقرة",
      preview: "/images/sections/text_paragraph.jpg",
      description: "قسم نصي يحتوي عنوان وفقرة نصية طويلة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "أدخل العنوان (اختياري)",
        },
        {
          key: "content",
          label: "الفقرة",
          type: "textarea",
          placeholder: "أدخل الفقرة النصية",
        },
      ],
      defaultData: {
        title: "Our Vision",
        content:
          "The vision of Team Arabia is to continue advancing our roles as the leaders within the industry and develop strong relationships with all our skilled employees and esteemed clients. Integrity, trust, and performance drive us towards our journey of becoming the benchmark within our field.",
      },
      htmlCode: `<section class="text-paragraph" style="padding:28px;">
  <div style="max-width:900px;margin:0 auto; text-align:left;"> 
    {{#if title}}<h3 style="font-size:22px;margin-bottom:12px;color:#1f5132;">{{title}}</h3>{{/if}}
    <p style="line-height:1.8;color:#333;white-space:pre-wrap;">{{content}}</p>
  </div>
</section>`,
    },
    {
      id: "about_text_image",
      name: "نص مع صورة",
      preview: "/images/sections/about_text_image.jpg",
      description: "قسم يحتوي على نص وصورة جانبية",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "أدخل العنوان",
        },
        {
          key: "content",
          label: "المحتوى",
          type: "textarea",
          placeholder: "أدخل المحتوى",
        },
        { key: "image", label: "الصورة", type: "image" },
      ],
      defaultData: { title: "", content: "", image: null },
      htmlCode: `<section class="about-text-image" style="display:flex;gap:20px;align-items:center;padding:24px;">
  <div class="about-text" style="flex:1">
    <h2>{{title}}</h2>
    <p>{{content}}</p>
  </div>
  <div class="about-image" style="width:320px">
    <img src="{{image}}" alt="about image" style="width:100%;height:auto;display:block"/>
  </div>
</section>`,
    },
    {
      id: "about_timeline",
      name: "الخط الزمني",
      preview: "/images/sections/about_timeline.jpg",
      description: "عرض تاريخ الشركة في خط زمني",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "تاريخ الشركة",
        },
        {
          key: "events",
          label: "الأحداث",
          type: "textarea",
          placeholder: "أدخل الأحداث (كل حدث في سطر)",
        },
      ],
      defaultData: { title: "تاريخ الشركة", events: "" },
      htmlCode: `<section class="about-timeline"><h3>{{title}}</h3><ul>{{#each events}}<li>{{this}}</li>{{/each}}</ul></section>`,
    },
    {
      id: "about_values",
      name: "القيم والمبادئ",
      preview: "/images/sections/about_values.jpg",
      description: "عرض قيم ومبادئ الشركة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "قيمنا ومبادئنا",
        },
        {
          key: "values",
          label: "القيم",
          type: "textarea",
          placeholder: "أدخل القيم (كل قيمة في سطر)",
        },
      ],
      defaultData: { title: "قيمنا ومبادئنا", values: "" },
      htmlCode: `<section class="about-values"><h3>{{title}}</h3><div class="values">{{#each values}}<div class="value">{{this}}</div>{{/each}}</div></section>`,
    },
  ],

  our_staff: [
    {
      id: "staff_grid",
      name: "شبكة الموظفين",
      preview: "/images/sections/staff_grid.jpg",
      description: "عرض الموظفين في شبكة منظمة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "فريق العمل",
        },
        {
          key: "subtitle",
          label: "العنوان الفرعي",
          type: "text",
          placeholder: "تعرف على فريقنا المميز",
        },
      ],
      defaultData: { title: "فريق العمل", subtitle: "تعرف على فريقنا المميز" },
      htmlCode: `<section class="staff-grid"><h3>{{title}}</h3><p>{{subtitle}}</p><div class="grid">{{!-- staff items --}}</div></section>`,
    },
    {
      id: "staff_org_chart",
      name: "الهيكل التنظيمي",
      preview: "/images/sections/staff_org_chart.jpg",
      description: "عرض الهيكل التنظيمي للشركة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "الهيكل التنظيمي",
        },
      ],
      defaultData: { title: "الهيكل التنظيمي" },
      htmlCode: `<section class="org-chart"><h3>{{title}}</h3><div class="chart">{{!-- org chart markup --}}</div></section>`,
    },
    {
      id: "staff_departments",
      name: "الأقسام",
      preview: "/images/sections/staff_departments.jpg",
      description: "عرض الموظفين مقسمين حسب الأقسام",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "أقسام الشركة",
        },
      ],
      defaultData: { title: "أقسام الشركة" },
      htmlCode: `<section class="staff-departments"><h3>{{title}}</h3><div class="departments">{{!-- departments list --}}</div></section>`,
    },
  ],

  key_clients: [
    {
      id: "clients_logos",
      name: "شعارات العملاء",
      preview: "/images/sections/clients_logos.jpg",
      description: "عرض شعارات العملاء الرئيسيين",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "عملاؤنا الرئيسيون",
        },
      ],
      defaultData: { title: "عملاؤنا الرئيسيون" },
      htmlCode: `<section class="clients-logos"><h3>{{title}}</h3><div class="logos">{{!-- logos --}}</div></section>`,
    },
    {
      id: "clients_testimonials",
      name: "آراء العملاء",
      preview: "/images/sections/clients_testimonials.jpg",
      description: "عرض آراء وتقييمات العملاء",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "ماذا يقول عملاؤنا",
        },
      ],
      defaultData: { title: "ماذا يقول عملاؤنا" },
      htmlCode: `<section class="clients-testimonials"><h3>{{title}}</h3><blockquote>{{!-- testimonials --}}</blockquote></section>`,
    },
    {
      id: "clients_case_studies",
      name: "دراسات الحالة",
      preview: "/images/sections/clients_case_studies.jpg",
      description: "عرض دراسات حالة للمشاريع المنجزة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "دراسات الحالة",
        },
      ],
      defaultData: { title: "دراسات الحالة" },
      htmlCode: `<section class="case-studies"><h3>{{title}}</h3><div class="studies">{{!-- case studies --}}</div></section>`,
    },
  ],

  services: [
    {
      id: "services_grid",
      name: "شبكة الخدمات",
      preview: "/images/sections/services_grid.jpg",
      description: "عرض الخدمات في شبكة منظمة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "خدماتنا",
        },
        {
          key: "subtitle",
          label: "العنوان الفرعي",
          type: "text",
          placeholder: "نقدم مجموعة شاملة من الخدمات",
        },
      ],
      defaultData: {
        title: "خدماتنا",
        subtitle: "نقدم مجموعة شاملة من الخدمات",
      },
      htmlCode: `<section class="services-grid"><h3>{{title}}</h3><p>{{subtitle}}</p><div class="grid">{{!-- services --}}</div></section>`,
    },
    {
      id: "services_detailed",
      name: "خدمات مفصلة",
      preview: "/images/sections/services_detailed.jpg",
      description: "عرض تفصيلي للخدمات مع الوصف",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "خدماتنا المتخصصة",
        },
      ],
      defaultData: { title: "خدماتنا المتخصصة" },
      htmlCode: `<section class="service-detailed"><h3>{{title}}</h3><div class="service-list">{{!-- detailed list --}}</div></section>`,
    },
    {
      id: "services_process",
      name: "عملية العمل",
      preview: "/images/sections/services_process.jpg",
      description: "عرض خطوات عملية تقديم الخدمة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "كيف نعمل",
        },
      ],
      defaultData: { title: "كيف نعمل" },
      htmlCode: `<section class="services-process"><h3>{{title}}</h3><ol>{{!-- steps --}}</ol></section>`,
    },
  ],

  projects: [
    {
      id: "projects_gallery",
      name: "معرض المشاريع",
      preview: "/images/sections/projects_gallery.jpg",
      description: "عرض المشاريع في معرض صور",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "مشاريعنا",
        },
        {
          key: "subtitle",
          label: "العنوان الفرعي",
          type: "text",
          placeholder: "استعرض أعمالنا المميزة",
        },
      ],
      defaultData: { title: "مشاريعنا", subtitle: "استعرض أعمالنا المميزة" },
      htmlCode: `<section class="projects-gallery"><h3>{{title}}</h3><div class="gallery">{{!-- images --}}</div></section>`,
    },
    {
      id: "projects_timeline",
      name: "خط زمني للمشاريع",
      preview: "/images/sections/projects_timeline.jpg",
      description: "عرض المشاريع في خط زمني",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "رحلة مشاريعنا",
        },
      ],
      defaultData: { title: "رحلة مشاريعنا" },
      htmlCode: `<section class="projects-timeline"><h3>{{title}}</h3><ul>{{!-- timeline --}}</ul></section>`,
    },
    {
      id: "projects_categories",
      name: "فئات المشاريع",
      preview: "/images/sections/projects_categories.jpg",
      description: "عرض المشاريع مقسمة حسب الفئات",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "مشاريعنا حسب الفئة",
        },
      ],
      defaultData: { title: "مشاريعنا حسب الفئة" },
      htmlCode: `<section class="projects-categories"><h3>{{title}}</h3><div class="categories">{{!-- categories --}}</div></section>`,
    },
  ],

  tools_instruments: [
    {
      id: "tools_grid",
      name: "شبكة الأدوات",
      preview: "/images/sections/tools_grid.jpg",
      description: "عرض الأدوات والمعدات في شبكة",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "أدواتنا ومعداتنا",
        },
        {
          key: "subtitle",
          label: "العنوان الفرعي",
          type: "text",
          placeholder: "نستخدم أحدث الأدوات والتقنيات",
        },
      ],
      defaultData: {
        title: "أدواتنا ومعداتنا",
        subtitle: "نستخدم أحدث الأدوات والتقنيات",
      },
      htmlCode: `<section class="tools-grid"><h3>{{title}}</h3><p>{{subtitle}}</p><div class="grid">{{!-- tools --}}</div></section>`,
    },
    {
      id: "tools_categories",
      name: "فئات الأدوات",
      preview: "/images/sections/tools_categories.jpg",
      description: "عرض الأدوات مقسمة حسب الفئات",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "أدواتنا حسب الفئة",
        },
      ],
      defaultData: { title: "أدواتنا حسب الفئة" },
      htmlCode: `<section class="tools-categories"><h3>{{title}}</h3><div class="categories">{{!-- tools categories --}}</div></section>`,
    },
    {
      id: "tools_specifications",
      name: "مواصفات الأدوات",
      preview: "/images/sections/tools_specifications.jpg",
      description: "عرض تفصيلي لمواصفات الأدوات",
      fields: [
        {
          key: "title",
          label: "العنوان",
          type: "text",
          placeholder: "مواصفات أدواتنا",
        },
      ],
      defaultData: { title: "مواصفات أدواتنا" },
      htmlCode: `<section class="tools-specs"><h3>{{title}}</h3><div class="specs">{{!-- specs --}}</div></section>`,
    },
  ],
};

export default SectionTemplatesData;
