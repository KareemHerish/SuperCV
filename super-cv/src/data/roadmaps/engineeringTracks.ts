import { DetailedRoadmapTrack } from './types';

export const engineeringTracks: Record<string, DetailedRoadmapTrack> = {
  'Full Stack': {
    id: 'full-stack',
    title: 'Full Stack',
    titleAr: 'تطوير التطبيقات المتكامل',
    icon: 'layers',
    level: 'مبتدئ إلى مهندس متكامل متقدم',
    duration: '6 – 10 أشهر',
    summary: 'خريطة طريق شاملة لتطوير تطبيقات الويب الكاملة من الأساسيات إلى الواجهات الحديثة والخوادم الموزعة وقواعد البيانات والنشر السحابي والـ CI/CD.',
    officialSlug: 'full-stack',
    stages: [
      {
        number: '01',
        name: 'Internet & Frontend Core Foundations',
        nameAr: 'أساسيات الإنترنت ولغات الويب الأمامية',
        description: 'فهم بروتوكولات الإنترنت (HTTP/HTTPS, DNS) وإتقان لغات الويب الأساسية والمعايير القياسية.',
        skills: ['HTML5 Semantics', 'Modern CSS3', 'Flexbox & CSS Grid', 'JavaScript (ES2024+)', 'DOM Manipulation', 'Git & GitHub Workflow'],
        level: 'أساسي',
        projectFocus: 'بناء موقع متجاوب متعدد الصفحات بدون أطر عمل مع معايير الوصول والـ SEO'
      },
      {
        number: '02',
        name: 'Modern Frontend Ecosystem & Type Safety',
        nameAr: 'منظومة الواجهات الحديثة والأمان النمطي',
        description: 'إتقان TypeScript وأطر عمل الواجهات الحديثة مثل React 19 والتعامل مع الحالة والـ API.',
        skills: ['TypeScript Strict Mode', 'React 19 & Hooks', 'Next.js 15 (App Router)', 'Tailwind CSS', 'TanStack Query', 'Zustand / Redux Toolkit', 'Responsive UI & a11y'],
        level: 'متوسط',
        projectFocus: 'تطبيق لوحة تحكم تفاعلية مع Server Actions وتحديثات فورية وإدارة حالة شاملة'
      },
      {
        number: '03',
        name: 'Backend Runtimes, APIs & Microservices',
        nameAr: 'بيئات الخوادم وتصميم الـ APIs الموزعة',
        description: 'بناء خوادم قوية ومعمارية RESTful و GraphQL و WebSockets وتوثيق المسارات البرمجية.',
        skills: ['Node.js & Express / NestJS', 'RESTful API Standards', 'GraphQL & Apollo', 'WebSockets & SSE', 'Authentication (JWT, OAuth 2.0, Passkeys)', 'Rate Limiting & Helmet'],
        level: 'متوسط',
        projectFocus: 'خدمة خلفية لإدارة المعاملات والمستخدمين تدعم المصادقة المتقدمة والاشتراكات الحية'
      },
      {
        number: '04',
        name: 'Databases, ORMs & Data Modeling',
        nameAr: 'قواعد البيانات والتخزين والنماذج البيانية',
        description: 'تصميم قواعد البيانات العلائقية والمستندية وتحسين الاستعلامات والـ Indexes وتكامل الـ ORMs.',
        skills: ['PostgreSQL & SQL Mastery', 'Prisma & Drizzle ORM', 'MongoDB & Mongoose', 'Database Indexing & Normalization', 'ACID Transactions', 'Redis Caching & PubSub'],
        level: 'متقدم',
        projectFocus: 'نظام تجارة إلكترونية مع معاملات مالية ذرية (Atomic Transactions) وتخزين كاش بالـ Redis'
      },
      {
        number: '05',
        name: 'Testing, Code Quality & Web Security',
        nameAr: 'اختبار البرمجيات والجودة والأمن السيبراني للويب',
        description: 'ضمان استقرار التطبيقات عبر اختبارات شاملة والالتزام بمعايير أمان OWASP وحماية الثغرات.',
        skills: ['Unit Testing (Vitest / Jest)', 'E2E Testing (Playwright / Cypress)', 'OWASP Top 10 Mitigation', 'CORS, CSP, XSS & CSRF Prevention', 'ESLint, Prettier & Husky', 'Zod Schema Validation'],
        level: 'متقدم',
        projectFocus: 'تغطية شاملة للمشروع باختبارات E2E وأتمتة فحص الثغرات الأمنية في الـ Pipeline'
      },
      {
        number: '06',
        name: 'DevOps, Containers, Cloud & System Design',
        nameAr: 'الحاويات والنشر السحابي ومعمارية النظم الموزعة',
        description: 'أتمتة دورات النشر والتكامل المستمر وتشغيل الحاويات ومراقبة التطبيقات الحية في الإنتاج.',
        skills: ['Docker & Containerization', 'CI/CD Pipelines (GitHub Actions)', 'Cloud (AWS / GCP / Vercel)', 'Nginx & Reverse Proxies', 'System Design & High Availability', 'Monitoring & Sentry / Datadog'],
        level: 'احترافي',
        projectFocus: 'بنية تحتية كاملة منشورة على السحابة مع أتمتة الـ CI/CD ومراقبة الأداء والـ Logs'
      }
    ]
  },
  'Frontend': {
    id: 'frontend',
    title: 'Frontend',
    titleAr: 'تطوير واجهات المستخدم',
    icon: 'terminal',
    level: 'مبتدئ إلى كبير مهندسي واجهات',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد يغطي رحلة مهندس الواجهات بالكامل من أساسيات المتصفح إلى أطر العمل الحديثة، مؤشرات Core Web Vitals، والأنظمة المصغرة Micro-Frontends.',
    officialSlug: 'frontend',
    stages: [
      {
        number: '01',
        name: 'Browser Fundamentals, HTML & Modern CSS',
        nameAr: 'أساسيات المتصفح والـ HTML والـ CSS المتقدم',
        description: 'فهم دورة حياة تصيير المتصفح (DOM & CSSOM) والتنسيقات المتقدمة والتجاوب التام.',
        skills: ['HTML5 & Semantic Markup', 'CSS3 Grid & Flexbox', 'Responsive Web Design', 'CSS Custom Properties', 'Container Queries', 'Web Accessibility (WCAG 2.1 AA)'],
        level: 'أساسي',
        projectFocus: 'واجهة متجر إلكتروني متجاوبة بالكامل ومتوافقة مع ذوي الاحتياجات الخاصة ومعايير الوصول'
      },
      {
        number: '02',
        name: 'Modern JavaScript & Deep TypeScript',
        nameAr: 'جافاسكريبت الحديثة والتايب سكريبت المتقدم',
        description: 'إتقان حلقة الأحداث (Event Loop) والميزات الحديثة في جافاسكريبت والأنماط المعقدة في TypeScript.',
        skills: ['JavaScript (ES2024+)', 'Async/Await & Promises', 'Event Loop & Concurrency', 'TypeScript Generics', 'Utility Types & Template Literals', 'Strict Type Checking'],
        level: 'متوسط',
        projectFocus: 'مكتبة أدوات برمجية Utility Library مبنية بالـ TypeScript النقي مع دعم الشاشات المختلفة'
      },
      {
        number: '03',
        name: 'Component Frameworks & Modern Tooling',
        nameAr: 'أطر عمل المكونات وأدوات البناء السريعة',
        description: 'بناء تطبيقات أحادية وتطبيقات هجينة باستخدام React 19 ومجمعات الحزم الحديثة مثل Vite.',
        skills: ['React 19 Core & Hooks', 'Vite & Rolldown', 'Next.js 15 (SSR / SSG / ISR)', 'Tailwind CSS v4', 'Headless UI & Radix UI', 'CSS-in-JS vs Zero-Runtime'],
        level: 'متوسط',
        projectFocus: 'تطبيق ويب إنتاجي يعتمد على React 19 مع SSR لتحقيق أعلى سرعة تحميل للصفحات'
      },
      {
        number: '04',
        name: 'State Architecture & Client-Side Data',
        nameAr: 'معمارية الحالة وجلب البيانات من الخادم',
        description: 'إدارة الحالة المعقدة واستراتيجيات التخزين المؤقت وتزامن البيانات غير المتصلة.',
        skills: ['Zustand & State Machines', 'TanStack Query (React Query)', 'Redux Toolkit', 'Optimistic UI Updates', 'Client-side Caching', 'WebSocket Realtime Subscriptions'],
        level: 'متقدم',
        projectFocus: 'لوحة تحليلات مالية مباشرة تدعم الاستجابة الفورية والتحديثات اللحظية عبر الـ WebSockets'
      },
      {
        number: '05',
        name: 'Performance Tuning & Core Web Vitals',
        nameAr: 'تحسين الأداء ومؤشرات تجربة المستخدم',
        description: 'تحسين مقاييس الأداء الأساسية (LCP, INP, CLS) وتقسيم الحزم البرمجية وضغط الموارد.',
        skills: ['Core Web Vitals (LCP, INP, CLS)', 'Code Splitting & Lazy Loading', 'Lighthouse Audits & Chrome DevTools Profiling', 'Image & Asset Optimization (WebP/AVIF)', 'Service Workers & Progressive Web Apps (PWA)'],
        level: 'متقدم',
        projectFocus: 'إعادة هيكلة تطبيق ويب لتحقيق معدل 98+ في مؤشرات Lighthouse و Core Web Vitals'
      },
      {
        number: '06',
        name: 'Enterprise Architecture & Micro-Frontends',
        nameAr: 'المعمارية المؤسسية وتطبيقات المايكرو-فرونت إند',
        description: 'تصميم نظم التصميم Design Systems الموسعة وتقنيات Module Federation للفرق الكبيرة.',
        skills: ['Micro-Frontends & Module Federation', 'Design Systems & Storybook', 'Monorepos (Turborepo / Nx)', 'E2E Testing (Playwright)', 'CI/CD Automated Builds', 'Web Security (XSS, CSP, Iframe sandboxing)'],
        level: 'احترافي',
        projectFocus: 'معمارية Micro-Frontend مستقلة لنظام مصرفي تضم Storybook و Design System مشترك'
      }
    ]
  },
  'Backend': {
    id: 'backend',
    title: 'Backend',
    titleAr: 'تطوير النظم الخلفية والخوادم',
    icon: 'dns',
    level: 'متوسط إلى خبير معمارية نظم',
    duration: '6 – 9 أشهر',
    summary: 'خريطة شاملة لمعمارية الخوادم عالية الكثافة، النظم الموزعة، قواعد البيانات الكبرى، وإدارة حركة المرور المرتفعة.',
    officialSlug: 'backend',
    stages: [
      {
        number: '01',
        name: 'Backend Languages & Execution Runtimes',
        nameAr: 'لغات الخوادم وبيئات التشغيل المتقدمة',
        description: 'إتقان لغات الباك إند القوية مع فهم عميق لإدارة الذاكرة والعمليات غير المتزامنة.',
        skills: ['Node.js & TypeScript', 'Go (Golang)', 'Python (FastAPI)', 'Asynchronous I/O & Concurrency', 'POSIX & Linux CLI Skills', 'Data Structures & Algorithms'],
        level: 'أساسي',
        projectFocus: 'محرك معالجة مهام غير متزامن يتعامل مع مئات الطلبات المتوازية بكفاءة عالية'
      },
      {
        number: '02',
        name: 'API Protocols & Inter-Service Networking',
        nameAr: 'بروتوكولات الـ API والاتصال الشبكي بين الخدمات',
        description: 'تصميم واجهات برمجية قياسية وبناء قنوات اتصال فائقة السرعة للميكروسيرفسز.',
        skills: ['RESTful Best Practices', 'GraphQL & Apollo Federation', 'gRPC & Protocol Buffers', 'WebSockets & Event Streams', 'API Versioning & OpenAPI / Swagger', 'API Gateway (Kong / KrakenD)'],
        level: 'متوسط',
        projectFocus: 'بوابة خدمات مركزية API Gateway مع مصادقة موحدة وتوجيه سريع لطلبات gRPC و REST'
      },
      {
        number: '03',
        name: 'Relational & Distributed Databases',
        nameAr: 'قواعد البيانات العلائقية والموزعة وتوسعتها',
        description: 'إتقان محركات قواعد البيانات، هندسة الـ Queries، الـ Partitioning، والـ Sharding.',
        skills: ['PostgreSQL Deep Internals', 'Query Execution Plans (EXPLAIN ANALYZE)', 'Connection Pooling (PgBouncer)', 'Database Sharding & Replication', 'NoSQL (MongoDB, DynamoDB)', 'Vector Databases (pgvector)'],
        level: 'متقدم',
        projectFocus: 'قاعدة بيانات متعددة النسخ مع Read Replicas و Sharding لمعالجة ملايين السجلات'
      },
      {
        number: '04',
        name: 'Caching, In-Memory Stores & Performance',
        nameAr: 'التخزين المؤقت وحلول الذاكرة السريعة',
        description: 'استراتيجيات الكاش، معالجة الـ Cache Stampede، واستخدام الذاكرة للتزامن والأقفال الموزعة.',
        skills: ['Redis (Data Structures, Sorted Sets, Streams)', 'Cache-Aside, Write-Through & Write-Back', 'Distributed Locks (Redlock)', 'Memcached', 'Rate Limiting & Token Bucket Algorithms'],
        level: 'متقدم',
        projectFocus: 'نظام حجز تذاكر بضغط عالي يمنع الحجز المزدوج باستخدام Redis Distributed Locks'
      },
      {
        number: '05',
        name: 'Event-Driven Architecture & Message Brokers',
        nameAr: 'المعمارية الموجهة بالأحداث ووسطاء الرسائل',
        description: 'بناء تدفقات بيانات حية وخدمات مفصولة تعتمد على وسائط الرسائل وبث الأحداث.',
        skills: ['Apache Kafka & Event Streaming', 'RabbitMQ & Message Queues', 'Event Sourcing & CQRS', 'Idempotent Consumer Patterns', 'Dead Letter Queues (DLQ)', 'CDC (Change Data Capture)'],
        level: 'احترافي',
        projectFocus: 'نظام مدفوعات بنكي يعتمد على Event-Driven Architecture ومعالجة آمنة للرسائل عبر Kafka'
      },
      {
        number: '06',
        name: 'System Design, Observability & Resilience',
        nameAr: 'تصميم النظم الكبرى والموثوقية والمراقبة الحية',
        description: 'تصميم أنظمة تتحمل الأعطال (Fault-Tolerant) مع المراقبة الشاملة وقواطع الدوائر.',
        skills: ['System Design (CAP Theorem, PACELC)', 'Circuit Breakers & Retries (Resilience4j)', 'OpenTelemetry, Prometheus & Grafana', 'Distributed Tracing (Jaeger)', 'Chaos Engineering', 'Zero-Downtime Deployments'],
        level: 'احترافي',
        projectFocus: 'تصميم معمارية كاملة لمنصة مشابهة لـ Uber أو Netflix مع مخططات التحمل وتوزيع الحمل'
      }
    ]
  },
  'DevOps': {
    id: 'devops',
    title: 'DevOps',
    titleAr: 'هندسة العمليات السحابية والبنية التحتية',
    icon: 'cloud_sync',
    level: 'متوسط إلى خبير بنية تحتية',
    duration: '6 – 8 أشهر',
    summary: 'مسار معتمد لأتمتة البنية التحتية البرمجية، إدارة الحاويات عبر Kubernetes، أمان خطوط الـ CI/CD، وهندسة استقرار النظم SRE.',
    officialSlug: 'devops',
    stages: [
      {
        number: '01',
        name: 'Operating Systems & Linux Mastery',
        nameAr: 'أنظمة التشغيل والتمكن من بيئات لينكس',
        description: 'فهم عميق لنواة لينكس، إدارة الذاكرة، إدارة العمليات والشبكات الطرفية.',
        skills: ['Linux Shell & Bash Scripting', 'Systemd, Process Management & Cron', 'Network Protocols (TCP/IP, DNS, SSL/TLS, SSH)', 'Storage & File Systems (LVM, NFS)', 'Linux Performance Profiling (htop, iostat, tcpdump)'],
        level: 'أساسي',
        projectFocus: 'نص برمجي مؤتمت لتهيئة خادم لينكس جديد وتأمينه وإعداده لاستضافة التطبيقات'
      },
      {
        number: '02',
        name: 'Version Control, Git & CI/CD Pipelines',
        nameAr: 'إدارة الإصدارات وخطوط التكامل والنشر المؤتمت',
        description: 'تصميم وبناء قنوات نشر مؤتمتة تنفذ الفحوصات والاختبارات وتطلق التحديثات بدون توقف.',
        skills: ['Git Advanced Branching & GitOps', 'GitHub Actions / GitLab CI', 'Automated Testing & Linting Steps', 'Artifact Repositories (Nexus, Harbor)', 'Canary & Blue/Green Deployments', 'Secrets Management in CI/CD'],
        level: 'متوسط',
        projectFocus: 'خط CI/CD متكامل يقوم بفحص الكود، تشغيل الاختبارات، وبناء الحاويات ونشرها تلقائياً'
      },
      {
        number: '03',
        name: 'Containers & Docker Architecture',
        nameAr: 'الحاويات ومعمارية دوكر المتقدمة',
        description: 'بناء صور حاويات آمنة، خفيفة الحجم، ومحسنة مع ممارسات Multi-Stage Builds.',
        skills: ['Docker & Container Internals (Namespaces, Cgroups)', 'Multi-Stage Dockerfile Optimization', 'Container Security & Distroless Images', 'Docker Compose for Microservices', 'Container Registry Management'],
        level: 'متوسط',
        projectFocus: 'تحويل تطبيق معقد متعدد الخدمات إلى حاويات محسنة بحجم صغير جداً وأمان مرتفع'
      },
      {
        number: '04',
        name: 'Kubernetes (K8s) Cluster Administration',
        nameAr: 'إدارة وتنسيق مجمعات كوبرنيتيز',
        description: 'نشر وإدارة التطبيقات على نطاق واسع عبر K8s مع إدارة الشبكات والـ Ingress والـ Storage.',
        skills: ['Kubernetes Architecture (Control Plane & Worker Nodes)', 'Deployments, Services & Ingress Controllers', 'ConfigMaps, Secrets & Volumes (PV / PVC)', 'Horizontal Pod Autoscaler (HPA / KEDA)', 'Helm Package Manager', 'Kubernetes Network Policies'],
        level: 'متقدم',
        projectFocus: 'نشر مجمع K8s كامل مع Helm Charts وموازنة تلقائية للأحمال ومسارات آمنة عبر SSL'
      },
      {
        number: '05',
        name: 'Infrastructure as Code (IaC) & Cloud',
        nameAr: 'البنية التحتية كشفرة برمجية والمنصات السحابية',
        description: 'تهيئة وإدارة الموارد السحابية برمجياً عبر Terraform وأدوات التكوين مثل Ansible.',
        skills: ['Terraform (Modules, State Management, Workspaces)', 'Ansible Automation', 'AWS Core Services (VPC, EKS, RDS, S3, IAM)', 'Google Cloud Platform (GCP)', 'Cloud Cost Optimization & FinOps'],
        level: 'متقدم',
        projectFocus: 'إنشاء بيئة سحابية كاملة من الصفر على AWS بنقرة واحدة باستخدام كود Terraform'
      },
      {
        number: '06',
        name: 'Observability, SRE & Chaos Engineering',
        nameAr: 'المراقبة الشاملة واستقرار النظم وهندسة الفوضى',
        description: 'متابعة المؤشرات، السجلات، وتتبع الطلبات الموزعة وتطبيق مبادئ Site Reliability Engineering.',
        skills: ['Prometheus & Grafana Dashboards', 'Log Aggregation (Loki, ELK Stack)', 'Distributed Tracing (OpenTelemetry / Jaeger)', 'SLO, SLA, SLI & Error Budgets', 'Incident Response & PagerDuty', 'Chaos Engineering (Chaos Mesh)'],
        level: 'احترافي',
        projectFocus: 'منظومة مراقبة حية للمؤسسة ترسل تنبيهات تلقائية عند انخفاض جودة الخدمة عن 99.9%'
      }
    ]
  },
  'DevSecOps': {
    id: 'devsecops',
    title: 'DevSecOps',
    titleAr: 'أمن العمليات البرمجية والسحابية',
    icon: 'security',
    level: 'متوسط إلى خبير أمن نظم',
    duration: '5 – 8 أشهر',
    summary: 'دمج الأمان كعنصر أساسي في كل مرحلة من مراحل دورة تطوير البرمجيات وحماية البنية التحتية السحابية من التهديدات المتطورة.',
    officialSlug: 'devops',
    stages: [
      {
        number: '01',
        name: 'Security Culture & Linux Hardening',
        nameAr: 'ثقافة الأمان وتحصين بيئات الخوادم',
        description: 'تبني مبدأ الأمان أولاً (Shift-Left) وتأمين نواة لينكس وشبكات الاتصال.',
        skills: ['Linux Kernel Hardening & SELinux', 'OWASP Top 10 for Developers', 'PKI, TLS/SSL & Cryptography Basics', 'Firewall Configurations (iptables / nftables)', 'Security Baseline Auditing (Lynis)'],
        level: 'أساسي',
        projectFocus: 'خطة تحصين خوادم الإنتاج وفق معايير CIS Benchmarks العالمية'
      },
      {
        number: '02',
        name: 'SAST & Code Security Scanning',
        nameAr: 'الفحص الأمني للشفرات المصدرية الثابتة',
        description: 'كشف الثغرات ونقاط الضعف في الشفرة البرمجية أثناء كتابتها في محرر الأكواد والـ CI/CD.',
        skills: ['SonarQube & Static Analysis', 'Semgrep Custom Security Rules', 'GitGuardian (Secret Leak Detection)', 'CodeQL Semantic Code Analysis', 'Pre-commit Security Hooks'],
        level: 'متوسط',
        projectFocus: 'أتمتة منع تسريب مفاتيح الـ API وفحص الأكواد تلقائياً قبل دمجها في الفرع الرئيسي'
      },
      {
        number: '03',
        name: 'Software Supply Chain & SCA Security',
        nameAr: 'أمن سلسلة التوريد البرمجية والتبعيات',
        description: 'فحص الحزم والمكتبات المفتوحة المصدر وإنشاء سجلات البرمجيات SBOM.',
        skills: ['Software Composition Analysis (Snyk / Dependency-Track)', 'SBOM Generation (CycloneDX / SPDX)', 'Package Vulnerability Feeds (CVE & NVD)', 'Artifact Signing (Cosign / Sigstore)', 'Supply-chain Security (SLSA Framework)'],
        level: 'متوسط',
        projectFocus: 'إنشاء شهادة توقيع رقمية لحزم وتطبيقات المؤسسة تضمن عدم التلاعب بها'
      },
      {
        number: '04',
        name: 'Container & Kubernetes Security',
        nameAr: 'أمن الحاويات ومجمعات كوبرنيتيز',
        description: 'تأمين بيئات التشغيل المعزولة وفرض سياسات صارمة على مستوى الـ Pods والـ Network.',
        skills: ['Trivy & Clair Container Scanners', 'Distroless & Rootless Containers', 'Kubernetes Admission Controllers (OPA Gatekeeper / Kyverno)', 'NetworkPolicies Micro-segmentation', 'Falco Runtime Threat Detection'],
        level: 'متقدم',
        projectFocus: 'فرض سياسات منع تشغيل أي حاوية بامتيازات الـ Root داخل مجمع Kubernetes'
      },
      {
        number: '05',
        name: 'Infrastructure as Code Security & Secrets',
        nameAr: 'أمن البنية التحتية وإدارة الأسرار المشفرة',
        description: 'فحص قوالب Terraform وحماية الأسرار البرمجية وتدويرها تلقائياً.',
        skills: ['Checkov & tfsec for Terraform', 'HashiCorp Vault Secrets Engine', 'AWS KMS & Cloud HSM', 'Least-Privilege IAM Policies', 'Automated Secret Rotation'],
        level: 'متقدم',
        projectFocus: 'خزينة أسرار مركزية تقوم بتوليد بيانات اعتماد مؤقتة وتدويرها كل 24 ساعة'
      },
      {
        number: '06',
        name: 'Dynamic Testing, Compliance & Threat Modeling',
        nameAr: 'الاختبار الديناميكي ونمذجة التهديدات والامتثال',
        description: 'محاكاة الهجمات الحية وفحص نقاط الضعف النشطة والامتثال للمعايير العالمية (SOC2, ISO27001).',
        skills: ['DAST (OWASP ZAP / Burp Suite)', 'Threat Modeling (STRIDE Framework)', 'Cloud Security Posture Management (CSPM)', 'SOC2, ISO 27001 & PCI-DSS Compliance', 'Incident Response Playbooks'],
        level: 'احترافي',
        projectFocus: 'تقرير تقييم أمني شامل لمنصة سحابية يتضمن نمذجة التهديدات ومسار الامتثال لـ SOC2'
      }
    ]
  },
  'Software Architect': {
    id: 'software-architect',
    title: 'Software Architect',
    titleAr: 'معماري البرمجيات والأنظمة الكبرى',
    icon: 'account_tree',
    level: 'خبير تقني واستراتيجي',
    duration: '8 – 12 شهراً',
    summary: 'خريطة شاملة لقيادة القرارات الهندسية الكبرى، تصميم النظم التنافسية، المفاضلة المعمارية، وقيادة التحول الرقمي التقني.',
    officialSlug: 'software-architect',
    stages: [
      {
        number: '01',
        name: 'Design Principles & Modular Paradigms',
        nameAr: 'مبادئ التصميم والأنماط المعيارية للبرمجيات',
        description: 'تطبيق أحدث مبادئ هندسة البرمجيات لبناء شفرات قابلة للتوسع والصيانة على مدار سنوات.',
        skills: ['SOLID & GRASP Principles', 'Domain-Driven Design (DDD)', 'Clean Architecture & Hexagonal Architecture', 'Design Patterns (GoF)', 'Modularity & Coupling Metrics'],
        level: 'أساسي',
        projectFocus: 'إعادة تصميم تطبيق أحادي قديم إلى هيكل نظيف قائم على Domain-Driven Design'
      },
      {
        number: '02',
        name: 'Architectural Styles & Trade-off Analysis',
        nameAr: 'الأنماط المعمارية وتحليل المفاضلات التقنية',
        description: 'المفاضلة الدقيقة بين الأنظمة الأحادية المعيارية والميكروسيرفسز والسيرفرلس.',
        skills: ['Modular Monolith vs Microservices', 'Event-Driven Architecture (EDA)', 'Serverless & Edge Compute', 'Architectural Decision Records (ADRs)', 'Trade-off Analysis (Quality Attributes vs Cost)'],
        level: 'متوسط',
        projectFocus: 'كتابة مستند ADR تفصيلي للمفاضلة بين معمارية Microservices و Modular Monolith'
      },
      {
        number: '03',
        name: 'Distributed Data & Consistency Models',
        nameAr: 'البيانات الموزعة ونماذج الاتساق البياني',
        description: 'إدارة البيانات عبر مئات الخوادم دون فقدان الاتساق أو التضحية بالأداء العالي.',
        skills: ['Saga Pattern (Orchestration vs Choreography)', 'CQRS & Event Sourcing', 'Eventual Consistency & CRDTs', 'Distributed Transactions & 2PC', 'Database Polyglot Persistence'],
        level: 'متقدم',
        projectFocus: 'تصميم مسار معالجة طلبات مصرفية متعدد المراحل باستخدام Saga Orchestration'
      },
      {
        number: '04',
        name: 'Integration, Message Brokering & Protocols',
        nameAr: 'التكامل ووسطاء الرسائل وشبكات التواصل',
        description: 'ربط الأنظمة المتباينة وضمان تدفق ملايين الرسائل في الثانية بدون انقطاع.',
        skills: ['Enterprise Integration Patterns (EIP)', 'Kafka & Event Streaming Topologies', 'gRPC, GraphQL & REST Gateways', 'Service Mesh (Istio / Linkerd)', 'Idempotency & Replayability'],
        level: 'متقدم',
        projectFocus: 'تصميم شبكة تكامل تربط أنظمة Legacy قديمة بتطبيقات سحابية حديثة'
      },
      {
        number: '05',
        name: 'Scalability, High Availability & Resilience',
        nameAr: 'التوسع الفائق والتوافر المرتفع ومقاومة الأعطال',
        description: 'هندسة منصات تدعم ملايين المستخدمين المتزامنين مع ضمان التوافر بنسبة 99.99%.',
        skills: ['Multi-Region Active-Active Deployments', 'Disaster Recovery (RTO & RPO Objectives)', 'Cell-Based Architecture', 'Rate Limiting & Traffic Shedding', 'Circuit Breaking & Bulkheads'],
        level: 'احترافي',
        projectFocus: 'معمارية نظام دفع عالمي يعمل عبر 3 مناطق جغرافية مختلفة بنمط Multi-Region Active'
      },
      {
        number: '06',
        name: 'Governance, Security & Technical Leadership',
        nameAr: 'الحوكمة التقنية والأمن والقيادة الهندسية',
        description: 'قيادة فرق التطوير الكبرى وتوحيد المعايير التقنية وضمان توافق البنية مع استراتيجية العمل.',
        skills: ['Technology Radar & Tech Stack Governance', 'Zero-Trust Architecture & Threat Modeling', 'Engineering Cost Optimization (FinOps)', 'Technical Mentorship & C-Level Alignment', 'Evolutionary Architecture'],
        level: 'احترافي',
        projectFocus: 'رادار تقني للمؤسسة يحدد التقنيات المعتمدة، قيد التجربة، والتقنيات التي يجب استبعادها'
      }
    ]
  },
  'PostgreSQL': {
    id: 'postgresql',
    title: 'PostgreSQL',
    titleAr: 'خبير ومسؤول قواعد بيانات بوستجرس',
    icon: 'storage',
    level: 'متوسط إلى خبير بيانات',
    duration: '4 – 7 أشهر',
    summary: 'مسار احترافي متخصص في محرك PostgreSQL من البنية التحتية، الفهارس المتقدمة، فحص الأداء، التكرار، والبيانات الشعاعية pgvector.',
    officialSlug: 'postgresql',
    stages: [
      {
        number: '01',
        name: 'Architecture & Engine Internals',
        nameAr: 'معمارية محرك بوستجرس والعمليات الداخلية',
        description: 'فهم بنية الذاكرة (Shared Buffers, WAL) وعمليات المعالجة والتخزين في الأقراص.',
        skills: ['PostgreSQL Process Architecture', 'Shared Buffers & WAL (Write-Ahead Logging)', 'ACID Guarantees & MVCC', 'Vacuuming & Auto-Vacuum Tuning', 'Data Types & JSONB Storage'],
        level: 'أساسي',
        projectFocus: 'تثبيت وضبط إعدادات خادم PostgreSQL مخصص لمعالجة مكثفة للبيانات'
      },
      {
        number: '02',
        name: 'Advanced SQL, Window Functions & JSONB',
        nameAr: 'استعلامات SQL المتقدمة والدوال التحليلية',
        description: 'كتابة استعلامات عالية التعقيد واستخراج البيانات بدقة متناهية وسرعة فائقة.',
        skills: ['Window Functions & Analytics', 'Common Table Expressions (Recursive CTEs)', 'JSONB Indexing & Querying', 'Full-Text Search (tsvector / tsquery)', 'Stored Procedures & PL/pgSQL'],
        level: 'متوسط',
        projectFocus: 'لوحة تقارير مالية سريعة تستخدم استعلامات CTEs ودوال النوافذ Window Functions'
      },
      {
        number: '03',
        name: 'Indexing Strategies & Query Optimization',
        nameAr: 'استراتيجيات الفهرسة وتحسين الاستعلامات',
        description: 'استخدام أنواع الفهارس المختلفة وفحص خطط التنفيذ للقضاء على الاختناقات.',
        skills: ['B-Tree, GIN, GiST & BRIN Indexes', 'Partial & Expression Indexes', 'EXPLAIN (ANALYZE, BUFFERS) Interpretation', 'Query Cost Estimation Tuning', 'Covering Indexes (INCLUDE Clause)'],
        level: 'متقدم',
        projectFocus: 'تسريع استعلام بطيء يستغرق 8 ثوانٍ ليصبح أقل من 15ms عبر الفهرسة وتحليل الـ Plan'
      },
      {
        number: '04',
        name: 'Partitioning, Sharding & High-Throughput Scaling',
        nameAr: 'تقسيم الجداول والتوسع للبيانات الضخمة',
        description: 'إدارة الجداول التي تحتوي على مئات الملايين من السجلات عبر التقسيم الذكي.',
        skills: ['Declarative Table Partitioning (Range, List, Hash)', 'Connection Pooling (PgBouncer Tuning)', 'Foreign Data Wrappers (postgres_fdw)', 'Batch Ingestion & COPY Optimization', 'TimescaleDB for Time-Series Data'],
        level: 'متقدم',
        projectFocus: 'تقسيم جدول سجلات أحداث ضخم يحتوي على 200 مليون سجل لتحقيق أعلى سرعة بحث'
      },
      {
        number: '05',
        name: 'High Availability, Replication & Disaster Recovery',
        nameAr: 'التوافر المرتفع والتكرار والتعافي من الكوارث',
        description: 'ضمان استمرار قاعدة البيانات دون توقف عبر النسخ المتطابقة والنسخ الاحتياطي اللحظي.',
        skills: ['Streaming Replication (Physical & Logical)', 'Patroni & High Availability Clustering', 'Point-In-Time Recovery (PITR)', 'pgBackRest Backup & Restore', 'Zero-Downtime Minor Upgrades'],
        level: 'احترافي',
        projectFocus: 'بناء Cluster عالي التوافر عبر Patroni مع تحويل تلقائي في حال سقوط الخادم الرئيسي'
      },
      {
        number: '06',
        name: 'AI Integration (pgvector) & Enterprise Security',
        nameAr: 'تكامل الذكاء الاصطناعي (pgvector) والأمن المؤسسي',
        description: 'استخدام بوستجرس كقاعدة بيانات شعاعية للـ LLMs وتأمين البيانات والتشفير.',
        skills: ['pgvector (HNSW & IVFFlat Vector Indexes)', 'Semantic Similarity Queries in SQL', 'Row-Level Security (RLS)', 'Transparent Data Encryption & SSL', 'Audit Logging (pgaudit)'],
        level: 'احترافي',
        projectFocus: 'بناء محرك بحث دلالي ذكي بالذكاء الاصطناعي مع تأمين البيانات عبر Row-Level Security'
      }
    ]
  },
  'Network Engineer': {
    id: 'network-engineer',
    title: 'Network Engineer',
    titleAr: 'مهندس الشبكات والبنية التحتية السلكية واللاسلكية',
    icon: 'router',
    level: 'مبتدئ إلى خبير شبكات',
    duration: '6 – 9 أشهر',
    summary: 'خريطة شاملة لمعمارية الشبكات، بروتوكولات التوجيه، أمن الشبكات، والشبكات المعرفة برمجياً SDN.',
    officialSlug: 'devops',
    stages: [
      {
        number: '01',
        name: 'Network Fundamentals & OSI Reference Model',
        nameAr: 'أساسيات الشبكات ونموذج OSI المرجعي',
        description: 'فهم الطبقات السبع للشبكات وعناوين IP وتقسيم الشبكات الفرعية Subnetting.',
        skills: ['OSI 7-Layer & TCP/IP Models', 'IPv4 & IPv6 Addressing & Subnetting', 'Ethernet, VLANs & Trunking (802.1Q)', 'ARP, ICMP & DHCP Operations', 'Wireshark Packet Analysis'],
        level: 'أساسي',
        projectFocus: 'تصميم هيكل شبكة فرعية لمؤسسة مع تقسيم الـ VLANs وتحليل حركة المرور بـ Wireshark'
      },
      {
        number: '02',
        name: 'Routing & Switching Architecture',
        nameAr: 'بروتوكولات التوجيه والتبديل الشبكي',
        description: 'إتقان بروتوكولات التوجيه الديناميكي وإدارة المحولات المركزية.',
        skills: ['OSPF (Open Shortest Path First)', 'BGP (Border Gateway Protocol)', 'Spanning Tree Protocol (STP / RSTP)', 'First Hop Redundancy (HSRP / VRRP)', 'Cisco IOS & Juniper Junos CLI'],
        level: 'متوسط',
        projectFocus: 'إعداد شبكة متعددة الموجهات تعمل ببروتوكول OSPF مع مسارات بديلة فورية للأعطال'
      },
      {
        number: '03',
        name: 'Network Security & Firewalls',
        nameAr: 'أمن الشبكات وجدران الحماية المتقدمة',
        description: 'حماية الشبكات المؤسسية من الاختراقات وتشفير مسارات الاتصال الافتراضية VPN.',
        skills: ['Next-Generation Firewalls (Fortinet / Palo Alto)', 'IPSec & SSL VPNs', 'Access Control Lists (ACLs)', 'NAT / PAT Translations', 'IDS / IPS Systems (Snort / Suricata)'],
        level: 'متقدم',
        projectFocus: 'بناء نفق VPN مشفر يربط فرعين لمؤسسة مع تفعيل جدار حماية لمنع الهجمات الضارة'
      },
      {
        number: '04',
        name: 'Cloud Networking & Hybrid Connectivity',
        nameAr: 'شبكات السحابة والاتصال الهجين',
        description: 'تصميم الشبكات الافتراضية في AWS و Azure وربطها بالشبكات المحلية On-Premises.',
        skills: ['AWS VPC & Subnet Architecture', 'AWS Direct Connect & Transit Gateway', 'Azure VNet Peering & ExpressRoute', 'Cloud Load Balancers & Route 53', 'Hybrid Cloud Security'],
        level: 'متقدم',
        projectFocus: 'تصميم شبكة سحابية هجينة VPC متصلة بمركز بيانات محلي عبر نفق Transit Gateway'
      },
      {
        number: '05',
        name: 'Software-Defined Networking (SDN) & Automation',
        nameAr: 'الشبكات المعرفة برمجياً وأتمتة الشبكات',
        description: 'إدارة الشبكات عبر الأكواد البرمجية وواجهات الـ API باستخدام بايثون و Ansible.',
        skills: ['Python for Network Engineers (Netmiko, Scrapli)', 'Ansible Network Automation', 'RESTCONF & NETCONF Protocols', 'YANG Data Models', 'SDN Controllers & OpenFlow'],
        level: 'احترافي',
        projectFocus: 'أتمتة تحديث إعدادات 50 محول شبكة Switch دفعة واحدة باستخدام نص برمجي في بايثون'
      },
      {
        number: '06',
        name: 'Network Monitoring & Performance Troubleshooting',
        nameAr: 'المراقبة المستمرة واستكشاف أعطال الشبكات',
        description: 'تحليل أداء الشبكات، كشف الاختناقات، وتتبع حزم البيانات تحت الضغط العالي.',
        skills: ['SNMP, NetFlow & sFlow', 'SolarWinds & Nagios Monitoring', 'Jitter, Latency & Packet Loss Troubleshooting', 'QoS (Quality of Service) Traffic Shaping', 'Network Resilience & Disaster Recovery'],
        level: 'احترافي',
        projectFocus: 'لوحة مراقبة شبكية ترصد استهلاك النطاق الترددي وترسل إنذارات عند حدوث Packet Loss'
      }
    ]
  }
};
