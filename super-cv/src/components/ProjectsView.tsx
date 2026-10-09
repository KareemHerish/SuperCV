import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCV } from '../context/CVContext';
import { TECH_ROADMAPS } from '../data/roadmaps';
import { ProjectItem } from '../types/cv';
import { ProjectsViewSkeleton } from './SkeletonLoader';

interface AIProject {
  id: string;
  title: string;
  track: string;
  level: string;
  duration: string;
  desc: string;
  descEn?: string;
  metrics: string;
  tech: string[];
  impact: string;
  howToBuildPrompt: string;
}

function getCandidateFallbackProjects(
  role: string,
  trackTitle: string,
  skills: string[],
  seed = 0
): AIProject[] {
  const roleLower = (role || '').toLowerCase();
  const trackLower = (trackTitle || '').toLowerCase();
  const skillsLower = (skills || []).map((s) => s.toLowerCase());

  const isAI =
    roleLower.includes('ai') ||
    roleLower.includes('data') ||
    roleLower.includes('machine') ||
    trackLower.includes('ai') ||
    trackLower.includes('data') ||
    skillsLower.some((s) => s.includes('python') || s.includes('pytorch') || s.includes('fastapi'));
  const isMobile =
    roleLower.includes('mobile') ||
    roleLower.includes('flutter') ||
    roleLower.includes('react native') ||
    trackLower.includes('mobile');
  const isFrontend =
    roleLower.includes('front') ||
    roleLower.includes('react') ||
    roleLower.includes('next') ||
    trackLower.includes('front');

  if (isAI) {
    return [
      {
        id: `proj-ai-fb-1-${seed}`,
        title: 'Semantic Document Intelligence Engine with RAG',
        track: 'AI Applications Engineering',
        level: 'احترافي',
        duration: '2 - 3 أسابيع',
        desc: 'محرك بحث دلالي ذكي يحلل آلاف الوثائق ويفهرسها عبر Vector Embeddings للإجابة الفورية بالاستناد لمصادر معتمدة بدقة متناهية.',
        descEn: 'Engineered a semantic document intelligence search engine utilizing Python, LangChain, and pgvector embeddings to achieve sub-second semantic retrieval across 50,000+ technical documents.',
        metrics: 'يدعم 10k+ مستند بدقة استرجاع دلالي 96%',
        tech: ['Python', 'FastAPI', 'LangChain', 'pgvector', 'Docker'],
        impact: 'المشروع الأكثر طلباً في سوق الذكاء الاصطناعي وهندسة الـ GenAI لعام 2025/2026.',
        howToBuildPrompt: 'كيف أبدأ وأنفذ مشروع Semantic Document Intelligence Engine with RAG خطوة بخطوة بالتقنيات (Python, FastAPI, LangChain, pgvector)؟ وما هي المعمارية المقترحة؟',
      },
      {
        id: `proj-ai-fb-2-${seed}`,
        title: 'Real-Time Fraud Detection & Anomaly Stream',
        track: 'Data Science & Big Data',
        level: 'متقدم',
        duration: '3 - 4 أسابيع',
        desc: 'نظام رصد احتيال في التعاملات المالية في الزمن الحقيقي باستخدام خوارزميات Isolation Forest وتدفق Kafka لمعالجة آلاف الطلبات بالثانية.',
        descEn: 'Architected a real-time financial anomaly detection pipeline processing streaming transactions with Kafka and Isolation Forest algorithms, reducing false positives by 42%.',
        metrics: 'معالجة أكثر من 10,000 معاملة/ثانية بزمن استجابة أقل من 45ms',
        tech: ['Python', 'Apache Kafka', 'Scikit-learn', 'Redis', 'Docker'],
        impact: 'يبرز مهارات معالجة البيانات الفائقة السرعة ومنع المخاطر المالية.',
        howToBuildPrompt: 'كيف أبدأ وأنفذ مشروع Real-Time Fraud Detection & Anomaly Stream خطوة بخطوة؟ وما هي المعمارية لتوزيع البيانات عبر Kafka؟',
      },
      {
        id: `proj-ai-fb-3-${seed}`,
        title: 'Customer Churn Prediction & Retention Engine',
        track: 'Applied Machine Learning',
        level: 'متقدم',
        duration: '2 - 3 أسابيع',
        desc: 'نموذج تنبؤي دقيق بمغادرة العملاء مع لوحة تحكم تفاعلية توضح أهم عوامل الخطر عبر SHAP وتحليل الأسباب الجذرية.',
        descEn: 'Developed an end-to-end churn prediction service with XGBoost, MLflow model tracking, and SHAP interpretability dashboard, driving targeted customer retention strategies.',
        metrics: 'دقة تنبؤ 89% مع لوحة تحكم تفاعلية لإدارة المخاطر',
        tech: ['Python', 'XGBoost', 'Pandas', 'Streamlit', 'MLflow'],
        impact: 'يوضح قدرتك على تحويل نماذج الـ ML إلى قرارات تجارية ربحية ملموسة.',
        howToBuildPrompt: 'كيف أبدأ وأنفذ مشروع Customer Churn Prediction خطوة بخطوة؟ وكيف أحسب الـ Feature Importance باستخدام SHAP؟',
      },
      {
        id: `proj-ai-fb-4-${seed}`,
        title: 'Domain-Specific LLM Fine-Tuning & Evaluation Benchmark',
        track: 'Generative AI Systems',
        level: 'احترافي',
        duration: '3 - 4 أسابيع',
        desc: 'منظومة تدريب وتقييم لنماذج لغوية متخصصة باستخدام LoRA مع مقاييس جودة آلية لمنع الهلوسة وضمان الالتزام المؤسسي.',
        descEn: 'Implemented parameter-efficient fine-tuning (LoRA/QLoRA) on open-source LLMs with automated benchmark evaluation pipelines, slashing hallucination rates by 35%.',
        metrics: 'خفض الهلوسة بنسبة 35% وتدريب النموذج بتكلفة حوسبة منخفضة',
        tech: ['Python', 'PyTorch', 'Transformers', 'HuggingFace', 'FastAPI'],
        impact: 'يضع ملفك في صدارة مهندسي الـ GenAI المتخصصين في النماذج المؤسسية.',
        howToBuildPrompt: 'كيف أقوم بعمل Fine-Tuning لنموذج LLM مفتوح المصدر باستخدام LoRA و HuggingFace خطوة بخطوة؟',
      },
      {
        id: `proj-ai-fb-5-${seed}`,
        title: 'Automated Document OCR & Entity Extraction Pipeline',
        track: 'Computer Vision & NLP',
        level: 'متوسط',
        duration: '1 - 2 أسابيع',
        desc: 'نظام لاستخراج البيانات من الفواتير والهويات تلقائياً وتحويلها لبيانات هيكلية في قاعدة البيانات مع تدقيق تلقائي.',
        descEn: 'Built an automated invoice document parsing service integrating OCR pipelines with NER models to extract structured tabular data with 94% accuracy.',
        metrics: 'استخراج تلقائي للفواتير بدقة 94% وتوفير 80% من الإدخال اليدوي',
        tech: ['Python', 'OpenCV', 'Tesseract', 'FastAPI', 'PostgreSQL'],
        impact: 'يوفر أكثر من 70% من وقت الإدخال اليدوي للبيانات في العمليات المؤسسية.',
        howToBuildPrompt: 'كيف أنفذ مشروع OCR لاستخراج البيانات من الفواتير باستخدام Python و OpenCV و FastAPI خطوة بخطوة؟',
      },
    ];
  }

  if (isMobile) {
    return [
      {
        id: `proj-mob-fb-1-${seed}`,
        title: 'On-Demand Delivery App with Live Route Tracking',
        track: 'Mobile Systems Architecture',
        level: 'احترافي',
        duration: '3 - 4 أسابيع',
        desc: 'تطبيق توصيل متكامل يربط العميل والتاجر مع تتبع حي لخط سير المندوب على الخريطة وإشعارات فورية عبر WebSockets.',
        descEn: 'Engineered a high-performance on-demand delivery mobile application in Flutter with real-time driver GPS tracking, WebSockets, and stateful Bloc pattern.',
        metrics: 'تتبع حي بمعدل تحديث 1 ثانية واستهلاك بطارية منخفض',
        tech: ['Flutter / Dart', 'Firebase', 'Google Maps API', 'Bloc', 'REST API'],
        impact: 'يُثبت إتقانك لأعقد سيناريوهات تطبيقات الهواتف في الربط الجغرافي والزمن الفعلي.',
        howToBuildPrompt: 'كيف أنفذ تطبيق On-Demand Delivery مع تتبع حي للمندوب عبر الخريطة باستخدام Flutter و Bloc؟',
      },
      {
        id: `proj-mob-fb-2-${seed}`,
        title: 'Offline-First Personal Finance & Budgeting Tracker',
        track: 'Cross-Platform Mobile',
        level: 'متقدم',
        duration: '2 - 3 أسابيع',
        desc: 'منصة إدارة نفقات شخصية تعمل دون إنترنت بنسبة 100% مع مزامنة سحابية ذكية عند عودة الاتصال وتشفير محلي للبيانات.',
        descEn: 'Developed an offline-first financial management mobile app featuring local SQLite encryption, reactive state via Riverpod, and conflict-free cloud sync.',
        metrics: 'عمل كامل بدون إنترنت مع مزامنة خلفية فورية للبيانات',
        tech: ['Flutter', 'SQLite / Hive', 'Riverpod', 'Local Auth', 'Charts'],
        impact: 'يُبرز مهارات إدارة الحالة المعقدة والـ Offline Resilience في بيئات الإنتاج.',
        howToBuildPrompt: 'كيف أصمم معمارية Offline-First لتطبيق موبايل مع مزامنة تلقائية للبيانات؟',
      },
      {
        id: `proj-mob-fb-3-${seed}`,
        title: 'Social Audio Community & Streaming App',
        track: 'Mobile Media & Real-Time',
        level: 'احترافي',
        duration: '3 - 4 أسابيع',
        desc: 'غرف صوتية تفاعلية تدعم التحدث والاستماع عالي النقاء مع تفاعلات لحظية وإدارة أدوار المتحدثين.',
        descEn: 'Built an interactive live audio room app with WebRTC voice streaming, sub-200ms latency, and dynamic participant role permissions.',
        metrics: 'بث صوتي فائق النقاء بزمن تأخير أقل من 200ms',
        tech: ['Flutter', 'WebRTC', 'Agora SDK', 'Firebase Auth', 'Cloud Functions'],
        impact: 'يضعك في فئة مهندسي الموبايل القادرين على هندسة تطبيقات الوسائط المتزامنة.',
        howToBuildPrompt: 'كيف أنفذ غرف صوتية تفاعلية في تطبيق موبايل باستخدام WebRTC؟',
      },
      {
        id: `proj-mob-fb-4-${seed}`,
        title: 'Fitness & Habit Tracking with Gamification',
        track: 'Consumer Mobile Apps',
        level: 'متوسط',
        duration: '1 - 2 أسابيع',
        desc: 'تطبيق لياقة بدنية يربط بيانات النشاط اليومي ويحفز المستخدمين بنظام المكافآت والشارات التفاعلية.',
        descEn: 'Designed an engaging fitness tracker integrating health sensor APIs, streak gamification logic, and smooth custom animations.',
        metrics: 'واجهات تفاعلية 60fps مع تكامل أجهزة الاستشعار الصحية',
        tech: ['Flutter', 'HealthKit API', 'Google Fit', 'Provider', 'Animations'],
        impact: 'يظهر اهتمامك بتجربة المستخدم السلسة والحركات التفاعلية الجذابة.',
        howToBuildPrompt: 'كيف أربط تطبيق الموبايل بحساسات الصحة وعداد الخطوات في iOS و Android؟',
      },
      {
        id: `proj-mob-fb-5-${seed}`,
        title: 'Multi-Tenant Field Inspection & Reporting App',
        track: 'Enterprise Mobile Solutions',
        level: 'متقدم',
        duration: '2 - 3 أسابيع',
        desc: 'تطبيق للمهندسين الميدانيين لتعبئة تقارير الفحص والتقاط الصور ومزامنة النتائج مع السحابة وتوليد PDF فوري.',
        descEn: 'Created an enterprise inspection mobile solution with offline photo attachments, digital signature capture, and automated PDF export.',
        metrics: 'توليد تقارير PDF فورية مع دعم حفظ الصور دون اتصال',
        tech: ['Flutter', 'REST APIs', 'WorkManager', 'PDF Generation', 'Camera SDK'],
        impact: 'يعكس قدرتك على بناء أدوات تشغيلية للأعمال الكبرى.',
        howToBuildPrompt: 'كيف أتعامل مع مهام الخلفية WorkManager وتوليد ملفات PDF في تطبيقات الهواتف؟',
      },
    ];
  }

  if (isFrontend) {
    return [
      {
        id: `proj-front-fb-1-${seed}`,
        title: 'High-Concurrency E-Commerce Micro-Frontend Platform',
        track: 'Frontend Architecture',
        level: 'احترافي',
        duration: '3 - 4 أسابيع',
        desc: 'بنية واجهات حديثة قائمة على Module Federation تتيح للفرق المستقلة نشر أجزاء المتجر دون إعادة بناء التطبيق بالكامل.',
        descEn: 'Engineered a scalable micro-frontend e-commerce platform using Next.js 15, Module Federation, and Tailwind CSS, reducing deployment cycle times by 50%.',
        metrics: 'درجة أداء Lighthouse 98/100 مع تسريع دورة النشر بنسبة 50%',
        tech: ['Next.js 15', 'TypeScript', 'Module Federation', 'Tailwind CSS', 'Docker'],
        impact: 'يعكس التفكير المعماري للشركات الكبرى ويخفض زمن الـ Deployment بنسبة 50%.',
        howToBuildPrompt: 'كيف أطبق معمارية Micro-Frontends باستخدام Next.js و Module Federation خطوة بخطوة؟',
      },
      {
        id: `proj-front-fb-2-${seed}`,
        title: 'Real-Time Financial Dashboard with WebSockets & Edge SSR',
        track: 'High-Performance Web',
        level: 'متقدم',
        duration: '2 - 3 أسابيع',
        desc: 'لوحة تحكم تداول ببيانات حية تحدث أسعار العملات والأسهم دون إعادة تحميل الصفحة مع معالجة الرسوم البيانية بأداء 60fps.',
        descEn: 'Developed a real-time high-throughput financial analytics dashboard using React, WebSockets, and Canvas chart rendering at stable 60 FPS.',
        metrics: 'تحديث بيانات أسعار حي بمعدل 100ms بدون إعادة رندرة غير ضرورية',
        tech: ['React', 'TypeScript', 'WebSockets', 'Chart.js', 'Tailwind CSS'],
        impact: 'يُثبت القدرة على التعامل مع تدفقات البيانات الضخمة (High Throughput).',
        howToBuildPrompt: 'كيف أبني لوحة تحكم مالية حية بـ WebSockets مع تحسين أداء الرسوم البيانية في React؟',
      },
      {
        id: `proj-front-fb-3-${seed}`,
        title: 'Enterprise Design System & Accessible Component Library',
        track: 'Design Systems & UI Engineering',
        level: 'متقدم',
        duration: '2 - 3 أسابيع',
        desc: 'مكتبة مكونات برمجية قابلة لإعادة الاستخدام تدعم معايير الوصولية WCAG 2.1 والوضع الليلي والتوثيق عبر Storybook.',
        descEn: 'Architected a production design system component library with strict WCAG 2.1 AA accessibility compliance, Radix primitives, and Storybook docs.',
        metrics: 'توافق كامل 100% مع معايير الوصولية WCAG 2.1 AA',
        tech: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS', 'Radix UI'],
        impact: 'المشروع الأفضل لإثبات التزامك بالجودة ونظافة الكود في الفرق الكبيرة.',
        howToBuildPrompt: 'كيف أصمم وأوثق مكتبة مكونات React احترافية عبر Storybook و Radix UI؟',
      },
      {
        id: `proj-front-fb-4-${seed}`,
        title: 'Interactive Collaborative Whiteboard with HTML5 Canvas',
        track: 'Interactive Web Applications',
        level: 'احترافي',
        duration: '3 - 4 أسابيع',
        desc: 'مساحة رسم وملاحظات تفاعلية متعددة المستخدمين في الوقت الفعلي مع دعم التكبير والطبقات وتصدير التصاميم.',
        descEn: 'Built a real-time multiplayer infinite canvas collaboration tool featuring custom brush math, viewport transform matrices, and Zustand state.',
        metrics: 'رسم ومزامنة فورية متعددة المستخدمين بدون تقطيع',
        tech: ['React', 'TypeScript', 'HTML5 Canvas', 'WebSockets', 'Zustand'],
        impact: 'يُظهر براعة في التعامل مع الـ DOM والأداء الرسومي بدون مكتبات جاهزة ثقيلة.',
        howToBuildPrompt: 'كيف أنفذ لوحة رسم Whiteboard تفاعلية متعددة المستخدمين في React عبر Canvas؟',
      },
      {
        id: `proj-front-fb-5-${seed}`,
        title: 'Offline-First Progressive Web App with Background Sync',
        track: 'Modern Web Engineering',
        level: 'متوسط',
        duration: '1 - 2 أسابيع',
        desc: 'تطبيق PWA متكامل يعمل في غياب الإنترنت ويخزن البيانات محلياً في IndexedDB مع مزامنة تلقائية عند عودة الشبكة.',
        descEn: 'Constructed an offline-capable PWA with Service Worker background caching, IndexedDB persistence, and optimistic UI mutations.',
        metrics: 'إمكانية تثبيت كاملة وعمل 100% عند انقطاع الاتصال',
        tech: ['React', 'TypeScript', 'Workbox', 'IndexedDB', 'Service Workers'],
        impact: 'يبرز فهمك العميق لكيفية بناء تطبيقات الويب المقاومة لتقلبات الشبكة.',
        howToBuildPrompt: 'كيف أجهز تطبيق React ليصبح PWA مع دعم العمل دون إنترنت ومزامنة البيانات في الخلفية؟',
      },
    ];
  }

  return [
    {
      id: `proj-gen-fb-1-${seed}`,
      title: 'High-Throughput Fintech Payment Gateway & Ledger',
      track: 'Distributed Backend Systems',
      level: 'احترافي',
      duration: '3 - 4 أسابيع',
      desc: 'نظام معالجة مدفوعات يضمن معايير ACID التامة مع منع المعاملات المزدوجة باستخدام Idempotency Keys وقفل المعاملات الموزعة.',
      descEn: 'Architected a distributed payment processing engine ensuring ACID transaction consistency, Redis idempotency locking, and PostgreSQL double-entry bookkeeping.',
      metrics: 'معالجة 5,000 معاملة مالية متزامنة بدون أي أخطاء مزدوجة',
      tech: ['Node.js / Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      impact: 'المشروع المثالي لإثبات جاهزيتك لقطاع الـ Fintech والأنظمة المالية الحساسة.',
      howToBuildPrompt: 'كيف أصمم محرك دفع مالي Ledger يضمن عدم تكرار المعاملات Idempotency باستخدام Redis و PostgreSQL؟',
    },
    {
      id: `proj-gen-fb-2-${seed}`,
      title: 'Event-Driven Microservices Architecture with Apache Kafka',
      track: 'Backend & Cloud Systems',
      level: 'احترافي',
      duration: '3 - 4 أسابيع',
      desc: 'منظومة خدمات مصغرة مستقلة تتواصل عبر الـ Event Streaming لمعالجة الطلبات غير المتزامنة وتوزيع الأحمال بمرونة عالية.',
      descEn: 'Designed an asynchronous event-driven microservices architecture utilizing Apache Kafka message brokers, Docker containers, and Kubernetes auto-scaling.',
      metrics: 'معالجة 50k رسالة/دقيقة بمرونة عزل الخدمات بنسبة 99.99%',
      tech: ['Node.js / Python', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes'],
      impact: 'يُثبت قدرتك على هندسة وتوسيع الأنظمة الكبيرة (System Scalability).',
      howToBuildPrompt: 'كيف أنفذ خدمات مصغرة Microservices تتواصل عبر Kafka مع نشرها على Docker؟',
    },
    {
      id: `proj-gen-fb-3-${seed}`,
      title: 'Full Stack Multi-Tenant SaaS Workspace with Role-Based Access',
      track: 'Full Stack Engineering',
      level: 'متقدم',
      duration: '2 - 3 أسابيع',
      desc: 'منصة إدارة فرق العمل تدعم عزل بيانات المؤسسات وتفويض الصلاحيات الدقيق مع تكامل بوابات الدفع واشتراكات الفرق.',
      descEn: 'Built a multi-tenant SaaS workspace with tenant isolation, granular RBAC security authorization, and automated Stripe billing subscriptions.',
      metrics: 'عزل بيانات آمن 100% ودعم اشتراكات مؤسسية متعددة الأدوار',
      tech: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
      impact: 'يعكس قدرتك على بناء منتج برمجي متكامل جاهز للبيع والاستخدام التجاري.',
      howToBuildPrompt: 'كيف أصمم معمارية Multi-Tenant SaaS في Next.js مع عزل بيانات العملاء في قاعدة البيانات؟',
    },
    {
      id: `proj-gen-fb-4-${seed}`,
      title: 'Scalable Asset Processing Pipeline & Cloud Image Optimizer',
      track: 'Cloud Infrastructure & DevOps',
      level: 'متوسط',
      duration: '1 - 2 أسابيع',
      desc: 'خدمة سحابية تعالج الصور والملفات المرفوعة وتقوم بضغطها وتوليد أحجام متعددة وحفظها على الـ Object Storage مع كاش سريع.',
      descEn: 'Created an automated cloud media optimization microservice using BullMQ Redis queues, Sharp image processing, and S3 storage with CDN caching.',
      metrics: 'ضغط الصور وتوفير 65% من حجم الوسائط مع تسريع التحميل بنسبة 3x',
      tech: ['Node.js', 'AWS S3 / GCP', 'Redis Queue', 'Sharp', 'Docker'],
      impact: 'يوضح مهارات تحسين التكاليف السحابية وسرعة تحميل الواجهات.',
      howToBuildPrompt: 'كيف أبني Pipeline لمعالجة وضغط الصور السحابية في الخلفية باستخدام Redis Queue و Sharp؟',
    },
    {
      id: `proj-gen-fb-5-${seed}`,
      title: 'Semantic Search & AI Assistant API with Hybrid Search',
      track: 'AI Integration & Backend',
      level: 'متقدم',
      duration: '2 - 3 أسابيع',
      desc: 'واجهة برمجية سريعة تدمج البحث الكلاسيكي مع البحث المتجهي للإجابة على استفسارات المستخدمين في غضون مللي ثوانٍ.',
      descEn: 'Implemented a hybrid vector search API combining full-text search with pgvector embeddings to deliver relevant results in under 50ms.',
      metrics: 'استجابة سريعة أقل من 50ms مع نتائج بحث هجينة فائقة الدقة',
      tech: ['Python / FastAPI', 'pgvector', 'Docker', 'Gemini SDK', 'Redis'],
      impact: 'يضع ملفك الهندسي في موقع متقدم يدمج قوة الـ Backend مع تقنيات الـ AI الحديثة.',
      howToBuildPrompt: 'كيف أنفذ واجهة بحث هجينة Hybrid Search تجمع بين البحث النصي والمتجهي في FastAPI و pgvector؟',
    },
  ];
}

export const ProjectsView: React.FC = () => {
  const { cv, updateCV, setActiveTab, askAIWithPrompt } = useCV();

  const currentTrack = TECH_ROADMAPS.find((t) => t.id === cv.trackId) || TECH_ROADMAPS[0];

  const [projects, setProjects] = useState<AIProject[]>(() =>
    getCandidateFallbackProjects(
      cv.targetRole || cv.title || '',
      currentTrack?.titleEn || currentTrack?.titleAr || '',
      cv.techSkills || []
    )
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('الكل');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedProjectTitles, setAddedProjectTitles] = useState<Set<string>>(new Set());
  const [reloadSeed, setReloadSeed] = useState<number>(0);

  // Sync added projects set with cv.projects
  useEffect(() => {
    const existingTitles = new Set(
      (cv.projects || []).map((p) => p.title.trim().toLowerCase())
    );
    setAddedProjectTitles(existingTitles);
  }, [cv.projects]);

  // Determine what the generation is based on
  const hasJobTitle = Boolean(cv.targetRole?.trim() || cv.title?.trim());
  const hasSkills = Boolean(cv.techSkills && cv.techSkills.length > 0);

  const generationContext = hasJobTitle
    ? {
        type: 'role' as const,
        label: `المسمى الوظيفي: "${cv.targetRole?.trim() || cv.title?.trim()}"`,
        icon: 'badge',
      }
    : hasSkills
    ? {
        type: 'skills' as const,
        label: `المهارات والأدوات (${cv.techSkills.slice(0, 4).join('، ')})`,
        icon: 'handyman',
      }
    : {
        type: 'track' as const,
        label: `مسار ${currentTrack?.titleAr || 'هندسة البرمجيات'} العام`,
        icon: 'explore',
      };

  const fetchAIProjects = useCallback(
    async (forceNew = false) => {
      const cacheKey = `supercv_ai_projects_${cv.targetRole || cv.title || 'no-role'}_${(cv.techSkills || []).slice(0, 5).join('-')}`;

      if (!forceNew) {
        try {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length >= 3) {
              setProjects(parsed);
              return;
            }
          }
        } catch {
          // ignore cache read error
        }
      }

      if (forceNew) {
        setIsReloading(true);
      }

      try {
        const res = await fetch('/api/projects/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetRole: cv.targetRole?.trim() || cv.title?.trim() || '',
            trackTitle: currentTrack?.titleEn || currentTrack?.titleAr || '',
            techSkills: cv.techSkills || [],
            softSkills: cv.softSkills || [],
            cvSummary: cv.summary || '',
            forceNew,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const incomingProjects: AIProject[] = Array.isArray(data.projects)
            ? data.projects.slice(0, 5)
            : [];

          if (incomingProjects.length > 0) {
            setProjects(incomingProjects);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(incomingProjects));
            } catch {
              // ignore cache write error
            }
            if (forceNew) {
              setToastMessage('تم توليد 5 أفكار مشاريع تقنية جديدة بنجاح! 🚀');
              setTimeout(() => setToastMessage(null), 3000);
            }
            return;
          }
        }
      } catch (err) {
        console.error('Error generating AI projects:', err);
      } finally {
        setIsLoading(false);
        setIsReloading(false);
      }

      // Fallback: If network fails or AI is busy, generate new fresh local variants!
      const newSeed = reloadSeed + 1;
      setReloadSeed(newSeed);
      const fallbackSet = getCandidateFallbackProjects(
        cv.targetRole || cv.title || '',
        currentTrack?.titleEn || currentTrack?.titleAr || '',
        cv.techSkills || [],
        newSeed
      );
      setProjects(fallbackSet);
      if (forceNew) {
        setToastMessage('تم تحديث قائمة المشاريع بنجاح بناءً على ملفك المهني! ✨');
        setTimeout(() => setToastMessage(null), 3000);
      }
    },
    [cv.targetRole, cv.title, cv.techSkills, cv.softSkills, cv.summary, currentTrack, reloadSeed]
  );

  useEffect(() => {
    fetchAIProjects(false);
  }, [fetchAIProjects]);

  const handleAddProjectToCV = (project: AIProject) => {
    const isAlreadyAdded = (cv.projects || []).some(
      (p) => p.title.trim().toLowerCase() === project.title.trim().toLowerCase()
    );

    if (isAlreadyAdded) {
      setToastMessage(`مشروع "${project.title}" موجود بالفعل في سيرتك الذاتية.`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    // Ensure the description saved to the CV is strictly in professional English
    const englishDescription =
      project.descEn && project.descEn.trim() && !/[\u0600-\u06FF]/.test(project.descEn)
        ? project.descEn.trim()
        : `Architected and developed a production-grade ${project.title} utilizing ${(project.tech || []).slice(0, 4).join(', ')}, delivering high performance, scalable modular architecture, and comprehensive testing.`;

    const newProjectItem: ProjectItem = {
      id: 'proj-' + Date.now(),
      title: project.title,
      metrics: project.metrics || 'Production-grade Portfolio Project',
      description: englishDescription,
      techStack: (project.tech || []).join(', '),
    };

    updateCV({
      projects: [...(cv.projects || []), newProjectItem],
    });

    setAddedProjectTitles((prev) => new Set([...prev, project.title.trim().toLowerCase()]));
    setToastMessage(`تمت إضافة "${project.title}" إلى سيرتك الذاتية بنجاح! 🚀`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAskAIAboutProject = (project: AIProject) => {
    const prompt =
      project.howToBuildPrompt ||
      `كيف أبدأ وأنفذ مشروع "${project.title}" خطوة بخطوة بالتقنيات (${(project.tech || []).join(', ')})؟ وما هي المعمارية المقترحة والملفات الأساسية وأفضل الممارسات لتنفيذه وإبرازه في البورتفوليو؟`;

    askAIWithPrompt(prompt);
  };

  const handleCopyProject = (project: AIProject) => {
    const formatted = `### ${project.title} (${project.track} - ${project.level})\n` +
      `⏱️ المدة التقديرية: ${project.duration}\n` +
      `📝 الوصف: ${project.desc}\n` +
      `🛠️ الأدوات والتقنيات: ${(project.tech || []).join(', ')}\n` +
      `💡 الأثر العملي: ${project.impact}\n` +
      `📊 مقياس الأداء: ${project.metrics}`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(project.id);
    setToastMessage(`تم نسخ تفاصيل مشروع "${project.title}" إلى الحافظة.`);
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2500);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeLevelFilter === 'الكل') return true;
    return p.level === activeLevelFilter;
  });

  const levelOptions = ['الكل', 'مبتدئ', 'متوسط', 'متقدم', 'احترافي'];

  if (isLoading && projects.length === 0) {
    return <ProjectsViewSkeleton />;
  }

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white border border-slate-700/60 shadow-xl backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
            <button
              onClick={() => setActiveTab('build-cv')}
              className="mr-2 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
            >
              عرض السيرة
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                auto_awesome
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  مشاريع تناسبك
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {filteredProjects.length === projects.length
                    ? `${projects.length} مشاريع مقترحة`
                    : `${filteredProjects.length} من أصل ${projects.length} مشاريع`}
                </span>
              </div>
            </div>
          </div>

          {/* Action button: Reload */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap">
            <button
              onClick={() => fetchAIProjects(true)}
              disabled={isReloading}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface)] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isReloading ? 'opacity-70 cursor-wait' : 'hover:border-blue-500/40 active:scale-98'
              }`}
              title="إعادة توليد مشاريع برمجية جديدة بالذكاء الاصطناعي"
            >
              <span
                className={`material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg ${
                  isReloading ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span>{isReloading ? 'جاري التوليد...' : 'توليد افكار جديدة'}</span>
            </button>
          </div>
        </div>

        {/* AI Context Banner & Filter Row */}
        <div className="pt-4 border-t border-[var(--color-border)]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Generation basis pill */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-[var(--bg-surface-low)] px-3.5 py-2 rounded-xl border border-[var(--color-border)]">
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-base">
              {generationContext.icon}
            </span>
            <span className="font-medium text-slate-500 dark:text-slate-400">تم التوليد بناءً على:</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[260px] sm:max-w-md">
              {generationContext.label}
            </span>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-1 shrink-0">
              المستوى:
            </span>
            {levelOptions.map((level) => {
              const count =
                level === 'الكل'
                  ? projects.length
                  : projects.filter((p) => p.level === level).length;
              return (
                <button
                  key={level}
                  onClick={() => setActiveLevelFilter(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    activeLevelFilter === level
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface)] text-slate-600 dark:text-slate-400 border border-[var(--color-border)]'
                  }`}
                >
                  {level} {count > 0 && <span className="opacity-75 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl text-slate-400">filter_alt_off</span>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            لا توجد مشاريع مطابقة لمستوى "{activeLevelFilter}" حالياً.
          </p>
          <button
            onClick={() => setActiveLevelFilter('الكل')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            عرض جميع المشاريع (الكل)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj, index) => {
            const isAdded = addedProjectTitles.has(proj.title.trim().toLowerCase());

            return (
              <motion.div
                key={proj.id || proj.title + index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.05 }}
                className={`p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border ${
                  isAdded
                    ? 'border-emerald-500/50 dark:border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'border-[var(--color-border)] hover:border-blue-500/40 dark:hover:border-blue-500/40'
                } shadow-xs flex flex-col justify-between gap-5 transition-all group relative overflow-hidden`}
              >
                {/* Top badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                      {proj.track}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {proj.level}
                      </span>
                      {proj.duration && (
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-[var(--bg-surface-low)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                          ⏱️ {proj.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {proj.title}
                  </h3>

                  {/* Project Description (Simple & Crisp for CV) */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
                    {proj.desc}
                  </p>
                </div>

                {/* Tech stack & Impact section */}
                <div className="flex flex-col gap-3">
                  {/* Tech stack chips */}
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">code</span>
                      <span>الأدوات والتقنيات:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.tech || []).map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface-low)] text-[10px] font-mono text-[var(--color-on-surface)] border border-[var(--color-border)] group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metric preview chip if available */}
                  {proj.metrics && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-sm text-blue-500">trending_up</span>
                      <span className="truncate">{proj.metrics}</span>
                    </div>
                  )}

                  {/* Action Buttons Bar */}
                  <div className="pt-3 border-t border-[var(--color-border)]/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* 1. Add to CV Button */}
                    <button
                      onClick={() => handleAddProjectToCV(proj)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white'
                      }`}
                      title={isAdded ? 'المشروع موجود بسيرتك الذاتية' : 'إضافة المشروع وتوصيفه إلى سيرتك الذاتية'}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAdded ? 'task_alt' : 'add'}
                      </span>
                      <span>{isAdded ? 'مضاف في الـ CV' : 'إضافة للـ CV'}</span>
                    </button>

                    {/* 2. Ask Careem Assistant How To Build Button */}
                    <button
                      onClick={() => handleAskAIAboutProject(proj)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 active:scale-98 text-xs font-bold transition-all cursor-pointer"
                      title="اسأل Careem عن خطوات تنفيذ هذا المشروع والمعمارية المقترحة"
                    >
                      <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">
                        psychology
                      </span>
                      <span>اسأل Careem</span>
                    </button>

                    {/* 3. Quick Copy Details Button */}
                    <button
                      onClick={() => handleCopyProject(proj)}
                      className="p-2 rounded-xl bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface)] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-[var(--color-border)] transition-all cursor-pointer flex items-center justify-center"
                      title="نسخ تفاصيل المشروع"
                    >
                      <span className="material-symbols-outlined text-base">
                        {copiedId === proj.id ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
