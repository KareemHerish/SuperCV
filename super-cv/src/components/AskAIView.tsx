import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { TECH_ROADMAPS } from '../data/roadmaps';
import { CareemAvatar, CareemMascotCard } from './CareemMascot';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  retrievedChunks?: { id: string; section: string }[];
  missingSkills?: string[];
  actionSnippet?: string;
}

export const AskAIView: React.FC = () => {
  const { user } = useAuth();
  const {
    cv,
    setActiveTab,
    openAuth,
    updateExperience,
    chatMessages: messages,
    setChatMessages: setMessages,
    clearChatMessages,
    pendingAIQuestion,
    setPendingAIQuestion,
  } = useCV();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [id: string]: string }>({});
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const handleSelectQuizOption = (quizId: string, optionKey: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [quizId]: optionKey,
    }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
  };

  const currentTrack = TECH_ROADMAPS.find((t) => t.id === cv.trackId) || TECH_ROADMAPS[0];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    if (pendingAIQuestion && pendingAIQuestion.trim()) {
      const q = pendingAIQuestion.trim();
      setPendingAIQuestion(null);
      handleSendMessage(q);
    }
  }, [pendingAIQuestion]);

  const stripGreeting = (text: string): string => {
    if (!text) return '';
    return text.trim();
  };

  const getClientFallbackReply = (query: string, track: any, candidateCV: any): string => {
    const q = query.toLowerCase();
    const trackName = track?.title || 'تطوير البرمجيات';
    const role = candidateCV?.targetRole || track?.titleEn || 'Software Engineer';
    const skills: string[] = candidateCV?.techSkills || [];

    if (q.includes('مسار') || q.includes('roadmap') || q.includes('path') || q.includes('طريق')) {
      if (q.includes('ذكاء') || q.includes('ai') || track?.id === 'ai-engineer') {
        return `### أفضل مسار مهني لـ مهندس تطبيقات الذكاء الاصطناعي (AI Engineer):\n\n` +
          `1. **الأساس البرمجي وهندسة النظم:** إتقان Python المتقدم (AsyncIO, Type hints)، وبناء APIs عالية الأداء باستخدام **FastAPI**.\n` +
          `2. **أطر عمل الذكاء الاصطناعي و الـ LLMs:** إتقان **PyTorch**، بيئة **Hugging Face**، وتقنيات Prompt Engineering المتقدمة.\n` +
          `3. **هندسة الـ RAG وقواعد البيانات المتجهة:** بناء أنظمة استرجاع متقدمة باستخدام Vector DBs مثل **Pinecone** و **Milvus** مع **LangChain** أو **LlamaIndex**.\n` +
          `4. **الـ MLOps والإنتاجية:** نشر النماذج باستخدام **Docker**، و **Triton Inference Server**، مع قياس أداء الاستجابة (Latency Optimization).\n\n` +
          `نصيحة ذهبية: ركز على بناء نظام ذكاء اصطناعي إنتاجي كامل (End-to-End) يحل مشكلة تجارية حقيقية وارفعه على GitHub.`;
      }
      return `### خارطة الطريق الاحترافية لمسار **${trackName}** (${role}):\n\n` +
        `1. **التأسيس الصلب:** إتقان اللغات الأساسية، معمارية الكود النظيفة (Clean Code)، وهياكل البيانات.\n` +
        `2. **التقنيات الحديثة في بيئات العمل:** التخصص في التقنيات الأكثر طلباً بالسوق مع التركيز على معالجة البيانات وتكامل الخدمات.\n` +
        `3. **الاعتمادية والأداء:** تطبيق الـ Testing، و CI/CD Pipelines، وإدارة الـ Caching لتقليل زمن الاستجابة.\n` +
        `4. **المشاريع الإنتاجية:** بناء 2-3 مشاريع كاملة موثقة في GitHub توضح القرارات المعمارية التي اتخذتها.`;
    }

    if (q.includes('مصدر') || q.includes('مصادر') || q.includes('أتعلم منين') || q.includes('اتعلم منين') || q.includes('resource') || q.includes('كورس')) {
      return `### أهم مصادر التعلم المعتمدة لتطوير مستواك في **${trackName}**:\n\n` +
        `1. **الدورات الأكاديمية والتخصصية:**\n` +
        `   - منصة **DeepLearning.AI** و **Coursera** للتخصصات الحديثة والذكاء الاصطناعي.\n` +
        `   - كورسات **CS50** و **CS229** من جامعة Stanford لفهم المفاهيم العميقة.\n` +
        `2. **التوثيق الرسمي والمسارات المفتوحة:**\n` +
        `   - المسارات التفاعلية في **roadmap.sh** للمتابعة خطوة بخطوة.\n` +
        `   - الوثائق الرسمية (Official Docs) للتقنيات والـ Libraries المستخدمة.\n` +
        `3. **الممارسة العملية:**\n` +
        `   - قراءة الـ Open Source Repositories على **GitHub** والمساهمة فيها.\n` +
        `   - حل تحديات التفكير المنطقي على **LeetCode** لتجاوز المقابلات التقنية.`;
    }

    if (q.includes('skill') || q.includes('مهار') || q.includes('أتعلم') || q.includes('اتعلم') || q.includes('اهم') || q.includes('أهم')) {
      const trackSkills: string[] = [];
      if (track && Array.isArray(track.categories)) {
        track.categories.forEach((cat: any) => {
          if (Array.isArray(cat.skills)) {
            cat.skills.forEach((s: any) => trackSkills.push(s.name));
          }
        });
      }
      const missing = trackSkills.filter(
        ts => !skills.some(s => s.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(s.toLowerCase()))
      ).slice(0, 4);

      const topPicks = missing.length > 0 ? missing.join('، ') : 'System Design، Docker & CI/CD، Caching (Redis)';
      return `بناءً على مسارك الحالي في **${trackName}** (${role}):\n\n` +
        `أهم المهارات اللي تركز عليها حالياً وتضيفها لسيرتك الذاتية:\n` +
        `1. **${topPicks}**\n` +
        `2. إتقان **Clean Architecture** وبناء مشاريع كاملة (End-to-End) واضحة في GitHub.\n` +
        `3. قياس أثر الأداء وحل المشاكل المعمارية وتفادي الـ Bottlenecks بدلاً من مجرد كتابة كود وظيفي.`;
    }

    if (q.includes('cv') || q.includes('سير') || q.includes('ats') || q.includes('أعدي') || q.includes('اعدي') || q.includes('وظي')) {
      return `### خطوات تجهيز وتعديل الـ CV لاجتياز أنظمة الـ ATS:\n\n` +
        `1. **تطبيق معادلة Google XYZ:**\n` +
        `   - صياغة كل نقطة خبرة بأسلوب: *أنجزت [X] مقاساً بـ [Y] عبر تنفيذ [Z]* (مثال: تقليص زمن الاستجابة بنسبة 35% وتوفير 12k$).\n` +
        `2. **مطابقة الكلمات المفتاحية (Keywords Matching):**\n` +
        `   - استخرج المهارات المذكورة في إعلان الوظيفة وضعها بوضوح في قسم المهارات التقنية.\n` +
        `3. **التصميم المتوافق مع الفرز الآلي:**\n` +
        `   - استخدم تصميماً نظيفاً أحادي العمود بدون جداول متداخلة أو نصوص داخل صور.\n` +
        `   - يمكنك استخدام أداة **"ابن الـ CV"** في المنصة وتصدير الـ PDF مباشرة!`;
    }

    if (q.includes('سؤال') || q.includes('اختبر') || q.includes('كويز') || q.includes('امتحن') || q.includes('quiz')) {
      const skillFocus = skills[0] || (track?.id === 'backend' ? 'Node.js & PostgreSQL' : 'React & State Architecture');
      return `إليك سؤال سريع لاختبار مستواك في **${skillFocus}**:\n\n` +
        `[QUIZ_QUESTION]\n` +
        `السؤال: في بيئات الإنتاج عالية الحمل (${skillFocus})، ما هو الأسلوب المعماري الأنسب لتفادي عمليات إعادة المعالجة (Re-renders) غير الضرورية وتقليل استهلاك الذاكرة؟\n` +
        `A) تخزين كافة البيانات في SessionStorage وقراءتها في كل دورة حياة\n` +
        `B) فصل الحالة واستخدام Atomic Selectors مع Shallow Equality و Idempotent Handlers\n` +
        `C) تنفيذ forceUpdate الدوري لضمان تحديث كل المكونات بالتزامن\n` +
        `D) الاعتماد الكامل على متغيرات الـ window العامة لتفادي شجرة المكونات\n` +
        `[CORRECT: B]\n` +
        `[EXPLANATION: فصل الحالة والمحددات الذرية مع المقارنة السطحية تمنع المعالجات غير الضرورية وتضمن الحفاظ على معدل إطارات سلس وثبات استهلاك الذاكرة.]\n` +
        `[/QUIZ_QUESTION]\n\n` +
        `اضغط على الخيار الصحيح لمعرفة النتيجة فوراً!`;
    }

    if (q.includes('div') || q.includes('عنصر') || q.includes('كود') || q.includes('css')) {
      return `أهلاً بك! لتنفيذ هذا التعديل في الواجهة والكود:\n\n` +
        `1. يمكنك حذف وسم الـ \`<div>\` المطلوب مباشرة من ملف المكون.\n` +
        `2. لتفادي إضافة أي عقد زائدة، استخدم الـ Fragment الفارغ \`<></>\` بدلاً من وضع حاوية جديدة.\n` +
        `3. راجع تنسيقات الـ Flex و Grid لضمان بقاء الواجهة متناسقة بعد الحذف.`;
    }

    return `أهلاً بك! أنا "كريم" — مستشارك البرمجي في Super CV.\n\n` +
      `بخصوص سؤالك حول "${query}":\n` +
      `يسعدني مساعدتك فيها خطوة بخطوة. اكتب لي تفاصيل أكثر أو الكود الذي تعمل عليه وسأحلله لك فوراً!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timeFormatted,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    // Keep cursor / focus in the input area
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
    setIsLoading(true);

    // Prepare prior conversation history for short-term session memory (up to 16 messages)
    const conversationHistory = messages.slice(-16).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    let rawReply = '';
    let retrievedChunks: any = undefined;
    let missingSkills: any = undefined;

    // Attempt calling server with automatic retry
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch('/api/rag/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            mode: 'careem_copilot',
            cv,
            trackRoadmap: currentTrack,
            history: conversationHistory,
          }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.reply && typeof data.reply === 'string' && data.reply.trim()) {
            rawReply = data.reply.trim();
            retrievedChunks = data.retrievedChunks;
            missingSkills = data.missingSkills;
            break;
          }
        }
      } catch (e) {
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    if (!rawReply) {
      rawReply = getClientFallbackReply(text.trim(), currentTrack, cv);
    }

    const cleanReply = stripGreeting(rawReply);

    const assistantMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-reply',
      sender: 'assistant',
      text: cleanReply,
      time: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      retrievedChunks,
      missingSkills,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prev) => ({ ...prev, [msgId]: 'تم النسخ ✓' }));
    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [msgId]: '' }));
    }, 2000);
  };

  const handleApplySnippetToCV = (snippet: string) => {
    if (cv.experiences && cv.experiences.length > 0) {
      const exp = cv.experiences[0];
      const newAchievements = [snippet, ...exp.achievements.slice(1)];
      updateExperience(0, { ...exp, achievements: newAchievements });
      setAppliedFeedback('تم تحديث إنجازات الـ CV بنجاح! ✓');
      setTimeout(() => setAppliedFeedback(null), 3000);
    }
  };

  // Quick prompt presets from Image 1 & 2
  const quickPrompts = [
    {
      id: 'ai-skills',
      text: 'إيه أهم مهارات الـ AI المطلوبة دلوقتي؟',
      short: 'إيه أهم مهارات الـ AI؟',
      icon: 'lightbulb',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      id: 'fix-cv',
      text: 'ازاي أظبط الـ CV بتاعي عشان يعدي الـ ATS؟',
      short: 'ازاي أظبط الـ CV بتاعي؟',
      icon: 'description',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      id: 'best-path',
      text: `ما هو أفضل مسار مهني لمجال ${currentTrack.titleAr || 'هندسة البرمجيات'}؟`,
      short: 'أفضل مسار للمجال بتاعي؟',
      icon: 'menu_book',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
    },
    {
      id: 'resources',
      text: 'ما هي أهم مصادر التعلم المعتمدة لتطوير مستواي؟',
      short: 'مصادر تعلم مناسبة؟',
      icon: 'auto_stories',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      id: 'gaps',
      text: 'إيه اللي ناقصني في مهاراتي عشان أكون جاهز لسوق العمل؟',
      short: 'إيه اللي ناقصني عشان أكون جاهز؟',
      icon: 'track_changes',
      color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400',
    },
    {
      id: 'quiz-me',
      text: `اختبرني بأسئلة اختيار من متعدد في مجالي (${currentTrack.titleAr || 'البرمجة'}) عشان أقيس مستواي`,
      short: 'اختبرني بأسئلة تفاعلية (MCQ)',
      icon: 'quiz',
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    },
  ];

  // Category tags from Image 2
  const categories = [
    { name: 'اختبر نفسك', icon: 'quiz', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
    { name: 'المجالات', icon: 'explore', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
    { name: 'المهارات', icon: 'psychology', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
    { name: 'الـ CV', icon: 'article', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800' },
    { name: 'المشاريع', icon: 'code', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
    { name: 'الفرص', icon: 'work_outline', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
    { name: 'الموارد التعليمية', icon: 'school', color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' },
  ];

  // Helper to format assistant message text naturally with clean markdown support
  const renderMessageContent = (text: string) => {
    const cleanText = stripGreeting(text);
    const lines = cleanText.split('\n');

    const renderInline = (str: string) => {
      const tokens = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return tokens.map((token, tIdx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={tIdx} className="font-bold text-[var(--color-on-surface)]">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code
              key={tIdx}
              className="px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-high)] text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-[var(--color-border)]"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return <span key={tIdx}>{token}</span>;
      });
    };

    return (
      <div className="flex flex-col gap-2 text-[13px] leading-relaxed select-text">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-0.5" />;

          // Headings
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4 key={idx} className="font-black text-sm text-[var(--color-on-surface)] mt-2 mb-0.5 tracking-tight">
                {renderInline(headingText)}
              </h4>
            );
          }

          // Numbered lists
          const matchNumber = trimmed.match(/^(\d+)[.-]\s*(.+)/);
          if (matchNumber) {
            const num = matchNumber[1];
            const content = matchNumber[2];
            return (
              <div key={idx} className="flex items-start gap-2 py-0.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-xs mt-0.5 select-none">
                  {num}.
                </span>
                <div className="flex-1 text-[var(--color-on-surface)]">
                  {renderInline(content)}
                </div>
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            const bulletContent = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 py-0.5 pr-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <div className="flex-1 text-[var(--color-on-surface)]">
                  {renderInline(bulletContent)}
                </div>
              </div>
            );
          }

          // Blockquote or note
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed.slice(2);
            return (
              <div
                key={idx}
                className="my-1 p-2.5 rounded-xl bg-[var(--bg-surface-low)] border-r-3 border-emerald-500 text-xs italic text-[var(--color-on-surface-variant)]"
              >
                {renderInline(quoteContent)}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-[var(--color-on-surface)] font-normal">
              {renderInline(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // ================= QUIZ & MULTIPLE-CHOICE INTERACTIVE PARSER =================
  interface ParsedQuiz {
    question: string;
    codeSnippet?: string;
    options: { key: string; text: string }[];
    correctKey: string;
    explanation: string;
  }

  const normalizeQuizKey = (key: string): string => {
    const k = (key || '').trim().toUpperCase();
    if (k === 'A' || k === 'أ' || k === 'ا' || k === '1') return 'A';
    if (k === 'B' || k === 'ب' || k === '2') return 'B';
    if (k === 'C' || k === 'ج' || k === '3') return 'C';
    if (k === 'D' || k === 'د' || k === '4') return 'D';
    return k;
  };

  const parseSingleQuizContent = (block: string): ParsedQuiz | null => {
    // Extract correct key
    const correctMatch =
      block.match(/\[CORRECT:\s*([A-Da-dأ-ي1-4])\]/i) ||
      block.match(/(?:الإجابة الصحيحة|الخيار الصحيح|Correct Answer|Answer):\s*\(?([A-Da-dأ-ي1-4])\)?/i);
    const correctKey = correctMatch ? correctMatch[1].trim() : 'A';

    // Extract explanation
    const explanationMatch =
      block.match(/\[EXPLANATION:\s*([\s\S]*?)\]/i) ||
      block.match(/(?:التفسير|الشرح|Explanation):\s*([\s\S]*?)(?:$|\[)/i);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // Extract code snippet if present
    const codeMatch = block.match(/```(?:[\w]*\n)?([\s\S]*?)```/);
    const codeSnippet = codeMatch ? codeMatch[1].trim() : undefined;

    let cleaned = block
      .replace(/\[CORRECT:\s*([A-Da-dأ-ي1-4])\]/gi, '')
      .replace(/\[EXPLANATION:\s*[\s\S]*?\]/gi, '');
    if (codeMatch) {
      cleaned = cleaned.replace(codeMatch[0], '');
    }

    const lines = cleaned.split('\n');
    const optionLines: { key: string; text: string }[] = [];
    const questionLines: string[] = [];

    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      const optMatch = t.match(/^[-*•]?\s*\(?([A-Da-dأ-ي1-4])\)?[.:\-–—]\s*(.+)/);
      if (optMatch) {
        optionLines.push({
          key: optMatch[1],
          text: optMatch[2].trim(),
        });
      } else {
        if (optionLines.length === 0) {
          const qClean = t.replace(/^(السؤال\s*(\d+)?:?|Question\s*(\d+)?:?)/i, '').trim();
          if (qClean) questionLines.push(qClean);
        }
      }
    }

    const question = questionLines.join(' ').trim() || 'سؤال اختباري:';

    if (optionLines.length >= 2) {
      return {
        question,
        codeSnippet,
        options: optionLines,
        correctKey,
        explanation: explanation || 'هذا الخيار هو الأدق والأكثر كفاءة معمارياً وفق معايير السوق.',
      };
    }

    return null;
  };

  const parseUntaggedQuizContent = (text: string): Array<{ type: 'text'; content: string } | { type: 'quiz'; data: ParsedQuiz }> | null => {
    const hasOptions = /[A-Dأ-د]\)\s+[^\n]+/g.test(text) || /[-*•]\s+[A-Dأ-د][.:)]\s+[^\n]+/g.test(text);
    if (!hasOptions) return null;

    const answerMatch = text.match(/(?:الإجابة الصحيحة|الخيار الصحيح|Correct Answer|Answer):\s*\(?([A-Da-dأ-ي1-4])\)?/i);
    const correctKey = answerMatch ? answerMatch[1].trim() : 'A';

    const expMatch = text.match(/(?:التفسير|الشرح|Explanation):\s*([^\n]+(?:\n[^\n]+)*)/i);
    const explanation = expMatch ? expMatch[1].trim() : '';

    const lines = text.split('\n');
    const optionLines: { key: string; text: string }[] = [];
    const questionLines: string[] = [];
    let inOptions = false;

    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      const optMatch = t.match(/^[-*•]?\s*\(?([A-Da-dأ-ي1-4])\)?[.:\-–—]\s*(.+)/);
      if (optMatch) {
        inOptions = true;
        optionLines.push({
          key: optMatch[1],
          text: optMatch[2].trim(),
        });
      } else if (!inOptions) {
        if (!t.startsWith('###') && !t.startsWith('#')) {
          const qClean = t.replace(/^(السؤال\s*(\d+)?:?|Question\s*(\d+)?:?)/i, '').trim();
          if (qClean) questionLines.push(qClean);
        }
      }
    }

    if (optionLines.length >= 2) {
      return [
        {
          type: 'quiz',
          data: {
            question: questionLines.join(' ').trim() || 'سؤال اختباري تفاعلي:',
            options: optionLines,
            correctKey,
            explanation: explanation || 'هذا الخيار هو الأصح معمارياً وفق الممارسات الهندسية الحديثة.',
          },
        },
      ];
    }

    return null;
  };

  const parseQuizBlocks = (rawText: string): Array<{ type: 'text'; content: string } | { type: 'quiz'; data: ParsedQuiz }> => {
    const clean = stripGreeting(rawText);
    const parts: Array<{ type: 'text'; content: string } | { type: 'quiz'; data: ParsedQuiz }> = [];

    const tagRegex = /\[QUIZ_QUESTION\]([\s\S]*?)\[\/QUIZ_QUESTION\]/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(clean)) !== null) {
      if (match.index > lastIndex) {
        const precedingText = clean.slice(lastIndex, match.index).trim();
        if (precedingText) {
          parts.push({ type: 'text', content: precedingText });
        }
      }

      const block = match[1].trim();
      const parsed = parseSingleQuizContent(block);
      if (parsed) {
        parts.push({ type: 'quiz', data: parsed });
      } else {
        parts.push({ type: 'text', content: block });
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < clean.length) {
      const trailingText = clean.slice(lastIndex).trim();
      if (trailingText) {
        parts.push({ type: 'text', content: trailingText });
      }
    }

    if (parts.length === 0 || (parts.length === 1 && parts[0].type === 'text')) {
      const untagged = parseUntaggedQuizContent(clean);
      if (untagged && untagged.length > 0) {
        return untagged;
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: clean }];
  };

  const renderInteractiveQuiz = (
    quiz: ParsedQuiz,
    quizId: string,
    userSelectedKey: string | undefined,
    onSelectOption: (key: string) => void
  ) => {
    const isAnswered = !!userSelectedKey;
    const isCorrect = isAnswered && normalizeQuizKey(userSelectedKey) === normalizeQuizKey(quiz.correctKey);

    return (
      <div className="my-3.5 p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface-low)] border border-indigo-500/25 dark:border-indigo-500/35 shadow-xs flex flex-col gap-3.5 relative overflow-hidden transition-all text-right">
        {/* Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px]">quiz</span>
            <span>سؤال اختباري تفاعلي</span>
          </div>

          {isAnswered && (
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                isCorrect
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isCorrect ? 'check_circle' : 'cancel'}
              </span>
              <span>{isCorrect ? 'إجابة صحيحة ✓' : 'إجابة غير صحيحة ✗'}</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <div className="text-sm font-bold text-[var(--color-on-surface)] leading-relaxed">
          {quiz.question}
        </div>

        {/* Code Snippet if present */}
        {quiz.codeSnippet && (
          <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 dir-ltr text-left">
            <code>{quiz.codeSnippet}</code>
          </pre>
        )}

        {/* Options List */}
        <div className="flex flex-col gap-2 pt-1">
          {quiz.options.map((opt) => {
            const isThisSelected = userSelectedKey === opt.key;
            const isThisTheCorrectAnswer = normalizeQuizKey(opt.key) === normalizeQuizKey(quiz.correctKey);

            let optionStyle =
              'bg-[var(--bg-surface-lowest)] hover:bg-emerald-500/10 border-[var(--color-border)] hover:border-emerald-500/40 text-[var(--color-on-surface)]';
            let badgeStyle = 'bg-[var(--bg-surface-high)] text-[var(--color-on-surface-variant)]';

            if (isAnswered) {
              if (isThisSelected && isCorrect) {
                optionStyle =
                  'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30 font-bold';
                badgeStyle = 'bg-emerald-600 text-white font-black';
              } else if (isThisSelected && !isCorrect) {
                optionStyle =
                  'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30 font-bold';
                badgeStyle = 'bg-rose-600 text-white font-black';
              } else if (isThisTheCorrectAnswer && !isCorrect) {
                optionStyle =
                  'bg-emerald-500/10 border-emerald-500/70 border-dashed text-emerald-800 dark:text-emerald-200 font-semibold';
                badgeStyle = 'bg-emerald-600/80 text-white font-bold';
              } else {
                optionStyle =
                  'bg-[var(--bg-surface-lowest)]/60 opacity-60 border-[var(--color-border)] text-[var(--color-on-surface-variant)]';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectOption(opt.key)}
                className={`w-full text-right p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group shadow-2xs ${optionStyle}`}
              >
                {/* Option Letter Badge */}
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${badgeStyle}`}
                >
                  {opt.key}
                </span>

                {/* Option Text */}
                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed pt-0.5">
                  {opt.text}
                </span>

                {/* Evaluation Status Icon */}
                {isAnswered && (
                  <div className="shrink-0 pt-0.5">
                    {isThisSelected && isCorrect && (
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    )}
                    {isThisSelected && !isCorrect && (
                      <span className="material-symbols-outlined text-[18px] text-rose-600">cancel</span>
                    )}
                    {isThisTheCorrectAnswer && !isCorrect && !isThisSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                        الإجابة الصحيحة ✓
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Evaluation Feedback Card */}
        {isAnswered && (
          <div
            className={`mt-1 p-3.5 rounded-xl border flex flex-col gap-2.5 ${
              isCorrect
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/30'
                : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isCorrect ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isCorrect ? 'verified' : 'error'}
              </span>
              <span
                className={`text-xs font-bold ${
                  isCorrect
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-rose-800 dark:text-rose-300'
                }`}
              >
                {isCorrect
                  ? 'إجابة صحيحة! أحسنت 🎯'
                  : `إجابة غير صحيحة — الخيار الصحيح هو (${quiz.correctKey})`}
              </span>
            </div>

            {quiz.explanation && (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-6">
                <strong className="font-bold">التفسير: </strong>
                {quiz.explanation}
              </p>
            )}

            {/* Quick Actions after Answer */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--color-border)]/40 mt-1">
              <button
                type="button"
                onClick={() => handleSendMessage('اسألني سؤال كويز تاني اختياري في نفس المجال')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">quiz</span>
                <span>اسألني سؤال تاني</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSendMessage(`ناقش معايا السؤال ده بالتفصيل: "${quiz.question.slice(0, 45)}..."`)
                }
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-lowest)] hover:bg-[var(--bg-surface-high)] border border-[var(--color-border)] text-[var(--color-on-surface)] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>ناقش الإجابة مع كريم</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAssistantMessage = (msgId: string, text: string) => {
    const parts = parseQuizBlocks(text);

    return (
      <div className="flex flex-col gap-2">
        {parts.map((part, pIdx) => {
          if (part.type === 'text') {
            return <div key={pIdx}>{renderMessageContent(part.content)}</div>;
          }

          const quizId = `${msgId}-quiz-${pIdx}`;
          const selected = quizAnswers[quizId];

          return (
            <div key={pIdx}>
              {renderInteractiveQuiz(part.data, quizId, selected, (key) =>
                handleSelectQuizOption(quizId, key)
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 sm:p-6 text-center">
        <div className="max-w-md w-full bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-10 shadow-appearance-card flex flex-col items-center gap-5 relative overflow-hidden">
          {/* Subtle luminous aura */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-500/15 to-transparent pointer-events-none" />

          {/* Careem Mascot Icon */}
          <div className="relative">
            <CareemAvatar size="lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--bg-surface-lowest)] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[var(--color-on-surface)] tracking-tight">
              سجّل دخولك للوصول إلى المساعد الذكي
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              لتستطيع التحدث مع المساعد المهني الذكي وحفظ سجل المحادثات وتخصيص النصائح لسيرتك الذاتية، يجب أن يكون لديك حساب مسجل في المنصة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              onClick={() => openAuth('login')}
              className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>تسجيل الدخول</span>
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="flex-1 py-3 px-5 rounded-xl bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] border border-[var(--color-border)] text-[var(--color-on-surface)] font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>إنشاء حساب</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('intro')}
            className="text-xs text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer mt-1"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] bg-[var(--bg-surface-lowest)] pb-12">
      {/* Toast feedback */}
      {appliedFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-600 text-white shadow-xl text-xs font-bold animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{appliedFeedback}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1380px] w-full mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 flex-1">
        {/* ================= TOP APPLICATION HEADER ================= */}
        <div className="w-full bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-xs">
          {/* Back button & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('build-cv')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] text-xs font-bold text-[var(--color-on-surface)] transition-all cursor-pointer"
              title="العودة لمحرك بناء الـ CV"
            >
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
              <span>الـ CV بتاعي</span>
            </button>

            <div className="h-5 w-px bg-[var(--color-border)]"></div>

            {/* Careem Profile Identity */}
            <div className="flex items-center gap-2.5">
              <CareemAvatar size="sm" />
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-[var(--color-on-surface)] tracking-tight">
                  Careem
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearChatMessages}
              title="مسح المحادثة وبدء محادثة جديدة"
              className="w-9 h-9 rounded-xl bg-[var(--bg-surface-low)] hover:bg-red-500/10 text-[var(--color-on-surface-variant)] hover:text-red-500 border border-[var(--color-border)] hover:border-red-500/30 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">delete_outline</span>
            </button>
          </div>
        </div>

        {/* ================= 2-COLUMN SPLIT WORKSPACE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
          {/* ================= LEFT / MAIN: CHAT CONVERSATION (8 COLS) ================= */}
          <div className="lg:col-span-8 flex flex-col bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-3xl shadow-sm overflow-hidden h-[680px] sm:h-[720px] lg:h-[calc(100vh-12rem)] lg:min-h-[580px] lg:max-h-[840px]">
            {/* Messages Thread Container */}
            <div className={`flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto chat-scrollbar flex flex-col gap-5 ${messages.length === 0 ? 'justify-center items-center' : ''}`}>
              {/* If no user messages yet, show the integrated Hero Banner centered */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center p-4 sm:p-8 bg-gradient-to-b from-emerald-50/40 via-transparent to-transparent dark:from-emerald-950/20 rounded-3xl border border-emerald-500/10 m-auto w-full max-w-xl select-none">
                  {/* Logo Brand with green accent */}
                  <div className="flex flex-col items-center mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-[var(--color-on-surface)] tracking-tight">
                        Careem
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] max-w-md mt-2 leading-relaxed">
                      اسأل Careem عن أي حاجة تخص مسارك المهني، مهاراتك، الـ CV، أو الخطوات الجاية ... وهو دايماً هنا يساعدك.
                    </p>
                  </div>

                  {/* Category Pills from Image 2 */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                    {categories.map((cat, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          if (cat.name === 'اختبر نفسك') {
                            handleSendMessage(`اختبرني بأسئلة تفاعلية اختيار من متعدد في مجالي (${currentTrack.titleAr || 'البرمجة'}) عشان أقيس مستواي`);
                          } else {
                            handleSendMessage(`إيه أهم النصائح بخصوص ${cat.name} لـ ${currentTrack.titleAr || 'هندسة البرمجيات'}؟`);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${cat.color}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Floating interactive question cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-6">
                    {[
                      'إيه أهم Skill أتعلمه دلوقتي؟',
                      'الـ CV بتاعي محتاج إيه؟',
                      'اختبرني بأسئلة اختيار من متعدد',
                      'أنا مناسب للمجال ده؟',
                    ].map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSendMessage(q)}
                        className="p-2.5 rounded-2xl bg-[var(--bg-surface-low)] hover:bg-emerald-500/10 border border-[var(--color-border)] hover:border-emerald-500/40 text-right text-xs font-semibold text-[var(--color-on-surface)] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                      >
                        <span>{q}</span>
                        <span className="material-symbols-outlined text-[16px] text-emerald-500 group-hover:translate-x-[-2px] transition-transform">
                          arrow_back
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Bubbles Thread */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 sm:gap-3.5 ${
                      isUser ? 'flex-row-reverse justify-start' : 'justify-start'
                    }`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                    ) : (
                      <CareemAvatar size="sm" />
                    )}

                    {/* Bubble Card */}
                    <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[78%]">
                      {/* Sender Tag */}
                      <div
                        className={`flex items-center gap-1.5 text-[11px] font-bold ${
                          isUser ? 'text-right justify-end text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        <span>{isUser ? (cv.fullName || 'أنت') : 'Careem'}</span>
                        {!isUser && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        )}
                      </div>

                      {/* Main Message Content Card */}
                      <div
                        className={`rounded-3xl p-4 sm:p-5 shadow-xs border transition-all ${
                          isUser
                            ? 'bg-[#e2f7f6] dark:bg-teal-950/70 border-teal-200 dark:border-teal-800/60 text-slate-800 dark:text-slate-100 rounded-tr-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-sm'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-[13px] sm:text-sm font-medium leading-relaxed select-text">
                            {msg.text}
                          </p>
                        ) : (
                          renderAssistantMessage(msg.id, msg.text)
                        )}

                        {/* Action snippet if applicable */}
                        {msg.actionSnippet && (
                          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex flex-col gap-2">
                            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                              صياغة مقترحة للإنجاز:
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                              "{msg.actionSnippet}"
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleApplySnippetToCV(msg.actionSnippet!)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
                              >
                                تطبيق على الـ CV
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Footer details: Time & quick copy */}
                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[var(--color-border)]/50 text-[10px] text-[var(--color-outline)]">
                          <div className="flex items-center gap-1">
                            <span>{msg.time}</span>
                            {isUser && (
                              <span className="text-teal-600 dark:text-teal-400 font-bold">✓✓</span>
                            )}
                          </div>

                          {!isUser && (
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer"
                              title="نسخ الرد"
                            >
                              <span className="material-symbols-outlined text-[13px]">content_copy</span>
                              <span>{copyStatus[msg.id] || 'نسخ'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <CareemAvatar size="sm" />
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl rounded-tl-xs p-4 shadow-xs flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Careem يفكر...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ================= BOTTOM INPUT BAR (From Image 1 & 2) ================= */}
            <div className="p-3 sm:p-4 bg-[var(--bg-surface-lowest)] border-t border-[var(--color-border)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                  inputRef.current?.focus();
                }}
                className="relative flex items-center bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-high)] focus-within:bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-full px-4 py-2 transition-all shadow-sm"
              >
                {/* Text Input - Keep enabled so cursor remains inside even while Careem replies */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="بتفكر في ايه ..."
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] px-3 text-right"
                />

                {/* Circular Send Button - onMouseDown prevents stealing focus so cursor stays in input */}
                <button
                  type="submit"
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-500/30 cursor-pointer active:scale-95 shrink-0 mr-1"
                  title="إرسال"
                >
                  <span className="material-symbols-outlined text-[20px] rtl:rotate-180">
                    send
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: HERO & PROMPT ASSISTANT PANEL (4 COLS) ================= */}
          <div className="lg:col-span-4 flex flex-col h-[680px] sm:h-[720px] lg:h-[calc(100vh-12rem)] lg:min-h-[580px] lg:max-h-[840px]">
            {/* Careem Hero Greeting Card (From Image 1) - Without scrollbar */}
            <div className="bg-gradient-to-b from-[#eafaf5] to-white dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-500/20 dark:border-emerald-800/40 rounded-3xl p-5 shadow-sm flex flex-col items-center text-center h-full justify-between overflow-hidden">
              <div className="w-full flex flex-col items-center">
                {/* Mascot Illustration */}
                <CareemMascotCard className="scale-95" />

                {/* Title Section */}
                <h3 className="text-base font-black text-[var(--color-on-surface)] mt-3">
                  ممكن تسألني عن:
                </h3>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">
                  اسألني أي حاجة متعلقة بمسارك المهني
                </p>

                {/* List of 5 prompt buttons matching Image 1 */}
                <div className="flex flex-col gap-2 w-full mt-4">
                  {quickPrompts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSendMessage(item.text)}
                      disabled={isLoading}
                      className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 text-right text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        </div>
                        <span className="truncate">{item.short}</span>
                      </div>

                      <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-[-2px] transition-transform">
                        arrow_back
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Friendly reassurance banner (Image 1 Bottom Card) */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-emerald-500/20 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs shrink-0">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">auto_awesome</span>
                <span>اسأل براحتك ... أنا هنا عشان أساعدك</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
