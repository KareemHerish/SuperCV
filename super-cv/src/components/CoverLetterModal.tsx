import React, { useState } from 'react';
import { useCV } from '../context/CVContext';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ isOpen, onClose }) => {
  const { cv } = useCV();

  const [company, setCompany] = useState('Tamara / FinTech');
  const [jobTitle, setJobTitle] = useState('Staff Frontend Engineer');
  const [jd, setJd] = useState(
    'نبحث عن Staff Frontend Architect لقيادة فرق هندسية متعددة، تحسين استقرار المنصات السحابية الكبرى، خفض التكاليف التشغيلية، وبناء بنية Next.js متطورة للمدفوعات الرقمية.'
  );
  const [tone, setTone] = useState<'executive' | 'architectural' | 'metrics'>('executive');
  const [keyStrengths, setKeyStrengths] = useState([
    'قيادة 8 مهندسين وخفض تكاليف الاستضافة 42%',
    'معمارية Next.js 14 وتقنيات Edge SSR Caching',
    'جاهزية واعتمادية 99.98% خلال مواسم الذروة',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>(
    `إلى: لجنة التوظيف والقيادة الهندسية التقنية الموقرة\nشركة تمارا (Tamara FinTech) - الرياض\n\nيسرني التقدم لشغل موقع Staff Frontend Engineer لدى شركة تمارا، حيث أتابع باعتزاز ريادتكم لقطاع التكنولوجيا المالية ونظم الدفع المرن في منطقة الشرق الأوسط وشمال أفريقيا.\n\nانطلاقاً من مسيرتي في قيادة وتوجيه الفرق الهندسية المتقدمة، أشرفت مؤخراً على فريق معماري من 8 مهندسين لإعادة بناء الواجهات الأساسية لمنظومة تعاملات ضخمة بالاعتماد على Next.js 14 وEdge SSR Caching. أسهمت هذه النقلة في تقليص زمن الاستجابة بنسبة 38% وخفض نفقات الاستضافة السحابية بـ 42% ($18,000 شهرياً)، مع تحقيق استقرار بنسبة 99.98% في مواسم الذروة الشرائية.\n\nإن ما يميز أسلوبي القيادي هو الربط العضوي بين صلابة القرارات الهندسية وأهداف النمو التجاري؛ وهو ما يلتقي تماماً مع تطلعات تمارا لتقديم حلول دفع استثنائية وسريعة تتوافق مع معايير الأمان المالي العالمية.\n\nأتطلع بشغف لمناقشة كيفية تسخير هذه الخبرات المعمارية لدعم التوسع الهندسي لشركة تمارا وتحقيق الريادة المستدامة.\n\nمع خالص التحية والتقدير،\n${cv.fullName}\n${cv.linkedin} • ${cv.email}`
  );
  const [copyFeedback, setCopyFeedback] = useState('نسخ الخطاب (Copy)');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          jobTitle,
          jd,
          tone,
          keyStrengths,
          candidateCV: cv,
        }),
      });
      const data = await res.json();
      if (data.coverLetter) {
        setGeneratedLetter(data.coverLetter);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopyFeedback('تم النسخ بنجاح!');
    setTimeout(() => setCopyFeedback('نسخ الخطاب (Copy)'), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--bg-surface-low)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[var(--color-on-surface)]">
                  توليد خطاب التقديم الذكي (AI Cover Letter Generator)
                </h2>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] text-[10px] font-semibold border border-[var(--color-border)] hidden sm:inline-block">
                  صياغة تنفيذية مخصصة
                </span>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                توليد خطابات مهنية موجهة بدقة ومبنية على قياسات الأثر الفعلي وتوافق خوارزميات ATS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-high)]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[var(--color-border)]">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 p-5 flex flex-col gap-4 bg-[var(--bg-surface-low)]/50">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--color-outline)] text-[16px]">domain</span>
                <span>الجهة والمسمى الوظيفي المستهدف</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full h-9 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-on-surface)] focus:outline-none"
                  placeholder="اسم الشركة"
                />
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-on-surface)] focus:outline-none"
                  placeholder="المسمى الوظيفي"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--color-outline)] text-[16px]">description</span>
                <span>متطلبات الوظيفة أو الوصف الوظيفي (JD)</span>
              </label>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-on-surface)] focus:outline-none resize-none leading-relaxed"
                placeholder="ألصق نص الوصف الوظيفي هنا لمطابقة الشروط والكلمات المفتاحية بدقة..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--color-outline)] text-[16px]">tune</span>
                <span>نبرة الخطاب (Tone of Voice)</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTone('executive')}
                  className={`p-2 text-center rounded-lg text-xs font-semibold transition-all border ${
                    tone === 'executive'
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                      : 'bg-[var(--bg-surface-lowest)] text-[var(--color-on-surface-variant)] border-[var(--color-border)]'
                  }`}
                >
                  تنفيذي حاسم
                </button>
                <button
                  type="button"
                  onClick={() => setTone('architectural')}
                  className={`p-2 text-center rounded-lg text-xs font-semibold transition-all border ${
                    tone === 'architectural'
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                      : 'bg-[var(--bg-surface-lowest)] text-[var(--color-on-surface-variant)] border-[var(--color-border)]'
                  }`}
                >
                  تقني معماري
                </button>
                <button
                  type="button"
                  onClick={() => setTone('metrics')}
                  className={`p-2 text-center rounded-lg text-xs font-semibold transition-all border ${
                    tone === 'metrics'
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                      : 'bg-[var(--bg-surface-lowest)] text-[var(--color-on-surface-variant)] border-[var(--color-border)]'
                  }`}
                >
                  قائم بالأرقام
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGenerating ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isGenerating ? 'جارٍ التوليد الذكي...' : 'توليد وتخصيص الخطاب الآن'}</span>
            </button>
          </div>

          {/* Letter Preview (7 Cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col gap-4 bg-[var(--bg-surface-lowest)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                معاينة مسودة الخطاب التنفيذي
              </span>
              <span className="text-[11px] text-emerald-500 font-semibold font-mono">
                ATS PASSTHROUGH 98%
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-surface-low)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-on-surface)] leading-relaxed whitespace-pre-line font-sans flex-1 overflow-y-auto max-h-[400px]">
              {generatedLetter}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>{copyFeedback}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-surface-highest)]"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>تصدير PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
