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

export const ProjectsView: React.FC = () => {
  const { cv, updateCV, setActiveTab, askAIWithPrompt } = useCV();

  const [projects, setProjects] = useState<AIProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('الكل');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedProjectTitles, setAddedProjectTitles] = useState<Set<string>>(new Set());

  const currentTrack = TECH_ROADMAPS.find((t) => t.id === cv.trackId) || TECH_ROADMAPS[0];

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
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // ignore cache read error
        }
      }

      if (forceNew) {
        setIsReloading(true);
      } else {
        setIsLoading(true);
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

        if (!res.ok) {
          throw new Error('Failed to generate projects');
        }

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
        }
      } catch (err) {
        console.error('Error generating AI projects:', err);
      } finally {
        setIsLoading(false);
        setIsReloading(false);
      }
    },
    [cv.targetRole, cv.title, cv.techSkills, cv.softSkills, cv.summary, currentTrack]
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
                  5 مشاريع مقترحة
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
