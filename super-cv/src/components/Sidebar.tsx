import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { SuperCVLogo } from './SuperCVLogo';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { cv, activeTab, setActiveTab, openAuth, theme, isSidebarCollapsed, toggleSidebar } = useCV();

  const navItems = [
    {
      id: 'profile',
      label: 'الرئيسية',
      icon: 'home',
    },
    {
      id: 'build-cv',
      label: 'ابن الCV',
      icon: 'description',
    },
    {
      id: 'roadmaps',
      label: 'طريقي',
      icon: 'map',
    },
    {
      id: 'readiness',
      label: 'شوف جاهزيتك',
      icon: 'bar_chart',
    },
    {
      id: 'projects',
      label: 'مشاريع تناسبك',
      icon: 'grid_view',
    },
    {
      id: 'contact',
      label: 'تواصل معانا',
      icon: 'chat_bubble_outline',
    },
  ];

  return (
    <aside
      className={`fixed right-0 top-0 h-screen ${
        isSidebarCollapsed ? 'w-16' : 'w-72'
      } bg-[var(--bg-surface-lowest)] z-50 flex flex-col justify-between border-l border-[var(--color-border)] select-none transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col">
        {/* Header Bar - Styled clean like ChatGPT header (Image reference) */}
        <div
          onClick={isSidebarCollapsed ? toggleSidebar : undefined}
          className={`h-16 px-4 flex items-center justify-between relative select-none transition-colors duration-200 ${
            isSidebarCollapsed ? 'cursor-pointer hover:bg-[var(--bg-surface-low)]' : ''
          }`}
          title={isSidebarCollapsed ? 'اضغط لتوسيع القائمة الجانبية' : undefined}
        >
          {!isSidebarCollapsed ? (
            <>
              {/* Clean App Title: محاذاة البداية مع بداية طرف الأيقونات (السكاشن) وعرض أكبر لحرف الباء مع CV في دائرة فوقه */}
              <div
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer group py-1 flex items-center mr-4"
                title="سوبر CV - الرئيسية"
              >
                <div className="relative inline-flex flex-col items-center justify-center select-none">
                  {/* دايرة صغيرة فوق حرف الباء مكتوب جواها CV - نازلة تحت شوية على الباء */}
                  <div className="flex items-center justify-center relative z-10 translate-y-2 mb-[-1px]">
                    <span className="w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-black font-mono tracking-tighter flex items-center justify-center shadow-xs group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-200">
                      CV
                    </span>
                  </div>

                  {/* كلمة سوبــــــــــــــــــر ممتدة بعرض أكبر من حرف الباء ومحاذاة بدايتها مع بداية طرف أيقونات السكاشن */}
                  <span className="text-[21px] font-black tracking-normal text-[var(--color-on-surface)] group-hover:text-emerald-500 transition-colors duration-200 leading-none select-none whitespace-nowrap">
                    سوبــــــــــــــــــر
                  </span>
                </div>
              </div>

              {/* Sidebar toggle icon button (ChatGPT style sidebar dock icon) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                title="تصغير القائمة (الأيقونات فقط)"
                className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M15 3v18" />
                </svg>
              </button>
            </>
          ) : (
            /* Collapsed State: Click anywhere to open with cursor-pointer and expand icon */
            <div className="w-full flex items-center justify-center py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                title="توسيع القائمة الجانبية"
                className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex flex-col gap-1.5 pt-4 ${isSidebarCollapsed ? 'px-1' : 'px-4'}`}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative transition-colors duration-150 font-medium text-[15px] cursor-pointer ${
                  isSidebarCollapsed
                    ? 'w-10 h-10 mx-auto rounded-xl flex items-center justify-center'
                    : 'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-right'
                } ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className={`absolute inset-0 bg-[#ecfdf5] dark:bg-emerald-950/60 ${
                      isSidebarCollapsed ? 'rounded-xl' : 'rounded-2xl'
                    } shadow-xs`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 relative z-10 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span className="tracking-tight relative z-10">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Careem AI Assistant Card */}
      {isSidebarCollapsed ? (
        <div className="p-1.5 border-t border-[var(--color-border)] flex items-center justify-center">
          <button
            onClick={() => {
              if (!user) {
                openAuth('login');
              } else {
                setActiveTab('ask-ai');
              }
            }}
            className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer group shadow-xs relative ${
              activeTab === 'ask-ai'
                ? 'bg-emerald-500/10 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border-[var(--color-border)] hover:border-emerald-500/40'
            }`}
            title="Careem - مساعدك المهني"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[7px] font-black">
                C
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div className="p-3.5 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              if (!user) {
                openAuth('login');
              } else {
                setActiveTab('ask-ai');
              }
            }}
            className={`w-full p-3 rounded-2xl border transition-all text-right flex items-center justify-between cursor-pointer group shadow-xs ${
              activeTab === 'ask-ai'
                ? 'bg-emerald-500/10 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border-[var(--color-border)] hover:border-emerald-500/40'
            }`}
            title="افتح المساعد الذكي Careem"
          >
            {/* Careem Robot Avatar */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] font-black">
                C
              </span>
            </div>

            <div className="flex flex-col flex-1 px-3 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-black text-[var(--color-on-surface)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                  Careem
                </span>
                <span className="material-symbols-outlined text-[14px] text-emerald-500 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[var(--color-on-surface-variant)] truncate">
                  مساعدك المهني
                </span>
              </div>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
};
