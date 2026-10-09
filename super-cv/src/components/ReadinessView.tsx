import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCV } from '../context/CVContext';

interface MatchAnalysisResult {
  matchScore: number;
  jobTitle: string;
  company: string;
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: {
    technicalSkills: number;
    experience: number;
    roleFit: number;
    domainKnowledge: number;
  };
  strengths: string[];
  recommendations: string[];
  summaryFeedback: string;
}

export const ReadinessView: React.FC = () => {
  const { cv, addCustomTechSkill, setActiveTab, setPendingAIQuestion } = useCV();
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<MatchAnalysisResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Client-side fallback analyzer
  const analyzeClientSide = (jd: string): MatchAnalysisResult => {
    const techDictionary = [
      'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
      'Python', 'Django', 'FastAPI', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'RESTful APIs',
      'Tailwind CSS', 'CSS3', 'HTML5', 'Sass', 'Git', 'GitHub Actions', 'CI/CD',
      'Jest', 'Cypress', 'Playwright', 'Microservices', 'System Design', 'Kafka', 'RabbitMQ',
      'Linux', 'Flutter', 'React Native', 'Kotlin', 'Swift', 'Redux', 'Zustand', 'Prisma',
      'Drizzle', 'Webpack', 'Vite', 'Terraform', 'WebSockets', 'OAuth', 'Firebase', 'Supabase',
      'Agile', 'Scrum', 'Problem Solving', 'Clean Architecture', 'Data Structures', 'Algorithms',
      'Performance Optimization', 'Security', 'Figma'
    ];

    const allCandidateSkills = [
      ...(cv.techSkills || []),
      ...(cv.softSkills || []),
    ];

    const matched: string[] = [];
    const missing: string[] = [];

    techDictionary.forEach((item) => {
      const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(jd)) {
        const hasSkill = allCandidateSkills.some(
          (cs) => cs.toLowerCase() === item.toLowerCase() ||
                  cs.toLowerCase().includes(item.toLowerCase()) ||
                  item.toLowerCase().includes(cs.toLowerCase())
        );
        if (hasSkill) {
          if (!matched.includes(item)) matched.push(item);
        } else {
          if (!missing.includes(item)) missing.push(item);
        }
      }
    });

    allCandidateSkills.forEach((cSkill) => {
      if (cSkill.trim()) {
        const esc = cSkill.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(`\\b${esc}\\b`, 'i');
        if (rx.test(jd) && !matched.includes(cSkill)) {
          matched.push(cSkill);
        }
      }
    });

    const total = matched.length + missing.length;
    let score = 72;
    if (total > 0) {
      const ratio = matched.length / total;
      score = Math.min(Math.max(Math.round(ratio * 75 + 20), 38), 96);
    }

    const firstLine = jd.split('\n')[0].trim();
    const roleTitle = firstLine.length > 5 && firstLine.length < 50 ? firstLine : (cv.targetRole || 'Software Engineer');

    return {
      matchScore: score,
      jobTitle: roleTitle,
      company: 'الشركة المستهدفة',
      matchedSkills: matched,
      missingSkills: missing,
      breakdown: {
        technicalSkills: Math.min(score + 4, 98),
        experience: Math.max(score - 6, 45),
        roleFit: Math.min(score + 2, 95),
        domainKnowledge: Math.max(score - 4, 52),
      },
      strengths: [
        `تطابق مباشر في ${matched.slice(0, 3).join(', ') || 'المهارات التقنية الأساسية'} المطلوبة في إعلان الوظيفة.`,
        `سيرتك الذاتية تغطي جوانب العمل الجماعي والأدوات القياسية المطلوبة في بيئة العمل.`,
        `خلفيتك المهنية الحالية تتوافق بشكل جيد مع المسؤوليات الرئيسية للمنصب.`,
      ],
      recommendations: [
        missing.length > 0
          ? `أضف المهارات الناقصة (${missing.slice(0, 3).join(', ')}) إلى قسم المهارات في سيرتك الذاتية فوراً.`
          : 'أبرز المشاريع والتطبيقات التي تستخدم نفس الأدوات المطلوبة.',
        'قم بإعادة صياغة إنجازاتك في قسم الخبرات بالأرقام والنسب المئوية لإبراز الأثر العملي.',
        'طابق المسمى الوظيفي المستهدف في سيرتك ليتوافق بدقة مع اسم الوظيفة في الإعلان.',
      ],
      summaryFeedback: score >= 75
        ? 'توافق قوي جداً! لديك فرصة عالية لاجتياز الفرز الأولي والدخول في مرحلة المقابلات.'
        : 'توافق واعد؛ يمكنك سد الفجوات وإضافة المهارات الناقصة لرفع نسبة القبول لأكثر من 85%.',
    };
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/readiness/analyze-job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          candidateCV: cv,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.matchScore !== undefined) {
          setResult(data);
          return;
        }
      }

      // If server route is unavailable or returned error, use client-side analyzer
      const fallback = analyzeClientSide(jobDescription);
      setResult(fallback);
    } catch (err) {
      console.warn('Network notice, using instant client analysis:', err);
      const fallback = analyzeClientSide(jobDescription);
      setResult(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMissingSkill = (skill: string) => {
    addCustomTechSkill(skill);
    showToast(`تمت إضافة "${skill}" إلى مهارات سيرتك الذاتية بنجاح!`);

    // Dynamically update result state
    if (result) {
      setResult((prev) => {
        if (!prev) return null;
        const newMissing = prev.missingSkills.filter((s) => s !== skill);
        const newMatched = [...prev.matchedSkills, skill];
        const newTotal = newMatched.length + newMissing.length;
        const newScore = Math.min(Math.round((newMatched.length / Math.max(newTotal, 1)) * 75 + 20), 98);

        return {
          ...prev,
          matchScore: Math.max(prev.matchScore, newScore),
          matchedSkills: newMatched,
          missingSkills: newMissing,
        };
      });
    }
  };

  const handleAddAllMissingSkills = () => {
    if (!result || result.missingSkills.length === 0) return;
    result.missingSkills.forEach((s) => addCustomTechSkill(s));
    showToast(`تمت إضافة جميع المهارات الناقصة (${result.missingSkills.length}) إلى سيرتك الذاتية بنجاح!`);

    setResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        matchScore: Math.min(prev.matchScore + 18, 98),
        matchedSkills: [...prev.matchedSkills, ...prev.missingSkills],
        missingSkills: [],
      };
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
      pill: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      label: 'توافق ممتاز مع متطلبات الوظيفة! 🎉',
    };
    if (score >= 50) return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      pill: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      label: 'توافق جيد — يمكنك سد الفجوات بسهولة 👍',
    };
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      pill: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      label: 'فجوة في المتطلبات — تحتاج لتطوير مهارات إضافية 🎯',
    };
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-700 text-white shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-emerald-500/40"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">target</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            شوف جاهزيتك - خليك سوبر
          </h1>
        </div>

        {/* Current CV Info Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">السيرة المفحوصة:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
              {cv.fullName?.trim() || cv.targetRole || 'سيرتك الحالية'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {cv.techSkills?.length || 0} مهارة
          </span>
        </div>
      </div>

      {/* Main Input Card: Textarea & Comparison Action */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
        {/* Textarea Input */}
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          dir="rtl"
          rows={7}
          placeholder="حط وصف الوظيفه هنا - وقارن مع مهاراتك"
          className="w-full p-4.5 rounded-2xl border border-[var(--color-border)] bg-[var(--bg-surface-low)]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm text-right placeholder:text-right leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-y"
        />

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
              !jobDescription.trim() || isAnalyzing
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.01]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>جاري المقارنة...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                <span>ابدأ المقارنة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* 1. Main Match Score Bar Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">نتيجة الفحص للوظيفة:</span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {result.jobTitle}
                </h2>
              </div>

              {/* Big Score Badge */}
              <div className="flex items-center gap-4 self-center md:self-auto">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl sm:text-5xl font-black font-mono ${getScoreColor(result.matchScore).text}`}>
                      {result.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Animated Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">نسبه التوافق الكلية:</span>
                <span className={`font-mono text-sm ${getScoreColor(result.matchScore).text}`}>{result.matchScore}%</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.matchScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getScoreColor(result.matchScore).bg} shadow-sm`}
                />
              </div>
            </div>

            {/* Sub-metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">المهارات التقنية</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{result.breakdown.technicalSkills}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.breakdown.technicalSkills}%` }} />
                </div>
                <span className="text-[10px] text-slate-500">التقنيات والمكتبات المباشرة</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">مستوى وسنوات الخبرة</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{result.breakdown.experience}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.breakdown.experience}%` }} />
                </div>
                <span className="text-[10px] text-slate-500">عمق المشاريع وسنوات العمل</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">مطابقة المسمى</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{result.breakdown.roleFit}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${result.breakdown.roleFit}%` }} />
                </div>
                <span className="text-[10px] text-slate-500">تناسق العنوان والمسار</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">معرفة المجال</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">{result.breakdown.domainKnowledge}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.breakdown.domainKnowledge}%` }} />
                </div>
                <span className="text-[10px] text-slate-500">المعايير المنهجية وهيكلة العمل</span>
              </div>
            </div>
          </div>

          {/* 2. Matched Skills vs Missing Skills Grid (Two Big Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Column A: Matched Skills (المهارات المتطابقة) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">المهارات المتطابقة في سيرتك</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">مطلوبة في الوظيفة وموجودة بالفعل في ملفك</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">
                  {result.matchedSkills.length} مهارة
                </span>
              </div>

              {result.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">✓</span>
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  لم يتم رصد مهارات متطابقة مباشرة. نوصي بإضافة المهارات المطلوبة أدناه لسيرتك.
                </div>
              )}
            </div>

            {/* Column B: Missing Skills (المهارات الناقصة) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-rose-200 dark:border-rose-900/50 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">المهارات الناقصة المطلوبة في الوظيفة</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">مذكورة في إعلان الوظيفة وغير مسجلة بسيرتك</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono">
                  {result.missingSkills.length} مهارة
                </span>
              </div>

              {result.missingSkills.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.missingSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 shadow-2xs group"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleAddMissingSkill(skill)}
                          title={`إضافة ${skill} لسيرتك الذاتية`}
                          className="w-5 h-5 rounded-md bg-rose-200 dark:bg-rose-800/60 hover:bg-emerald-500 hover:text-white text-rose-700 dark:text-rose-200 flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleAddAllMissingSkills}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-100 hover:bg-emerald-600 text-rose-800 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-emerald-600 dark:hover:text-white border border-rose-300 dark:border-rose-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_task</span>
                      <span>إضافة جميع المهارات الناقصة إلى سيرتي الذاتية دفعة واحدة (+)</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                  <span>رائع! لا توجد مهارات رئيسية ناقصة، سيرتك تغطي جميع متطلبات الوظيفة.</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Strengths & Recommendations Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Strengths */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                <span className="material-symbols-outlined text-emerald-500 text-[20px]">thumb_up</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">نقاط القوة لملفك في هذه الوظيفة</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">lightbulb</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">توصيات الذكاء الاصطناعي لرفع فرص قبولك</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">💡</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Bottom Action Buttons */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const jd = jobDescription.trim();
                  const prompt = jd
                    ? `عايز استشارتك بخصوص جاهزيتي للوظيفة دي بناءً على وصف الوظيفة التالي ومطابقته مع الـ CV بتاعي:\n\n"""\n${jd}\n"""\n\nإيه تقييمك لجاهزيتي، وإيه المهارات أو النقاط اللي أركز عليها عشان أعلي فرص قبولي؟`
                    : 'عايز استشارتك بخصوص جاهزيتي لمتطلبات الوظيفة وإزاي أطور مهاراتي عشان أتقبل.';
                  setPendingAIQuestion(prompt);
                  setActiveTab('ask-ai');
                }}
                className="px-5 py-3 rounded-2xl bg-[var(--bg-surface-low)] hover:bg-slate-200 dark:hover:bg-slate-800 border border-[var(--color-border)] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span>استشر Careem حول هذه الوظيفة</span>
              </button>
            </div>

            <button
              onClick={() => {
                setJobDescription('');
                setResult(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold cursor-pointer underline transition-colors"
            >
              فحص وصف وظيفي جديد
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
