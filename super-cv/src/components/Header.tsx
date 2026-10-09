import React from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setActiveTab, isSidebarCollapsed, openAuth } = useCV();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setActiveTab('intro');
    }
  };

  return (
    <header
      className={`fixed top-0 ${
        isSidebarCollapsed ? 'right-16' : 'right-72'
      } left-0 h-16 bg-[var(--bg-surface-lowest)]/95 backdrop-blur-xl z-40 px-6 sm:px-8 flex items-center justify-between transition-all duration-300 ease-in-out`}
    >
      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Header Actions on the Left */}
      <div className="flex items-center gap-3">
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

        <div className="h-4 w-px bg-[var(--color-border)]"></div>

        {/* User Account / Auth Status */}
        {user ? (
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] cursor-pointer hover:border-emerald-500 transition-colors"
              title={user.email || ''}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-xl text-red-500 hover:text-red-600 bg-red-50/70 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 flex items-center justify-center transition-colors cursor-pointer border border-red-200/50 dark:border-red-900/40"
              title="تسجيل الخروج"
            >
              <span className="material-symbols-outlined text-[18px] text-red-500 dark:text-red-400">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuth('login')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>دخول</span>
          </button>
        )}
      </div>
    </header>
  );
};
