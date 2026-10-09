import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { SuperCVLogo } from './SuperCVLogo';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onSuccess }) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const { setActiveTab } = useCV();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    clearError();
    setLocalError('');
  }, [initialMode]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Switch tabs
  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    clearError();
    setLocalError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setLocalError('يرجى ملء جميع الحقول.');
      return;
    }
    setLocalError('');
    clearError();
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveTab('build-cv');
      }
    } catch {
      // Error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Signup Direct Submit (بدون OTP)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError('يرجى إدخال اسمك الكامل.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    if (password.length < 6) {
      setLocalError('كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLocalError('');
    clearError();
    setSubmitting(true);

    try {
      await signupWithEmail(name, email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveTab('build-cv');
      }
    } catch (err: any) {
      setLocalError(err.message || 'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Login / Signup
  const handleGoogleAuth = async () => {
    setLocalError('');
    clearError();
    setSubmitting(true);
    try {
      await loginWithGoogle();
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveTab('build-cv');
      }
    } catch {
      // Handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="min-h-screen w-full bg-[var(--bg-background)] flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden" dir="rtl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Top Header & Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-3 cursor-pointer mb-3" onClick={() => setActiveTab('intro')}>
            <SuperCVLogo className="w-10 h-10 drop-shadow-sm" />
            <div className="relative inline-flex flex-col items-center justify-center select-none">
              <div className="flex items-center justify-center mb-[-4px]">
                <span className="w-4.5 h-4.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black font-mono tracking-tighter flex items-center justify-center shadow-xs">
                  CV
                </span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                سوبــــــــــر
              </span>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </h2>
        </div>

        {/* Tab Toggle (Login / Signup) */}
        <div className="flex p-1 bg-[var(--bg-surface-low)] rounded-2xl border border-[var(--color-border)] mb-6">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {/* General Error Message */}
        {displayedError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{displayedError}</span>
          </div>
        )}

        {/* Form Container */}
        {mode === 'login' ? (
          
          /* ========================================================================= */
          /* LOGIN FORM                                                                */
          /* ========================================================================= */
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>
          </form>
        ) : (
          
          /* ========================================================================= */
          /* SIGNUP FORM (مباشر وفوري بدون OTP)                                       */
          /* ========================================================================= */
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الأسم
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: كريم عبد العزيز"
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="لا تقل عن 6 أحرف"
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock_reset
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <span>إنشاء الحساب والمتابعة</span>
                  <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider & Google Auth Option */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]"></div>
          </div>
          <span className="relative px-3 bg-[var(--bg-surface-lowest)] text-[11px] text-slate-400 font-medium">
            أو تابع عبر
          </span>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={submitting}
          className="w-full h-11 rounded-xl bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border border-[var(--color-border)] hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xs"
        >
          {/* Google Brand SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{mode === 'login' ? 'تسجيل الدخول باستخدام Google' : 'الاشتراك بحساب Google'}</span>
        </button>

        {/* Back Button */}
        <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 text-center">
          <button
            onClick={() => setActiveTab('intro')}
            className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            <span>الرجوع للرئيسية</span>
          </button>
        </div>

      </div>

    </div>
  );
};
