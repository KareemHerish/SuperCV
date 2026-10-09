import { DetailedRoadmapTrack } from './types';

export const aiDataTracks: Record<string, DetailedRoadmapTrack> = {
  'AI Engineer': {
    id: 'ai-engineer',
    title: 'AI Engineer',
    titleAr: 'مهندس تطبيقات الذكاء الاصطناعي',
    icon: 'psychology',
    level: 'متوسط إلى خبير ذكاء اصطناعي',
    duration: '6 – 9 أشهر',
    summary: 'خريطة شاملة لبناء تطبيقات الذكاء الاصطناعي التوليدي، معمارية الـ RAG، والوكلاء الأذكياء المتعددي الأدوار (Multi-Agent Systems).',
    officialSlug: 'ai-engineer',
    stages: [
      {
        number: '01',
        name: 'Python Ecosystem & AI Fundamentals',
        nameAr: 'بيئة بايثون وأساسيات نماذج الذكاء الاصطناعي',
        description: 'إتقان لغة بايثون للذكاء الاصطناعي والتعامل مع واجهات برمجة النماذج اللغوية الكبيرة.',
        skills: ['Python 3.12+', 'NumPy & Pandas', 'OpenAI & Google GenAI SDKs', 'Tokenization & Context Windows', 'Prompt Engineering Patterns', 'Structured JSON Outputs'],
        level: 'أساسي',
        projectFocus: 'تطبيق توليد محتوى ذكي مع مخرجات JSON صارمة ومضمونة التوافق مع النماذج'
      },
      {
        number: '02',
        name: 'Embeddings & Vector Databases',
        nameAr: 'التمثيل الشعاعي وقواعد البيانات الشعاعية',
        description: 'تحويل النصوص والبيانات إلى متجهات وفهرستها للبحث الدلالي الفائق.',
        skills: ['Vector Embeddings (text-embedding-3, Cohere)', 'Vector DBs (Pinecone, Qdrant, Chroma, Weaviate)', 'pgvector with PostgreSQL', 'Distance Metrics (Cosine, Dot Product, Euclidean)', 'HNSW & IVFFlat Indexing'],
        level: 'متوسط',
        projectFocus: 'محرك بحث دلالي مخصص يبحث في آلاف المستندات بسرعة استجابة تقل عن 50ms'
      },
      {
        number: '03',
        name: 'Advanced RAG Architectures',
        nameAr: 'معمارية استرجاع المعلومات الموسعة المتقدمة',
        description: 'بناء خطوط أنابيب RAG متقدمة تتغلب على الهلوسة وتسترجع المعلومات بدقة بالغة.',
        skills: ['Chunking Strategies (Semantic, Recursive, Sliding)', 'Hybrid Search (Keyword + Dense Vector)', 'Reranking Models (Cohere Rerank, BGE)', 'Parent Document & Sentence-Window Retrieval', 'Hypothetical Document Embeddings (HyDE)'],
        level: 'متقدم',
        projectFocus: 'نظام RAG متكامل لمؤسسة مالية يقرأ التقارير السنوية ويجيب بدقة موثقة بالمصادر'
      },
      {
        number: '04',
        name: 'LLM Orchestration & Frameworks',
        nameAr: 'أطر إدارة وتوجيه النماذج التوليدية',
        description: 'ربط النماذج بالأدوات وقواعد المعرفة وبناء تدفقات منطقية متقدمة.',
        skills: ['LangChain Core & LCEL', 'LlamaIndex Data Framework', 'Tool Calling & Function Calling', 'Memory & State Management', 'Routing & Fallback Chains', 'Semantic Cache (Redis / GPTCache)'],
        level: 'متقدم',
        projectFocus: 'مساعد ذكي يدمج بين البحث في قاعدة المعرفة والاتصال بـ APIs خارجية لحجز مواعيد'
      },
      {
        number: '05',
        name: 'Autonomous AI Agents & Multi-Agent Swarms',
        nameAr: 'الوكلاء الأذكياء المستقلون والأنظمة التعاونية',
        description: 'بناء وكلاء يقومون بالتفكير، التخطيط، والتعاون لحل المشكلات المعقدة.',
        skills: ['LangGraph & State Graphs', 'CrewAI Multi-Agent Teams', 'ReAct Prompting Pattern', 'Human-in-the-Loop Workflows', 'Long-term Agent Memory', 'Self-Reflective Agents'],
        level: 'احترافي',
        projectFocus: 'فريق وكلاء أذكياء يتعاونون: باحث، كاتب، ومدقق لإنتاج تقارير تحليلية شاملة'
      },
      {
        number: '06',
        name: 'Evaluation, Production Serving & Safety',
        nameAr: 'التقييم الشامل والنشر في الإنتاج وأمان الذكاء الاصطناعي',
        description: 'قياس دقة النماذج، منع ثغرات الـ Prompt Injection، ونشر الحلول على السحابة.',
        skills: ['Ragas & TruLens Evaluation Frameworks', 'LLM Guardrails (NeMo Guardrails)', 'Prompt Injection & Jailbreak Defense', 'vLLM / Ollama for Local Inference', 'OpenTelemetry for LLM Observability', 'Cost & Latency Optimization'],
        level: 'احترافي',
        projectFocus: 'منصة إنتاجية آمنة للذكاء الاصطناعي تدعم مراقبة التكاليف وجودة الإجابات ومكافحة التهديدات'
      }
    ]
  },
  'Machine Learning': {
    id: 'machine-learning',
    title: 'Machine Learning',
    titleAr: 'تعلم الآلة والنمذجة الرياضية',
    icon: 'smart_toy',
    level: 'مبتدئ إلى باحث ومهندس ML',
    duration: '6 – 10 أشهر',
    summary: 'خريطة شاملة لفهم الرياضيات والإحصاء وبناء وتدريب النماذج الكلاسيكية والشبكات العصبية العميقة.',
    officialSlug: 'ai-data-scientist',
    stages: [
      {
        number: '01',
        name: 'Mathematics, Linear Algebra & Probability',
        nameAr: 'الرياضيات، الجبر الخطي، والاحتمالات والإحصاء',
        description: 'الأساس الرياضي النظري الضروري لفهم خوارزميات تعلم الآلة والتحسين الرياضي.',
        skills: ['Linear Algebra (Vectors, Matrices, Eigenvalues)', 'Multivariate Calculus & Gradients', 'Probability Distributions & Bayes Theorem', 'Descriptive & Inferential Statistics', 'Hypothesis Testing & p-values'],
        level: 'أساسي',
        projectFocus: 'بناء خوارزمية انحدار خطي من الصفر باستخدام الرياضيات وبايثون بدون مكتبات ML'
      },
      {
        number: '02',
        name: 'Data Manipulation & Exploratory Analysis',
        nameAr: 'معالجة البيانات والتحليل الاستكشافي EDA',
        description: 'تنظيف البيانات، التعامل مع القيم المفقودة، وهندسة الخصائص Feature Engineering.',
        skills: ['Pandas & NumPy Deep Operations', 'Matplotlib & Seaborn Visualizations', 'Handling Missing Values & Outliers', 'Feature Scaling & Normalization', 'Categorical Encoding (One-Hot, Target)'],
        level: 'أساسي',
        projectFocus: 'تحليل شامل ومفصل لمجموعة بيانات ضخمة مع تنظيفها واستخلاص الخصائص المؤثرة'
      },
      {
        number: '03',
        name: 'Classical Machine Learning Algorithms',
        nameAr: 'خوارزميات تعلم الآلة الكلاسيكية',
        description: 'إتقان خوارزميات التعلم الموجه وغير الموجه وفهم مقاييس التقييم.',
        skills: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Gradient Boosting (XGBoost, LightGBM, CatBoost)', 'K-Means & Hierarchical Clustering', 'PCA & Dimensionality Reduction', 'Scikit-Learn Mastery'],
        level: 'متوسط',
        projectFocus: 'نموذج للتنبؤ بأسعار المنازل أو التخلف عن سداد القروض بدقة تتجاوز 93%'
      },
      {
        number: '04',
        name: 'Model Validation, Hyperparameter Tuning & Metrics',
        nameAr: 'تقييم النماذج وضبط المعاملات والمقاييس',
        description: 'منع ظاهرة الإفراط في المطابقة (Overfitting) والتحقق المتقاطع وضبط المعاملات.',
        skills: ['Cross-Validation Strategies (K-Fold, Stratified)', 'ROC-AUC, Precision, Recall & F1-Score', 'Hyperparameter Optimization (Optuna / GridSearchCV)', 'Bias-Variance Tradeoff', 'SHAP & LIME for Model Explainability'],
        level: 'متقدم',
        projectFocus: 'ضبط معاملات نموذج التصنيف باستخدام Optuna مع تفسير قراراته عبر مكتبة SHAP'
      },
      {
        number: '05',
        name: 'Deep Learning & Neural Networks',
        nameAr: 'التعلم العميق والشبكات العصبية الاصطناعية',
        description: 'بناء وتدريب الشبكات العصبية باستخدام PyTorch وفهم خوارزميات التحسين.',
        skills: ['PyTorch Core (Tensors, Autograd, Modules)', 'Backpropagation & Loss Functions', 'Optimizers (AdamW, SGD with Momentum)', 'Convolutional Neural Networks (CNNs)', 'Recurrent Networks (LSTM / GRU)', 'Transfer Learning'],
        level: 'متقدم',
        projectFocus: 'شبكة عصبية عميقة في PyTorch لتصنيف الصور الطبية مع استخدام Transfer Learning'
      },
      {
        number: '06',
        name: 'Transformers & Fine-Tuning Foundations',
        nameAr: 'معمارية الـ Transformers والضبط الدقيق للنماذج',
        description: 'فهم آلية الانتباه الذاتي Self-Attention وتطبيق تقنيات الضبط الدقيق الفعال للنماذج.',
        skills: ['Self-Attention & Multi-Head Attention', 'Hugging Face Transformers Library', 'PEFT & LoRA (Low-Rank Adaptation)', 'Model Quantization (INT8, INT4)', 'Dataset Preparation for Fine-Tuning'],
        level: 'احترافي',
        projectFocus: 'إعادة تدريب وضبط دقيق لنموذج لغوي مفتوح المصدر على بيانات شركة طبية أو قانونية'
      }
    ]
  },
  'AI and Data Scientist': {
    id: 'ai-data-scientist',
    title: 'AI and Data Scientist',
    titleAr: 'عالم الذكاء الاصطناعي والبيانات',
    icon: 'neurology',
    level: 'متقدم إلى كبير علماء بيانات',
    duration: '8 – 12 شهراً',
    summary: 'مسار متكامل يجمع بين الاستدلال الإحصائي، النمذجة الرياضية المتقدمة، وبناء حلول الذكاء الاصطناعي المعقدة للأعمال.',
    officialSlug: 'ai-data-scientist',
    stages: [
      {
        number: '01',
        name: 'Advanced Statistical Inference & Experimentation',
        nameAr: 'الاستدلال الإحصائي المتقدم وتصميم التجارب',
        description: 'تصميم تجارب الـ A/B Testing واختبار الفرضيات وتحليل التباين والارتباط السببي.',
        skills: ['A/B Testing & Sample Size Calculation', 'Bayesian Statistics & MCMC', 'Causal Inference & Propensity Scoring', 'Parametric & Non-Parametric Tests', 'Multivariate Regression Models'],
        level: 'أساسي',
        projectFocus: 'تصميم وتشغيل تجربة A/B Testing كاملة لمنصة تجارة إلكترونية وقياس الأثر المالي بدقة'
      },
      {
        number: '02',
        name: 'Scientific Python & Big Data Computing',
        nameAr: 'حوسبة البيانات العلمية والضخمة في بايثون',
        description: 'معالجة مجموعات البيانات الكبرى باستخدام أدوات الحوسبة المتوازية والموزعة.',
        skills: ['Polars & DuckDB for High-Speed Data', 'PySpark & Distributed DataFrames', 'NumPy Matrix Operations', 'Scipy Scientific Computing', 'Data Pipeline Automation'],
        level: 'متوسط',
        projectFocus: 'معالجة وتنظيف 50 مليون سجل مالي باستخدام Polars و DuckDB في ثوانٍ معدودة'
      },
      {
        number: '03',
        name: 'Predictive Modeling & Ensemble Methods',
        nameAr: 'النمذجة التنبؤية وطرق التجميع المتقدمة',
        description: 'بناء نماذج تنبؤية تنافسية باستخدام خوارزميات التجميع المتقدمة وتقنيات Stacking.',
        skills: ['Ensemble Stacking & Blending', 'Time-Series Forecasting (Prophet, ARIMA, TFT)', 'Survival Analysis', 'Anomaly Detection (Isolation Forests, One-Class SVM)', 'Feature Importance & Selection'],
        level: 'متقدم',
        projectFocus: 'نموذج تنبؤي دقيق بالسلاسل الزمنية لمبيعات التجزئة لعام كامل مع تحديد الأنماط الموسمية'
      },
      {
        number: '04',
        name: 'Modern NLP, Vision & Generative AI',
        nameAr: 'معالجة اللغات الطبيعية والرؤية الحاسوبية والـ GenAI',
        description: 'تطبيق نماذج الذكاء الاصطناعي الحديثة في معالجة المستندات وتحليل الصور والصوتيات.',
        skills: ['Transformer Models (BERT, RoBERTa, CLIP)', 'Computer Vision (YOLO, Vision Transformers)', 'Topic Modeling & Semantic Clustering', 'Multimodal Foundation Models', 'Retrieval-Augmented Generation (RAG)'],
        level: 'متقدم',
        projectFocus: 'نظام فحص آلي للمستندات يدمج بين استخراج النصوص والتحليل الدلالي والتصنيف الذاتي'
      },
      {
        number: '05',
        name: 'Model Interpretation & Ethical AI Governance',
        nameAr: 'تفسير النماذج وحوكمة الذكاء الاصطناعي الأخلاقي',
        description: 'ضمان عدالة النماذج ومنع التحيز والامتثال للوائح الذكاء الاصطناعي العالمية.',
        skills: ['Fairness & Bias Auditing in ML', 'Explainable AI (XAI) with SHAP', 'Model Cards & Datasheets for Datasets', 'Data Privacy (Differential Privacy, Anonymization)', 'EU AI Act Compliance Guidelines'],
        level: 'احترافي',
        projectFocus: 'تدقيق أمني وأخلاقي لنموذج توظيف يثبت خلوه من التحيز الجندري أو العمري'
      },
      {
        number: '06',
        name: 'Data Science to Production & Value Creation',
        nameAr: 'نقل نماذج البيانات للإنتاج وصناعة القيمة للمؤسسة',
        description: 'تحويل النماذج النظرية إلى خدمات برمجية نشطة تدر أرباحاً وتخفض التكاليف التشغيلية.',
        skills: ['MLflow & Experiment Tracking', 'FastAPI Microservice Deployment', 'Model Drift & Data Drift Monitoring', 'Executive Data Storytelling', 'ROI & KPI Measurement for AI Projects'],
        level: 'احترافي',
        projectFocus: 'نشر نموذج تنبؤي في الإنتاج عبر واجهة API ومراقبته دورياً ضد انحراف البيانات Data Drift'
      }
    ]
  },
  'MLOps': {
    id: 'mlops',
    title: 'MLOps',
    titleAr: 'مهندس عمليات ونشر تعلم الآلة',
    icon: 'precision_manufacturing',
    level: 'متوسط إلى خبير بنية تحتية للـ AI',
    duration: '5 – 8 أشهر',
    summary: 'أتمتة دورة حياة نماذج تعلم الآلة من التدريب والمصادقة إلى النشر، المراقبة اللحظية، وإعادة التدريب التلقائي.',
    officialSlug: 'ai-data-scientist',
    stages: [
      {
        number: '01',
        name: 'Reproducibility, Git & Data Versioning',
        nameAr: 'إمكانية إعادة الإنتاج وإدارة إصدارات البيانات',
        description: 'إدارة إصدارات مجموعات البيانات والنماذج لضمان تكرار التجارب بدقة.',
        skills: ['Git for Machine Learning', 'DVC (Data Version Control)', 'Remote Storage S3/GCS Integration', 'Cookiecutter Data Science Templates', 'Environment Isolation (Poetry, Conda)'],
        level: 'أساسي',
        projectFocus: 'مشروع ML متكامل يربط بين كود بايثون وإصدار محدد من البيانات عبر أداة DVC'
      },
      {
        number: '02',
        name: 'Experiment Tracking & Model Registry',
        nameAr: 'تتبع التجارب وسجل النماذج المركزي',
        description: 'تسجيل المقاييس والمعاملات وأرشفة النماذج واعتمادها للإنتاج.',
        skills: ['MLflow Tracking & Registry', 'Weights & Biases (W&B)', 'Model Artifact Versioning', 'Model Metadata & Performance Comparison', 'Stage Transitions (Staging to Production)'],
        level: 'متوسط',
        projectFocus: 'نظام مركزي لتتبع تجارب تدريب 20 نموذجا والمقارنة بينها واختيار الأفضل تلقائياً'
      },
      {
        number: '03',
        name: 'Feature Stores & Pipeline Orchestration',
        nameAr: 'مخازن الخصائص وجدولة خطوط أنابيب التعلم',
        description: 'بناء خطوط أنابيب تدريب مؤتمتة ومشاركة الخصائص عبر نماذج متعددة.',
        skills: ['Feast / Hopsworks Feature Store', 'Apache Airflow for ML Pipelines', 'Prefect / Dagster Workflow Orchestration', 'Data Validation (Great Expectations)', 'Automated Feature Preprocessing'],
        level: 'متقدم',
        projectFocus: 'خط أنابيب مؤتمت بالكامل يقوم بجلب البيانات، التحقق من جودتها، وتدريب النموذج دورياً'
      },
      {
        number: '04',
        name: 'Containerization & Cloud Infrastructure for ML',
        nameAr: 'الحاويات والبنية التحتية السحابية للتعلم الآلي',
        description: 'تجهيز بيئات الحاويات الداعمة لوحدات معالجة الرسوميات GPU وتشغيلها على السحابة.',
        skills: ['Docker with NVIDIA GPU Support (nvidia-docker)', 'Kubernetes for ML (Kubeflow)', 'Ray for Distributed Training & Tuning', 'Terraform for Cloud ML Clusters', 'Cloud ML Platforms (AWS SageMaker / GCP Vertex AI)'],
        level: 'متقدم',
        projectFocus: 'تهيئة بيئة تدريب موزعة على Kubernetes تدعم كروت NVIDIA لتسريع تدريب النماذج'
      },
      {
        number: '05',
        name: 'Model Serving & Real-Time Inference',
        nameAr: 'خدمة النماذج والاستدلال الفوري عالي السرعة',
        description: 'نشر النماذج للاستدلال السريع بدقة وزمن استجابة يقاس بأجزاء من الثانية.',
        skills: ['Triton Inference Server', 'TorchServe & TensorFlow Serving', 'FastAPI & BentoML', 'ONNX & TensorRT Optimization', 'gRPC Inference Protocols', 'Batch vs Stream Inference'],
        level: 'احترافي',
        projectFocus: 'تسريع استدلال نموذج عبر تحويله إلى ONNX وتشغيله على Triton Server بزمن 5ms'
      },
      {
        number: '06',
        name: 'Production Monitoring & Continuous Training (CT)',
        nameAr: 'مراقبة الإنتاج وإعادة التدريب المستمر',
        description: 'كشف انحراف البيانات ونزول الدقة وإطلاق دورات إعادة التدريب الآلي بدون تدخل بشري.',
        skills: ['Evidently AI for Drift Detection', 'Prometheus & Grafana ML Metrics', 'Data Drift vs Concept Drift Handling', 'Continuous Training (CT) Automation', 'A/B Testing & Shadow Deployments for Models'],
        level: 'احترافي',
        projectFocus: 'نظام مراقبة يكشف تلقائياً عند تغير سلوك العملاء ويعيد تدريب النموذج وينشره بسلاسة'
      }
    ]
  },
  'Data Engineer': {
    id: 'data-engineer',
    title: 'Data Engineer',
    titleAr: 'مهندس البيانات ومستودعات البيانات الكبرى',
    icon: 'database',
    level: 'متوسط إلى خبير معمارية بيانات',
    duration: '6 – 9 أشهر',
    summary: 'خريطة شاملة لمعمارية بحيرات البيانات، خطوط أنابيب ETL/ELT، الحوسبة الموزعة مع Apache Spark، والتدفق الحي.',
    officialSlug: 'data-engineer',
    stages: [
      {
        number: '01',
        name: 'Data Fundamentals, SQL Mastery & Python',
        nameAr: 'أساسيات البيانات وإتقان SQL ولغة بايثون',
        description: 'فهم نمذجة البيانات العلائقية وكتابة استعلامات SQL معقدة وأتمتة المهام ببايثون.',
        skills: ['Advanced SQL (Window Functions, Aggregations)', 'Data Modeling (Star & Snowflake Schema)', 'Python for Data Engineering', 'Linux CLI & File Formats (Parquet, Avro, JSON, CSV)', 'Git for Data Teams'],
        level: 'أساسي',
        projectFocus: 'تصميم نموذج Star Schema لشركة لوجستية وكتابة استعلامات تحليلية فائقة الأداء'
      },
      {
        number: '02',
        name: 'Data Warehousing & Cloud Modern Data Stack',
        nameAr: 'مستودعات البيانات ومنظومة البيانات السحابية الحديثة',
        description: 'إتقان مستودعات البيانات السحابية العملاقة وتحويل البيانات عبر dbt.',
        skills: ['Snowflake Architecture', 'Google BigQuery', 'Amazon Redshift', 'dbt (data build tool) for ELT', 'Columnar Storage & Partitioning', 'Data Testing & Documentation'],
        level: 'متوسط',
        projectFocus: 'بناء مستودع بيانات كامل على BigQuery باستخدام dbt لتحويل وتوثيق البيانات واختبارها'
      },
      {
        number: '03',
        name: 'Workflow Orchestration & Pipeline Automation',
        nameAr: 'جدولة تدفقات العمل وأتمتة خطوط البيانات',
        description: 'إدارة وتنسيق خطوط الأنابيب المعقدة والمعتمدة على بعضها عبر أدوات الأوركسترا.',
        skills: ['Apache Airflow (DAGs, Operators, Sensors)', 'Dagster Workflow Platform', 'Data Quality Checks (Great Expectations)', 'Error Handling & Retry Strategies', 'SLA Monitoring for Pipelines'],
        level: 'متقدم',
        projectFocus: 'خط أنابيب بيانات مجدول في Airflow يجلب البيانات من 5 مصادر مختلفة ويدمجها يومياً'
      },
      {
        number: '04',
        name: 'Distributed Processing with Apache Spark',
        nameAr: 'المعالجة الموزعة للبيانات الضخمة عبر Apache Spark',
        description: 'معالجة مئات الجيجابايت والتيرابايت من البيانات بالتوازي عبر Apache Spark و Databricks.',
        skills: ['Apache Spark Architecture & RDDs', 'PySpark DataFrames & SQL', 'Spark Optimization (Shuffling, Partitioning, Broadcast Joins)', 'Databricks Platform', 'Delta Lake & ACID Lakehouses'],
        level: 'متقدم',
        projectFocus: 'معالجة سجلات اتصالات بحجم 500GB باستخدام PySpark وتخزينها بتنسيق Delta Lake'
      },
      {
        number: '05',
        name: 'Real-Time Streaming & Event-Driven Pipelines',
        nameAr: 'معالجة البيانات اللحظية والتدفق المستمر',
        description: 'معالجة تدفقات البيانات الحية في الوقت الفعلي باستخدام Kafka ومحركات البث.',
        skills: ['Apache Kafka (Producers, Consumers, Topics)', 'Kafka Connect & Schema Registry', 'Spark Structured Streaming', 'Apache Flink Stream Processing', 'Change Data Capture (Debezium)'],
        level: 'احترافي',
        projectFocus: 'نظام مراقبة معاملات بنكية لحظي يكتشف الاحتيال المالي خلال أقل من 100ms عبر Kafka'
      },
      {
        number: '06',
        name: 'Data Governance, Quality & Architecture Design',
        nameAr: 'حوكمة البيانات، الجودة، وتصميم معمارية البيانات الكبرى',
        description: 'إدارة أمن البيانات، تتبع سلاسل الأنساب Data Lineage، ومبادئ Data Mesh.',
        skills: ['Data Mesh & Decentralized Data Teams', 'Data Lineage & Catalogs (OpenMetadata / Amundsen)', 'Data Observability (Monte Carlo)', 'GDPR & Data Privacy Compliance', 'Data Architecture Blueprint Design'],
        level: 'احترافي',
        projectFocus: 'تصميم معمارية بيانات شاملة (Modern Data Architecture) لمؤسسة اتصالات كبرى'
      }
    ]
  },
  'Data Analyst': {
    id: 'data-analyst',
    title: 'Data Analyst',
    titleAr: 'محلل البيانات وذكاء الأعمال',
    icon: 'analytics',
    level: 'مبتدئ إلى كبير محللي بيانات',
    duration: '4 – 7 أشهر',
    summary: 'مسار متكامل لتحويل الأرقام الخام إلى رؤى تجارية استراتيجية، لوحات تحكم تفاعلية، وتحليلات إحصائية دقيقة.',
    officialSlug: 'data-analyst',
    stages: [
      {
        number: '01',
        name: 'Spreadsheet Modeling & Advanced Excel',
        nameAr: 'النمذجة بالمعادلات والإكسل المتقدم',
        description: 'إتقان المعادلات المتقدمة، الجداول المحورية، ونمذجة البيانات السريعة في Excel.',
        skills: ['Advanced Formulas (XLOOKUP, INDEX/MATCH, LET)', 'Pivot Tables & Pivot Charts', 'Power Query for Data Cleaning', 'What-If Analysis & Scenario Manager', 'Data Validation & Formatting Standards'],
        level: 'أساسي',
        projectFocus: 'نموذج مالي متكامل في Excel مع لوحة قيادة تفاعلية لتحليل الميزانية وتوقعات الإيرادات'
      },
      {
        number: '02',
        name: 'SQL for Data Analysis & Extraction',
        nameAr: 'لغة SQL المتقدمة للتحليل واستخراج البيانات',
        description: 'استخراج وتجميع وتصفية البيانات من قواعد البيانات العلائقية بدقة عالية.',
        skills: ['SELECT, WHERE, GROUP BY & HAVING', 'Complex Joins (INNER, LEFT, FULL, CROSS)', 'Subqueries & CTEs', 'Window Functions (RANK, DENSE_RANK, LEAD/LAG)', 'Data Aggregations & Cohort Calculations'],
        level: 'متوسط',
        projectFocus: 'تحليل سلوك العملاء وفترات الاحتفاظ بهم (Cohort Retention Analysis) باستخدام SQL'
      },
      {
        number: '03',
        name: 'Business Intelligence & Power BI / Tableau',
        nameAr: 'ذكاء الأعمال ولوحات التحكم التفاعلية',
        description: 'تصميم لوحات تحكم تفاعلية جذابة تخدم متخذي القرار وتوضح مؤشرات الأداء KPIs.',
        skills: ['Power BI Desktop & Service', 'DAX Calculations (CALCULATE, FILTER, Time Intelligence)', 'Tableau Visual Analytics', 'Data Modeling & Relationship Cardinality', 'User Experience for Dashboards'],
        level: 'متوسط',
        projectFocus: 'لوحة قيادة تفاعلية متكاملة في Power BI تعرض مؤشرات الأداء التنفيذية للشركة'
      },
      {
        number: '04',
        name: 'Python for Exploratory Data Analysis (EDA)',
        nameAr: 'بايثون للتحليل الاستكشافي ومعالجة البيانات',
        description: 'استخدام مكتبات بايثون لتنظيف البيانات، اكتشاف الأنماط، وتوليد الرسوم البيانية.',
        skills: ['Pandas for Data Manipulation', 'NumPy for Numerical Computing', 'Data Visualization (Seaborn & Plotly)', 'Handling Outliers & Missing Values', 'Jupyter Notebooks Reporting'],
        level: 'متقدم',
        projectFocus: 'تقرير تحليلي استكشافي كامل في Jupyter Notebook يحدد العوامل المؤثرة على رضا العملاء'
      },
      {
        number: '05',
        name: 'Applied Statistics & Hypothesis Testing',
        nameAr: 'الإحصاء التطبيقي واختبار الفرضيات',
        description: 'تطبيق الاختبارات الإحصائية للتأكد من دلالة الفروق بين الحملات والمنتجات.',
        skills: ['A/B Testing Analysis & Z-Score / T-Test', 'Correlation vs Causation Analysis', 'Confidence Intervals & Significance', 'ANOVA (Analysis of Variance)', 'Regression Analysis for Trends'],
        level: 'متقدم',
        projectFocus: 'تحليل نتائج حملة تسويقية واختبار دلالتها الإحصائية لتقديم توصيات مدعومة بالبراهين'
      },
      {
        number: '06',
        name: 'Business Acumen, Storytelling & Strategy',
        nameAr: 'فهم الأعمال وسرد القصص البيانية وتقديم الرؤى',
        description: 'ترجمة التحليلات المعقدة إلى عروض تقديمية واضحة ومقنعة للقيادات التنفيذية.',
        skills: ['Data Storytelling & Executive Summaries', 'Business KPIs Definition (LTV, CAC, Churn, ROI)', 'Stakeholder Management & Presentations', 'Root Cause Investigation', 'Translating Insights to Actionable Strategy'],
        level: 'احترافي',
        projectFocus: 'عرض تقديمي استراتيجي للإدارة العليا يوضح خطة خفض معدل فقدان العملاء بنسبة 15%'
      }
    ]
  },
  'BI Analyst': {
    id: 'bi-analyst',
    title: 'BI Analyst',
    titleAr: 'محلل ذكاء الأعمال والتقارير المؤسسية',
    icon: 'bar_chart',
    level: 'متوسط إلى خبير ذكاء أعمال',
    duration: '5 – 8 أشهر',
    summary: 'بناء النماذج البيانية المركزية، مقاييس الـ DAX المتقدمة، التقارير المؤسسية المؤتمتة، وإدارة بوابات ذكاء الأعمال.',
    officialSlug: 'data-analyst',
    stages: [
      {
        number: '01',
        name: 'Enterprise Data Modeling & Star Schema',
        nameAr: 'النمذجة البيانية المؤسسية ومخططات النجمة',
        description: 'تصميم جداول الحقائق Fact Tables والأبعاد Dimension Tables وفق منهجية Kimball.',
        skills: ['Dimensional Modeling (Kimball Methodology)', 'Fact vs Dimension Tables', 'Conformed Dimensions & Grain Definition', 'Slowly Changing Dimensions (SCD Type 1 & 2)', 'Surrogate Keys & Indexing'],
        level: 'أساسي',
        projectFocus: 'تصميم مخطط نجمي Star Schema متكامل لشركة تجزئة متعددة الفروع والمنتجات'
      },
      {
        number: '02',
        name: 'Advanced SQL & Data Transformation',
        nameAr: 'لغة SQL المؤسسية وتحويل وتجهيز البيانات',
        description: 'كتابة استعلامات تنظيف وتجهيز البيانات لربطها بأنظمة ذكاء الأعمال مباشرة.',
        skills: ['Complex SQL Transformations', 'Views & Materialized Views', 'Query Performance Tuning for BI', 'Stored Procedures for ETL', 'Data Cleansing & Deduplication'],
        level: 'متوسط',
        projectFocus: 'إنشاء Views محسنة في قاعدة البيانات لتغذية لوحات الـ BI بأسرع وقت تحميل ممكن'
      },
      {
        number: '03',
        name: 'Deep DAX & Power BI Mastery',
        nameAr: 'إتقان لغة DAX ونظام Power BI المتقدم',
        description: 'كتابة معادلات DAX المعقدة وحسابات المقاييس الزمنية ومجموعات الحسابات.',
        skills: ['CALCULATE, ALL, ALLEXCEPT, VALUES', 'Time Intelligence Functions (YTD, MTD, YoY)', 'Evaluation Context (Filter vs Row Context)', 'Calculation Groups & Tabular Editor', 'Performance Analyzer & DAX Studio'],
        level: 'متقدم',
        projectFocus: 'نموذج Power BI محسن باستخدام Tabular Editor ومعادلات DAX سريعة ومقاييس زمنية سنوية'
      },
      {
        number: '04',
        name: 'Tableau & Multi-Tool Visualization',
        nameAr: 'أداة Tableau والتصوير البياني المتعدد',
        description: 'إنشاء لوحات تفاعلية وقصص بيانات جذابة باستخدام Tableau Desktop و Server.',
        skills: ['Tableau LOD Expressions (FIXED, INCLUDE, EXCLUDE)', 'Interactive Dashboards & Actions', 'Tableau Data Blending & Joins', 'Visual Best Practices & Color Theory', 'Tableau Server Publishing & Permissions'],
        level: 'متقدم',
        projectFocus: 'لوحة تفاعلية على Tableau توظف دوال الـ LOD لمقارنة أداء مديري المبيعات'
      },
      {
        number: '05',
        name: 'Semantic Layers & Modern Cloud BI',
        nameAr: 'الطبقات الدلالية Semantic Layers وحلول الـ BI السحابية',
        description: 'بناء طبقة دلالية موحدة تضمن أن جميع أقسام المؤسسة تستخدم نفس تعريفات الـ KPIs.',
        skills: ['Semantic Layers (Cube.js, dbt Semantic Layer)', 'Power BI Datamarts & Fabric', 'Looker & LookML Modeling', 'Automated Scheduled Refreshes', 'Row-Level Security (RLS) in BI'],
        level: 'احترافي',
        projectFocus: 'تطبيق نظام Row-Level Security في Power BI ليرى كل مدير فرع بيانات فرعه فقط'
      },
      {
        number: '06',
        name: 'BI Governance, Adoption & Strategic KPIs',
        nameAr: 'حوكمة ذكاء الأعمال، التبني المؤسسي، وقيادة القرارات',
        description: 'حوكمة بوابات التقارير، منع تكرار المقاييس، وضمان تبني الموظفين لأدوات البيانات.',
        skills: ['BI Governance & Center of Excellence (CoE)', 'Data Dictionary & Metric Catalog', 'User Adoption & Training Workshops', 'Executive Decision Support Systems', 'Automated Alerting & Incident Reports'],
        level: 'احترافي',
        projectFocus: 'خطة حوكمة شاملة لذكاء الأعمال مع قاموس موحد لتعريف 100 مقياس ومؤشر أداء للمؤسسة'
      }
    ]
  }
};
