import React, { useState, useEffect } from 'react';
import { useCV } from '../context/CVContext';

interface Question {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AssessmentView: React.FC = () => {
  const {
    cv,
    selectedAssessmentSkill,
    setSelectedAssessmentSkill,
    addVerifiedBadge,
  } = useCV();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizSkill, setCurrentQuizSkill] = useState('');
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // If a skill was pre-selected from profile or sidebar
  useEffect(() => {
    if (selectedAssessmentSkill) {
      startQuizForSkill(selectedAssessmentSkill);
      setSelectedAssessmentSkill(null);
    }
  }, [selectedAssessmentSkill]);

  const startQuizForSkill = async (skillName: string, count: 5 | 10 = questionCount) => {
    setCurrentQuizSkill(skillName);
    setIsQuizModalOpen(true);
    setIsLoadingQuestions(true);
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skillName,
          count,
          difficulty: 'advanced',
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback default questions
        setQuestions([
          {
            id: 1,
            question: `In production ${skillName}, what is the best practice to prevent memory leaks and unhandled re-renders?`,
            options: [
              'Cleaning up listeners, aborting fetch signals, and decoupling state',
              'Increasing node memory limit without profiling heap snapshots',
              'Reloading the entire application after every 100 actions',
              'Disabling garbage collection in the runtime'
            ],
            correctIndex: 0,
            explanation: 'تنظيف مستمعي الأحداث وإلغاء طلبات الشبكة المنتهية يفصل استهلاك الذاكرة ويمنع تسرب الـ Heap.'
          },
          {
            id: 2,
            question: `How does ${skillName} ensure high throughput under peak traffic loads?`,
            options: [
              'Synchronous blocking operations on the main thread',
              'Non-blocking async pipelines, request batching, and edge caching',
              'Limiting incoming traffic to 10 requests per minute',
              'Doubling the payload size of each JSON response'
            ],
            correctIndex: 1,
            explanation: 'المعالجة غير الحاجبة (Non-blocking) والتخزين عند الحواف (Edge Caching) يوفران استجابة متوازية وسريعة.'
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      const calculatedScore = Math.round((correct / questions.length) * 100);
      setScore(calculatedScore);
      setIsQuizFinished(true);

      // If passed >= 70%, add verified badge to CV
      if (calculatedScore >= 70) {
        addVerifiedBadge(currentQuizSkill, calculatedScore);
      }
    }
  };

  const handleRegenerateQuestions = () => {
    startQuizForSkill(currentQuizSkill, questionCount);
  };

  // Find badges for current CV skills
  const getBadgeForSkill = (skillName: string) => {
    return cv.verifiedBadges.find(b => b.skill === skillName);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-6 flex flex-col gap-6 w-full">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] border border-[var(--color-border)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                تقييمات معتمدة بنظام AI Engine v4.2
              </span>
              <span className="text-xs text-[var(--color-outline)]">• متصل بمهارات الـ CV</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">
              مركز التقييم واختبار المهارات (Skill Assessments)
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              اختر أي مهارة محددة في سيرتك الذاتية لاختبارها فوراً بـ 5 أو 10 أسئلة تخصصية بالذكاء الاصطناعي، واحصل على شارة تحقق معتمدة تُضاف مباشرة لسيرتك وترفع درجة الـ ATS.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (cv.techSkills[0]) startQuizForSkill(cv.techSkills[0]);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>بدء اختبار سريع لمهاراتك</span>
            </button>
          </div>
        </section>

        {/* KPI & Telemetry Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[var(--color-outline)] font-medium">المستوى العام المعتمد</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] border border-[var(--color-border)]">
                TOP 5% MENA
              </span>
            </div>
            <div className="mt-3">
              <div className="text-sm font-bold text-[var(--color-on-surface)] truncate">{cv.targetRole.split('|')[0]}</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-[var(--color-on-surface)]">{cv.atsScore}</span>
                <span className="text-xs text-[var(--color-outline)]">/ 100 مؤشر الكفاءة</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-[var(--bg-surface-highest)] h-1 rounded-full overflow-hidden">
              <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: `${cv.atsScore}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[var(--color-outline)] font-medium">المهارات المحددة في الـ CV</span>
              <span className="material-symbols-outlined text-[var(--color-outline)] text-[20px]">terminal</span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[var(--color-on-surface)]">{cv.techSkills.length}</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">مهارة جاهزة للاختبار</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                <span className="text-emerald-500 font-semibold">{cv.verifiedBadges.length} معتمدة</span>
                <span className="text-[var(--color-outline)]">• متوافقة مع الـ ATS</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-[var(--bg-surface-highest)] h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(cv.verifiedBadges.length / Math.max(cv.techSkills.length, 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[var(--color-outline)] font-medium">شارات التحقق النشطة</span>
              <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified</span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[var(--color-on-surface)]">{cv.verifiedBadges.length}</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">شارات موثقة</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {cv.verifiedBadges.slice(0, 2).map(b => (
                  <span key={b.id} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] font-mono">
                    {b.skill.split(' ')[0]} {b.badgeCode}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 text-[11px] text-[var(--color-outline)] flex items-center gap-1">
              <span className="text-emerald-500 font-bold">+1</span>
              <span>تمنح أولوية للمقابلات</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs text-[var(--color-outline)] font-medium">المقابلات الذكية المكتملة</span>
              <span className="material-symbols-outlined text-[var(--color-outline)] text-[20px]">psychology</span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[var(--color-on-surface)]">6</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">محاكاة مسجلة ومحللة</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--color-on-surface-variant)]">
                <span className="text-[var(--color-on-surface)] font-semibold">4.8 / 5.0</span>
                <span className="text-[var(--color-outline)]">نضج الإجابة والمعمارية</span>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-[var(--color-outline)] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
              <span>محاكاة مطابقة لـ Google & FinTech</span>
            </div>
          </div>
        </section>

        {/* Featured Live AI Mock Interviewer Banner */}
        <section className="rounded-xl bg-gradient-to-b from-[var(--bg-surface-high)] to-[var(--bg-surface-low)] border border-[var(--color-border)] p-5 lg:p-6 relative overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 relative z-10">
            <div className="flex flex-col justify-between flex-1 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-bold tracking-wider">
                    LIVE SKILL SIMULATOR
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] text-[10px] border border-[var(--color-border)]">
                    توليد ذكي فوري
                  </span>
                  <span className="text-xs text-[var(--color-outline)]">محاكاة معايير: Tamara, Careem, Amazon</span>
                </div>
                <h2 className="text-lg font-bold text-[var(--color-on-surface)] mt-1">
                  محاكاة اختبارات المهارات المعمارية لـ {cv.targetRole}
                </h2>
                <p className="text-xs text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed">
                  يقوم المساعد الذكي بتوليد أسئلة سيناريوهات إنتاجية حية استناداً إلى المهارات التي قمت باختيارها في الـ CV، مع اختبار التعامل مع الضغط العالي والـ Edge Cases والـ Performance Tuning.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="p-2 rounded bg-[var(--bg-surface-lowest)]/80 border border-[var(--color-border)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[18px]">quiz</span>
                  <span className="text-xs text-[var(--color-on-surface)] font-medium">5 أو 10 أسئلة لكل مهارة</span>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface-lowest)]/80 border border-[var(--color-border)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[18px]">verified</span>
                  <span className="text-xs text-[var(--color-on-surface)] font-medium">شارة تحقق فورية على الـ CV</span>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface-lowest)]/80 border border-[var(--color-border)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[18px]">refresh</span>
                  <span className="text-xs text-[var(--color-on-surface)] font-medium">توليد متجدد للأسئلة بدون توقف</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Area: Candidate CV Skills Assessment Cards (8 Cols) */}
          <main className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--color-on-surface)]">
                  المهارات المحددة في سيرتك الذاتية (CV Skills Ready to Test)
                </h3>
                <p className="text-xs text-[var(--color-outline)]">
                  انقر على أي مهارة لبدء اختبار مكون من 5 أو 10 أسئلة اختر والحصول على شارة موثقة:
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-[var(--color-on-surface)]">
                {cv.techSkills.length} مهارة متاحة
              </span>
            </div>

            {/* Dynamic Skills Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cv.techSkills.map((skillName, idx) => {
                const verifiedBadge = getBadgeForSkill(skillName);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col justify-between hover:border-[var(--color-outline)] transition-all group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-surface-highest)] text-[var(--color-on-surface)] border border-[var(--color-border)]">
                          ADVANCED LEVEL
                        </span>
                        <span className="text-xs text-[var(--color-outline)] flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          5-10 د
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors font-mono">
                        {skillName}
                      </h4>

                      <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2">
                        اختبار إنتاجي يقيس جودة الحل الهندسي، كفاءة الأداء، والتعامل مع الأخطاء غير المتوقعة في {skillName}.
                      </p>

                      {verifiedBadge ? (
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>تم الاجتياز بنسبة <strong>{verifiedBadge.score}%</strong></span>
                          </div>
                          <span className="font-mono text-[10px]">{verifiedBadge.badgeCode}</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
                          <span className="material-symbols-outlined text-[var(--color-outline)] text-[16px]">verified</span>
                          <span>تمنح شارة تحقق فورية تُضاف تلقائياً للـ CV</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                      <button
                        onClick={() => startQuizForSkill(skillName, 5)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded text-xs font-semibold hover:opacity-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        <span>اختبار (5 أسئلة)</span>
                      </button>

                      <button
                        onClick={() => startQuizForSkill(skillName, 10)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] rounded text-xs font-semibold hover:bg-[var(--bg-surface-highest)] transition-all border border-[var(--color-border)]"
                      >
                        <span className="material-symbols-outlined text-[16px]">quiz</span>
                        <span>اختبار مكثف (10)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Side Column: AI Telemetry & Active Badges (4 Cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[20px]">insights</span>
                  <h3 className="text-sm font-bold text-[var(--color-on-surface)]">تحليل الذكاء الاصطناعي (Skill Telemetry)</h3>
                </div>
                <span className="text-[11px] text-[var(--color-outline)]">مُحدّث اليوم</span>
              </div>

              {/* Super Strengths */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[var(--color-on-surface)] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-emerald-500">trending_up</span>
                  نقاط القوة الاستثنائية (Super Strengths)
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  {cv.verifiedBadges.map((badge, bIdx) => (
                    <div key={bIdx}>
                      <div className="flex justify-between text-xs text-[var(--color-on-surface)]">
                        <span className="font-medium font-mono">{badge.skill}</span>
                        <span className="font-bold text-emerald-500">{badge.score}%</span>
                      </div>
                      <div className="w-full bg-[var(--bg-surface-highest)] h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${badge.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Tip */}
              <div className="p-3 rounded-lg bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex items-start gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[18px] shrink-0 mt-0.5">tips_and_updates</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">توصية خبير التوظيف</span>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">
                    اجتيازك للاختبارات بنتيجة &gt; 85% يمنح سيرتك ختم التحقق البرمجي (Verified Badge) الذي يرفع معدل تجاوز الفلترة بنسبة +24%.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Verified Badges List */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] flex flex-col gap-3">
              <span className="text-xs font-bold text-[var(--color-on-surface)] uppercase tracking-wider">
                شاراتك الموثقة على رابط سيرتك
              </span>
              <div className="flex flex-col gap-2">
                {cv.verifiedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-lowest)] border border-[var(--color-border)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                      <span className="text-xs font-semibold text-[var(--color-on-surface)] font-mono">{badge.skill}</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-outline)] font-mono font-bold">
                      ID: {badge.badgeCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE SKILL ASSESSMENT QUIZ MODAL                                    */}
      {/* ========================================================================= */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-xl shadow-2xl p-6 flex flex-col gap-5 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[22px]">quiz</span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-on-surface)] font-mono">
                    اختبار مهارة: {currentQuizSkill}
                  </h3>
                  <span className="text-xs text-[var(--color-outline)]">
                    {questions.length} أسئلة اختر من متعدد • إثبات الكفاءة المعمارية
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="p-1 rounded text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-high)]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Question Count Selector & Regenerate bar */}
            <div className="flex items-center justify-between bg-[var(--bg-surface-low)] p-2 rounded-lg border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--color-on-surface-variant)]">عدد الأسئلة:</span>
                <button
                  onClick={() => startQuizForSkill(currentQuizSkill, 5)}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    questionCount === 5 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--bg-surface-high)]'
                  }`}
                >
                  5 أسئلة
                </button>
                <button
                  onClick={() => startQuizForSkill(currentQuizSkill, 10)}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    questionCount === 10 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--bg-surface-high)]'
                  }`}
                >
                  10 أسئلة
                </button>
              </div>

              <button
                onClick={handleRegenerateQuestions}
                disabled={isLoadingQuestions}
                className="flex items-center gap-1 text-xs text-[var(--color-on-surface)] hover:underline font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>توليد أسئلة أخرى</span>
              </button>
            </div>

            {/* Modal Body */}
            {isLoadingQuestions ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  جارٍ توليد أسئلة سيناريوهات إنتاجية لمهارة {currentQuizSkill} عبر الذكاء الاصطناعي...
                </span>
              </div>
            ) : isQuizFinished ? (
              /* Score & Badge Screen */
              <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-mono font-bold border-4 ${
                  score >= 70 ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'
                }`}>
                  {score}%
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                  <h4 className="text-lg font-bold text-[var(--color-on-surface)]">
                    {score >= 70 ? 'تهانينا! لقد اجتزت التقييم بنجاح' : 'محاولة جيدة، يمكنك التحسين والمحاولة مجدداً'}
                  </h4>
                  <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                    {score >= 70
                      ? `تم منحك شارة تحقق رسمية لمهارة "${currentQuizSkill}" وأضيفت مباشرة إلى سيرتك الذاتية لتحسين تصنيف الـ ATS.`
                      : `للحصول على شارة التحقق يجب تحقيق 70% على الأقل. يمكنك مراجعة الشرح وإعادة توليد أسئلة جديدة.`}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleRegenerateQuestions}
                    className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold hover:opacity-90"
                  >
                    توليد أسئلة أخرى لهذه المهارة
                  </button>
                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="px-4 py-2 bg-[var(--bg-surface-high)] text-[var(--color-on-surface)] rounded-lg text-xs font-semibold"
                  >
                    إغلاق والعودة للتقييمات
                  </button>
                </div>
              </div>
            ) : questions.length > 0 ? (
              /* Active Question */
              <div className="flex flex-col gap-4">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-[var(--color-outline)] font-mono">
                  <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[var(--bg-surface-highest)] h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-primary)] h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question Text */}
                <div className="flex flex-col gap-2 pt-2">
                  <h4 className="text-sm font-semibold text-[var(--color-on-surface)] leading-relaxed font-sans" dir="ltr">
                    {questions[currentQuestionIndex].question}
                  </h4>

                  {/* Code snippet if any */}
                  {questions[currentQuestionIndex].codeSnippet && (
                    <pre className="p-3 bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-[var(--color-on-surface)] overflow-x-auto text-left" dir="ltr">
                      {questions[currentQuestionIndex].codeSnippet}
                    </pre>
                  )}
                </div>

                {/* 4 Choices */}
                <div className="flex flex-col gap-2 pt-2">
                  {questions[currentQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
                    const isCorrect = optIdx === questions[currentQuestionIndex].correctIndex;

                    let btnClass = 'bg-[var(--bg-surface-low)] border-[var(--color-border)] text-[var(--color-on-surface)] hover:border-[var(--color-outline)]';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold';
                      } else if (isSelected) {
                        btnClass = 'bg-red-500/15 border-red-500 text-red-400 font-semibold';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-[var(--bg-surface-highest)] border-[var(--color-primary)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${btnClass}`}
                        dir="ltr"
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box when answered */}
                {showExplanation && (
                  <div className="p-3 bg-[var(--bg-surface-low)] border border-[var(--color-border)] rounded-lg flex flex-col gap-1 text-xs">
                    <span className="font-bold text-[var(--color-on-surface)] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      الشرح التقني للإجابة:
                    </span>
                    <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
                      {questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Bottom Next Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-outline)]">
                    {selectedAnswers[currentQuestionIndex] === undefined ? 'اختر الإجابة المناسبة للمتابعة' : 'انقر للمتابعة للسؤال التالي'}
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="flex items-center gap-1 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                  >
                    <span>{currentQuestionIndex + 1 === questions.length ? 'إنهاء وحساب النتيجة' : 'السؤال التالي'}</span>
                    <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
