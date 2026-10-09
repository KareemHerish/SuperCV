import { DetailedRoadmapTrack } from './types';

export const productDesignTracks: Record<string, DetailedRoadmapTrack> = {
  'Product Manager': {
    id: 'product-manager',
    title: 'Product Manager',
    titleAr: 'مدير المنتج الرقمي واستراتيجيات النمو',
    icon: 'category',
    level: 'متوسط إلى رئيس قطاع المنتجات CPO',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد لقيادة دورة حياة المنتجات الرقمية من الرؤية الاستراتيجية واكتشاف احتياجات العملاء إلى الإطلاق وتحقيق أهداف النمو والربحية.',
    officialSlug: 'product-manager',
    stages: [
      {
        number: '01',
        name: 'Product Discovery & Market Research',
        nameAr: 'استكشاف المنتج وبحوث السوق والعملاء',
        description: 'فهم المشاكل الحقيقية للعملاء، إجراء المقابلات النوعية، وتحليل الفرص السوقية والمنافسين.',
        skills: ['Customer Interviews & User Personas', 'Competitive Analysis & Market Sizing (TAM/SAM/SOM)', 'Jobs to Be Done (JTBD) Framework', 'Problem Framing & Opportunity Solution Trees', 'User Journey Mapping'],
        level: 'أساسي',
        projectFocus: 'إعداد وثيقة استكشاف منتج (Product Discovery Dossier) تحدد فجوة حقيقية في السوق'
      },
      {
        number: '02',
        name: 'Product Strategy & Vision Roadmap',
        nameAr: 'استراتيجية المنتج ورسم خريطة الطريق',
        description: 'صياغة رؤية ملهمة للمنتج وربطها بالأهداف الاستراتيجية عبر منهجية OKRs.',
        skills: ['Product Vision & Value Proposition', 'OKRs (Objectives & Key Results)', 'Outcome-based Roadmapping', 'Prioritization Frameworks (RICE, Kano, MoSCoW)', 'Business Model Canvas'],
        level: 'متوسط',
        projectFocus: 'خريطة طريق ربع سنوية مبنية على النتائج (Outcome Roadmap) محددة بمعايير RICE'
      },
      {
        number: '03',
        name: 'Product Execution & Agile Delivery',
        nameAr: 'التنفيذ البرمجي وإدارة التطوير السريع',
        description: 'كتابة مواصفات المتطلبات (PRDs) وقصص المستخدمين والعمل الوثيق مع فرق الهندسة والتصميم.',
        skills: ['Product Requirements Documents (PRDs)', 'User Stories & Acceptance Criteria', 'Agile / Scrum / Kanban Methodologies', 'Sprint Planning & Backlog Refinement', 'Jira & Linear Project Management'],
        level: 'متوسط',
        projectFocus: 'كتابة وثيقة متطلبات منتج (PRD) تفصيلية لميزة دفع إلكتروني جديدة تضم معايير القبول'
      },
      {
        number: '04',
        name: 'Product Analytics & Experimentation',
        nameAr: 'تحليلات المنتج وتصميم التجارب السريعة',
        description: 'قياس تفاعل المستخدمين عبر مسارات التحويل وتصميم تجارب A/B Testing لزيادة الاستخدام.',
        skills: ['Product Analytics (Mixpanel, Amplitude, PostHog)', 'Funnel & Retention Cohort Analysis', 'A/B Testing Hypothesis & Execution', 'North Star Metric & Supporting KPIs', 'Heatmaps & Session Recordings (Hotjar)'],
        level: 'متقدم',
        projectFocus: 'تحليل مسار تحويل المستخدمين (Funnel) واقتراح تجربة A/B رفعت معدل التسجيل بنسبة 18%'
      },
      {
        number: '05',
        name: 'Growth, Monetization & Go-To-Market (GTM)',
        nameAr: 'استراتيجيات النمو، التسعير، والإطلاق التجاري',
        description: 'وضع خطط الإطلاق التسويقي، حلقات النمو الفيروسي، ونماذج التسعير والاشتراكات.',
        skills: ['Product-Led Growth (PLG) Strategies', 'Go-To-Market (GTM) Strategy', 'Pricing & Packaging Models (Freemium, Tiered)', 'Virality & Referral Loops', 'Customer Acquisition Cost (CAC) & LTV Optimization'],
        level: 'متقدم',
        projectFocus: 'خطة إطلاق GTM متكاملة لمنتج SaaS تشمل نموذج التسعير وحلقات النمو الذاتي'
      },
      {
        number: '06',
        name: 'Executive Stakeholder Leadership & AI Products',
        nameAr: 'التواصل القيادي وإدارة منتجات الذكاء الاصطناعي',
        description: 'قيادة التوافق بين الأقسام وإدارة منتجات مدعومة بنماذج الذكاء الاصطناعي التوليدي.',
        skills: ['Executive Presentations & Stakeholder Alignment', 'AI Product Management (LLMs, Latency vs Cost)', 'Managing Cross-Functional Teams without Authority', 'Crisis & Tech Debt Negotiation', 'Portfolio Management'],
        level: 'احترافي',
        projectFocus: 'عرض تقديمي استراتيجي لمجلس الإدارة يوضح جدوى الاستثمار في إضافة وكيل AI للمنتج'
      }
    ]
  },
  'Product Design': {
    id: 'product-design',
    title: 'Product Design',
    titleAr: 'تصميم المنتجات الرقمية الشامل (UI/UX)',
    icon: 'draw',
    level: 'مبتدئ إلى قائد تصميم منتجات',
    duration: '5 – 8 أشهر',
    summary: 'مسار متكامل يدمج بين بحوث المستخدمين العميقة، هندسة المعلومات، نظم التصميم Figma الموسعة، والواجهات الجذابة.',
    officialSlug: 'product-design',
    stages: [
      {
        number: '01',
        name: 'Design Thinking & User Research',
        nameAr: 'التفكير التصميمي وبحوث المستخدمين',
        description: 'تطبيق منهجية التفكير التصميمي والتعاطف مع المستخدمين واكتشاف الدوافع والاحتياجات.',
        skills: ['Design Thinking Process (Empathize, Define, Ideate, Prototype, Test)', 'User Interviews & Surveys', 'Empathy Maps & Persona Creation', 'Competitive UX Benchmarking', 'Affinity Diagrams & Synthesis'],
        level: 'أساسي',
        projectFocus: 'دراسة حالة بحثية كاملة لتحديد مشاكل حجز التذاكر لدى فئة كبار السن'
      },
      {
        number: '02',
        name: 'Information Architecture & Wireframing',
        nameAr: 'هندسة المعلومات والمخططات الهيكلية',
        description: 'هيكلة المحتوى منطقياً ورسم رحلات المستخدم والمخططات منخفضة الدقة Low-Fi.',
        skills: ['Information Architecture (IA) & Card Sorting', 'User Flows & Task Flows', 'Site Mapping & Navigation Models', 'Low-Fidelity Wireframing (Paper / Figma)', 'Content Strategy Basics'],
        level: 'متوسط',
        projectFocus: 'هندسة معلومات وتدفقات مستخدم كاملة لتطبيق توصيل طعام متعدد المتاجر'
      },
      {
        number: '03',
        name: 'Visual Design, Typography & Design Tokens',
        nameAr: 'التصميم البصري، التيبوغرافي، وشفرات التصميم',
        description: 'إتقان التسلسل الهرمي البصري، تناسق الخطوط والألوان، وتطبيق أسس التصميم الجرافيكي.',
        skills: ['Visual Hierarchy & Spacing Systems (8pt Grid)', 'Typography Pairing & Scale', 'Color Theory & Accessibility Contrast (WCAG)', 'Micro-Interactions & Motion Design', 'Iconography & Visual Assets'],
        level: 'متوسط',
        projectFocus: 'تصميم واجهة لوحة تحكم مالية فاخرة تدعم الوضعين الداكن والفاتح بنسب تباين معتمدة'
      },
      {
        number: '04',
        name: 'Figma Mastery & Scalable Design Systems',
        nameAr: 'إتقان Figma المتقدم وبناء نظم التصميم الموسعة',
        description: 'بناء مكونات قابلة لإعادة الاستخدام باستخدام Auto Layout و Variables والمتغيرات النمطية.',
        skills: ['Figma Auto Layout 5 & Responsive Constraints', 'Design Components, Variants & Component Properties', 'Design Tokens & Figma Variables (Theme Switching)', 'Atomic Design Methodology', 'Design System Documentation'],
        level: 'متقدم',
        projectFocus: 'بناء Design System شامل يضم 50+ مكوناً برمجياً جاهزاً مع دعم التبديل الآلي للثيمات'
      },
      {
        number: '05',
        name: 'Interactive Prototyping & Usability Testing',
        nameAr: 'النماذج التفاعلية الحية واختبارات قابلية الاستخدام',
        description: 'بناء نماذج تفاعلية عالية الدقة تشبه التطبيقات الحقيقية واختبارها مع مستخدمين فعليين.',
        skills: ['Advanced Prototyping in Figma (Smart Animate, Interactive Components)', 'Usability Testing Sessions & Protocols', 'SUS (System Usability Scale) & NPS Metrics', 'A/B Testing Visuals', 'Synthesizing Test Feedback into Iterations'],
        level: 'متقدم',
        projectFocus: 'نموذج تفاعلي عالي الدقة لتطبيق مصرفي تم اختباره مع 5 مستخدمين ومعالجة نقاط الإرباك'
      },
      {
        number: '06',
        name: 'Developer Handoff, Design Ops & Product Impact',
        nameAr: 'تسليم التصاميم للمطورين وإدارة عمليات التصميم DesignOps',
        description: 'توثيق الحالات الحدية Edge Cases والتنسيق التقني مع مهندسي الواجهات لقياس الأثر.',
        skills: ['Developer Handoff with Figma Dev Mode', 'Annotating Edge Cases, Empty States & Errors', 'DesignOps & Design Team Workflow', 'Measuring UX Impact on Business KPIs', 'Design Critique & Mentorship'],
        level: 'احترافي',
        projectFocus: 'تسليم مشروع إنتاجي متكامل للمطورين مع المواصفات التقنية والأكواد الجاهزة والحالات الشاذة'
      }
    ]
  },
  'UX Design': {
    id: 'ux-design',
    title: 'UX Design',
    titleAr: 'تصميم تجربة المستخدم والبحوث المعرفية',
    icon: 'psychology_alt',
    level: 'مبتدئ إلى كبير باحثي تجربة مستخدم',
    duration: '4 – 7 أشهر',
    summary: 'التركيز على الجانب النفسي والسلوكي للمستخدم، تقليل الاحتكاك الإدراكي، بحوث التفاعل، وإمكانية الوصول الشاملة.',
    officialSlug: 'product-design',
    stages: [
      {
        number: '01',
        name: 'Cognitive Psychology & UX Laws',
        nameAr: 'علم النفس المعرفي وقوانين تجربة المستخدم',
        description: 'فهم كيفية إدراك العقل البشري للواجهات وتطبيق القوانين السلوكية الأساسية.',
        skills: ['Hick’s Law & Decision Overload', 'Fitts’s Law & Target Sizing', 'Jakob’s Law of Internet Familiarity', 'Cognitive Load Theory', 'Mental Models vs Conceptual Models'],
        level: 'أساسي',
        projectFocus: 'تحليل وتدقيق واجهة معقدة وإعادة تصميمها لتقليل الجهد الذهني للمستخدم وفق قانون هيك'
      },
      {
        number: '02',
        name: 'Qualitative & Quantitative User Research',
        nameAr: 'بحوث المستخدمين النوعية والكمية',
        description: 'تصميم أدوات البحث، الاستطلاعات، والمقابلات المعمقة لاستخلاص الحقائق السلوكية.',
        skills: ['User Interviews & Contextual Inquiry', 'Survey Design & Sampling Methods', 'Diary Studies & Longitudinal Research', 'Card Sorting (Open & Closed) for Navigation', 'Tree Testing for IA Validation'],
        level: 'متوسط',
        projectFocus: 'دراسة بحثية تضم 10 مقابلات نوعية واستطلاعاً كمياً لـ 200 مستخدم لتحديد أسباب ترك السلة'
      },
      {
        number: '03',
        name: 'Usability Heuristics & Expert Evaluation',
        nameAr: 'التقييم الاستكشافي ومعايير نيلسن لقابلية الاستخدام',
        description: 'فحص التطبيقات والخدمات وفق معايير Nielsen Norman Group العشرة.',
        skills: ['Nielsen’s 10 Usability Heuristics', 'Cognitive Walkthrough Methodology', 'Severity Rating for Usability Issues', 'Heuristic Evaluation Reporting', 'Form & Error State Optimization'],
        level: 'متوسط',
        projectFocus: 'تقرير تدقيق قابلية استخدام شامل Heuristic Audit لمنصة حكومية أو تجارية مع الحلول'
      },
      {
        number: '04',
        name: 'Accessibility & Inclusive Design (a11y)',
        nameAr: 'إمكانية الوصول الشاملة والتصميم للجميع',
        description: 'ضمان إمكانية استخدام التطبيقات لذوي الإعاقات البصرية والسمعية والحركية.',
        skills: ['WCAG 2.2 Guidelines (Level A, AA, AAA)', 'Screen Reader Testing (VoiceOver, NVDA)', 'Keyboard-Only Navigation Flows', 'Color Blindness Simulation & Safe Palettes', 'Accessible Touch Targets & Focus States'],
        level: 'متقدم',
        projectFocus: 'إعادة تصميم تدفق تسجيل دخول ومطابقته بالكامل مع أعلى معايير الوصول WCAG 2.2 AA'
      },
      {
        number: '05',
        name: 'Advanced Usability Testing & Metrics',
        nameAr: 'اختبارات الاستخدام المتقدمة والمقاييس الرقمية',
        description: 'قياس سرعة إنجاز المهام، معدل الأخطاء، وحساب مقياس سهولة الاستخدام SUS.',
        skills: ['Moderated vs Unmoderated Testing (UserTesting, Maze)', 'Task Success Rate & Time on Task Measurement', 'System Usability Scale (SUS) Scoring', 'Single Ease Question (SEQ)', 'Eye Tracking & Heatmap Insights'],
        level: 'متقدم',
        projectFocus: 'جلسة اختبار استخدام بدون موجه عبر Maze لـ 30 مشاركاً مع تحليل معدل الخطأ والنجاح'
      },
      {
        number: '06',
        name: 'UX Strategy & Organizational Maturity',
        nameAr: 'استراتيجية تجربة المستخدم والنضج المؤسسي',
        description: 'رفع مستوى نضج تجربة المستخدم في المؤسسة وربط نتائج UX بقرارات الاستثمار.',
        skills: ['UX Maturity Models', 'ROI of UX Calculations', 'Design Thinking Facilitation Workshops', 'Cross-Functional UX Advocacy', 'Continuous Research Repository Setup'],
        level: 'احترافي',
        projectFocus: 'خطة استراتيجية لتحويل مؤسسة من مرحلة التجاهل إلى مرحلة القيادة الموجهة بتجربة المستخدم'
      }
    ]
  },
  'SEO': {
    id: 'seo',
    title: 'SEO',
    titleAr: 'تحسين محركات البحث والظهور الرقمي',
    icon: 'travel_explore',
    level: 'مبتدئ إلى كبير مستشاري الـ SEO',
    duration: '4 – 7 أشهر',
    summary: 'مسار معتمد لتحسين تصنيف المواقع، أرشفة محركات البحث، الـ Technical SEO، وبناء السلطة الرقمية والمحتوى المتوافق مع الذكاء الاصطناعي.',
    officialSlug: 'seo',
    stages: [
      {
        number: '01',
        name: 'Search Engine Crawling, Indexing & Fundamentals',
        nameAr: 'أساسيات محركات البحث، الزحف، والأرشفة',
        description: 'فهم كيف يكتشف Googlebot الصفحات ويفهرسها ويعالج ملفات robots.txt و sitemaps.',
        skills: ['Search Engine Crawlers & Indexing Pipelines', 'robots.txt Configuration & Directives', 'XML Sitemaps Generation & Management', 'HTTP Status Codes (301, 302, 404, 410, 500)', 'Canonical Tags (rel=canonical) & Duplicate Content'],
        level: 'أساسي',
        projectFocus: 'تدقيق أرشفة موقع كامل عبر Google Search Console وحل مشاكل الصفحات المستبعدة'
      },
      {
        number: '02',
        name: 'Keyword Research & Search Intent Mapping',
        nameAr: 'بحوث الكلمات المفتاحية ومطابقة نية البحث',
        description: 'اكتشاف العبارات الأكثر بحثاً وفهم نية الباحث (معلوماتية، تجارية، تنقلية، شرائية).',
        skills: ['Keyword Research Tools (Ahrefs, Semrush, Google Keyword Planner)', 'Search Intent Categorization (Informational, Transactional)', 'Search Volume vs Keyword Difficulty (KD)', 'Long-Tail Keywords Strategy', 'Topic Clusters & Pillar Page Architecture'],
        level: 'متوسط',
        projectFocus: 'خطة كلمات مفتاحية لمتجر إلكتروني تضم 100 كلمة مصنفة حسب نية الشراء وحجم البحث'
      },
      {
        number: '03',
        name: 'On-Page SEO & Content Architecture',
        nameAr: 'السيو الداخلي On-Page وهيكلة المحتوى الجذاب',
        description: 'تحسين العناوين، الأوصاف، الصور، والروابط الداخلية لتعزيز القيمة الدلالية للصفحات.',
        skills: ['Title Tags & Meta Descriptions Optimization', 'Heading Hierarchy (H1, H2, H3) & Content Depth', 'Internal Linking Architecture & PageRank Distribution', 'Image SEO (Alt Text, WebP Compression)', 'Helpful Content Guidelines & E-E-A-T Standards'],
        level: 'متوسط',
        projectFocus: 'تحسين صفحة مقال رئيسية لتحقيق شروط Google E-E-A-T وتصدر النتيجة الأولى في البحث'
      },
      {
        number: '04',
        name: 'Technical SEO, Core Web Vitals & Rendering',
        nameAr: 'السيو التقني وسرعة الصفحات ومعالجة JavaScript',
        description: 'تحسين أداء المتصفح وسرعة الموقع لضمان اجتياز معايير Core Web Vitals.',
        skills: ['Core Web Vitals Optimization (LCP, INP, CLS)', 'Server-Side Rendering (SSR) vs CSR for SEO', 'Mobile-First Indexing Best Practices', 'Pagination & Infinite Scroll SEO', 'Hreflang for International Multi-Language Sites'],
        level: 'متقدم',
        projectFocus: 'حل مشاكل تصيير جافاسكريبت لموقع Next.js ورفع سرعة LCP من 4.2 ثانية إلى 1.4 ثانية'
      },
      {
        number: '05',
        name: 'Structured Data, Schema.org & Rich Snippets',
        nameAr: 'البيانات المنظمة Schema.org والنتائج المنسقة',
        description: 'إضافة أكواد JSON-LD لظهور الموقع في ميزات البحث الغنية (النجوم، الأسئلة، المنتجات).',
        skills: ['JSON-LD Structured Data Implementation', 'Schema Types (Product, Article, FAQ, LocalBusiness)', 'Google Rich Results Testing & Validation', 'BreadcrumbList & Organization Schema', 'AI Overviews & SGE Optimization'],
        level: 'متقدم',
        projectFocus: 'تضمين أكواد Schema كاملة لصفحات المنتجات للحصول على نجوم التقييم والأسعار في بحث جوجل'
      },
      {
        number: '06',
        name: 'Off-Page SEO, Digital PR & Analytics',
        nameAr: 'السيو الخارجي والعلاقات العامة الرقمية والتحليلات',
        description: 'بناء الروابط الخلفية عالية الثقة (Backlinks) وقياس العائد الاستثماري عبر التحليلات.',
        skills: ['High-Authority Backlink Acquisition Strategies', 'Digital PR & Content Linkable Assets', 'Google Analytics 4 (GA4) for Organic Traffic', 'Competitor Backlink Gap Analysis', 'Disavow Tool & Toxic Link Audits'],
        level: 'احترافي',
        projectFocus: 'حملة Digital PR أثمرت عن 15 رابطاً خلفياً من مواقع إخبارية كبرى ورفعت الزيارات بنسبة 60%'
      }
    ]
  },
  'QA': {
    id: 'qa',
    title: 'QA',
    titleAr: 'مهندس ضمان الجودة واختبار البرمجيات المؤتمت',
    icon: 'fact_check',
    level: 'مبتدئ إلى مهندس SDET متقدم',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد لهندسة اختبار البرمجيات من الاختبار اليدوي وتصميم الحالات إلى الأتمتة الشاملة E2E واختبارات الأداء والأمان.',
    officialSlug: 'qa',
    stages: [
      {
        number: '01',
        name: 'Testing Fundamentals & ISTQB Standards',
        nameAr: 'أساسيات الاختبار ومعايير ISTQB العالمية',
        description: 'فهم مستويات الاختبار، دورة حياة العيوب، وتصميم خطط الاختبار المحكمة.',
        skills: ['Software Testing Life Cycle (STLC)', 'Test Case Design Techniques (Boundary Value, Equivalence)', 'Defect Life Cycle & Severity vs Priority', 'Black Box vs White Box Testing', 'ISTQB Certified Tester Foundation Level Standards'],
        level: 'أساسي',
        projectFocus: 'كتابة خطة اختبار Test Plan شاملة لتطبيق تجارة إلكترونية مع 50 حالة اختبار مفصلة'
      },
      {
        number: '02',
        name: 'API Testing & Automation with Postman',
        nameAr: 'اختبار واجهات برمجة التطبيقات API والأتمتة',
        description: 'فحص سلامة الـ RESTful APIs، الاستجابات، رموز الحالة، والتسلسل المنطقي.',
        skills: ['Postman Collections & Environment Variables', 'API Assertions with JavaScript (pm.test)', 'Newman CLI for Automated Test Runs', 'Status Codes & Payload Validation', 'Mock Servers & Automated Contract Testing'],
        level: 'متوسط',
        projectFocus: 'مجموعة اختبارات API مؤتمتة في Postman تفحص 30 مساراً برمجياً وتعمل في الـ CI/CD عبر Newman'
      },
      {
        number: '03',
        name: 'Web UI Test Automation (Playwright / Cypress)',
        nameAr: 'أتمتة اختبارات واجهات الويب (Playwright / Cypress)',
        description: 'كتابة اختبارات تفاعلية تلقائية تحاكي حركة المستخدم الحقيقية عبر المتصفحات.',
        skills: ['Playwright Test Runner & Auto-Waiting', 'Page Object Model (POM) Design Pattern', 'Cross-Browser Testing (Chromium, Firefox, WebKit)', 'Cypress End-to-End Testing', 'Handling Dynamic Elements & Asynchronous Calls'],
        level: 'متوسط',
        projectFocus: 'إطار أتمتة كامل بنمط Page Object Model يختبر دورة الشراء من الإضافة للسلة إلى الدفع'
      },
      {
        number: '04',
        name: 'Mobile App Testing Automation (Appium)',
        nameAr: 'أتمتة اختبارات تطبيقات الهواتف الذكية (Appium)',
        description: 'أتمتة اختبار تطبيقات أندرويد و iOS على الأجهزة الحقيقية والمحاكيات.',
        skills: ['Appium Architecture & Client Libraries', 'Locating Mobile Elements (Accessibility ID, XPath)', 'Gestures Automation (Swipe, Pinch, Long Press)', 'Testing on Emulators & Real Devices', 'Cloud Device Farms (BrowserStack / Sauce Labs)'],
        level: 'متقدم',
        projectFocus: 'مجموعة اختبارات مؤتمتة لتطبيق هاتف تعمل بنجاح عبر Appium وتتحقق من شاشات التطبيق'
      },
      {
        number: '05',
        name: 'Performance & Load Testing (k6 / JMeter)',
        nameAr: 'اختبارات الأداء وتحمل الضغط العالي',
        description: 'محاكاة آلاف المستخدمين المتزامنين لمعرفة نقطة انهيار النظام واكتشاف الاختناقات.',
        skills: ['k6 Load Testing with JavaScript', 'Apache JMeter Stress & Spike Testing', 'Analyzing Latency, Throughput & Error Rates', 'Defining Performance Thresholds & SLAs', 'Bottleneck Identification in Database/CPU'],
        level: 'متقدم',
        projectFocus: 'اختبار حمل يحاكي 10,000 مستخدم متزامن على خادم تسجيل الدخول وتحديد سعة التحمل القصوى'
      },
      {
        number: '06',
        name: 'Continuous Testing in CI/CD & TestOps',
        nameAr: 'الاختبار المستمر في خطوط النشر وإدارة TestOps',
        description: 'دمج الاختبارات في مسارات GitHub Actions وإدارة التقارير والتحليلات الحية.',
        skills: ['CI/CD Pipeline Integration (GitHub Actions / GitLab)', 'Allure Test Reporting Dashboards', 'Parallel Test Execution for Speed', 'Flaky Tests Identification & Quarantining', 'Quality Gate Enforcement for Deployments'],
        level: 'احترافي',
        projectFocus: 'منظومة اختبارات مؤتمتة تعمل بالتوازي في أقل من 3 دقائق وترسل تقارير Allure تفاعلية'
      }
    ]
  },
  'Engineering Manager': {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    titleAr: 'مدير الفرق الهندسية وتطوير البرمجيات',
    icon: 'groups',
    level: 'قائد فريق إلى مدير هندسي أول / VP',
    duration: '6 – 10 أشهر',
    summary: 'مسار معتمد لقيادة الفرق الهندسية عالية الأداء، تطوير المطورين، إدارة المشاريع المعقدة، ومواءمة التقنية مع الأعمال.',
    officialSlug: 'engineering-manager',
    stages: [
      {
        number: '01',
        name: 'People Leadership, 1-on-1s & Career Coaching',
        nameAr: 'قيادة الأفراد والجلسات الفردية وتطوير المسارات المهنية',
        description: 'بناء علاقات ثقة مع المهندسين، إدارة اللقاءات الدورية 1:1، ووضع خطط الترقية والتطوير.',
        skills: ['Effective 1-on-1 Frameworks', 'Career Ladders & Competency Matrices', 'Active Listening & Radical Candor Feedback', 'Coaching vs Mentoring Techniques', 'Psychological Safety in Engineering Teams'],
        level: 'أساسي',
        projectFocus: 'إنشاء مصفوفة كفاءات هندسية Career Ladder للمطورين من Junior إلى Staff Engineer'
      },
      {
        number: '02',
        name: 'Hiring, Talent Acquisition & Team Scaling',
        nameAr: 'استقطاب وتوظيف الكفاءات وتوسيع الفرق',
        description: 'تصميم مسارات المقابلات العادلة، تقييم المرشحين، وبناء فرق هندسية متوازنة ومتكاملة.',
        skills: ['Technical Interview Rubrics Design', 'Unbiased Hiring Practices', 'Candidate Sourcing & Tech Branding', 'Onboarding Programs for Fast Ramp-up', 'Managing Team Size & Squad Structure'],
        level: 'متوسط',
        projectFocus: 'إعداد برنامج تأهيل للمهندسين الجدد يقلص زمن أول تسليم كود إلى الإنتاج إلى 4 أيام'
      },
      {
        number: '03',
        name: 'Engineering Delivery & Agile Execution',
        nameAr: 'تسليم المشاريع الهندسية وإدارة سرعة الإنجاز',
        description: 'إزالة العوائق أمام الفريق، موازنة الأولويات، وضمان تسليم الميزات في المواعيد المقررة.',
        skills: ['Scrum / Kanban Optimization', 'DORA Metrics (Deployment Frequency, Lead Time, CFR, MTTR)', 'Managing Technical Debt vs Feature Delivery', 'Risk Management & Dependency Mapping', 'Sprint Retrospectives & Continuous Improvement'],
        level: 'متوسط',
        projectFocus: 'لوحة قياس مؤشرات DORA للفريق ورفع معدل النشر إلى الإنتاج من مرة شهرياً إلى يومياً'
      },
      {
        number: '04',
        name: 'System Architecture & Technical Alignment',
        nameAr: 'المعمارية التقنية والتوافق الهندسي مع النظم',
        description: 'المشاركة في القرارات المعمارية الكبرى دون التدخل الدقيق (No Micro-management).',
        skills: ['Architectural Review Process (RFCs)', 'Code Review Culture & Standards', 'Incident Post-Mortems & Blameless Reviews', 'Capacity Planning & Cloud Cost Awareness', 'Balancing Innovation with System Stability'],
        level: 'متقدم',
        projectFocus: 'إدارة جلسة تحليل حادثة إنتاج كبرى Blameless Post-Mortem ووضع حلول وقائية جذرية'
      },
      {
        number: '05',
        name: 'Cross-Functional Collaboration & Stakeholder Mgmt',
        nameAr: 'التنسيق بين الأقسام وإدارة العلاقات مع متخذي القرار',
        description: 'التواصل الفعال مع مديري المنتجات والتصميم والقيادات التنفيذية وترجمة التقنية لأرقام عمل.',
        skills: ['Product-Engineering-Design Triad Alignment', 'Translating Technical Complexity to Business Language', 'Negotiating Deadlines & Scope Management', 'Budgeting & Vendor Management', 'Executive Communication (C-Level Reports)'],
        level: 'متقدم',
        projectFocus: 'خطة عمل مشتركة بين الهندسة والمنتج لحل مشكلة الديون التقنية وتأثيرها على سرعة التطوير'
      },
      {
        number: '06',
        name: 'Strategic Leadership & Culture Building',
        nameAr: 'القيادة الاستراتيجية وبناء الثقافة الهندسية',
        description: 'غرس قيم التميز الهندسي، تحفيز الفريق، وقيادة التغيير التنظيمي والتحول الرقمي.',
        skills: ['Engineering Culture & Core Values', 'Managing Low & High Performers', 'Strategic Tech Roadmapping', 'Change Management & Reorganizations', 'Burnout Prevention & Team Well-being'],
        level: 'احترافي',
        projectFocus: 'خطة استراتيجية سنوية للقطاع الهندسي تتضمن المستهدفات التقنية وتطوير المواهب والميزانية'
      }
    ]
  },
  'Developer Relations': {
    id: 'developer-relations',
    title: 'Developer Relations',
    titleAr: 'علاقات المطورين ومناصري التقنية (DevRel)',
    icon: 'connect_without_contact',
    level: 'متوسط إلى قائد مجتمعات مطورين',
    duration: '4 – 7 أشهر',
    summary: 'بناء جسور التواصل بين منتجات الشركات والمطورين عبر المحتوى التقني، المحاضرات، إدارة المجتمعات، وتطوير نماذج SDKs.',
    officialSlug: 'developer-relations',
    stages: [
      {
        number: '01',
        name: 'Developer Experience (DX) & Onboarding',
        nameAr: 'تجربة المطور (DX) وسرعة بدء الاستخدام',
        description: 'تقليص وقت تحقيق أول نجاح (Time to Hello World) وتبسيط مسار استخدام الـ API.',
        skills: ['Time to First Hello World (TTFHW) Optimization', 'API Documentation Auditing', 'Quickstart Guides & Interactive Sandboxes', 'Sample Code & Boilerplates (Node, Python, Go)', 'Developer Portal Usability'],
        level: 'أساسي',
        projectFocus: 'إعادة تصميم دليل البدء السريع لـ API وتقليص خطوات التشغيل الأولى من 12 إلى 3 خطوات'
      },
      {
        number: '02',
        name: 'Technical Content & Educational Tutorials',
        nameAr: 'المحتوى التقني التثقيفي والشروحات البرمجية',
        description: 'كتابة مقالات برمجية عميقة ومشاريع عملية توضح قيمة التقنية للمطورين.',
        skills: ['Technical Blogging & Code Walkthroughs', 'Video Tutorials & Screencasting', 'GitHub Repositories Best Practices (README, Issues)', 'Creating Demo Applications', 'SEO for Developer Content'],
        level: 'متوسط',
        projectFocus: 'بناء تطبيق عملي توضيحي مفتوح المصدر على GitHub مع شرح بالفيديو ومقال تفصيلي'
      },
      {
        number: '03',
        name: 'Public Speaking & Hackathon Leadership',
        nameAr: 'الإلقاء والمؤتمرات التقنية وقيادة الهاكاثونات',
        description: 'تقديم العروض في المؤتمرات العالمية وتنظيم وإرشاد الهاكاثونات البرمجية.',
        skills: ['Public Speaking & Conference Presentation', 'Slide Design & Live Coding Demos', 'Organizing & Mentoring Hackathons', 'Workshop Facilitation', 'Webinars & Live Streams (YouTube, Twitch)'],
        level: 'متوسط',
        projectFocus: 'تقديم ورشة عمل برمجية حية مدتها ساعة ونصف تشرح بناء تطبيق يعتمد على الـ API'
      },
      {
        number: '04',
        name: 'Community Architecture & Engagement',
        nameAr: 'بناء وإدارة مجتمعات المطورين',
        description: 'إدارة مجتمعات Discord و Slack والمنتديات ودعم المطورين في حل المشاكل التقنية.',
        skills: ['Discord & Slack Community Management', 'Stack Overflow & Discourse Support', 'Developer Champions & Ambassador Programs', 'Community Moderation & Code of Conduct', 'Organizing Local Meetups'],
        level: 'متقدم',
        projectFocus: 'إطلاق برنامج سفراء المطورين Champions Program واستقطاب أول 25 مطوراً سفيراً للتقنية'
      },
      {
        number: '05',
        name: 'SDK Development & Product Feedback Loops',
        nameAr: 'تطوير حزم الـ SDKs وتغذية فرق المنتجات',
        description: 'كتابة مكتبات برمجية رسمية ونقل آراء ومشاكل المطورين إلى مهندسي المنتج الداخليين.',
        skills: ['SDK Design Guidelines (TypeScript, Python, Java)', 'Gathering & Synthesizing Developer Feedback', 'Feature Requests Prioritization with Product Teams', 'Beta Testing Programs', 'Tracking Developer Sentiment'],
        level: 'متقدم',
        projectFocus: 'تطوير حزمة TypeScript SDK مفتوحة المصدر ونشرها على npm مع تغطية اختبارات كاملة'
      },
      {
        number: '06',
        name: 'DevRel Metrics, Strategy & Business Impact',
        nameAr: 'مقاييس DevRel والاستراتيجية والأثر التجاري',
        description: 'إثبات العائد الاستثماري لجهود علاقات المطورين وربطها بنمو استخدام الـ API.',
        skills: ['DevRel Frameworks (Orbit Model / DevRel Funnel)', 'Measuring Developer Adoption & API Usage', 'Attribution & Conversion to Paid Tiers', 'DevRel Strategy & Budgeting', 'C-Level Reporting for Community Impact'],
        level: 'احترافي',
        projectFocus: 'تقرير أداء فصلي للإدارة يوضح كيف ساهم مجتمع المطورين في نمو استهلاك الـ API بنسبة 45%'
      }
    ]
  },
  'Technical Writer': {
    id: 'technical-writer',
    title: 'Technical Writer',
    titleAr: 'الكاتب والتوثيق التقني لفرق البرمجيات',
    icon: 'edit_note',
    level: 'مبتدئ إلى كبير مسؤولي التوثيق التقني',
    duration: '4 – 6 أشهر',
    summary: 'مسار معتمد لصياغة التوثيقات البرمجية فائقة الوضوح، أدلة الـ APIs، بوابات المطورين، ومنهجية Docs-as-Code.',
    officialSlug: 'technical-writer',
    stages: [
      {
        number: '01',
        name: 'Technical Writing Fundamentals & Grammar',
        nameAr: 'أساسيات الكتابة التقنية والأسلوب المباشر',
        description: 'الكتابة بلغة واضحة، موجزة، ومباشرة وخالية من الغموض وفق أدلة الأسلوب العالمية.',
        skills: ['Clear, Concise & Active Voice Writing', 'Google Developer Documentation Style Guide', 'Microsoft Writing Style Guide', 'Markdown & MDX Mastery', 'Audience Analysis & Reading Levels'],
        level: 'أساسي',
        projectFocus: 'إعادة كتابة وثيقة تقنية معقدة وجعلها سهلة الفهم لمهندسي البرمجيات المبتدئين'
      },
      {
        number: '02',
        name: 'Docs-as-Code & Modern Documentation Tools',
        nameAr: 'منهجية التوثيق كشفرة برمجية Docs-as-Code',
        description: 'إدارة التوثيق مثل كود البرمجيات عبر Git و GitHub ومولدات المواقع الثابتة.',
        skills: ['Git Version Control for Documentation', 'Static Site Generators (Docusaurus, Mintlify, Starlight)', 'Continuous Integration for Docs (Linting & Previews)', 'Vale Prose Linter for Style Enforcement', 'Mermaid.js for Text-Based Diagrams'],
        level: 'متوسط',
        projectFocus: 'بناء موقع توثيق تقني كامل باستخدام Docusaurus مع فحوصات آلية للأسلوب عبر Vale'
      },
      {
        number: '03',
        name: 'API Documentation & OpenAPI / Swagger',
        nameAr: 'توثيق واجهات برمجة التطبيقات و OpenAPI',
        description: 'توثيق نقاط الاتصال البرمجية، المعاملات، الردود، وحالات الأخطاء وفق مواصفات OpenAPI.',
        skills: ['OpenAPI 3.1 & Swagger Specification', 'Documenting Endpoints, Headers, Query Params', 'Error Codes & Troubleshooting Guides', 'Authentication Guides (API Keys, OAuth2)', 'Interactive API Explorers (Scalar, Redoc)'],
        level: 'متوسط',
        projectFocus: 'كتابة ملف مواصفات OpenAPI 3.1 كامل لخدمة مصرفية مع أمثلة واقعية لكل طلب واستجابة'
      },
      {
        number: '04',
        name: 'Information Architecture & Developer Portals',
        nameAr: 'هندسة المعلومات وبوابات المطورين',
        description: 'تنظيم وتصنيف مئات الصفحات التوثيقية لسهولة التصفح والبحث السريع.',
        skills: ['Information Architecture for Tech Docs', 'Navigation & Hierarchy Design (Sidebar & Breadcrumbs)', 'Search Integration (Algolia DocSearch)', 'Versioned Documentation for Multiple Releases', 'Changelogs & Release Notes Writing'],
        level: 'متقدم',
        projectFocus: 'إعادة تنظيم بوابة مطورين تحتوي على 150 مقالاً تقنياً وتسهيل العثور على المعلومات'
      },
      {
        number: '05',
        name: 'Architecture Diagrams & Visual Documentation',
        nameAr: 'المخططات المعمارية والتوثيق البصري',
        description: 'رسم تدفقات البيانات والمخططات الهندسية باستخدام معايير C4 Model وأدوات الرسم.',
        skills: ['C4 Model for Software Architecture', 'Sequence Diagrams & Data Flow Diagrams', 'Diagrams as Code (Mermaid, PlantUML)', 'Screenshots & GIF Capture Best Practices', 'Annotating Complex System Interactions'],
        level: 'متقدم',
        projectFocus: 'رسم وتوثيق معمارية نظام مدفوعات متعدد الخدمات بالكامل باستخدام C4 Model و Mermaid'
      },
      {
        number: '06',
        name: 'Content Governance, Metrics & Continuous Feedback',
        nameAr: 'حوكمة المحتوى، مقاييس التوثيق، والتطوير المستمر',
        description: 'قياس جودة التوثيق عبر تقييمات المطورين وتحديث الوثائق دورياً مع كل تحديث برمجي.',
        skills: ['Docs Analytics (Pageviews, Bounce Rate, Search Queries)', 'Helpfulness Feedback Widgets (Was this page helpful?)', 'Review Cycles with Engineers & Product Managers', 'Maintenance & Deprecation of Outdated Docs', 'Writing for Non-Native English Speakers (Global English)'],
        level: 'احترافي',
        projectFocus: 'وضع سياسة حوكمة شاملة للتوثيق تضمن مراجعة وتحديث كل وثيقة مع إطلاق أي ميزة برمجية'
      }
    ]
  },
  'Forward Deployed Engineer': {
    id: 'forward-deployed-engineer',
    title: 'Forward Deployed Engineer',
    titleAr: 'مهندس الحلول الميدانية والدمج التقني (FDE)',
    icon: 'domain_verification',
    level: 'متوسط إلى خبير حلول مؤسسية',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد يجمع بين البرمجة عالية الكفاءة والتواجد مع كبار العملاء لتصميم وتطبيق حلول معقدة مخصصة على أرض الواقع.',
    officialSlug: 'full-stack',
    stages: [
      {
        number: '01',
        name: 'Core Engineering & Problem Solving Under Pressure',
        nameAr: 'الهندسة البرمجية والحل السريع للمشكلات المعقدة',
        description: 'كتابة أكواد نظيفة وسريعة وفهم خوارزميات الربط والتكامل عبر لغات متعددة.',
        skills: ['Full Stack Fluency (Python, TypeScript, SQL)', 'Debugging Production Issues Quickly', 'Reverse Engineering Unfamiliar Codebases', 'Data Structures & Algorithmic Problem Solving', 'Git & Branching for Client Customizations'],
        level: 'أساسي',
        projectFocus: 'تعديل وتكييف خدمة خلفية مفتوحة المصدر لتعمل بكفاءة مع نظام عميل ذي متطلبات غير قياسية'
      },
      {
        number: '02',
        name: 'Enterprise Data Pipelines & ETL Integration',
        nameAr: 'خطوط بيانات المؤسسات والتكامل مع الأنظمة القديمة',
        description: 'سحب، تحويل، وتغذية البيانات من أنظمة العميل القديمة (Legacy) إلى المنصة الحديثة.',
        skills: ['ETL / ELT Pipeline Development', 'Connecting to Enterprise DBs (Oracle, SQL Server, SAP)', 'Data Cleaning & Schema Mapping', 'Handling Massive Batch Data Transfers', 'SFTP, Webhooks & Secure File Transfers'],
        level: 'متوسط',
        projectFocus: 'بناء مسار تكاملي ينقل 10 ملايين سجل من قاعدة بيانات Oracle قديمة إلى السحابة بنجاح'
      },
      {
        number: '03',
        name: 'System Architecture & Custom Solutions Design',
        nameAr: 'معمارية النظم وتصميم الحلول المؤسسية المخصصة',
        description: 'تصميم حلول تقنية تناسب البيئات الأمنية الصارمة للعملاء مثل البنوك والهيئات الحكومية.',
        skills: ['Custom Solutions Architecture', 'On-Premises & Air-Gapped Deployments', 'API Integrations & Custom Middleware', 'Single Sign-On (SAML 2.0, OpenID Connect)', 'High Availability for Enterprise Deployments'],
        level: 'متوسط',
        projectFocus: 'تصميم معمارية نشر معزولة تماماً عن الإنترنت (Air-Gapped) لمنصة تحليلات في جهة سيادية'
      },
      {
        number: '04',
        name: 'Client Discovery, Empathy & Executive Communication',
        nameAr: 'استكشاف متطلبات العميل والتواصل القيادي المباشر',
        description: 'الجلوس مع مديري التكنولوجيا (CTO) للعملاء واستخراج المتطلبات التقنية الدقيقة.',
        skills: ['Technical Discovery Workshops', 'Translating Business Needs into Technical Specs', 'Managing Client Expectations & Scope Creep', 'Executive Demos & Proof of Concepts (PoC)', 'Root-Cause Explanation to Non-Technical Stakeholders'],
        level: 'متقدم',
        projectFocus: 'إدارة ورشة عمل استكشافية مدتها أسبوع مع الفريق التقني للعميل وصياغة مواصفات الحل'
      },
      {
        number: '05',
        name: 'Security, Compliance & Data Governance for Enterprise',
        nameAr: 'الأمن والامتثال وحوكمة البيانات لعملاء الشركات',
        description: 'الامتثال للوائح الأمنية الصارمة للعملاء وتأمين البيانات المشفرة أثناء النقل والتخزين.',
        skills: ['Data Residency & Sovereignty Laws', 'SOC 2 & ISO 27001 Requirements for Vendors', 'Role-Based Access Control (RBAC) & Audit Trails', 'Vulnerability Remediation for Security Audits', 'Secrets Management in Client Infrastructure'],
        level: 'متقدم',
        projectFocus: 'اجتياز فحص أمني صارم من فريق الأمن السيبراني لبنك استثماري قبل إطلاق الحل في الإنتاج'
      },
      {
        number: '06',
        name: 'Product Feedback Bridge & Scalable Generalization',
        nameAr: 'جسر التواصل مع فرق المنتجات وتعميم الحلول المخصصة',
        description: 'تحويل الحلول المخصصة المكتوبة لعميل واحد إلى ميزات عامة تفيد جميع عملاء المنصة.',
        skills: ['Turning Custom Fixes into Platform Features', 'Collaborating with Core Product & Engineering Teams', 'Technical Account Handover to Support / Success', 'Post-Deployment Performance Tuning', 'Measuring Customer Time-to-Value (TTV)'],
        level: 'احترافي',
        projectFocus: 'استخلاص ميزة ربط مخصصة وتحويلها إلى إضافة قياسية مدمجة في المنتج الأساسي للشركة'
      }
    ]
  }
};
