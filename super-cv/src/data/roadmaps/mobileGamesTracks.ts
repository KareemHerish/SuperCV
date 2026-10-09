import { DetailedRoadmapTrack } from './types';

export const mobileGamesTracks: Record<string, DetailedRoadmapTrack> = {
  'Android': {
    id: 'android',
    title: 'Android',
    titleAr: 'تطوير تطبيقات أندرويد الحديثة',
    icon: 'android',
    level: 'مبتدئ إلى قائد تطوير أندرويد',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد لتطوير تطبيقات أندرويد الاحترافية باستخدام Kotlin، واجهات Jetpack Compose التصريحية، ومعمارية MVI النظيفة.',
    officialSlug: 'android',
    stages: [
      {
        number: '01',
        name: 'Kotlin Mastery & Android Operating System',
        nameAr: 'إتقان لغة كوتلن ونظام تشغيل أندرويد',
        description: 'إتقان مميزات لغة Kotlin المتقدمة، التزامن عبر Coroutines، وفهم دورة حياة المكونات.',
        skills: ['Kotlin Core (Null Safety, Extensions, Sealed Classes)', 'Kotlin Coroutines & Flow', 'Android Lifecycle & Application Class', 'Intents, BroadcastReceivers & Services', 'Git & Android Studio IDE Proficiency'],
        level: 'أساسي',
        projectFocus: 'تطبيق لإدارة المهام يعتمد على Coroutines لجلب البيانات بدون تجميد واجهة المستخدم'
      },
      {
        number: '02',
        name: 'Modern UI with Jetpack Compose',
        nameAr: 'بناء واجهات المستخدم الحديثة عبر Jetpack Compose',
        description: 'التصميم التصريحي لواجهات أندرويد، الرسوم المتحركة، ونظم التصميم Material 3.',
        skills: ['Jetpack Compose State & Recomposition', 'Material Design 3 Components', 'Compose Navigation & Type-Safe Arguments', 'Custom Modifiers & Canvas Drawing', 'Compose Animations & Transitions'],
        level: 'متوسط',
        projectFocus: 'تطبيق تجارة إلكترونية كامل مبني بنسبة 100% باستخدام Jetpack Compose و Material 3'
      },
      {
        number: '03',
        name: 'Architecture Patterns & Dependency Injection',
        nameAr: 'أنماط المعمارية وحقن التبعيات',
        description: 'تطبيق مبادئ Clean Architecture وأنماط MVVM و MVI مع حقن التبعيات بـ Hilt.',
        skills: ['Clean Architecture & Multi-Module Structure', 'MVI (Model-View-Intent) & MVVM Patterns', 'Hilt / Dagger Dependency Injection', 'StateFlow & SharedFlow for UI State', 'Repository Pattern & Use Cases'],
        level: 'متوسط',
        projectFocus: 'إعادة هيكلة تطبيق متعدد الوحدات Multi-Module مع حقن التبعيات باستخدام Hilt'
      },
      {
        number: '04',
        name: 'Local Storage, Room DB & Background Tasks',
        nameAr: 'التخزين المحلي والمهام الخلفية الموثوقة',
        description: 'حفظ البيانات محلياً مع Room ومعالجة المهام الخلفية عبر WorkManager حتى عند إغلاق التطبيق.',
        skills: ['Room Database & SQLite Operations', 'DataStore Preferences & Proto DataStore', 'WorkManager for Background Jobs', 'Offline-First Synchronization Pattern', 'Network Connectivity Observation'],
        level: 'متقدم',
        projectFocus: 'تطبيق ملاحظات Offline-First يتزامن تلقائياً في الخلفية عند توفر الإنترنت عبر WorkManager'
      },
      {
        number: '05',
        name: 'Networking, Security & Performance Profiling',
        nameAr: 'الاتصال بالشبكات، الأمان، وفحص الأداء والذاكرة',
        description: 'استهلاك الـ APIs بكفاءة، تأمين التطبيق من الهندسة العكسية، واكتشاف تسرب الذاكرة.',
        skills: ['Retrofit & OkHttp with Interceptors', 'Kotlinx.Serialization / Moshi', 'Android Keystore & EncryptedSharedPreferences', 'ProGuard & R8 Code Shrinking', 'Memory Leaks (LeakCanary) & Android Profiler'],
        level: 'متقدم',
        projectFocus: 'فحص تطبيق وتحسين استهلاك الذاكرة وإصلاح تسريبات LeakCanary وتشفير بيانات التخزين'
      },
      {
        number: '06',
        name: 'Automated Testing, CI/CD & Play Store Release',
        nameAr: 'الاختبار المؤتمت وخطوط النشر لمتجر Google Play',
        description: 'كتابة اختبارات شاملة وأتمتة بناء حزم Android App Bundles ونشرها على متجر Google Play.',
        skills: ['Unit Testing (JUnit 5, Mockk)', 'Compose UI Testing & Espresso', 'CI/CD with GitHub Actions & Fastlane', 'Google Play Console Release Management', 'Crashlytics & Firebase App Distribution'],
        level: 'احترافي',
        projectFocus: 'إعداد خط نشر آلي Fastlane يبني التطبيق ويجري الاختبارات ويرفعه تلقائياً لـ Google Play'
      }
    ]
  },
  'iOS': {
    id: 'ios',
    title: 'iOS',
    titleAr: 'تطوير تطبيقات أبل الحديثة (iOS & iPadOS)',
    icon: 'phone_iphone',
    level: 'مبتدئ إلى كبير مطوري تطبيقات أبل',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد لتطوير تطبيقات نظام iOS باستخدام Swift 6، واجهات SwiftUI الحديثة، معمارية MVVM/TCA، وميزات أجهزة Apple.',
    officialSlug: 'ios',
    stages: [
      {
        number: '01',
        name: 'Swift Mastery & Apple Ecosystem',
        nameAr: 'إتقان لغة سويفت ومنظومة أبل للمطورين',
        description: 'إتقان أساسيات لغة Swift، الأنواع القوية، والبرمجة كائنية التوجه والموجهة بالبروتوكولات.',
        skills: ['Swift 6 Basics & Syntax', 'Optionation & Type Safety', 'Protocols & Generics', 'Memory Management (ARC & Weak/Unowned)', 'Xcode IDE, Simulator & Instruments'],
        level: 'أساسي',
        projectFocus: 'تطبيق عملي لحساب الميزانية الشخصية يطبق معايير Swift النقية وإدارة الذاكرة بـ ARC'
      },
      {
        number: '02',
        name: 'Modern Declarative UI with SwiftUI',
        nameAr: 'الواجهات التصريحية الحديثة عبر SwiftUI',
        description: 'بناء واجهات متجاوبة، رسوم متحركة سلسة، ودعم الوضع الداكن وشاشات iPhone و iPad.',
        skills: ['SwiftUI Views & Modifiers', 'State Management (@State, @Binding, @Observable)', 'NavigationStack & Deep Linking', 'SwiftUI Animations & Transitions', 'UIKit Interoperability (UIViewRepresentable)'],
        level: 'متوسط',
        projectFocus: 'واجهة تطبيق بث فيديو متقدمة مع دعم الانتقالات المخصصة والتنقل عبر NavigationStack'
      },
      {
        number: '03',
        name: 'Modern Swift Concurrency & Networking',
        nameAr: 'التزامن الحديث والاتصال الشبكي فائق السرعة',
        description: 'الاستغناء عن الـ Closures واستخدام async/await و Actors لمنع تضارب البيانات.',
        skills: ['Swift Concurrency (Async/Await)', 'Actors & Global Actors (@MainActor)', 'TaskGroups & AsyncSequence', 'URLSession & Codable Parsing', 'Combine Framework Essentials'],
        level: 'متوسط',
        projectFocus: 'عميل شبكي آمن يجلب مئات الصور والبيانات بالتوازي باستخدام TaskGroups بدون Race Conditions'
      },
      {
        number: '04',
        name: 'Persistence, SwiftData & Core Data',
        nameAr: 'حفظ البيانات المحلي و SwiftData الحديثة',
        description: 'تخزين بيانات المستخدم محلياً مع دعم الفهرسة والبحث والتزامن السحابي عبر iCloud.',
        skills: ['SwiftData Framework (@Model, @Query)', 'Core Data Architecture & Migration', 'iCloud Sync with CloudKit', 'Keychain Services for Secure Tokens', 'UserDefaults & File Storage'],
        level: 'متقدم',
        projectFocus: 'تطبيق إدارة وثائق محلي يعتمد على SwiftData مع دعم المزامنة عبر سحابة iCloud'
      },
      {
        number: '05',
        name: 'Architecture Patterns (MVVM & The Composable Architecture)',
        nameAr: 'معمارية التطبيقات المتقدمة (MVVM و TCA)',
        description: 'تنظيم كود التطبيق في طبقات قابلة للاختبار والصيانة باستخدام MVVM أو TCA.',
        skills: ['MVVM with @Observable Macro', 'The Composable Architecture (TCA)', 'Modular Architecture with Swift Packages (SPM)', 'Unit Testing with Swift Testing & XCTest', 'UI Testing & Snapshot Testing'],
        level: 'متقدم',
        projectFocus: 'بناء تطبيق بنكي باستخدام The Composable Architecture (TCA) مع تغطية اختبار 90%+'
      },
      {
        number: '06',
        name: 'Apple Platform Features, CI/CD & App Store Release',
        nameAr: 'مزايا منصات أبل والأتمتة والنشر في App Store',
        description: 'دمج الودجات والـ Live Activities، وأتمتة النشر عبر Xcode Cloud والـ App Store.',
        skills: ['Widgets & Dynamic Island (ActivityKit)', 'Apple Pay & In-App Purchases (StoreKit 2)', 'Xcode Cloud & Fastlane Automation', 'Instruments Profiling (Time Profiler, Leaks)', 'App Store Review Guidelines & TestFlight'],
        level: 'احترافي',
        projectFocus: 'إطلاق تطبيق متكامل يضم Dynamic Island ومشتريات StoreKit مع أتمتة الرفع عبر TestFlight'
      }
    ]
  },
  'Game Developer': {
    id: 'game-developer',
    title: 'Game Developer',
    titleAr: 'تطوير وتصميم الألعاب الإلكترونية',
    icon: 'sports_esports',
    level: 'مبتدئ إلى كبير مطوري ألعاب',
    duration: '6 – 10 أشهر',
    summary: 'مسار معتمد لتطوير الألعاب ثنائية وثلاثية الأبعاد باستخدام محركات Unity و Unreal Engine، لغات C# و C++، وفيزياء الألعاب.',
    officialSlug: 'game-developer',
    stages: [
      {
        number: '01',
        name: 'Math, Physics & Game Programming Languages',
        nameAr: 'رياضيات الألعاب، الفيزياء، ولغات البرمجة',
        description: 'إتقان المتجهات، الزوايا، الجبر الخطي، ولغات البرمجة الأساسية للألعاب (C# / C++).',
        skills: ['Vectors, Matrices & Quaternions', 'Linear Algebra & Trigonometry for Games', 'C# Fundamentals for Unity', 'C++ Core for Unreal Engine', 'Object-Oriented Programming & Game Loops'],
        level: 'أساسي',
        projectFocus: 'بناء لعبة Pong كلاسيكية مع محاكاة فيزيائية لحركة الكرة والاصطدام بدون محرك'
      },
      {
        number: '02',
        name: '2D & 3D Game Engine Fundamentals (Unity / Godot)',
        nameAr: 'محركات الألعاب وتصميم عوالم ثنائية وثلاثية الأبعاد',
        description: 'إتقان محرك Unity أو Godot والتعامل مع الكائنات والفيزياء والتصادمات.',
        skills: ['Unity Engine Architecture & Components', 'Rigidbodies, Colliders & Physics Simulation', 'Tilemaps & 2D Sprite Animation', '3D Transforms & Camera Controls', 'Prefabs & Asset Management'],
        level: 'متوسط',
        projectFocus: 'لعبة منصات 2D Platformer كاملة تحتوي على أعداء، فيزياء قفز، ومستويات متعددة'
      },
      {
        number: '03',
        name: 'Game Mechanics, UI & Audio Systems',
        nameAr: 'ميكانيكا اللعب، الواجهات التفاعلية، والنظام الصوتي',
        description: 'بناء تجربة لعب متكاملة تضم أنظمة القتال، إدارة الصحة، والواجهات والصوتيات.',
        skills: ['Character Controllers & Movement Mechanics', 'Health, Damage & Inventory Systems', 'UI Toolkits & In-Game HUDs', 'Spatial Audio & Sound Management', 'Input System (Keyboard, Gamepad, Touch)'],
        level: 'متوسط',
        projectFocus: 'لعبة مغامرات 3D من منظور الشخص الثالث تحتوي على نظام قتال وتجميع موارد وواجهة HUD'
      },
      {
        number: '04',
        name: 'Game AI & State Machines',
        nameAr: 'الذكاء الاصطناعي للألعاب وآلات الحالة',
        description: 'برمجة تصرفات الأعداء وسلوكيات الشخصيات غير اللاعبة عبر خوارزميات البحث والحركة.',
        skills: ['Finite State Machines (FSM)', 'NavMesh & Pathfinding (A* Algorithm)', 'Behavior Trees for Complex AI', 'Enemy Spawning & Wave Management', 'Vision & Audio Detection for NPCs'],
        level: 'متقدم',
        projectFocus: 'نظام ذكاء اصطناعي للأعداء يضم سلوكيات: الدورية، المطاردة، الهجوم، والانسحاب عند الإصابة'
      },
      {
        number: '05',
        name: 'Shaders, Lighting & Visual Effects (VFX)',
        nameAr: 'المظللات، الإضاءة، والمؤثرات البصرية',
        description: 'تحسين المظهر البصري للألعاب عبر الإضاءة الواقعية ونظم الجسيمات والمظللات.',
        skills: ['Shader Graph & Custom HLSL Shaders', 'Post-Processing & Volumetric Lighting', 'Particle Systems & VFX Graph', 'Baking Shadows & Lightmaps', 'Materials & PBR Texturing'],
        level: 'متقدم',
        projectFocus: 'مشهد بيئي سينمائي 3D يحتوي على مؤثرات طقس ممطر ومظللات مياه واقعية'
      },
      {
        number: '06',
        name: 'Optimization, Profiling & Cross-Platform Publishing',
        nameAr: 'تحسين الأداء وفحص الإطارات والنشر المتعدد',
        description: 'الوصول إلى معدل 60+ إطاراً ثابتاً في الثانية وتصدير اللعبة للحاسوب، الهواتف، والمنصات.',
        skills: ['Unity / Unreal Profiler & Frame Debugger', 'Draw Call Reduction & Batching', 'LOD (Level of Detail) & Occlusion Culling', 'Memory & Garbage Collection Optimization', 'Steam, Google Play & iOS Publishing'],
        level: 'احترافي',
        projectFocus: 'تحسين أداء لعبة 3D لتعمل بسلاسة بمعدل 60 FPS على أجهزة الهواتف المتوسطة وتجهيزها للإطلاق'
      }
    ]
  },
  'Server Side Game Developer': {
    id: 'server-side-game-developer',
    title: 'Server Side Game Developer',
    titleAr: 'مطور خوادم الألعاب الجماعية',
    icon: 'stadia_controller',
    level: 'متوسط إلى خبير شبكات ألعاب',
    duration: '6 – 9 أشهر',
    summary: 'هندسة خوادم الألعاب الموزعة، تزامن حركة اللاعبين بالزمن الحقيقي عبر بروتوكولات UDP، مكافحة الغش، وإدارة جلسات اللعب.',
    officialSlug: 'game-developer',
    stages: [
      {
        number: '01',
        name: 'Network Protocols & Low-Latency Sockets',
        nameAr: 'بروتوكولات الشبكات ومقابس الاتصال فائقة السرعة',
        description: 'فهم الفروق الجوهرية بين TCP و UDP وبناء اتصالات شبكية منخفضة التأخير.',
        skills: ['UDP vs TCP for Real-time Gaming', 'Binary Serialization & Packet Packing', 'WebSocket Protocols for Web Games', 'Socket Programming in C++ / Go / C#', 'Bandwidth Optimization & Packet Loss'],
        level: 'أساسي',
        projectFocus: 'خادم مقابس UDP بسيط يرسل إحداثيات اللاعبين المشفرة ثنائياً بمعدل 30 مرة بالثانية'
      },
      {
        number: '02',
        name: 'Client-Server Architecture & State Sync',
        nameAr: 'معمارية الخادم المعتمد وتزامن حالة اللعبة',
        description: 'بناء خادم معتمد سلطوياً (Authoritative Server) لمنع الغش ومزامنة حركة اللاعبين.',
        skills: ['Authoritative Game Server Model', 'Tick Rates & Simulation Loops (60Hz / 128Hz)', 'Entity State Synchronization', 'State Replication & Deltas', 'Interest Management & Spatial Grid Partitioning'],
        level: 'متوسط',
        projectFocus: 'خادم ألعاب يطبق Authoritative Physics لمنع اللاعبين من التلاعب بسرعتهم أو مواقعهم'
      },
      {
        number: '03',
        name: 'Lag Compensation, Prediction & Reconciliation',
        nameAr: 'تعويض التأخير والتنبؤ الحركي وإعادة المطابقة',
        description: 'التقنيات الرياضية المستخدمة لجعل اللعبة سريعة الاستجابة حتى مع وجود تأخير شبكي (Ping).',
        skills: ['Client-Side Prediction', 'Server Reconciliation', 'Entity Interpolation & Extrapolation', 'Lag Compensation (Lag Rewind / Backtracking)', 'Handling Jitter & Network Outages'],
        level: 'متقدم',
        projectFocus: 'تطبيق محاكاة رماية شبكية تطبق Lag Rewind لضمان دقة إصابة الهدف عند وجود 150ms تأخير'
      },
      {
        number: '04',
        name: 'Matchmaking, Lobbies & Spatial Scaling',
        nameAr: 'أنظمة التوفيق بين اللاعبين وإدارة الردهات والتوسع المكاني',
        description: 'تصميم أنظمة Matchmaking متطورة وفق مستوى المهارة وإدارة غرف اللعب.',
        skills: ['Skill-Based Matchmaking (Elo, Glicko-2, TrueSkill)', 'Lobby & Party Management Services', 'Agones for Kubernetes Game Server Orchestration', 'Dedicated Game Server Hosting', 'Redis for Fast Session State'],
        level: 'متقدم',
        projectFocus: 'نظام Matchmaking يوزع اللاعبين على غرف اللعب استناداً لمعدل التقييم وزمن الاستجابة'
      },
      {
        number: '05',
        name: 'Anti-Cheat, Security & Economy Integrity',
        nameAr: 'أنظمة مكافحة الغش وأمن المعاملات واقتصاد اللعبة',
        description: 'حماية خوادم الألعاب من هجمات الحرمان من الخدمة (DDoS) ومنع محاولات الغش وتكرار العملات.',
        skills: ['Speed-hack & Teleport Detection', 'Server-side Inventory & Currency Validation', 'DDoS Protection for Game Ports', 'Packet Encryption & Token Auth', 'Memory Inspection Defense Integration'],
        level: 'احترافي',
        projectFocus: 'نظام حماية يكتشف حركات اللاعبين غير الطبيعية ويتحقق من صحة شراء العناصر في الخادم'
      },
      {
        number: '06',
        name: 'Distributed Cloud Architecture & Observability',
        nameAr: 'المعمارية السحابية الموزعة والمراقبة اللحظية للألعاب',
        description: 'نشر أساطيل الخوادم حول العالم ومراقبة زمن التأخير ومعدل الإطارات لحظة بلحظة.',
        skills: ['Multi-Region Edge Game Server Deployment', 'OpenTelemetry for Game Telemetry', 'Live Metric Dashboards (Grafana / Prometheus)', 'Match Logging & Replay Systems', 'Auto-Scaling Fleets Based on Player Concurrency'],
        level: 'احترافي',
        projectFocus: 'معمارية أسطول خوادم ألعاب تعمل على مجمعات Kubernetes وتتوسع تلقائياً مع ذروة اللاعبين'
      }
    ]
  },
  'Blockchain': {
    id: 'blockchain',
    title: 'Blockchain',
    titleAr: 'تطوير البلوكشين والعقود الذكية (Web3)',
    icon: 'currency_bitcoin',
    level: 'متوسط إلى مهندس Web3 متقدم',
    duration: '5 – 8 أشهر',
    summary: 'مسار معتمد لتطوير العقود الذكية الآمنة بلغة Solidity، معمارية التطبيقات اللامركزية DApps، شبكات الطبقة الثانية، وتدقيق الأمان.',
    officialSlug: 'blockchain',
    stages: [
      {
        number: '01',
        name: 'Cryptography & Distributed Ledger Fundamentals',
        nameAr: 'أساسيات التشفير ودفاتر الحسابات الموزعة',
        description: 'فهم التشفير بالمفتاح العام، دوال الهاش، وآليات الإجماع اللامركزية.',
        skills: ['Public-Key Cryptography & ECDSA', 'Hash Functions (SHA-256, Keccak-256)', 'Consensus Mechanisms (PoW, PoS)', 'Blockchain Data Structures (Merkle Trees)', 'Wallets, Public Addresses & Private Keys'],
        level: 'أساسي',
        projectFocus: 'بناء نموذج بلوكشين مبسط في بايثون أو جافاسكريبت مع إنشاء كتل وسلاسل Merkle'
      },
      {
        number: '02',
        name: 'Solidity & Ethereum Virtual Machine (EVM)',
        nameAr: 'لغة Solidity وآلة إيثيريوم الافتراضية EVM',
        description: 'كتابة عقود ذكية متوافقة مع معايير EVM والتعامل مع الغاز (Gas) والذاكرة.',
        skills: ['Solidity Syntax, Data Types & Mappings', 'EVM Execution Model & Storage vs Memory', 'Gas Optimization Techniques', 'Events, Modifiers & Error Handling', 'Remix IDE & Hardhat / Foundry Development'],
        level: 'متوسط',
        projectFocus: 'عقد ذكي لإدارة صندوق تمويل جماعي Crowdfunding مع استرداد آمن للأموال وشروط محكمة'
      },
      {
        number: '03',
        name: 'Token Standards & OpenZeppelin Libraries',
        nameAr: 'معايير التوكنات ومكتبات العقود المعتمدة',
        description: 'بناء وتخصيص العملات والرموز غير القابلة للاستبدال (NFTs) بالاعتماد على مكتبات آمنة.',
        skills: ['ERC-20 Fungible Token Standard', 'ERC-721 & ERC-1155 NFT Standards', 'OpenZeppelin Contracts Library', 'Access Control (Ownable, AccessControl)', 'Upgradable Contracts (Proxy Patterns)'],
        level: 'متوسط',
        projectFocus: 'إطلاق عملة مشفرة متوافقة مع ERC-20 مع ميزات الحرق والسك وإدارة الأذونات عبر OpenZeppelin'
      },
      {
        number: '04',
        name: 'DApp Integration & Web3 Frontend',
        nameAr: 'بناء التطبيقات اللامركزية وربط الواجهات الأمامية',
        description: 'ربط واجهات الويب بالمحافظ الرقمية والتفاعل المباشر مع العقود الذكية.',
        skills: ['Ethers.js / Viem & Wagmi', 'Wallet Connection (MetaMask, WalletConnect)', 'IPFS & Decentralized Storage', 'Querying On-Chain Data & Events', 'The Graph Protocol for Subgraphs'],
        level: 'متقدم',
        projectFocus: 'تطبيق ويب DApp يتصل بمحفظة MetaMask ويتيح للمستخدمين تداول وشراء التوكنات مباشرة'
      },
      {
        number: '05',
        name: 'Smart Contract Security & Formal Auditing',
        nameAr: 'أمن العقود الذكية والتدقيق البرمجي الصارم',
        description: 'كشف وحماية العقود من الثغرات الكارثية مثل Reentrancy و Integer Overflow.',
        skills: ['Reentrancy Attack Prevention (ReentrancyGuard)', 'Front-running & MEV Protection', 'Static Analysis Tools (Slither, Mythril)', 'Automated Fuzz Testing with Foundry', 'Formal Verification Concepts'],
        level: 'متقدم',
        projectFocus: 'تدقيق أمني شامل لعقد بروتوكول تداول وكشف ثغرة Reentrancy وإصلاحها واختبارها بـ Foundry'
      },
      {
        number: '06',
        name: 'Layer 2 Rollups, DeFi & Cross-Chain Bridges',
        nameAr: 'شبكات الطبقة الثانية والتمويل اللامركزي والجسور',
        description: 'بناء تطبيقات على شبكات Rollups السريعة (Arbitrum, Optimism) وفهم بروتوكولات التمويل DeFi.',
        skills: ['Optimistic & Zero-Knowledge (ZK) Rollups', 'Automated Market Makers (AMM & Uniswap v3/v4)', 'Decentralized Lending Protocols (Aave)', 'Chainlink Oracles (Price Feeds, VRF)', 'Cross-Chain Communication & Bridges'],
        level: 'احترافي',
        projectFocus: 'بروتوكول مقايضة توكنات مبسط AMM يستخدم مؤشرات Chainlink للأسعار ومنشور على شبكة Layer 2'
      }
    ]
  },
  'Cyber Security': {
    id: 'cyber-security',
    title: 'Cyber Security',
    titleAr: 'الأمن السيبراني والدفاع الرقمي واختبار الاختراق',
    icon: 'shield',
    level: 'مبتدئ إلى خبير أمن سيبراني',
    duration: '6 – 10 أشهر',
    summary: 'مسار شامل للدفاع عن الشبكات، اختبار الاختراق الأخلاقي، الاستجابة للحوادث الأمنية، وحماية البنية الرقمية.',
    officialSlug: 'cyber-security',
    stages: [
      {
        number: '01',
        name: 'Security Fundamentals, Networking & Cryptography',
        nameAr: 'أساسيات الأمان، الشبكات، والتشفير الرياضي',
        description: 'فهم مثلث الأمان CIA، بروتوكولات الاتصال الشبكي، والأنظمة التشفيرية المتماثلة وغير المتماثلة.',
        skills: ['CIA Triad (Confidentiality, Integrity, Availability)', 'TCP/IP Packet Inspection with Wireshark', 'Symmetric & Asymmetric Encryption (AES, RSA)', 'Hashing & Message Integrity (HMAC, SHA-3)', 'Linux Security Fundamentals'],
        level: 'أساسي',
        projectFocus: 'تحليل حركة شبكية مخترقة باستخدام Wireshark وتحديد محاولة استخراج كلمات مرور غير مشفرة'
      },
      {
        number: '02',
        name: 'Vulnerability Assessment & Penetration Testing',
        nameAr: 'تقييم الثغرات واختبار الاختراق الأخلاقي',
        description: 'استخدام أدوات مسح الأنظمة واكتشاف نقاط الضعف وفق منهجيات الاختبار المعتمدة.',
        skills: ['Reconnaissance & OSINT (Shodan, Nmap)', 'Vulnerability Scanning (Nessus, OpenVAS)', 'Metasploit Framework', 'Privilege Escalation (Linux & Windows)', 'Ethical Hacking Methodologies'],
        level: 'متوسط',
        projectFocus: 'تنفيذ اختبار اختراق مصرح به على بيئة تدريبية والحصول على تقرير مفصل بنقاط الضعف'
      },
      {
        number: '03',
        name: 'Web Application Security & OWASP',
        nameAr: 'أمن تطبيقات الويب وثغرات OWASP Top 10',
        description: 'اكتشاف واستغلال ثغرات المواقع الإلكترونية والـ APIs ومعرفة طرق تحصينها البرمجية.',
        skills: ['SQL Injection (SQLi) & Blind SQLi', 'Cross-Site Scripting (XSS: Stored, Reflected)', 'Cross-Site Request Forgery (CSRF)', 'Server-Side Request Forgery (SSRF)', 'Burp Suite Professional Skills'],
        level: 'متوسط',
        projectFocus: 'فحص تطبيق ويب كامل عبر Burp Suite وإثبات وجود ثغرة SQLi واقتراح الحل البرمجي الآمن'
      },
      {
        number: '04',
        name: 'Network Defense, Firewalls & Zero Trust',
        nameAr: 'الدفاع الشبكي وجدران الحماية ونموذج الثقة الصفرية',
        description: 'تأمين المحيط الشبكي وتطبيق أحدث مبادئ الثقة الصفرية ومصادقة المستخدمين.',
        skills: ['Intrusion Detection/Prevention (Snort, Suricata)', 'Next-Gen Firewalls & WAF (Cloudflare / ModSecurity)', 'Zero Trust Architecture (ZTA)', 'Identity & Access Management (IAM & MFA)', 'Network Micro-segmentation'],
        level: 'متقدم',
        projectFocus: 'تهيئة جدار حماية WAF لمنع هجمات حجب الخدمة واعتراض هجمات الحقن التلقائية'
      },
      {
        number: '05',
        name: 'SOC Operations, Incident Response & Forensics',
        nameAr: 'عمليات مركز الأمن الاستجابة للحوادث والتحقيق الرقمي',
        description: 'مراقبة التهديدات اللحظية، تحليل السجلات الأمنية، وجمع الأدلة الجنائية الرقمية.',
        skills: ['SIEM Platforms (Splunk, Elastic SIEM)', 'EDR (Endpoint Detection & Response)', 'Digital Forensics & Memory Analysis (Volatility)', 'Incident Response Lifecycle (NIST SP 800-61)', 'Malware Triage & Sandboxing'],
        level: 'متقدم',
        projectFocus: 'التحقيق في حادثة اختراق محاكاة عبر تحليل سجلات SIEM وتحديد نقطة الدخول والمحطات المصابة'
      },
      {
        number: '06',
        name: 'Cloud Security, Threat Hunting & Compliance',
        nameAr: 'أمن الحوسبة السحابية وصيد التهديدات والامتثال',
        description: 'تأمين موارد السحابة، مطاردة التهديدات السيبرانية المتقدمة، وتطبيق معايير ISO و NIST.',
        skills: ['AWS / Azure Security Center & IAM Audits', 'Cloud Security Posture Management (CSPM)', 'MITRE ATT&CK Framework Mapping', 'Threat Hunting with Threat Intelligence Feeds', 'ISO 27001, SOC 2 & NIST CSF Compliance'],
        level: 'احترافي',
        projectFocus: 'بناء استراتيجية دفاع سيبراني متكاملة لمؤسسة سحابية متوافقة مع إطار عمل MITRE ATT&CK'
      }
    ]
  }
};
