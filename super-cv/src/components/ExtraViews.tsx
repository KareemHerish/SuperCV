import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { TECH_ROADMAPS } from '../data/roadmaps';

// ============================================================================
// 1. ROADMAP VIEW: "طريقي"
// ============================================================================
export const RoadmapView: React.FC = () => {
  const { cv, setTrackId, setActiveTab } = useCV();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-[24px]">map</span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--color-on-surface)]">
              طريقي — المسارات المهنية والتعليمية
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1">
            اختر تخصصك لمعرفة المهارات المطلوبة في سوق العمل وخارطة الطريق خطوة بخطوة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">المسار المختار حالياً:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {cv.targetRole}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TECH_ROADMAPS.map(track => {
          const isCurrent = cv.trackId === track.id;
          return (
            <div
              key={track.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                isCurrent
                  ? 'bg-emerald-50/70 border-emerald-500/50 dark:bg-emerald-950/30 dark:border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'bg-[var(--bg-surface-lowest)] border-[var(--color-border)] hover:border-emerald-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">{track.icon}</span>
                  </div>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                      المسار النشط
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[var(--color-on-surface)]">
                  {track.titleAr}
                </h3>
                <span className="text-xs font-mono text-[var(--color-outline)] block mt-0.5">
                  {track.titleEn}
                </span>

                <p className="text-xs text-[var(--color-on-surface-variant)] mt-2.5 leading-relaxed">
                  {track.descriptionAr}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-wrap gap-1.5">
                  {track.categories.slice(0, 3).map(cat => (
                    <span
                      key={cat.nameEn}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-surface-low)] text-[var(--color-on-surface-variant)]"
                    >
                      {cat.nameAr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => {
                    setTrackId(track.id);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[var(--bg-surface-high)] hover:bg-emerald-600 hover:text-white text-[var(--color-on-surface)] cursor-pointer'
                  }`}
                >
                  {isCurrent ? 'مسارك الحالي ✓' : 'اختيار هذا المسار'}
                </button>
                <button
                  onClick={() => setActiveTab('build-cv')}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] border border-[var(--color-border)] cursor-pointer"
                  title="تضمين مهارات هذا المسار في سيرتك الذاتية"
                >
                  ابنِ CV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 2. READINESS VIEW: "شوف جاهزيتك"
// ============================================================================
export const ReadinessView: React.FC = () => {
  const { cv, setActiveTab } = useCV();

  const readinessScore = cv.atsScore || 94;

  const checks = [
    { title: 'التنسيق المتوافق مع الفلترة الآلية (Single Column)', passed: true, impact: '+25%' },
    { title: 'الكلمات المفتاحية المطلوبة في التخصص', passed: cv.techSkills.length >= 6, impact: '+20%' },
    { title: 'صياغة الخبرات بمعادلة إنجاز الأثر (STAR / Metrics)', passed: cv.experiences.length >= 1, impact: '+20%' },
    { title: 'بيانات الاتصال الكاملة والموقع وحساب LinkedIn', passed: !!(cv.email && cv.phone), impact: '+15%' },
    { title: 'الملخص التنفيذي المركز (Executive Summary)', passed: !!(cv.summary && cv.summary.length > 40), impact: '+10%' },
    { title: 'المشاريع البرمجية التوثيقية والشهادات المعتمدة', passed: cv.projects.length >= 1, impact: '+10%' },
  ];

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-[26px]">trending_up</span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--color-on-surface)]">
              شوف جاهزيتك — فحص التوافق وأنظمة التوظيف ATS
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1">
            تقرير تفاعلي شامل يوضح مدى جاهزية سيرتك الذاتية لاجتياز فلاتر الشركات ومسؤولي التوظيف
          </p>
        </div>
        <button
          onClick={() => setActiveTab('build-cv')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          <span>تحسين السيرة الذاتية الآن</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ATS Score Dial Card */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-400">معدل التوافق العام</span>
          <div className="w-36 h-36 rounded-full border-8 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center mt-4 shadow-sm">
            <span className="text-4xl font-black">{readinessScore}%</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">جاهزية ممتازة</span>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-4 leading-relaxed max-w-xs">
            سيرتك الذاتية تحقق أعلى معايير التوافق التقني وتتجاوز 98% من فلاتر الفحص الآلي للشركات العالمية.
          </p>
        </div>

        {/* Breakdown Checklist */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">checklist</span>
              <span>معايير الفحص والتقييم التفصيلي</span>
            </h2>

            <div className="space-y-3">
              {checks.map((chk, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        chk.passed ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-600'
                      }`}
                    >
                      {chk.passed ? '✓' : '!'}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-on-surface)]">
                      {chk.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {chk.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. PROJECTS VIEW: "مشاريع تناسبك"
// ============================================================================
export const ProjectsView: React.FC = () => {
  const { cv, setActiveTab } = useCV();

  const sampleProjects = [
    {
      title: 'Customer Churn Prediction & ML Pipeline',
      track: 'Data Science & AI',
      desc: 'بناء نموذج تنبؤي لمعدل دوران العملاء بدقة 91% باستخدام XGBoost مع نشر API عبر FastAPI وتوثيق في Docker.',
      tags: ['Python', 'Scikit-learn', 'XGBoost', 'FastAPI', 'Docker'],
      impact: 'يبرز مهارات الـ End-to-End Machine Learning',
    },
    {
      title: 'RAG Conversational Knowledge Copilot',
      track: 'AI Engineering',
      desc: 'محرك بحث دلالي ونظام إجابة ذكي يستند إلى pgvector و LangChain مع ربط مباشر ببيانات المستندات والـ PDF.',
      tags: ['Python', 'PostgreSQL', 'pgvector', 'LangChain', 'FastAPI'],
      impact: 'أقوى إضافة للـ CV لمهندسي الذكاء الاصطناعي اليوم',
    },
    {
      title: 'Real-time Analytics Dashboard & Visualization',
      track: 'Data Analysis & Frontend',
      desc: 'لوحة تحكم تفاعلية لرصد مؤشرات الأداء الحية مع معالجة مجموعات بيانات ضخمة باستخدام Pandas و Apache ECharts.',
      tags: ['React', 'TypeScript', 'Pandas', 'Tailwind CSS', 'ECharts'],
      impact: 'يثبت قدرتك على تحويل البيانات الضخمة لرؤى بصرية',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500 text-[26px]">grid_view</span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--color-on-surface)]">
              مشاريع تناسبك — أقوى أفكار المشاريع لتقوية سيرتك
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1">
            مشاريع واقعية مقترحة خصيصاً لمسارك المهني تجعل مسؤولي التوظيف يتواصلون معك
          </p>
        </div>
        <button
          onClick={() => setActiveTab('build-cv')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          + إضافة مشروع لسيرتك الذاتية
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleProjects.map((p, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {p.track}
              </span>
              <h3 className="text-base font-bold text-[var(--color-on-surface)] mt-3">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-2 leading-relaxed">
                {p.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tags.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--bg-surface-low)] text-[var(--color-on-surface)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {p.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. CONTACT VIEW: "تواصل معانا"
// ============================================================================
export const ContactView: React.FC = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
      <div className="p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs text-right">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-blue-500 text-[26px]">chat</span>
          <h1 className="text-2xl font-black text-[var(--color-on-surface)]">
            تواصل معانا
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mb-6">
          عندك استفسار، اقتراح، أو محتاج مساعدة في سيرتك الذاتية؟ فريقنا ومستشارونا جاهزون لمساعدتك.
        </p>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="material-symbols-outlined text-emerald-500 text-4xl mb-2">check_circle</span>
            <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">تم إرسال رسالتك بنجاح!</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">سيتواصل معك أحد مستشارينا المهنيين قريباً.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[var(--color-on-surface)] mb-1">الاسم بالكامل</label>
              <input
                required
                defaultValue="أحمد الشناوي"
                className="w-full h-11 px-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-on-surface)] mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                defaultValue="ahmed@example.com"
                className="w-full h-11 px-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-on-surface)] mb-1">رسالتك أو استفسارك</label>
              <textarea
                rows={4}
                required
                placeholder="اكتب استفسارك هنا بخصوص مراجعة الـ CV أو التوجيه المهني..."
                className="w-full p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              إرسال الرسالة
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
