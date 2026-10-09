import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCV } from '../context/CVContext';
import {
  ALL_ROADMAPS_MAP,
  DetailedRoadmapTrack,
  engineeringTracks,
  aiDataTracks,
  mobileGamesTracks,
  productDesignTracks,
} from '../data/allRoadmapsData';
import { TECH_ROADMAPS } from '../data/roadmaps';

type DomainCategory = 'all' | 'engineering' | 'ai-data' | 'mobile-games' | 'product-design';

interface DomainTab {
  id: DomainCategory;
  label: string;
  icon: string;
  count: number;
}

export const RoadmapsView: React.FC = () => {
  const { cv, setTrackId, setActiveTab, setPendingAIQuestion } = useCV();

  // All tracks list as array of DetailedRoadmapTrack
  const allTracksList = useMemo<DetailedRoadmapTrack[]>(() => {
    return Object.values(ALL_ROADMAPS_MAP);
  }, []);

  // Track selection state (default to CV track or first track)
  const [selectedTrackId, setSelectedTrackId] = useState<string>(() => {
    if (cv.trackId && ALL_ROADMAPS_MAP[cv.trackId]) return cv.trackId;
    const found = allTracksList.find(t => t.id === cv.trackId || t.officialSlug === cv.trackId);
    return found?.id || 'ai-engineer';
  });

  // Keep synced with CV track when returning
  useEffect(() => {
    if (cv.trackId) {
      const found = allTracksList.find(t => t.id === cv.trackId || t.officialSlug === cv.trackId);
      if (found) {
        setSelectedTrackId(found.id);
      }
    }
  }, [cv.trackId, allTracksList]);

  // Selected track object
  const selectedTrack = useMemo<DetailedRoadmapTrack>(() => {
    return (
      allTracksList.find(t => t.id === selectedTrackId || t.officialSlug === selectedTrackId) ||
      allTracksList[0]
    );
  }, [allTracksList, selectedTrackId]);

  // View mode: 'pathway' (Detailed interactive stage timeline) or 'grid' (All 30 tracks grid like roadmap.sh screenshot)
  const [viewMode, setViewMode] = useState<'pathway' | 'grid'>('pathway');

  // Active category filter
  const [activeCategory, setActiveCategory] = useState<DomainCategory>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive skill mastery tracking per track (persisted in localStorage)
  const [masteredSkills, setMasteredSkills] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`supercv_skills_mastery_${selectedTrack.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reload mastered skills when selected track changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`supercv_skills_mastery_${selectedTrack.id}`);
      setMasteredSkills(saved ? JSON.parse(saved) : {});
    } catch {
      setMasteredSkills({});
    }
  }, [selectedTrack.id]);

  const toggleSkillMastery = (skillName: string) => {
    setMasteredSkills(prev => {
      const next = { ...prev, [skillName]: !prev[skillName] };
      try {
        localStorage.setItem(`supercv_skills_mastery_${selectedTrack.id}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Calculate total skills and progress percentage for the selected track
  const allSkillsForSelectedTrack = useMemo(() => {
    return (selectedTrack.stages || []).flatMap(s => s.skills || []);
  }, [selectedTrack]);

  const masteredCount = useMemo(() => {
    return allSkillsForSelectedTrack.filter(sk => masteredSkills[sk]).length;
  }, [allSkillsForSelectedTrack, masteredSkills]);

  const progressPercentage = useMemo(() => {
    if (allSkillsForSelectedTrack.length === 0) return 0;
    return Math.round((masteredCount / allSkillsForSelectedTrack.length) * 100);
  }, [allSkillsForSelectedTrack, masteredCount]);

  // Category Tabs Configuration
  const categoryTabs: DomainTab[] = useMemo(() => [
    {
      id: 'all',
      label: 'جميع المسارات',
      icon: 'hub',
      count: allTracksList.length,
    },
    {
      id: 'engineering',
      label: 'تطوير الويب والبرمجيات',
      icon: 'code',
      count: Object.keys(engineeringTracks).length,
    },
    {
      id: 'ai-data',
      label: 'الذكاء الاصطناعي والبيانات',
      icon: 'psychology',
      count: Object.keys(aiDataTracks).length,
    },
    {
      id: 'mobile-games',
      label: 'الموبايل والألعاب والأمن',
      icon: 'devices',
      count: Object.keys(mobileGamesTracks).length,
    },
    {
      id: 'product-design',
      label: 'إدارة المنتجات والتصميم',
      icon: 'design_services',
      count: Object.keys(productDesignTracks).length,
    },
  ], [allTracksList.length]);

  // Categorized tracks lists
  const engineeringList = useMemo(() => Object.values(engineeringTracks), []);
  const aiDataList = useMemo(() => Object.values(aiDataTracks), []);
  const mobileGamesList = useMemo(() => Object.values(mobileGamesTracks), []);
  const productDesignList = useMemo(() => Object.values(productDesignTracks), []);

  // Filtered tracks based on category and search query
  const filteredTracks = useMemo(() => {
    let list: DetailedRoadmapTrack[] = allTracksList;

    if (activeCategory === 'engineering') list = engineeringList;
    else if (activeCategory === 'ai-data') list = aiDataList;
    else if (activeCategory === 'mobile-games') list = mobileGamesList;
    else if (activeCategory === 'product-design') list = productDesignList;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.trim().toLowerCase();
    return list.filter(track => {
      const matchTitle = track.title.toLowerCase().includes(query);
      const matchTitleAr = track.titleAr.toLowerCase().includes(query);
      const matchSummary = track.summary?.toLowerCase().includes(query);
      const matchSkill = (track.stages || []).some(stage =>
        (stage.skills || []).some(skill => skill.toLowerCase().includes(query))
      );
      return matchTitle || matchTitleAr || matchSummary || matchSkill;
    });
  }, [
    activeCategory,
    searchQuery,
    allTracksList,
    engineeringList,
    aiDataList,
    mobileGamesList,
    productDesignList,
  ]);

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    setViewMode('pathway');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const isCurrentTrackInCV =
    selectedTrack.id === cv.trackId ||
    selectedTrack.officialSlug === cv.trackId ||
    TECH_ROADMAPS.find(t => t.id === cv.trackId)?.titleEn === selectedTrack.title;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-7 select-none" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER: Visual Career Roadmaps Banner                            */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] p-6 sm:p-8 shadow-xs">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <span className="material-symbols-outlined text-[26px]">alt_route</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    طريقي — خرائط المسارات المهنية
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    30 مساراً معتمداً
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                  اكتشف خارطة طريقك المهنية محطة بمحطة، وتعرف على المهارات المطلوبة والمشاريع التطبيقية لكل مرحلة
                </p>
              </div>
            </div>
          </div>

          {/* Quick Active CV Track Status Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] shadow-xs">
              <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-medium">مسارك المعتمد بالـ CV</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                  {allTracksList.find(t => t.id === cv.trackId || t.officialSlug === cv.trackId)?.titleAr ||
                   TECH_ROADMAPS.find(t => t.id === cv.trackId)?.titleAr ||
                   'مهندس تطبيقات الذكاء الاصطناعي'}
                </span>
              </div>
            </div>

            {/* View Mode Toggle: Interactive Pathway vs 30-Tracks Grid */}
            <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)]">
              <button
                onClick={() => setViewMode('pathway')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'pathway'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">timeline</span>
                <span>الخارطة التفصيلية</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>شبكة الـ 30 مساراً</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border)]/70 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Domain Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
            {categoryTabs.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-slate-700 dark:text-slate-300 border-[var(--color-border)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900 font-bold'
                      : 'bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] lg:w-72">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مسار أو مهارة (مثال: Docker, React)..."
              className="w-full pl-8 pr-9 py-2 rounded-xl text-xs bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FAST TRACK CHIPS STRIP (Horizontal quick-jump between 30 tracks)       */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
          <span>اختر مسارك للاستعراض السريع: ({filteredTracks.length} مسار)</span>
          {searchQuery && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              نتائج البحث عن: "{searchQuery}"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {filteredTracks.map(track => {
            const isSelected = track.id === selectedTrack.id || track.officialSlug === selectedTrack.id;
            const isCV =
              track.id === cv.trackId ||
              track.officialSlug === cv.trackId ||
              TECH_ROADMAPS.find(t => t.id === cv.trackId)?.titleEn === track.title;

            return (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrackId(track.id);
                  if (viewMode === 'grid') setViewMode('pathway');
                }}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-[var(--bg-surface-lowest)] hover:bg-[var(--bg-surface-low)] text-slate-700 dark:text-slate-300 border-[var(--color-border)]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] opacity-85 group-hover:scale-110 transition-transform">
                  {track.icon || 'alt_route'}
                </span>
                <span>{track.titleAr}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`} dir="ltr">
                  {track.title}
                </span>
                {isCV && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} title="مسارك بالـ CV" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VIEW MODE A: ALL 30 TRACKS GRID (Aesthetic Roadmap.sh 3-Column Grid)  */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Section Description */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500">category</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                شبكة المسارات المهنية الـ 30 المصنفة حسب التخصص
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              اضغط على أي مسار لعرض خريطة مراحله التفصيلية والمهارات المكونة له
            </span>
          </div>

          {/* 3-Column Categorized Grid Matching the Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="ltr">
            {filteredTracks.map(track => {
              const isSelected = track.id === selectedTrack.id || track.officialSlug === selectedTrack.id;
              const isCV =
                track.id === cv.trackId ||
                track.officialSlug === cv.trackId ||
                TECH_ROADMAPS.find(t => t.id === cv.trackId)?.titleEn === track.title;

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`relative p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-[var(--color-border)] hover:border-emerald-500/50'
                  }`}
                  dir="rtl"
                >
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                      }`}>
                        <span className="material-symbols-outlined text-[22px]">{track.icon || 'alt_route'}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {track.titleAr}
                        </span>
                        <span className="font-mono text-xs text-slate-400 font-semibold" dir="ltr">
                          {track.title}
                        </span>
                      </div>
                    </div>

                    {isCV && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                        مسارك المعتمد
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed text-right">
                    {track.summary || 'خريطة شاملة ومحدثة لإتقان هذا المسار المهني وفق أفضل الممارسات والمعايير العالمية.'}
                  </p>

                  {/* Card Footer Meta & Action */}
                  <div className="pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">flag</span>
                        <span>{track.stages?.length || 4} محطات</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span>{track.duration || '6-9 أشهر'}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline cursor-pointer"
                    >
                      <span>استعراض الخريطة</span>
                      <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW MODE B: DETAILED CONNECTED ROADMAP PATHWAY (Roadmap.sh Style)    */}
      {/* ========================================================================= */}
      {viewMode === 'pathway' && (
        <motion.div
          key={selectedTrack.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-8"
        >
          {/* TRACK OVERVIEW CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            
            {/* Top Bar with Title, Badges & Actions */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-[var(--color-border)] pb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <span className="material-symbols-outlined text-[32px]">{selectedTrack.icon || 'alt_route'}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      مسار: {selectedTrack.titleAr}
                    </h2>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-surface-high)] text-slate-700 dark:text-slate-300 font-bold border border-[var(--color-border)]" dir="ltr">
                      {selectedTrack.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mt-1">
                    {selectedTrack.summary || 'خريطة شاملة لتطوير المهارات المطلوبة في هذا التخصص خطوة بخطوة وفق أحدث المعايير القياسية.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Set as CV Track & Navigate */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
                {isCurrentTrackInCV ? (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>مسارك المعتمد الحالي بالـ CV</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTrackId(selectedTrack.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>تعيين هذا المسار لسيرتي الذاتية (CV)</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isCurrentTrackInCV}
                  onClick={() => {
                    if (isCurrentTrackInCV) return;
                    setTrackId(selectedTrack.id);
                    setActiveTab('build-cv');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isCurrentTrackInCV
                      ? 'bg-[var(--bg-surface-low)] text-slate-400 dark:text-slate-500 border border-[var(--color-border)]/50 cursor-not-allowed opacity-60'
                      : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-slate-700 dark:text-slate-300 border border-[var(--color-border)] cursor-pointer'
                  }`}
                  title={isCurrentTrackInCV ? 'هذا المسار مطبّق بالفعل في سيرتك الذاتية الحالية' : 'الانتقال إلى محرر السيرة الذاتية لتطبيق مهارات المسار'}
                >
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  <span>{isCurrentTrackInCV ? 'مطبّق بالفعل في الـ CV' : 'تطبيق في الـ CV'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackId(selectedTrack.id);
                    setPendingAIQuestion(`اختبرني بأسئلة اختيار من متعدد في مسار ${selectedTrack.titleAr || selectedTrack.title}، اديني 5 أسئلة مع 4 اختيارات لكل سؤال عشان أقيم مستواي.`);
                    setActiveTab('ask-ai');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                  title="اطلب اختباراً تفاعلياً من Careem في هذا المسار"
                >
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  <span>اختبر مهاراتك مع Careem</span>
                </button>
              </div>
            </div>

            {/* Track Highlights Strip (Duration, Level, Stage Count, Skills Count) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">المدة المتوقعة</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedTrack.duration || '6 – 9 أشهر'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">مستوى الصعوبة</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedTrack.level || 'متوسط إلى متقدم'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">flag</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">عدد المحطات</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedTrack.stages?.length || 4} مراحل رئيسية</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">إجمالي المهارات</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{allSkillsForSelectedTrack.length} مهارة مطلوبة</span>
                </div>
              </div>
            </div>

            {/* Interactive Progress Tracking Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 shadow-xs flex flex-col gap-2.5 transition-all animate-[pulse_4s_ease-in-out_infinite] hover:animate-none">
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px] animate-bounce">military_tech</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    تابع إنجازك: علّم على أي مهارة تخلّصها عشان تزوّد نسبتك
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs shrink-0">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
                  <span className="text-slate-400">({masteredCount} من {allSkillsForSelectedTrack.length})</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* THE CONNECTED ROADMAP PATHWAY (Roadmap.sh Style Vertical Flow)            */}
          {/* ========================================================================= */}
          <div className="relative flex flex-col gap-6">
            
            {/* Visual Pathway Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  محطات خارطة الطريق المهنية ({selectedTrack.stages?.length || 0} محطات)
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                تسلسل زمني تصاعدي من مرحلة التأسيس حتى الاحتراف
              </span>
            </div>

            {/* Stages Timeline Container with Connected Center/Side Spine */}
            <div className="relative flex flex-col gap-6 before:absolute before:top-6 before:bottom-6 before:right-6 sm:before:right-8 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-purple-500 before:rounded-full before:opacity-30 before:z-0">
              {(selectedTrack.stages || []).map((stage, idx) => {
                const stageSkills = stage.skills || [];
                const stageMasteredSkills = stageSkills.filter(sk => masteredSkills[sk]).length;
                const isStageComplete = stageSkills.length > 0 && stageMasteredSkills === stageSkills.length;

                // Color accent by stage level
                const levelColor = 
                  stage.level === 'أساسي' ? 'bg-emerald-500 text-white' :
                  stage.level === 'متوسط' ? 'bg-sky-500 text-white' :
                  stage.level === 'متقدم' ? 'bg-indigo-500 text-white' :
                  'bg-purple-500 text-white';

                const levelBadgeClass =
                  stage.level === 'أساسي' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' :
                  stage.level === 'متوسط' ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' :
                  stage.level === 'متقدم' ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' :
                  'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';

                return (
                  <div
                    key={idx}
                    className="relative z-10 flex items-start gap-4 sm:gap-6 pr-0"
                  >
                    {/* Stage Number Node / Marker */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface-lowest)] border-2 border-[var(--color-border)] shadow-md flex flex-col items-center justify-center shrink-0 group-hover:border-emerald-500 transition-colors">
                      <span className={`text-[11px] sm:text-xs font-mono font-black px-2 py-0.5 rounded-md ${levelColor}`}>
                        {stage.number || `0${idx + 1}`}
                      </span>
                      {isStageComplete && (
                        <span className="material-symbols-outlined text-emerald-500 text-[14px] mt-0.5">
                          check_circle
                        </span>
                      )}
                    </div>

                    {/* Stage Card Content */}
                    <div className="flex-1 p-5 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] hover:border-emerald-500/40 transition-all shadow-xs flex flex-col gap-4">
                      
                      {/* Stage Card Top */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--color-border)]/60 pb-3.5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              {stage.nameAr || stage.name}
                            </h4>
                            {stage.level && (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${levelBadgeClass}`}>
                                المستوى: {stage.level}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-400 font-semibold mt-0.5" dir="ltr">
                            {stage.name}
                          </span>
                        </div>

                        {/* Stage completion indicator */}
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 shrink-0">
                          <span className="material-symbols-outlined text-[16px] text-emerald-500">task_alt</span>
                          <span>{stageMasteredSkills}/{stageSkills.length} مهارة مكتملة</span>
                        </div>
                      </div>

                      {/* Stage Detailed Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Hands-on Milestone Project Box (If exists) */}
                      {stage.projectFocus && (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                              مشروع المحطة التطبيقي (Milestone Project):
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {stage.projectFocus}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Stage Skills Chips */}
                      <div className="flex flex-col gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          المهارات والأدوات المطلوب إتقانها في هذه المحطة (اضغط على المهارة لتحديدها):
                        </span>

                        <div className="flex flex-wrap gap-2" dir="ltr">
                          {stageSkills.map((skillName, skIdx) => {
                            const isMastered = !!masteredSkills[skillName];
                            const isSearchMatch =
                              searchQuery.trim().length > 0 &&
                              skillName.toLowerCase().includes(searchQuery.trim().toLowerCase());

                            return (
                              <button
                                key={skIdx}
                                type="button"
                                onClick={() => toggleSkillMastery(skillName)}
                                title={isMastered ? 'تم إتقانها (اضغط للإلغاء)' : 'اضغط للتحديد كمهارة متقنة'}
                                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                                  isMastered
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : isSearchMatch
                                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500 ring-2 ring-amber-500/30'
                                    : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-slate-700 dark:text-slate-300 border-[var(--color-border)]'
                                }`}
                              >
                                <span className={`material-symbols-outlined text-[14px] ${
                                  isMastered ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'
                                }`}>
                                  {isMastered ? 'check_circle' : 'circle'}
                                </span>
                                <span>{skillName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Fast Navigation Call to Action */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </span>
              <div className="flex flex-col text-right">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  هل ترغب في استعراض مسار مهني آخر؟
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يمكنك التبديل بين الـ 30 مساراً المتاحة في أي وقت وتعيين أي مسار لسيرتك الذاتية.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setViewMode('grid');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-slate-800 dark:text-slate-200 border border-[var(--color-border)] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>استعراض شبكة جميع المسارات (30)</span>
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};
