import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { findTrackById } from '../data/roadmaps';
import { ProfileViewSkeleton } from './SkeletonLoader';

export const ProfileView: React.FC = () => {
  const { 
    cv, 
    setActiveTab, 
    hasCreatedCV, 
    loadSampleCV, 
    resetToEmptyCV,
    userCVs,
    saveCVToFirestore,
    switchCV,
    createNewCV,
    deleteCVFromFirestore,
    isSyncing,
    isLoadingCVs,
  } = useCV();
  const { user } = useAuth();
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState(false);

  const handleSaveToCloud = async () => {
    await saveCVToFirestore();
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleDeleteCV = async (e: React.MouseEvent, cvId: string) => {
    e.stopPropagation();
    try {
      await deleteCVFromFirestore(cvId);
      setDeleteConfirmId(null);
      setDeleteSuccessMsg(true);
      setTimeout(() => setDeleteSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Error deleting CV:', err);
    }
  };

  const availableCVs = userCVs || [];
  const hasAnyCVs = availableCVs.length > 0 || hasCreatedCV;

  // Dynamic statistics based strictly on existing, selected CV
  const currentRoleTitle = hasAnyCVs ? (cv.targetRole?.trim() || cv.title?.trim() || '') : '';
  const currentSkillsCount = hasAnyCVs && cv.techSkills && cv.techSkills.length > 0 ? cv.techSkills.length : 0;
  const currentAts = hasAnyCVs ? (cv.atsScore || 0) : 0;

  // Dynamic skills styling based on selected CV
  const skillIcons = ['terminal', 'psychology', 'database', 'monitoring', 'deployed_code', 'hub', 'layers', 'code', 'token', 'dns', 'memory', 'neurology'];
  const skillStyles = [
    { bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', iconColor: 'text-blue-500' },
    { bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', iconColor: 'text-purple-500' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', iconColor: 'text-amber-600' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', iconColor: 'text-emerald-600' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800', iconColor: 'text-cyan-600' },
    { bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800', iconColor: 'text-orange-600' },
  ];

  const displayedSkills = hasAnyCVs && cv.techSkills && cv.techSkills.length > 0
    ? cv.techSkills
    : [];

  if (isLoadingCVs) {
    return <ProfileViewSkeleton />;
  }

  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Welcome Card (Matching Screenshot)                        */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-l from-[#ecfdf5] via-[#f0fdf4]/60 to-[#f0f9ff] dark:from-emerald-950/25 dark:via-teal-950/15 dark:to-cyan-950/25 border border-emerald-100/90 dark:border-emerald-900/40 p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs">
        
        {/* Left Side: 3D Cute Laptop Illustration with Sparkles */}
        <div className="hidden md:flex items-center justify-center shrink-0 w-36 h-28 relative">
          <svg className="w-32 h-28 drop-shadow-md" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sparkles around laptop */}
            <path d="M20 25 L24 22 L20 19 L16 22 Z" fill="#60a5fa" />
            <path d="M125 15 L129 12 L125 9 L121 12 Z" fill="#38bdf8" />
            <path d="M130 55 L133 53 L130 51 L127 53 Z" fill="#818cf8" />
            <path d="M10 65 L13 63 L10 61 L7 63 Z" fill="#38bdf8" />

            {/* Laptop Screen Body */}
            <rect x="30" y="16" width="80" height="56" rx="8" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
            {/* Inner Screen Display */}
            <rect x="36" y="22" width="68" height="44" rx="4" fill="#eff6ff" />
            
            {/* Avatar on Screen */}
            <circle cx="70" cy="38" r="8" fill="#3b82f6" />
            <path d="M58 58 C58 50, 64 48, 70 48 C76 48, 82 50, 82 58 Z" fill="#3b82f6" />
            
            {/* Laptop Base */}
            <path d="M18 76 L122 76 C126 76, 128 78, 126 82 L116 88 C114 89, 112 90, 108 90 L32 90 C28 90, 26 89, 24 88 L14 82 C12 78, 14 76, 18 76 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />
            {/* Trackpad */}
            <rect x="58" y="80" width="24" height="6" rx="2" fill="#bfdbfe" />
          </svg>
        </div>

        {/* Center: Greeting & Action Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right flex-1 px-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>مرحبا بك في رحلتك المهنية</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            ابن CV احترافي, اعرف مهاراتك واكتشف الطريق اللي يوصلك للشغل اللي بتحلم بيه.
          </p>
        </div>

        {/* Right Side: Hand-drawn "Your Next Step Matters" badge */}
        <div className="hidden lg:flex flex-col items-center justify-center shrink-0 rotate-[-5deg] select-none pl-4">
          <div className="text-emerald-600 dark:text-emerald-400 font-serif flex flex-col items-center leading-tight">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">Your</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight -mt-1">Next Step</span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight -mt-1">Matters</span>
          </div>
          {/* Custom curved underline */}
          <svg className="w-28 h-3 text-emerald-500 mt-1" viewBox="0 0 120 12" fill="none">
            <path d="M 6 8 Q 60 1 114 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CVs Selector Card (بطاقة السير الذاتية وإدارة النسخ - مبنية على الـ CV المختار) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] p-6 shadow-sm flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">folder_shared</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  سيرك الذاتية المحفوظة ({availableCVs.length})
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                createNewCV();
                setActiveTab('build-cv');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>إنشاء سيرة ذاتية</span>
            </button>
          </div>
        </div>

        {/* Delete Success Alert Banner */}
        {deleteSuccessMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم حذف السيرة الذاتية من السحابة بنجاح.</span>
          </div>
        )}

        {/* CVs Grid or Clean Empty State */}
        {availableCVs.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-[var(--bg-surface-low)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center text-center gap-3 select-none">
            <div className="w-14 h-14 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">folder_off</span>
            </div>
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">لا توجد أي سيرة ذاتية محفوظة</h4>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  createNewCV();
                  setActiveTab('build-cv');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>إنشاء سيرة ذاتية</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {availableCVs.map((item, idx) => {
              const isSelected = item.id === cv.id || (!cv.id && idx === 0);
              const score = item.atsScore || 90;
              const skillsNum = item.techSkills?.length || 0;
              const updatedDate = item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                : '12 مايو 2025';

              return (
                <div
                  key={item.id || idx}
                  onClick={() => switchCV(item.id)}
                  className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 text-right select-none ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'border-[var(--color-border)] bg-[var(--bg-surface-low)] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-[var(--bg-surface-high)]'
                  }`}
                >
                  {/* Top Row: Title + Selected Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {isSelected ? 'check_circle' : 'description'}
                        </span>
                      </div>
                      <div>
                        {(() => {
                          const itemTrack = findTrackById(item.trackId || 'other');
                          const itemTitle = item.trackId === 'other'
                            ? (item.targetRole?.trim() || item.title || 'تراك مخصص')
                            : (itemTrack ? itemTrack.titleAr : (item.title || item.targetRole || `سيرة ذاتية #${idx + 1}`));
                          const itemSubtitle = item.targetRole || (itemTrack ? (itemTrack.roleTitle || itemTrack.titleEn) : 'مسار مهني عام');
                          return (
                            <>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[170px]" title={itemTitle}>
                                {itemTitle}
                              </h4>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block max-w-[170px]">
                                {itemSubtitle}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1 shadow-xs animate-fadeIn">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        <span>النشطة حالياً</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                        انقر للتحديد
                      </span>
                    )}
                  </div>

                  {/* Middle Metrics Badges */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1 border-t border-[var(--color-border)]/50">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">
                      <span className="material-symbols-outlined text-[13px]">layers</span>
                      <span>{skillsNum} مهارة</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-slate-500 dark:text-slate-400 text-[10px]">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      <span>{updatedDate}</span>
                    </div>
                  </div>

                  {/* Bottom Row Actions & Cloud Delete Option */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchCV(item.id);
                        setActiveTab('build-cv');
                      }}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit_note</span>
                      <span>تعديل</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Delete CV from Cloud with Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(item.id);
                        }}
                        className="px-2 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer flex items-center gap-1 group"
                        title="حذف هذه السيرة من السحابة"
                      >
                        <span className="material-symbols-outlined text-[16px] text-red-500/80 group-hover:text-red-600">
                          delete_outline
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-red-600">
                          هل تريد الحذف؟
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Confirmation when user clicks Delete */}
                  {deleteConfirmId === item.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-2 text-xs animate-fadeIn"
                    >
                      <div className="flex items-center gap-1.5 text-red-700 dark:text-red-300 font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[16px] text-red-600">delete_forever</span>
                        <span>هل تريد الحذف؟</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCV(e, item.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          نعم، احذف
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-[11px] cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE KPI CARDS                                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: المجال الحالي */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center justify-between h-36">
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">المجال الحالي</div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate mt-1">
              {hasAnyCVs ? (currentRoleTitle || 'مسار مهني') : 'لم يتم تحديد مسار'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
              {hasAnyCVs ? 'المسار المهني المستهدف' : 'اختر مسارك في الـ Roadmaps'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">ads_click</span>
          </div>
        </div>

        {/* Card 2: عدد الـ Skills */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center justify-between h-36">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">عدد الـ Skills</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {hasAnyCVs && currentSkillsCount > 0 ? `${currentSkillsCount}+` : '0'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              مهارات
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">layers</span>
          </div>
        </div>

        {/* Card 3: الـ CV الحالي */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center justify-between h-36">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">الـ CV الحالي</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 truncate max-w-[140px]">
              {hasAnyCVs ? `${(currentRoleTitle || 'سيرتي').split(' ')[0]} CV` : 'لا يوجد CV بعد'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {hasAnyCVs ? 'سيرة نشطة' : 'لم يتم الإنشاء بعد'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE ROW: المسار الحالي & أبرز مهاراتك (Matching Screenshot)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Right (In RTL): المسار الحالي */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--color-border)]/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">map</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">المسار الحالي</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hasAnyCVs ? (currentRoleTitle || 'اختر مسارك المهني') : 'لم يتم اختيار مسار'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('roadmaps')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              استعراض المسارات
            </button>
          </div>

          {/* Stepper Timeline - Vertically Centered */}
          <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-8 my-auto min-h-[140px]">
            <div className="relative flex items-center justify-between">
              {/* Horizontal Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: hasAnyCVs ? '66%' : '0%' }}
                ></div>
              </div>

              {/* Step 1: البداية */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  hasAnyCVs
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">البداية</span>
              </div>

              {/* Step 2: متوسط */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  hasAnyCVs
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">متوسط</span>
              </div>

              {/* Step 3: متقدم */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">متقدم</span>
              </div>

              {/* Step 4: احترافي */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center"></div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">احترافي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left (In RTL): أبرز مهاراتك */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between">
          <div className="border-b border-[var(--color-border)]/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">star_outline</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">أبرز مهاراتك</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              أهم الـ Skills الموجودة عندك في الـ CV
            </p>
          </div>

          {/* Skill Pills matching selected CV */}
          <div className="pt-4 flex flex-wrap gap-2.5 items-center">
            {displayedSkills.length > 0 ? (
              displayedSkills.map((skillName, idx) => {
                const style = skillStyles[idx % skillStyles.length];
                const icon = skillIcons[idx % skillIcons.length];
                return (
                  <div
                    key={skillName + idx}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${style.bg}`}
                  >
                    <span className={`material-symbols-outlined text-[17px] ${style.iconColor}`}>{icon}</span>
                    <span>{skillName}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full py-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-[36px]">psychology</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  أنت لسه ماضيفتش مهاراتك
                </p>
                <button
                  onClick={() => setActiveTab('build-cv')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  إضافة مهارات الآن
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ROW: سريع كده & مستقبلك أقرب مما تتخيل (Matching Screenshot)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: سريع كده */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between">
          <div className="border-b border-[var(--color-border)]/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">lightbulb</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">سريع كده</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              معلومات سريعة وموجزة مستخلصة مباشرة من سيرتك الذاتية
            </p>
          </div>

          {/* Dynamic Info Cards Grid - only existing fields without dummy fallbacks */}
          {(() => {
            const stats: { icon: string; iconBg: string; iconColor: string; label: string; value: string }[] = [];
            if (hasAnyCVs && cv.targetRole?.trim()) {
              stats.push({
                icon: 'school',
                iconBg: 'bg-blue-50 dark:bg-blue-950/40',
                iconColor: 'text-blue-600 dark:text-blue-400',
                label: 'المجال المستهدف',
                value: cv.targetRole.trim(),
              });
            }
            if (hasAnyCVs && cv.updatedAt) {
              stats.push({
                icon: 'calendar_month',
                iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                label: 'أحدث تحديث للـ CV',
                value: new Date(cv.updatedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
              });
            }
            if (hasAnyCVs && cv.education?.[0]?.degree?.trim()) {
              stats.push({
                icon: 'trending_up',
                iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
                iconColor: 'text-indigo-600 dark:text-indigo-400',
                label: 'المؤهل العلمي',
                value: cv.education[0].degree.trim(),
              });
            }
            if (hasAnyCVs && cv.education?.[0]?.institution?.trim()) {
              stats.push({
                icon: 'account_balance',
                iconBg: 'bg-teal-50 dark:bg-teal-950/40',
                iconColor: 'text-teal-600 dark:text-teal-400',
                label: 'الجامعة / المؤسسة',
                value: cv.education[0].institution.trim(),
              });
            }
            if (hasAnyCVs && cv.location?.trim()) {
              stats.push({
                icon: 'pin_drop',
                iconBg: 'bg-amber-50 dark:bg-amber-950/40',
                iconColor: 'text-amber-600 dark:text-amber-400',
                label: 'الموقع الحالي',
                value: cv.location.trim(),
              });
            }
            if (hasAnyCVs && cv.experiences?.[0]?.company?.trim()) {
              stats.push({
                icon: 'work',
                iconBg: 'bg-purple-50 dark:bg-purple-950/40',
                iconColor: 'text-purple-600 dark:text-purple-400',
                label: 'آخر جهة عمل',
                value: cv.experiences[0].company.trim(),
              });
            }

            if (stats.length === 0) {
              return (
                <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--bg-surface-low)] mt-4">
                  <span className="material-symbols-outlined text-slate-400 text-[28px]">assignment_late</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    لا توجد بيانات مسجلة في هذا الـ CV بعد
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    املأ مؤهلك أو خبراتك في محرر السيرة لتظهر ملخصاتها هنا تلقائياً
                  </p>
                </div>
              );
            }

            return (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-3.5 pt-4`}>
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)]/70 flex flex-col items-center text-center justify-center gap-1.5"
                  >
                    <div className={`w-8 h-8 rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Right: مستقبلك أقرب مما تتخيل */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-b from-[#f5f3ff] to-[#eff6ff] dark:from-indigo-950/30 dark:to-blue-950/20 border border-indigo-100/90 dark:border-indigo-900/40 shadow-xs flex flex-col justify-between overflow-hidden relative">
          <div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              مستقبلك أقرب مما تتخيل
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              خطوة بخطوة.. لحد ما توصل لهدفك
            </p>
          </div>

          {/* Mountain with Flag SVG Illustration */}
          <div className="w-full flex items-end justify-center pt-6">
            <svg className="w-48 h-24" viewBox="0 0 200 100" fill="none">
              {/* Back mountain */}
              <polygon points="20,100 80,45 140,100" fill="#c7d2fe" opacity="0.6" />
              {/* Front main mountain */}
              <polygon points="70,100 145,25 210,100" fill="#818cf8" opacity="0.75" />
              {/* Snow peak */}
              <polygon points="135,38 145,25 155,38" fill="#ffffff" />
              {/* Flag on mountain summit */}
              <line x1="145" y1="25" x2="145" y2="12" stroke="#4f46e5" strokeWidth="2.5" />
              <polygon points="145,12 158,16 145,20" fill="#4f46e5" />
              {/* Footpath curve */}
              <path d="M 40 95 Q 110 80 142 35" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};
