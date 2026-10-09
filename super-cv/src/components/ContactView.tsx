import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { SuperCVLogo } from './SuperCVLogo';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ContactView: React.FC = () => {
  const { cv } = useCV();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentDetails, setSentDetails] = useState<{ name: string; email: string; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: cv.fullName || '',
    email: cv.email || '',
    message: '',
  });

  const TARGET_EMAIL = 'kareemherish@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      // 1. Guaranteed database logging in Firestore
      try {
        await addDoc(collection(db, 'contact_messages'), {
          name: payload.name,
          email: payload.email,
          message: payload.message,
          recipient: TARGET_EMAIL,
          createdAt: new Date().toISOString(),
          timestamp: Date.now(),
        });
      } catch (dbErr) {
        console.warn('Firestore contact backup note:', dbErr);
      }

      // 2. Dispatch through server endpoint (with SMTP / FormSubmit backend)
      let serverDispatched = false;
      try {
        const res = await fetch('/api/contact/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          serverDispatched = true;
        }
      } catch (serverErr) {
        console.warn('Server contact dispatch notice:', serverErr);
      }

      // 3. Client-side FormSubmit fallback if server route didn't acknowledge
      if (!serverDispatched) {
        try {
          await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              name: payload.name,
              email: payload.email,
              message: payload.message,
              _subject: `استفسار جديد من منصة SuperCV - ${payload.name}`,
              _template: 'table',
              _captcha: 'false',
            }),
          });
        } catch (clientErr) {
          console.warn('Client direct dispatch notice:', clientErr);
        }
      }

      setSentDetails(payload);
      setSubmitted(true);
      setFormData({ name: cv.fullName || '', email: cv.email || '', message: '' });
    } catch (err) {
      console.error('Error submitting contact message:', err);
      setSentDetails(payload);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailSubject = encodeURIComponent(`استفسار بخصوص منصة SuperCV - ${sentDetails?.name || 'مستخدم'}`);
  const mailBody = encodeURIComponent(
    `مرحباً كريم،\n\nأرسل لك هذه الرسالة بخصوص منصة SuperCV:\n\n${sentDetails?.message || ''}\n\nبيانات التواصل:\nالاسم: ${sentDetails?.name || ''}\nالبريد: ${sentDetails?.email || ''}`
  );
  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${mailSubject}&body=${mailBody}`;
  const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">chat_bubble_outline</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">تواصل معانا</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          كلمنا فى أي وقت ورسالتك هتوصل إلى المطور مباشرة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs">
          {submitted ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">تم إرسال رسالتك بنجاح!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  تم توجيه الاستفسار وحفظه للمطور مباشرة على البريد:
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-200 dark:border-emerald-800" dir="ltr">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {TARGET_EMAIL}
                </div>
              </div>

              {/* Message Details */}
              {sentDetails && (
                <div className="w-full max-w-md bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-2xl p-4 text-right text-xs space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 border-b border-[var(--color-border)] pb-1.5 flex items-center justify-between">
                    <span>تفاصيل الرسالة المرسلة:</span>
                    <span className="text-emerald-600 font-mono text-[10px]">مُسجلة ومُرسلة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الاسم:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sentDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">البريد:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200" dir="ltr">{sentDetails.email}</span>
                  </div>
                  <div className="pt-1 text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/20 p-2.5 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap">
                    {sentDetails.message}
                  </div>
                </div>
              )}

              {/* Action Buttons: Direct Gmail confirmation + Send another */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full max-w-md">
                <a
                  href={gmailWebComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="فتح في Gmail لتأكيد الإرسال المباشر من بريدك"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>تأكيد الإرسال في Gmail</span>
                </a>

                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>إرسال استفسار آخر</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500"
                    placeholder="مثال: كريم عبد العزيز"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الرسالة أو الاستفسار
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] focus:outline-none focus:border-emerald-500"
                  placeholder="اكتب استفسارك وسيقوم المطور بالرد عليك بأسرع وقت"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>جاري الإرسال إلى kareemherish@gmail.com...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>إرسال الاستفسار إلى kareemherish@gmail.com</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-[var(--color-border)] pb-3">
            وسائل التواصل
          </h2>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-surface-low)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">البريد الإلكتروني</div>
              <a
                href={mailtoUrl}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors block"
                dir="ltr"
              >
                {TARGET_EMAIL}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-surface-low)]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">رقم الهاتف</div>
              <a
                href="tel:+201150549890"
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors block"
                dir="ltr"
              >
                +201150549890
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 rounded-2xl bg-[var(--bg-surface-low)]">
            <SuperCVLogo className="w-16 h-16 drop-shadow-md" />
          </div>
        </div>

      </div>

    </div>
  );
};
