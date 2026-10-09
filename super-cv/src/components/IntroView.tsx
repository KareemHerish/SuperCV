import React, { useState, useEffect, useRef } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { TECH_ROADMAPS } from '../data/roadmaps';
import { ALL_ROADMAPS_MAP, DetailedRoadmapTrack } from '../data/allRoadmapsData';
import { RoadmapModal } from './RoadmapModal';
import { SuperCVLogo } from './SuperCVLogo';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'scale' | 'fade' | 'left' | 'right';
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransitionStyle = () => {
    if (isVisible) {
      return 'opacity-100 translate-y-0 translate-x-0 scale-100 filter-none';
    }
    switch (direction) {
      case 'scale':
        return 'opacity-0 scale-[0.93] translate-y-8';
      case 'fade':
        return 'opacity-0';
      case 'left':
        return 'opacity-0 -translate-x-8 translate-y-2';
      case 'right':
        return 'opacity-0 translate-x-8 translate-y-2';
      case 'up':
      default:
        return 'opacity-0 translate-y-10 scale-[0.98]';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${getTransitionStyle()} ${className}`}
    >
      {children}
    </div>
  );
};

export const IntroView: React.FC = () => {
  const { cv, setActiveTab, theme, toggleTheme, openAuth } = useCV();
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'cv' | 'quiz' | 'rag' | null>(null);
  
  // Hero section mount state for coordinated slow-motion choreography
  const [isHeroMounted, setIsHeroMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsHeroMounted(true);
    }, 60);

    // Full target text for the typewriter animation
    const fullText = 'إحنا نساعدك ...';
    let typeIndex = 0;
    let intervalId: any = null;

    // Noticeable delay: wait 1250ms after the section and "مش عارف تبدأ منين؟" appear before starting typing
    const startTypeTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (typeIndex < fullText.length) {
          typeIndex++;
          setTypedText(fullText.slice(0, typeIndex));
        } else {
          clearInterval(intervalId);
          setIsTypewriterDone(true);
        }
      }, 110); // Deliberate typing rhythm
    }, 1250);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(startTypeTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Smooth responsive momentum wheel scrolling with larger travel distance
  useEffect(() => {
    let isWheeling = false;
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.overflow-y-auto') ||
        target?.closest('textarea') ||
        target?.closest('pre') ||
        target?.closest('[role="dialog"]')
      ) {
        return;
      }

      e.preventDefault();
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      // Substantially increased scroll travel distance
      const deltaMultiplier = e.deltaMode === 1 ? 45 : 2.5;
      targetY = Math.max(0, Math.min(maxScroll, targetY + e.deltaY * deltaMultiplier));

      if (!isWheeling) {
        isWheeling = true;
        const animate = () => {
          const diff = targetY - currentY;
          if (Math.abs(diff) < 1.0) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            isWheeling = false;
          } else {
            // Responsive easing (0.22 instead of sluggish 0.08)
            currentY += diff * 0.22;
            window.scrollTo(0, currentY);
            rafId = requestAnimationFrame(animate);
          }
        };
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleScroll = () => {
      if (!isWheeling) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Interactive mini-quiz state for the live demo on intro page
  const [miniQuizSelected, setMiniQuizSelected] = useState<number | null>(null);
  const [miniQuizAnswered, setMiniQuizAnswered] = useState<boolean>(false);

  // Roadmap Track Details Modal state
  const [selectedRoadmapTrack, setSelectedRoadmapTrack] = useState<DetailedRoadmapTrack | null>(null);

  const handleOpenRoadmapTrack = (title: string) => {
    const track = ALL_ROADMAPS_MAP[title];
    if (track) {
      setSelectedRoadmapTrack(track);
    }
  };

  const { user, logout } = useAuth();

  const handleEnterDashboard = (tab: string = 'build-cv') => {
    if (!user) {
      openAuth('login');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const interactiveFeatures = [
    {
      id: 'cv' as const,
      title: 'بناء الـ CV و ATS',
      icon: 'edit_document',
      badge: '98% ATS Pass',
      tabTarget: 'build-cv',
    },
    {
      id: 'quiz' as const,
      title: 'اختبر نفسك',
      icon: 'checklist',
      badge: 'سؤال تفاعلي',
      tabTarget: 'ask-ai',
    },
    {
      id: 'rag' as const,
      title: 'المساعد الذكي',
      icon: 'auto_awesome',
      badge: 'معاينة شات',
      tabTarget: 'ask-ai',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-background)] text-[var(--color-on-surface)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-[var(--color-on-primary)] transition-colors duration-200">
      {/* ========================================================================= */}
      {/* SHADOW APPEARANCE: MULTI-LAYER AMBIENT LIGHTING & ATMOSPHERIC AURA        */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-center hero luminous spotlight with depth */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] sm:w-[1100px] h-[580px] bg-gradient-to-b from-[var(--color-primary)]/15 via-[var(--color-primary)]/5 to-transparent blur-[160px] rounded-full pointer-events-none"></div>

        {/* Right side ambient soft shadow aura */}
        <div className="absolute top-[32%] right-[-10%] w-[550px] h-[550px] bg-[var(--bg-surface-highest)]/40 blur-[150px] rounded-full pointer-events-none"></div>

        {/* Left side ambient aura */}
        <div className={`absolute top-[60%] left-[-10%] w-[600px] h-[600px] ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-emerald-500/10'} blur-[170px] rounded-full pointer-events-none transition-colors duration-500`}></div>

        {/* Bottom subtle shadow & ambient glow rising from bottom (subtle white in dark mode, emerald in light mode) */}
        <div className={`absolute -bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[440px] bg-gradient-to-t ${theme === 'dark' ? 'from-white/[0.12] via-white/[0.04] to-transparent' : 'from-emerald-500/20 via-emerald-500/8 to-transparent'} blur-[130px] rounded-full pointer-events-none transition-all duration-500`}></div>
        <div className={`absolute bottom-0 inset-x-0 h-[360px] ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,255,255,0.08),transparent_70%)]' : 'bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(16,185,129,0.12),transparent_70%)]'} pointer-events-none transition-all duration-500`}></div>

        {/* Geometric subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.22]"></div>
      </div>

      {/* ========================================================================= */}
      {/* INTRO TOP NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 w-full backdrop-blur-xl bg-[var(--bg-surface-lowest)]/90 border-b border-[var(--color-border)] px-4 sm:px-8 py-2.5 sm:py-3 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-h-[56px] sm:min-h-[64px]">
          {/* Logo with superhero illustration on the right (RTL start) */}
          <div
            onClick={() => handleEnterDashboard('profile')}
            className="flex items-center gap-3 sm:gap-3.5 cursor-pointer select-none group relative py-1"
            title="سوبر CV"
          >
            {/* The Superhero CV Logo image on the right */}
            <div className="relative shrink-0 translate-y-1.5 sm:translate-y-2 group-hover:scale-105 transition-transform duration-300">
              <SuperCVLogo className="w-14 h-14 sm:w-[68px] sm:h-[68px] drop-shadow-md" />
            </div>

            {/* Word سوبر CV */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Circular badge CV above stretched baa */}
              <div className="flex items-center justify-center mb-[-4px] relative z-10">
                <span className={`translate-y-2 sm:translate-y-2.5 w-5.5 h-5.5 sm:w-6 sm:h-6 font-mono text-[8.5px] sm:text-[9.5px] font-black uppercase rounded-full border shadow-xs flex items-center justify-center transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white bg-white/15 border-white/30 dark:text-white dark:bg-white/15 dark:border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                    : 'text-emerald-800 bg-emerald-500/10 border-emerald-500/30 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'
                }`}>
                  CV
                </span>
              </div>

              {/* Word سوبر */}
              <div className="flex items-center justify-center overflow-visible">
                <span className={`text-xl sm:text-2xl lg:text-3xl font-black leading-none select-none whitespace-nowrap transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-white dark:text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]'
                    : 'text-slate-900'
                }`}>
                  سوبـــــــــــــــــر
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Mode Toggle Switch */}
            <button
              onClick={toggleTheme}
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              className="relative w-14 h-7.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-[var(--color-border)] p-1 cursor-pointer shadow-inner flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            >
              {/* Background Indicator Icons */}
              <span className="absolute left-1.5 text-indigo-400 material-symbols-outlined text-[13px] pointer-events-none select-none">
                dark_mode
              </span>
              <span className="absolute right-1.5 text-amber-500 material-symbols-outlined text-[13px] pointer-events-none select-none">
                light_mode
              </span>
              {/* Animated Sliding Knob */}
              <span
                style={{ left: theme === 'dark' ? '3px' : 'calc(100% - 25px)' }}
                className="absolute top-1 w-5.5 h-5.5 rounded-full bg-white dark:bg-emerald-500 text-slate-700 dark:text-white shadow-md flex items-center justify-center transition-all duration-200 pointer-events-none"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </span>
            </button>

            {/* User status or login button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-on-surface)] cursor-pointer transition-all"
                  title="عرض ملفك الشخصي"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="truncate max-w-[110px]">{user.displayName || user.email?.split('@')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] border border-[var(--color-border)] text-xs font-bold cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>تسجيل الدخول</span>
              </button>
            )}

          </div>
        </div>
      </header>
      {/* Spacer to prevent content from jumping beneath fixed header */}
      <div className="h-[74px] sm:h-[86px] w-full" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* HERO SECTION WITH PROGRESSIVE SLOW-MOTION CHOREOGRAPHY                    */}
      {/* ========================================================================= */}
      <section
        className={`relative z-10 min-h-[calc(100dvh-74px)] sm:min-h-[calc(100dvh-86px)] max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center text-center py-6 sm:py-10 box-border transition-all duration-1200 ease-out will-change-transform ${
          isHeroMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        }`}
      >

        {/* 1) Hero Main Title - Appears with slow-motion alongside the section */}
        <div
          className={`transition-all duration-1000 ease-out will-change-transform ${
            isHeroMounted
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-8 filter-blur'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <h1 className="flex flex-col items-center justify-center max-w-5xl mx-auto drop-shadow-sm leading-tight">
            <span className="block text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-on-surface)]">
              مش عارف تبدأ منين؟
            </span>
            <span className="inline-flex items-center justify-center text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] mt-2 sm:mt-2.5 min-h-[1.4em]">
              <span>{typedText}</span>
              {!isTypewriterDone && typedText.length > 0 && (
                <span className="inline-block w-[3px] h-[1em] bg-[var(--color-primary)] ms-1 animate-pulse" />
              )}
            </span>
          </h1>
        </div>

        {/* 2) Hero Subtitle - Appears smoothly once typing finishes */}
        <div
          className={`transition-all duration-1000 ease-out will-change-transform ${
            isTypewriterDone
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-8 filter-blur'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <p className="mt-3 sm:mt-4 text-xs sm:text-base lg:text-lg text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed text-center font-normal">
            ابن الـCV بتاعك، اعرف إيه اللي ناقصك، واتعلم الصح عشان توصل للشغل اللي نفسك فيه
          </p>
        </div>

        {/* 3) Hero CTAs - Appears right after subtitle */}
        <div
          className={`w-full sm:w-auto transition-all duration-1000 ease-out will-change-transform ${
            isTypewriterDone
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{ transitionDelay: '350ms' }}
        >
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => handleEnterDashboard('build-cv')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-slate-950 dark:font-extrabold text-sm font-bold shadow-lg shadow-emerald-600/25 dark:shadow-[0_0_22px_rgba(52,211,153,0.4)] hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit_document</span>
              <span>ابدأ دلوقتي</span>
            </button>

            <button
              onClick={() => {
                if (!user) {
                  openAuth('login');
                } else {
                  setActiveTab('ask-ai');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] border border-[var(--color-border)] text-sm font-semibold shadow-appearance-pill hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>اتكلم مع مساعدك الذكي</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHADOW APPEARANCE HERO CARD MOCKUP WITH RESPONSIVE FLOATING SATELLITES    */}
        {/* ========================================================================= */}
        <div
          className={`w-full max-w-5xl mt-8 sm:mt-10 relative transition-all duration-1100 ease-out will-change-transform ${
            isTypewriterDone
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-[0.94]'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Floating Satellite 1: Top-Left Verified ATS Badge */}
          <div className="flex absolute -top-5 sm:-top-6 -left-2 sm:-left-6 z-20 items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-appearance-card animate-float-slow">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">verified</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold text-[var(--color-on-surface)]">
                قرب النسبة مع ال ATS
              </div>
            </div>
          </div>

          {/* Floating Satellite 2: Bottom-Right RAG Sync Badge */}
          <div className="flex absolute -bottom-5 sm:-bottom-6 -right-2 sm:-right-6 z-20 items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-appearance-card animate-float-reverse">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">hub</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold text-[var(--color-on-surface)]">اكتشف ال Roadmaps</div>
            </div>
          </div>

          {/* Main Elevated Glass Container */}
          <div className="relative w-full rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[var(--color-border)] via-[var(--color-border)]/40 to-transparent shadow-appearance-hero border border-[var(--color-border)]/80 hover:scale-[1.01] transition-all duration-500">
            {/* Inner Dashboard Simulation */}
            <div className="relative w-full rounded-2xl bg-[var(--bg-surface-low)] overflow-hidden border border-[var(--color-border)] p-4 sm:p-7 flex flex-col gap-5 text-right shadow-inner">

              {/* Three Stat Cards with Deep Shadow (Visual showcase only, non-clickable) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {/* Card 1 */}
                <div
                  className="p-4 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col justify-between gap-2.5 shadow-appearance-card cursor-default select-none text-right h-full"
                >
                  <div className="flex items-center justify-between gap-2 min-h-[30px]">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-on-surface)] whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px] text-emerald-500 shrink-0">verified</span>
                      <span>جاهزيتك المهنية</span>
                    </span>
                    <span className="text-emerald-500 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 whitespace-nowrap">
                      94/100 جاهزية
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                    خلي ال Skills بتاعتك تزيد وطور منها.
                  </span>
                </div>

                {/* Card 2 */}
                <div
                  className="p-4 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col justify-between gap-2.5 shadow-appearance-card cursor-default select-none text-right h-full"
                >
                  <div className="flex items-center justify-between gap-2 min-h-[30px]">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-on-surface)] whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)] shrink-0">military_tech</span>
                      <span>مهاراتك المطلوبة</span>
                    </span>
                    <span className="text-[var(--color-primary)] font-bold font-mono text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 shrink-0 whitespace-nowrap">
                      14+ Skill
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                    اعرف أهم المهارات المطلوبة في المجال اللي مستهدفه.
                  </span>
                </div>

                {/* Card 3 */}
                <div
                  className="p-4 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col justify-between gap-2.5 shadow-appearance-card cursor-default select-none text-right h-full"
                >
                  <div className="flex items-center justify-between gap-2 min-h-[30px]">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-on-surface)] whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px] text-cyan-400 shrink-0">auto_awesome</span>
                      <span>مساعدك الذكي</span>
                    </span>
                    <span className="text-emerald-500 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 whitespace-nowrap">
                      مستعد يساعدك
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                    اسأل عن الـCV، مهاراتك، أو إيه اللي ناقصك.
                  </span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE FEATURE INSPECTOR (Live interactive preview on Intro page)   */}
      {/* ========================================================================= */}
      <section id="interactive-preview" className="relative z-10 py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[var(--color-border)]">
        <RevealOnScroll delayMs={0} direction="up">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--color-on-surface)] tracking-tight">
              شوف أمثلة مباشرة من هنا
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[var(--color-on-surface-variant)] max-w-xl">
              اضغط على أي ميزة لمعاينتها تفاعلياً قبل الدخول إليها في لوحة التحكم
            </p>
          </div>
        </RevealOnScroll>

        {/* Feature Tabs Bar */}
        <RevealOnScroll delayMs={100} direction="up">
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-8 p-1.5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] shadow-appearance-pill">
            {interactiveFeatures.map(feat => {
              const isActive = activeInteractiveTab === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveInteractiveTab(prev => (prev === feat.id ? null : feat.id))}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-slate-950 dark:font-extrabold shadow-md shadow-emerald-500/25 scale-[1.02]'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-high)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{feat.icon}</span>
                  <span>{feat.title}</span>
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Interactive Feature Stage with Shadow Appearance (renders only after user clicks a tab) */}
        {activeInteractiveTab !== null && (
          <RevealOnScroll delayMs={80} direction="scale">
            <div className="rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] p-6 sm:p-10 shadow-appearance-hero text-right relative overflow-hidden transition-all duration-300">
              {/* Tab 1: CV Builder preview with Mini ATS-compliant CV visual mockup */}
              {activeInteractiveTab === 'cv' && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-[var(--color-border)] pb-4">
                  <h3 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">task_alt</span>
                    <span>نموذج CV متوافق مع انظمة ال ATS</span>
                  </h3>
                </div>

                {/* Grid: Mini CV Document Sheet on one side + ATS validation highlights on other side */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Mini ATS CV Document Mockup (100% English & ATS Compliant Sections) */}
                  <div className="lg:col-span-8 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] p-6 sm:p-8 shadow-appearance-card relative overflow-hidden font-sans text-xs" dir="ltr">
                    {/* Resume Header (Contact Information) */}
                    <div className="border-b border-[var(--color-border)] pb-4 text-left">
                      <h4 className="text-xl sm:text-2xl font-black text-[var(--color-on-surface)] tracking-tight">
                        AHMED MAMDOUH
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-[var(--color-primary)] mt-0.5 tracking-wide">
                        Senior Full Stack & AI Applications Engineer
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-mono text-[var(--color-outline)]">
                        <span>Cairo, Egypt</span>
                        <span>|</span>
                        <span>ahmed.mamdouh@example.com</span>
                        <span>|</span>
                        <span>+20 100 123 4567</span>
                        <span>|</span>
                        <span className="text-[var(--color-primary)]">linkedin.com/in/ahmed</span>
                        <span>|</span>
                        <span className="text-[var(--color-primary)]">github.com/ahmed</span>
                      </div>
                    </div>

                    {/* Resume Body: Standard ATS Sections in English */}
                    <div className="mt-4 flex flex-col gap-4 text-[11px] leading-relaxed text-left">
                      {/* Section 1: Professional Summary */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>PROFESSIONAL SUMMARY</span>
                        </div>
                        <div className="pl-4 sm:pl-5">
                          <p className="text-[var(--color-on-surface-variant)] leading-normal">
                            Results-driven Senior Software Engineer with 5+ years of experience engineering high-performance web platforms and AI-driven solutions. Proven expertise in React 19, Next.js 15, TypeScript, Python, and scalable cloud architectures. Demonstrated history of slashing Largest Contentful Paint (LCP) by 42% and architecting design systems adopted across distributed engineering teams.
                          </p>
                        </div>
                      </div>

                      {/* Section 2: Skills (Technical & Soft) */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>SKILLS</span>
                        </div>
                        <div className="pl-4 sm:pl-5 grid grid-cols-1 gap-1.5 text-[11px]">
                          <div>
                            <span className="font-bold text-[var(--color-on-surface)] font-sans">Technical Skills: </span>
                            <span className="text-[var(--color-on-surface-variant)] font-mono">React 19, Next.js, TypeScript, Python, Node.js, Tailwind CSS, PostgreSQL, Docker, Git, CI/CD</span>
                          </div>
                          <div>
                            <span className="font-bold text-[var(--color-on-surface)] font-sans">Soft Skills: </span>
                            <span className="text-[var(--color-on-surface-variant)]">Problem Solving, Team Leadership, Agile / Scrum Collaboration, Effective Communication, Critical Thinking</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Education */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>EDUCATION</span>
                        </div>
                        <div className="pl-4 sm:pl-5 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-[var(--color-on-surface)]">B.Sc. in Computer Science & Artificial Intelligence</span>
                            <span className="text-[var(--color-on-surface-variant)] block">Cairo University — First Class Honors (GPA: 3.85 / 4.0)</span>
                          </div>
                          <span className="font-mono text-[10px] text-[var(--color-outline)]">2016 – 2020</span>
                        </div>
                      </div>

                      {/* Section 4: Projects */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>PROJECTS</span>
                        </div>
                        <div className="pl-4 sm:pl-5 flex flex-col gap-1.5">
                          <div>
                            <div className="flex items-center justify-between font-bold text-[var(--color-on-surface)]">
                              <span>AI Career Copilot & ATS Matching Engine</span>
                              <span className="font-mono text-[10px] text-[var(--color-outline)]">github.com/career-copilot</span>
                            </div>
                            <div className="text-[10px] text-[var(--color-primary)] font-mono mb-1">Next.js 15, TypeScript, Python, FastAPI, pgvector, Tailwind CSS</div>
                            <ul className="list-disc list-outside ml-4 text-[var(--color-on-surface-variant)] space-y-1">
                              <li>
                                Built an end-to-end RAG semantic search engine processing <strong className="text-[var(--color-on-surface)] font-semibold">50,000+ candidate profiles</strong> with sub-100ms vector query latency using pgvector.
                              </li>
                              <li>
                                Engineered automated ATS scoring pipeline evaluating keyword density and STAR metrics, boosting interview callback rates by <strong className="text-[var(--color-on-surface)] font-semibold">44%</strong>.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Experience */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>EXPERIENCE</span>
                        </div>
                        <div className="pl-4 sm:pl-5 flex flex-col gap-3">
                          <div>
                            <div className="flex items-center justify-between font-bold text-[var(--color-on-surface)]">
                              <span>Senior Software Engineer — Apex Digital Global</span>
                              <span className="font-mono text-[10px] text-[var(--color-outline)]">Jan 2022 – Present</span>
                            </div>
                            <div className="text-[10px] text-[var(--color-primary)] font-mono mb-1">Dubai / Remote</div>
                            <ul className="list-disc list-outside ml-4 text-[var(--color-on-surface-variant)] space-y-1">
                              <li>
                                Spearheaded frontend re-architecture of core platform serving <strong className="text-[var(--color-on-surface)] font-semibold">1.8M+ monthly active users</strong>, reducing p95 load times by <strong className="text-[var(--color-on-surface)] font-semibold">38%</strong> via Next.js SSR caching.
                              </li>
                              <li>
                                Designed and authored a unified Design System component library adopted by 5 engineering squads, cutting feature time-to-market by <strong className="text-[var(--color-on-surface)] font-semibold">40%</strong> and saving 120+ monthly developer hours.
                              </li>
                              <li>
                                Implemented robust CI/CD automated test suites with Jest and Playwright, elevating test coverage from 62% to <strong className="text-[var(--color-on-surface)] font-semibold">91%</strong> and reducing production bug regressions by 55%.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Section 6: Certifications */}
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-[var(--color-on-surface)] border-b border-[var(--color-border)] pb-1 mb-1.5 tracking-wider">
                          <span>CERTIFICATIONS</span>
                        </div>
                        <div className="pl-4 sm:pl-5 flex flex-col gap-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[var(--color-on-surface)]">
                              AWS Certified Solutions Architect – Associate
                            </span>
                            <span className="font-mono text-[10px] text-[var(--color-outline)]">2024</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[var(--color-on-surface)]">
                              Meta Certified Senior Frontend Engineer
                            </span>
                            <span className="font-mono text-[10px] text-[var(--color-outline)]">2023</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: ATS Score Circular Gauge Widget */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center">
                    <div className="w-full p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-appearance-card flex flex-col items-center justify-center text-center relative overflow-hidden">
                      {/* Subtle ambient emerald aura */}
                      <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-outline)] mb-6 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                        <span>ATS COMPLIANCE SCORE</span>
                      </div>

                      {/* Circular Gauge */}
                      <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                        {/* SVG Progress Circle */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                          {/* Background track circle */}
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-[var(--bg-surface-high)]"
                          />
                          {/* Progress circle for 98% (Circumference = 2 * PI * 70 ≈ 439.82, 98% -> offset ≈ 8.8) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="url(#ats-emerald-grad)"
                            strokeWidth="10"
                            strokeDasharray="439.82"
                            strokeDashoffset="8.8"
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="ats-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                          <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-500 tracking-tight">
                            98%
                          </span>
                          <span className="text-[11px] font-mono font-bold text-[var(--color-outline)] tracking-widest uppercase mt-1">
                            ATS PASSED
                          </span>
                          <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            ممتاز (98/100)
                          </span>
                        </div>
                      </div>

                      {/* Bottom Quick Metric Pills */}
                      <div className="mt-6 flex flex-col gap-2 w-full text-xs text-[var(--color-on-surface-variant)] text-right">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)]">
                          <span className="font-semibold text-[var(--color-on-surface)]">تنسيق الـ PDF</span>
                          <span className="text-emerald-500 font-bold font-mono">100% متوافق</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)]">
                          <span className="font-semibold text-[var(--color-on-surface)]">الكلمات المفتاحية</span>
                          <span className="text-emerald-500 font-bold font-mono">97% مطابقة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Quiz Preview */}
            {activeInteractiveTab === 'quiz' && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-[var(--color-border)] pb-4">
                  <h3 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">quiz</span>
                    <span>اختبر نفسك</span>
                  </h3>
                </div>

                <div className="p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col gap-5 shadow-appearance-card">
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-[var(--color-on-surface)] leading-relaxed">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] shrink-0"></span>
                    <span>إيه اللغة المستخدمة للتعامل مع الذكاء الاصطناعي؟</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {[
                      { idx: 0, text: 'Python (بايثون)', correct: true },
                      { idx: 1, text: 'HTML (إتش تي إم إل)', correct: false },
                      { idx: 2, text: 'C++ (سي بلس بلس)', correct: false },
                      { idx: 3, text: 'PHP (بي إتش بي)', correct: false },
                    ].map(opt => {
                      const isChosen = miniQuizSelected === opt.idx;
                      return (
                        <button
                          key={opt.idx}
                          onClick={() => {
                            setMiniQuizSelected(opt.idx);
                            setMiniQuizAnswered(true);
                          }}
                          className={`p-4 rounded-xl text-right text-xs sm:text-sm font-semibold leading-relaxed transition-all flex items-center justify-between border cursor-pointer ${
                            isChosen
                              ? opt.correct
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-appearance-pill'
                                : 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400 font-bold shadow-appearance-pill'
                              : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border-[var(--color-border)] text-[var(--color-on-surface)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs opacity-75 font-bold">{opt.idx + 1}.</span>
                            <span>{opt.text}</span>
                          </div>
                          {isChosen && (
                            <span className="material-symbols-outlined text-[20px]">
                              {opt.correct ? 'check_circle' : 'cancel'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {miniQuizAnswered && (
                    <div
                      className={`p-4 rounded-xl text-xs flex items-start gap-3 shadow-xs border ${
                        miniQuizSelected === 0
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-[var(--color-on-surface)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
                        {miniQuizSelected === 0 ? 'verified' : 'info'}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm">
                          {miniQuizSelected === 0 ? 'إجابة صحيحة وممتازة!' : 'الإجابة الصحيحة هي: Python (بايثون)'}
                        </span>
                        <p className="text-[11px] leading-relaxed text-[var(--color-on-surface-variant)]">
                          تعتبر لغة <strong>Python</strong> هي المعيار العالمي الأساسي لتطوير تطبيقات ونماذج الذكاء الاصطناعي (AI) وتعلم الآلة (Machine Learning)، وذلك بفضل مكتباتها العملاقة مثل PyTorch و TensorFlow و Scikit-learn و LangChain.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: AI Assistant simulation (Static chat mockup, read-only) */}
            {activeInteractiveTab === 'rag' && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-[var(--color-border)] pb-4">
                  <h3 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400">auto_awesome</span>
                    <span>المساعد الذكي</span>
                  </h3>
                </div>

                {/* Static Chat Mockup Box */}
                <div className="rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-appearance-card overflow-hidden flex flex-col">
                  {/* Chat Top Status Bar */}
                  <div className="px-6 py-4 bg-[var(--bg-surface-low)] border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <span className="material-symbols-outlined text-[19px]">smart_toy</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[var(--color-on-surface)] flex items-center gap-1.5">
                        <span>المساعد الذكي</span>
                        <span className="font-mono text-cyan-500 dark:text-cyan-400 font-semibold tracking-wide">(Careem)</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Thread (Static) */}
                  <div className="p-5 sm:p-6 flex flex-col gap-5 bg-[var(--bg-surface-lowest)]/50">
                    {/* User Message */}
                    <div className="self-start max-w-xl flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-[var(--color-outline)] px-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                        <span>أنت</span>
                      </span>
                      <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-none bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs leading-relaxed shadow-sm">
                        إيه المهارات اللي محتاج أركز عليها علشان أطور الـ CV بتاعي لوظائف الـ AI والـ Machine Learning؟
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="self-end max-w-2xl flex flex-col gap-1.5 items-start">
                      <span className="text-[11px] font-mono font-bold text-cyan-500 dark:text-cyan-400 px-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span>Careem</span>
                      </span>
                      <div className="w-full p-4 sm:p-5 rounded-2xl rounded-tr-none bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] leading-relaxed shadow-appearance-card flex flex-col gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">auto_awesome</span>
                          <p className="text-[var(--color-on-surface)] leading-relaxed">
                            أهلاً بك! لتجهيز سيرتك الذاتية بنجاح لمسارات الـ AI والتعلم الآلي في كبرى الشركات، إليك أهم المهارات الواجب التركيز عليها:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
                          <div className="p-2.5 rounded-lg bg-[var(--bg-surface-lowest)] border border-cyan-500/30 text-xs flex flex-col gap-0.5">
                            <span className="font-bold text-cyan-400 font-mono">1. Python & Core Libraries</span>
                            <span className="text-[11px] text-[var(--color-on-surface-variant)]">إتقان PyTorch أو TensorFlow والتعامل مع البيانات عبر Pandas و NumPy.</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[var(--bg-surface-lowest)] border border-cyan-500/30 text-xs flex flex-col gap-0.5">
                            <span className="font-bold text-cyan-400 font-mono">2. RAG & Vector Databases</span>
                            <span className="text-[11px] text-[var(--color-on-surface-variant)]">ربط النماذج اللغوية (LLMs) ببيانات مخصصة باستخدام أطر مثل LangChain.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
        )}
      </section>





      {/* ========================================================================= */}
      {/* ROADMAP.SH TRACKS SHOWCASE (Visual Showcase / Non-clickable Display)       */}
      {/* ========================================================================= */}
      <section id="roadmaps" className="relative z-10 py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[var(--color-border)]">
        <RevealOnScroll delayMs={0} direction="up">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--color-on-surface)] tracking-tight drop-shadow-sm">
              معظم المسارات الموجودة
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[var(--color-on-surface-variant)] max-w-xl">
              اكتشف المسار المناسب ليك واعرف الطريق
            </p>
          </div>
        </RevealOnScroll>

        {/* Interactive Roadmap.sh Showcase Window */}
        <RevealOnScroll delayMs={100} direction="up">
          <div
            className="rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] p-5 sm:p-8 shadow-appearance-card relative"
            dir="ltr"
          >

            {/* 3-Column Grid matching the screenshot (10 tracks per column) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                {[
                  'Full Stack',
                  'DevSecOps',
                  'AI Engineer',
                  'Machine Learning',
                  'iOS',
                  'Software Architect',
                  'Technical Writer',
                  'MLOps',
                  'Developer Relations',
                  'Forward Deployed Engineer',
                ].map((title, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenRoadmapTrack(title)}
                    className="p-3.5 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:bg-[var(--bg-surface-high)]/60 flex items-center justify-center text-center text-xs sm:text-sm font-semibold text-[var(--color-on-surface)] shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group w-full"
                  >
                    <span className="group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
                  </button>
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                {[
                  'Frontend',
                  'Android',
                  'Data Analyst',
                  'AI and Data Scientist',
                  'Product Design',
                  'Blockchain',
                  'Cyber Security',
                  'Game Developer',
                  'Product Manager',
                  'BI Analyst',
                ].map((title, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenRoadmapTrack(title)}
                    className="p-3.5 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:bg-[var(--bg-surface-high)]/60 flex items-center justify-center text-center text-xs sm:text-sm font-semibold text-[var(--color-on-surface)] shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group w-full"
                  >
                    <span className="group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
                  </button>
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Backend' },
                  { title: 'DevOps' },
                  { title: 'SEO', isNew: true },
                  { title: 'Data Engineer' },
                  { title: 'PostgreSQL' },
                  { title: 'QA' },
                  { title: 'UX Design' },
                  { title: 'Server Side Game Developer' },
                  { title: 'Engineering Manager' },
                  { title: 'Network Engineer' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenRoadmapTrack(item.title)}
                    className="p-3.5 rounded-xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:bg-[var(--bg-surface-high)]/60 flex items-center justify-center text-center text-xs sm:text-sm font-semibold text-[var(--color-on-surface)] shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="group-hover:text-[var(--color-primary)] transition-colors">{item.title}</span>
                      {item.isNew && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          <span>New</span>
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION (Luminous Elevated Container with Shadow Appearance) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <RevealOnScroll delayMs={100} direction="scale">
          <div className="p-8 sm:p-16 rounded-3xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] shadow-appearance-hero relative overflow-hidden flex flex-col items-center hover:scale-[1.01] transition-all duration-500">
            {/* Luminous accent spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-[var(--color-primary)]/15 blur-3xl pointer-events-none"></div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight">
              جاهز لتجربة سيرة ذاتية تتجاوز الفلترة الآلية بنسبة تصل إلي 98%؟
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[var(--color-on-surface-variant)] max-w-lg leading-relaxed">
              ابدأ الآن مجاناً — اختبر مهاراتك، ابنِ سيرتك الذاتية، واستشر الذكاء الاصطناعي لسد الفجوات قبل مقابلة عملك القادمة.
            </p>

            <button
              onClick={() => handleEnterDashboard('build-cv')}
              className="mt-8 flex items-center gap-2 px-9 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-slate-950 dark:font-extrabold text-sm font-bold shadow-lg shadow-emerald-600/25 dark:shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>الدخول للمنصة وابدأ مجاناً</span>
              <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_forward</span>
            </button>
          </div>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[var(--color-border)] py-8 px-4 text-center text-xs text-[var(--color-outline)] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-white/[0.04] via-white/[0.01] to-transparent' : 'from-emerald-500/10 via-emerald-500/2 to-transparent'} pointer-events-none transition-colors duration-500`}></div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center gap-1">
          <span className="font-semibold text-xs sm:text-sm tracking-wide text-[var(--color-on-surface-variant)]">
            @SuperCV Powered by Karim Abdelaziz
          </span>
          <span className="text-[11px] font-mono text-[var(--color-outline)] tracking-wider">
            2026
          </span>
        </div>
      </footer>

      {/* Interactive Roadmap Details Modal */}
      <RoadmapModal
        track={selectedRoadmapTrack}
        onClose={() => setSelectedRoadmapTrack(null)}
        onSelectTrackForCV={(trackId) => handleEnterDashboard('build-cv')}
      />
    </div>
  );
};
