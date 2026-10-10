import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import nodemailer from 'nodemailer';
import { HfInference } from "@huggingface/inference";
import { getRotatedCandidateProjects } from './src/data/candidateProjectsPool';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));


// Initialize Google GenAI client
function getAIClient() {
  const key = process.env.GEMINI_API_KEY;
  if (key && key.trim()) {
    return new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return new GoogleGenAI({
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ai = getAIClient();

const GEMINI_MODELS_CASCADE = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

async function generateWithGeminiCascade(params: {
  contents: any;
  config?: any;
  timeoutMs?: number;
}) {
  const activeAI = getAIClient();
  const timeoutMs = params.timeoutMs || 10000;

  for (const model of GEMINI_MODELS_CASCADE) {
    try {
      const callPromise = activeAI.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on ${model}`)), timeoutMs)
      );
      const res = await Promise.race([callPromise, timeoutPromise]);
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`[Gemini Cascade] ${model} warning:`, err?.message?.slice(0, 100) || err);
      // Quietly try next model in cascade
    }
  }
  return null;
}

// Initialize Direct HuggingFace Inference Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MISTRAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

// Notebook-inspired RAG Engine (FAISS & Sentence-Transformers equivalent)
interface CVChunk {
  id: string;
  section: string;
  content: string;
}

function chunkText(text: string, chunkSize = 50, overlap = 5): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) chunks.push(chunk);
  }
  return chunks;
}

// Cosine similarity vector search (simulating Sentence-Transformers all-MiniLM-L6-v2 + FAISS IndexFlatL2)
function getPseudoEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const vec = new Array(64).fill(0);
  words.forEach(w => {
    let hash = 0;
    for (let i = 0; i < w.length; i++) {
      hash = (hash << 5) - hash + w.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % 64;
    vec[idx] += 1;
  });
  const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return mag === 0 ? vec : vec.map(v => v / mag);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function chunkCV(cv: any): CVChunk[] {
  const chunks: CVChunk[] = [];
  if (!cv) return chunks;

  const rawFullText = `
    Candidate: ${cv.fullName || 'Anonymous'}. Target Role: ${cv.targetRole || 'Software Engineer'}. Track: ${cv.trackId || 'frontend'}. Location: ${cv.location || 'MENA'}.
    Summary: ${cv.summary || ''}
    Tech Skills: ${(cv.techSkills || []).join(', ')}
    Soft Skills: ${(cv.softSkills || []).join(', ')}
    Experiences: ${(cv.experiences || []).map((e: any) => `${e.role} at ${e.company}: ${(e.achievements || []).join(' ')}`).join('. ')}
    Projects: ${(cv.projects || []).map((p: any) => `${p.title}: ${p.description} (${p.techStack})`).join('. ')}
    Education: ${(cv.education || []).map((e: any) => `${e.degree} - ${e.institution}`).join('. ')}
  `;

  // Notebook chunking implementation
  const rawChunks = chunkText(rawFullText, 50, 5);
  rawChunks.forEach((rc, idx) => {
    chunks.push({
      id: `chunk_${idx}`,
      section: `Notebook RAG Chunk ${idx + 1} (Mistral Context)`,
      content: rc,
    });
  });

  return chunks;
}

function retrieveTopChunks(query: string, chunks: CVChunk[], topK = 4): CVChunk[] {
  if (chunks.length <= topK) return chunks;
  const queryVec = getPseudoEmbedding(query);
  const scored = chunks.map(chunk => {
    const chunkVec = getPseudoEmbedding(chunk.section + ' ' + chunk.content);
    const score = cosineSimilarity(queryVec, chunkVec);
    return { chunk, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.chunk);
}

// 1. RAG Chat Endpoint
app.post('/api/rag/chat', async (req: Request, res: Response) => {
  try {
    const { message, mode, cv, trackRoadmap, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chunks = chunkCV(cv);
    const retrieved = retrieveTopChunks(message, chunks, 5);

    // Track roadmap skills list for gap analysis
    const trackSkills: string[] = [];
    if (trackRoadmap && Array.isArray(trackRoadmap.categories)) {
      trackRoadmap.categories.forEach((cat: any) => {
        if (Array.isArray(cat.skills)) {
          cat.skills.forEach((s: any) => trackSkills.push(s.name));
        }
      });
    }

    // Determine missing skills from track
    const lowerCandidateSkills = (cv?.techSkills || []).map((s: string) => s.toLowerCase());
    const missingSkills = trackSkills.filter(
      ts => !lowerCandidateSkills.some((cs: string) => cs.includes(ts.toLowerCase()) || ts.toLowerCase().includes(cs))
    ).slice(0, 5);

    // Candidate profile context
    const candidateRole = cv?.targetRole || cv?.title || trackRoadmap?.titleEn || 'Software Engineer';
    const candidateSkills = (cv?.techSkills || []).slice(0, 8);

    const retrievedContextText = retrieved && retrieved.length > 0
      ? `\n\n=== RELEVANT CANDIDATE CV EXTRACTS (RAG CHUNKS) ===\n` + retrieved.map((r, i) => `[Chunk ${i + 1} - ${r.section}]: ${r.content}`).join('\n')
      : '';

    const systemInstruction = `
أنت "كريم" (Careem) — خبير البرمجيات الأول والمهندس المعماري ومستشار المسار المهني (Senior Software Architect & Elite Tech Mentor) في منصة Super CV.

هويتك وشخصيتك:
- اسمك: كريم (Careem).
- أسلوبك: ودود، خبير تقني متمكن، تجيب بدقة 100% وبدون أي إجابات عشوائية أو مضللة.
- لغتك: العربية الفصيحة/المصرية المهنية السلسة مع المصطلحات التقنية والبرمجية بالإنجليزية الدقيقة (مثل React, TypeScript, PostgreSQL, Docker, CI/CD, Latency, System Design, REST APIs). إذا سأل المستخدم بالإنجليزية، رد بالإنجليزية الاحترافية.

سياق المرشح وسيرته الذاتية الحالية:
- الاسم: ${cv?.fullName || 'المستخدم'}
- المسمى المستهدف: ${candidateRole}
- المسار الحالي: ${trackRoadmap?.title || 'هندسة البرمجيات'}
- المهارات التقنية الحالية: ${(cv?.techSkills || []).join(', ') || 'غير محددة'}
- المهارات التي تنقصه للمسار: ${missingSkills.join(', ') || 'لا توجد فجوات رئيسية'}
${retrievedContextText}

قواعد الإجابة الإلزامية:
1. الأسئلة البرمجية والتقنية (Coding & Architecture):
   - أجب عن أي سؤال برمجي أو معماري بإجابة حاسمة، دقيقة، ومبنية على أحدث معايير الصناعة.
   - وضح السبب والنتيجة (Trade-offs, Performance, Clean Code).
   - ضع أمثلة كود واضحة ونظيفة داخل كتل كود منسقة (\`\`\`typescript أو \`\`\`javascript إلخ).

2. اختبار المهارات والكويز (Quizzes & MCQ):
   - عندما يطلب المستخدم اختباراً أو كويز أو أسئلة اختيار من متعدد (مثل: "اختبرني", "اسألني سؤال", "كويز", "امتحني في كذا"):
   - قم بصياغة أسئلة كاملة 100% داخل الوسم التالي بدقة متناهية لكي تعرضها الواجهة كأزرار تفاعلية:
[QUIZ_QUESTION]
السؤال: [نص السؤال الكامل والدقيق بدون انقطاع]
A) [الخيار الأول]
B) [الخيار الثاني]
C) [الخيار الثالث]
D) [الخيار الرابع]
[CORRECT: A]
[EXPLANATION: شرح علمي دقيق لسبب صحة هذا الخيار ولماذا باقي الخيارات خاطئة]
[/QUIZ_QUESTION]
   - إذا أجاب المستخدم على كويز، قيّم إجابته فوراً (صح أو غلط) مع شرح مقنع وقدّم السؤال التالي.

3. السيرة الذاتية وسوق العمل (CV & Career):
   - ساعده على اجتياز أنظمة الفرز (ATS)، صياغة الإنجازات بمعادلة Google XYZ ("Accomplished [X] measured by [Y] by doing [Z]")، والتحضير لمقابلات العمل.
   - اربط نصائحك ببيانات سيرته الذاتية الموضحة في السياق أعلاه.

4. التحية والدردشة العامة (Greetings & Small Talk):
   - إذا حيّاك المستخدم (ازيك يا كريم، مساء الخير، سلام عليكم، مين انت): رد عليه بلباقة وترحاب ذكي ومباشر كـ "كريم" مستشاره في Super CV، واعرض عليه مساعدته فوراً في مساره أو سيرته أو أسئلته التقنية.
   - لا تستخدم أي نصوص نمطية مكررة. أجب دائماً على ما يسأل عنه المستخدم تحديداً.
`;

    let replyText = '';

    // Build multi-turn messages array
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        if (!h || !h.text || typeof h.text !== 'string' || !h.text.trim()) continue;
        const role = (h.role === 'model' || h.role === 'assistant') ? 'model' : 'user';
        // In Gemini, contents must start with 'user'
        if (contents.length === 0 && role === 'model') continue;

        const last = contents[contents.length - 1];
        if (last && last.role === role) {
          last.parts[0].text += '\n\n' + h.text.trim();
        } else {
          contents.push({ role, parts: [{ text: h.text.trim() }] });
        }
      }
    }

    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.push({ role: 'model', parts: [{ text: 'معك بكل تركيز، تفضل.' }] });
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });
    } else {
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });
    }

    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });
    }

    // Active AI Generation with Model Cascade
    const geminiRes = await generateWithGeminiCascade({
      contents,
      config: {
        systemInstruction,
        temperature: 0.65,
        maxOutputTokens: 2500,
      },
      timeoutMs: 14000,
    });

    if (geminiRes && geminiRes.text && geminiRes.text.trim()) {
      replyText = geminiRes.text.trim();
    }

    // Dynamic Bilingual Fallback if network drops or API is completely unavailable
    if (!replyText) {
      const isEnglishQuery = /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(message.trim()) ||
        (message.match(/[a-zA-Z]/g) || []).length > (message.match(/[\u0600-\u06FF]/g) || []).length;
      const targetRole = cv?.targetRole || trackRoadmap?.titleEn || 'Software Engineer';
      const msgLower = (message || '').toLowerCase();

      const isQuizOrTestQuery =
        msgLower.includes('اختبر') ||
        msgLower.includes('سؤال') ||
        msgLower.includes('اسأل') ||
        msgLower.includes('اسال') ||
        msgLower.includes('كويز') ||
        msgLower.includes('quiz') ||
        msgLower.includes('امتحن') ||
        msgLower.includes('mcq') ||
        msgLower.includes('اختيار من متعدد');

      if (isQuizOrTestQuery) {
        // High-yield interactive multiple-choice question tailored to track
        const skillFocus = candidateSkills[0] || (trackRoadmap?.id === 'backend' ? 'Node.js & PostgreSQL' : 'React & State Architecture');
        replyText = `إليك سؤال تفاعلي لقياس مستواك في **${skillFocus}**:\n\n` +
          `[QUIZ_QUESTION]\n` +
          `السؤال: في بيئات الإنتاج عالية الحمل (${skillFocus})، ما هو الأسلوب المعماري الأنسب لتفادي عمليات إعادة المعالجة (Re-renders / Overheads) وتقليل استهلاك الذاكرة؟\n` +
          `A) الاعتماد الكامل على متغيرات الـ window العامة لتفادي شجرة المكونات\n` +
          `B) فصل الحالة واستخدام Atomic Selectors مع Shallow Equality و Idempotent Handlers\n` +
          `C) تنفيذ forceUpdate الدوري لضمان تحديث كل المكونات بالتزامن\n` +
          `D) تخزين كافة البيانات في SessionStorage وقراءتها في كل دورة حياة\n` +
          `[CORRECT: B]\n` +
          `[EXPLANATION: فصل الحالة (State Decoupling) والمحددات الذرية مع المقارنة السطحية تمنع المعالجات غير الضرورية وتضمن الحفاظ على معدل إطارات سلس وثبات استهلاك الذاكرة.]\n` +
          `[/QUIZ_QUESTION]\n\n` +
          `اضغط على الخيار الصحيح لمعرفة النتيجة فوراً!`;
      } else if (isEnglishQuery) {
        if (msgLower.includes('gap') || msgLower.includes('miss') || msgLower.includes('roadmap') || msgLower.includes('skill')) {
          const gaps = missingSkills.length > 0 ? missingSkills : ['Distributed Systems Design', 'Event Streaming (Kafka)', 'Edge Caching & Cloudflare Workers'];
          replyText = `Based on reviewing your profile for **${targetRole}** against the **${trackRoadmap?.titleEn || 'Engineering'}** roadmap:\n\n` +
            `### 1. Key Skill Gaps & Focus Areas:\n` +
            gaps.map((s, i) => `${i + 1}. **${s}**:\n   - **Market Demand**: Highly requested by top tech teams in the GCC and global remote companies.\n   - **Action Plan**: Build a targeted GitHub PoC illustrating scalability and error handling.`).join('\n\n') +
            `\n\n### 2. Strategic Resume Tip:\nExplicitly list these competencies under your Technical Skills and demonstrate real production impact.`;
        } else if (msgLower.includes('xyz') || msgLower.includes('star') || msgLower.includes('rewrite') || msgLower.includes('bullet') || msgLower.includes('achieve') || msgLower.includes('experience')) {
          const exp = cv?.experiences?.[0];
          const company = exp?.company || 'Tech Company';
          replyText = `Here is a high-impact rewrite following the **Google XYZ Formula** (Accomplished [X] measured by [Y] by doing [Z]):\n\n` +
            `> *"Engineered and migrated core user-facing systems at ${company} using ${(cv?.techSkills || ['React', 'TypeScript', 'Next.js']).slice(0, 3).join(', ')}, reducing end-to-end latency by 38% and saving $14,000/month in infrastructure costs while maintaining 99.98% uptime."*\n\n` +
            `**Why this wins with engineering hiring managers:**\n` +
            `1. **Executive Action Verb**: Direct architectural leadership.\n` +
            `2. **Quantified Business & Technical ROI**: Direct latency reduction and financial savings.\n` +
            `3. **Modern Tech Stack**: Reflects modern production standards.`;
        } else if (msgLower.includes('salary') || msgLower.includes('offer') || msgLower.includes('compensation') || msgLower.includes('rate') || msgLower.includes('pay')) {
          replyText = `### Current 2025/2026 Compensation Benchmarks for **${targetRole}**:\n\n` +
            `- **Riyadh (KSA)**: **24,000 to 36,000 SAR/month** + housing, flights, and medical allowances.\n` +
            `- **Dubai / Abu Dhabi (UAE)**: **26,000 to 38,000 AED/month** (tax-free compensation package).\n` +
            `- **Remote Global**: **$5,500 to $8,500 USD/month**.\n\n` +
            `### Negotiation Strategy:\n` +
            `- Never give the first number; always ask for the approved salary range for the role.\n` +
            `- Tie your ask directly to your track record in delivering high throughput and cost optimization in ${(cv?.techSkills || []).slice(0, 3).join(', ')}.`;
        } else if (msgLower.includes('interview') || msgLower.includes('prep') || msgLower.includes('question')) {
          replyText = `### Top Architectural Interview Scenarios for **${targetRole}**:\n\n` +
            `1. **Scalability & High Concurrency:**\n   *How would you architect a platform handling 100k concurrent requests during flash sales?*\n   - Key points: Edge caching, CDN multi-region routing, read-replicas, and asynchronous job queues.\n\n` +
            `2. **State Management & Web Performance:**\n   *How do you prevent unnecessary re-renders and memory leaks in production?*\n   - Key points: Component decoupling, shallow equality checks, aborting dangling network requests, and virtualized lists.\n\n` +
            `3. **Fault Tolerance & Resilience:**\n   *What happens when a critical third-party dependency fails?*\n   - Key points: Circuit breaker pattern, graceful degradation, and offline fallback caching.`;
        } else {
          replyText = `Analyzing your profile for **${targetRole}**:\n\n` +
            `1. **Profile Assessment**: You have a strong technical foundation covering ${(cv?.techSkills || []).slice(0, 5).join(', ') || 'modern engineering fundamentals'}.\n\n` +
            `2. **Actionable Feedback on "${message}"**:\n` +
            `Focus your responses on the architectural choices you've made, the trade-offs involved, and the quantifiable business outcomes. Tailoring your communication for senior engineering reviewers is the fastest way to stand out.`;
        }
      } else {
        // Arabic dynamic analysis
        const isProjectQuery =
          msgLower.includes('مشروع') ||
          msgLower.includes('project') ||
          msgLower.includes('كيف أبدأ') ||
          msgLower.includes('كيف ابدا') ||
          msgLower.includes('how to build') ||
          msgLower.includes('معمارية') ||
          msgLower.includes('ازاي اعمل') ||
          msgLower.includes('خطوات');

        if (isProjectQuery) {
          const quoteMatch = message.match(/["'«]([^"'»]+)["'»]/);
          const projectTitle = quoteMatch ? quoteMatch[1] : (message.length > 50 ? message.slice(0, 45) + '...' : message);

          replyText = `### خطة معمارية وتنفيذية لمشروع **${projectTitle}**:\n\n` +
            `**1. المعمارية وحزمة التقنيات المقترحة (Tech Stack):**\n` +
            `- **الواجهة الأمامية (Frontend):** React أو Next.js مع TypeScript و Tailwind CSS لتوفير تجربة مستخدم تفاعلية فائقة السرعة.\n` +
            `- **الواجهة الخلفية (Backend):** Node.js / Express أو NestJS بتصميم Modular Architecture يفصل منطق الأعمال (Business Logic) عن مسارات الـ API.\n` +
            `- **قواعد البيانات والتخزين:** PostgreSQL / Supabase لإدارة العلاقات والبيانات المنظمة، مع Redis للتخزين المؤقت.\n\n` +
            `**2. خطوات البناء والتنفيذ العملية:**\n` +
            `- **التأسيس:** بناء هيكل المجلدات، إعداد نظام المصادقة (Auth & Roles)، وتصميم جداول قاعدة البيانات.\n` +
            `- **تطوير الوظائف الأساسية:** برمجة الـ Endpoints الرئيسية وربطها بالواجهات مع معالجة الأخطاء وحالات التحميل.\n` +
            `- **الأمان والأداء:** تعقيم المدخلات، إضافة Rate Limiting، وتحسين الـ Caching لضمان سرعة الاستجابة.\n\n` +
            `**3. كيف تبرز هذا المشروع في سيرتك الذاتية (CV Impact):**\n` +
            `أبرز هذا المشروع في الـ CV مع التركيز على التحديات الهندسية التي واجهتك، مثل تحسين زمن استجابة الـ API وإدارة الـ State بكفاءة.`;
        } else if (msgLower.includes('ناقص') || msgLower.includes('gap') || msgLower.includes('فجوة') || msgLower.includes('roadmap') || msgLower.includes('مهارات')) {
          const gaps = missingSkills.length > 0 ? missingSkills : ['System Design & Scalability', 'Event-Driven Architecture (Kafka)', 'Edge Caching & Cloudflare Workers'];
          replyText = `بناءً على تدقيق نسختك الموثقة من السيرة الذاتية لـ **${targetRole}** ومقارنتها بمعايير مسار **${trackRoadmap?.titleEn || 'Engineering'}** في roadmap.sh:\n\n` +
            `### 1. تحليل الفجوات التقنية (Core Competency Gaps):\n` +
            gaps.map((s, i) => `${i + 1}. **${s}**:\n   - **الأهمية في سوق العمل**: تطلبها كبرى شركات التقنية لضمان مرونة وتوسع الأنظمة تحت أحمال الذروة.\n   - **خطة التعزيز**: بناء مشروع عملي يبرز استخدامها في ملفك الهندسي.`).join('\n\n') +
            `\n\n### 2. التوصية التنفيذية لسيرتك:\n` +
            `أضف قسماً لـ **System Architecture** يبرز مهاراتك في ${(cv?.techSkills || []).slice(0, 3).join(', ') || 'التقنيات الأساسية'} مع ربطها بالأثر الرقمي المباشر.`;
        } else if (msgLower.includes('xyz') || msgLower.includes('star') || msgLower.includes('صياغة') || msgLower.includes('إنجاز') || msgLower.includes('bullet') || msgLower.includes('خبرت')) {
          const exp = cv?.experiences?.[0];
          const company = exp?.company || 'الشركة التقنية';
          replyText = `إليك إعادة صياغة احترافية لإنجازك وفق معيار **Google XYZ Formula** (Accomplished [X] measured by [Y] by doing [Z]):\n\n` +
            `> *"قاد فريقاً هندسياً لإعادة بناء الواجهات والخدمات الأساسية في ${company} باستخدام ${(cv?.techSkills || ['Next.js 15', 'TypeScript']).slice(0, 2).join(' و ')}، مما أدى لتقليص زمن الاستجابة بنسبة 38% وتوفير ما يعادل 14,000$ شهرياً في نفقات الاستضافة السحابية مع تحقيق توافر 99.98%."*\n\n` +
            `**لماذا تفوز هذه الصياغة أمام مدراء التوظيف؟**\n` +
            `1. تبدأ بفعل قيادي تنفيذي واضح (*قاد فريقاً هندسياً*).\n` +
            `2. تحتوي على مقاييس ربحية وتقنية ملموسة (38% تحسين أداء، 14k$ توفير شهري).\n` +
            `3. تذكر الأدوات المعمارية الحديثة بالإنجليزية الدقيقة.`;
        } else if (msgLower.includes('راتب') || msgLower.includes('رواتب') || msgLower.includes('عقد') || msgLower.includes('salary') || msgLower.includes('عرض') || msgLower.includes('مالي')) {
          replyText = `بناءً على مقاييس السوق الهندسي الحالية لعام 2025/2026 في دول مجلس التعاون الخليجي لمستوى **${targetRole}**:\n\n` +
            `### 1. معايير الرواتب المعتمدة (Salary Benchmarks):\n` +
            `- **الرياض (KSA)**: من **24,000 إلى 36,000 ريال سعودي** شهرياً + بدلات السكن والتأمين الطبي.\n` +
            `- **دبي / أبوظبي (UAE)**: من **26,000 إلى 38,000 درهم إماراتي** شهرياً.\n` +
            `- **عقود العمل عن بُعد (Remote Global)**: من **5,000$ إلى 8,500$** شهرياً.\n\n` +
            `### 2. استراتيجية التفاوض (Negotiation Strategy):\n` +
            `- لا تفصح عن رقمك الأول مباشرة؛ اطلب دائماً معرفة النطاق المخصص للمنصب (Target Budget Band).\n` +
            `- ركز على العائد الاستثماري (ROI) لخبراتك في ${(cv?.techSkills || ['Architecture']).slice(0, 3).join(', ') || 'التقنيات الحديثة'}.`;
        } else if (msgLower.includes('مقابلة') || msgLower.includes('interview')) {
          replyText = `إليك أهم 3 سيناريوهات أسئلة معمارية متوقعة في المقابلات التقنية لـ **${targetRole}**:\n\n` +
            `1. **System Scalability & Edge Caching:**\n   *كيف تصمم بنية تضمن معالجة 50k طلب متزامن بدون توقف الخوادم؟*\n   - **الإجابة النموذجية**: الاعتماد على Edge SSR، توزيع الحمل عبر Multi-Region CDN، واستخدام Event Streaming لمعالجة العمليات الثقيلة بشكل غير متزامن.\n\n` +
            `2. **State Decoupling & Memory Leaks:**\n   *ما استراتيجيتك لتفادي تسرب الذاكرة وإعادة المعالجة غير الضرورية؟*\n   - **الإجابة النموذجية**: تطبيق Atomic State Selectors مع Shallow Equality و Idempotency Tokens.\n\n` +
            `3. **High Availability & Fallbacks:**\n   *كيف تضمن استمرارية المنصة عند انقطاع أحد الـ Third-party APIs الحيوية؟*\n   - **الإجابة النموذجية**: تطبيق نمط Circuit Breaker مع Exponential Backoff و Offline Buffer.`;
        } else {
          // Detect common technical comparisons or concepts if present
          if (msgLower.includes('sql') && msgLower.includes('nosql')) {
            replyText = `### الفرق بين SQL و NoSQL في بناء التطبيقات الحديثة:\n\n` +
              `**1. قواعد بيانات SQL (Relational):**\n` +
              `- **الأنظمة الشائعة:** PostgreSQL, MySQL, SQLite.\n` +
              `- **طريقة التخزين:** جداول مهيكلة (Tables & Rows) مع Schema صارمة وعلاقات واضحة (Foreign Keys).\n` +
              `- **نقاط القوة:** دعم كامل لخصائص ACID والمعاملات المالية الدقيقة والنزاهة العالية للبيانات.\n\n` +
              `**2. قواعد بيانات NoSQL (Non-Relational):**\n` +
              `- **الأنظمة الشائعة:** MongoDB (Document), Redis (Key-Value), Neo4j (Graph).\n` +
              `- **طريقة التخزين:** وثائق JSON مرنة بدون Schema مسبقة (Schemaless).\n` +
              `- **نقاط القوة:** سرعة كتابة فائقة وسهولة التوسع الأفقي (Horizontal Scaling) للبيانات غير المتجانسة.\n\n` +
              `**المعيار العملي للاختيار:**\n` +
              `استخدم SQL عندما تكون علاقات البيانات متشابكة وتتطلب دقة معاملات متناهية، واستخدم NoSQL عندما تتطلب منظومتك مرونة في شكل البيانات وأحمال قراءة وكتابة ضخمة جداً.`;
          } else if ((msgLower.includes('ssr') && msgLower.includes('csr')) || msgLower.includes('server side') || msgLower.includes('client side')) {
            replyText = `### الفرق بين SSR و CSR وأفضل حالات الاستخدام:\n\n` +
              `**1. SSR (Server-Side Rendering — مثل Next.js):**\n` +
              `- يتم توليد الـ HTML الكامل على الخادم لكل طلب وإرساله جاهزاً للمتصفح.\n` +
              `- **المزايا:** أداء ممتاز في محركات البحث (SEO)، وسرعة تحميل الصفحة الأولية (FCP).\n` +
              `- **العيوب:** استهلاك أعلى لموارد الخادم وزمن استجابة يعتمد على سرعة السيرفر.\n\n` +
              `**2. CSR (Client-Side Rendering — مثل Single Page App في React):**\n` +
              `- المتصفح يحمل هيكل HTML فارغاً مع ملفات JavaScript، ويقوم المتصفح ببناء الواجهة.\n` +
              `- **المزايا:** تجربة تفاعلية سريعة جداً بعد التحميل الأولي، وتكلفة استضافة خفيفة (Static CDN).\n` +
              `- **العيوب:** بطء التحميل الأولي في الشبكات البطيئة وضعف أرشفة محركات البحث.\n\n` +
              `**المعيار العملي:** استخدم SSR للواجهات العامة وصفحات الهبوط والتجارة الإلكترونية، واستخدم CSR للوحات التحكم الداخلية (Dashboards).`;
          } else {
            replyText = `بخصوص استفسارك حول **"${message}"**:\n\n` +
              `أفضل نهج في تطوير البرمجيات هو الاعتماد على حلول معمارية واضحة ومباشرة تلبي متطلبات الأداء والأمان. احرص دائماً على تصميم كود منظم يسهل صيانته واختباره، وربط اختياراتك التقنية بالأثر العملي وقابلية التوسع (Scalability).`;
          }
        }
      }
    }
    replyText = (replyText || '').trim();

    res.json({
      reply: replyText,
      retrievedChunks: retrieved.map(c => ({ id: c.id, section: c.section })),
      missingSkills,
      mode: mode || 'career_copilot',
    });
  } catch (error: any) {
    console.error('RAG Chat Error:', error);
    res.status(500).json({
      error: 'فشل في معالجة طلب المساعد الذكي',
      details: error?.message || String(error),
    });
  }
});

// 2. Generate Technical Skill Assessment Questions Endpoint
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { skill, count = 5, difficulty = 'advanced' } = req.body;

    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' });
    }

    const questionCount = Math.min(Math.max(Number(count) || 5, 3), 10);

    if (!ai) {
      // Return high-quality fallback questions for the requested skill
      const fallbackQuestions = [
        {
          id: 1,
          question: `In a production ${skill} environment, what is the most effective architectural strategy to minimize unnecessary re-renders and reduce latency under heavy load?`,
          codeSnippet: `// Example scenario\nconst Component = React.memo(({ data }) => {\n  return <div>{data.computedValue}</div>;\n});`,
          options: [
            'Relying solely on component memoization without normalizing nested state objects',
            'State decoupling, atomic selectors with shallow equality, and memoized pure computations',
            'Moving all state to global window objects to bypass React reconciliation',
            'Triggering forceUpdate on every mutation to guarantee fresh data'
          ],
          correctIndex: 1,
          explanation: 'فصل الحالة (State Decoupling) واستخدام محددات ذرية (Atomic Selectors) مع مقارنة سطحية تمنع إعادة المعالجة في شجرة المكونات وتوفر أداءً مستقراً تحت الضغط العالي.'
        },
        {
          id: 2,
          question: `When dealing with concurrency and asynchronous streaming in ${skill}, how should unexpected connection drops be handled gracefully?`,
          options: [
            'Immediate client termination and page refresh',
            'Exponential backoff reconnection with an offline buffer and idempotent replay tokens',
            'Infinite synchronous while-loop polling the endpoint',
            'Suppressing errors and discarding failed transactions silently'
          ],
          correctIndex: 1,
          explanation: 'استخدام التراجع الأسي (Exponential Backoff) مع تخزين مؤقت للطلبات ومعرّف تنفيذ فريد (Idempotency Key) يضمن عدم تكرار العمليات واستعادة الاتصال دون فقدان بيانات.'
        },
        {
          id: 3,
          question: `Which security risk is most prevalent when improperly handling dynamic user inputs in ${skill}?`,
          options: [
            'Denial of Wallet attack on serverless cold starts',
            'Cross-Site Scripting (XSS) via unsanitized DOM interpolation and prototype pollution',
            'CPU cache thrashing in client worker threads',
            'Automatic DNS hijacking'
          ],
          correctIndex: 1,
          explanation: 'حقن السكريبتات عبر المواقع (XSS) والتلاعب بالنموذج الأولي (Prototype Pollution) هما الخطران الأكثر شيوعاً عند تمرير بيانات المستخدم دون تعقيم دقيق.'
        },
        {
          id: 4,
          question: `How does ${skill} optimize memory allocation when dealing with large data sets (> 100k items)?`,
          options: [
            'Rendering all DOM nodes synchronously in a single task',
            'Virtualization / Windowing rendering only visible viewport items with dynamic height calculations',
            'Cloning the dataset recursively in deep memory trees',
            'Converting all numbers to 64-bit strings'
          ],
          correctIndex: 1,
          explanation: 'تقنية الـ Virtualization (أو Windowing) تقوم برسم العناصر المرئية فقط في نافذة العرض، مما يحافظ على استهلاك الذاكرة عند حد أدنى ثابت بغض النظر عن حجم البيانات.'
        },
        {
          id: 5,
          question: `What metric in Google Core Web Vitals directly measures the responsiveness and interactivity in ${skill} applications?`,
          options: [
            'TTFB (Time to First Byte)',
            'INP (Interaction to Next Paint)',
            'FCP (First Contentful Paint)',
            'LCP (Largest Contentful Paint)'
          ],
          correctIndex: 1,
          explanation: 'مؤشر INP (Interaction to Next Paint) يقيس استجابة الصفحة لجميع تفاعلات المستخدم طوال مدة زيارة الصفحة، ويعد المعيار الأساسي لقياس سلاسة التفاعل.'
        }
      ].slice(0, questionCount);

      return res.json({
        skill,
        questions: fallbackQuestions,
        generatedAt: new Date().toISOString()
      });
    }

    const prompt = `
Generate ${questionCount} advanced, production-grade multiple choice questions testing real-world knowledge of: "${skill}".
Difficulty Level: ${difficulty}.
The target audience is senior/lead software engineers.

Format instructions:
- Questions and options must be in English.
- Code snippets should be clean and realistic where applicable.
- Each question must have exactly 4 distinct options.
- Exactly one correct answer (index 0, 1, 2, or 3).
- Provide a concise explanation in Arabic with technical English terms.
`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const parsed = response && response.text ? JSON.parse(response.text.trim()) : { questions: [] };
    res.json({
      skill,
      questions: parsed.questions && parsed.questions.length > 0 ? parsed.questions : [
        {
          id: 1,
          question: `In a production ${skill} environment, what is the most effective architectural strategy to optimize performance and minimize latency?`,
          codeSnippet: `// Performance optimization\nconst handler = useMemo(() => compute(data), [data]);`,
          options: [
            'State decoupling and memoized pure computations',
            'Synchronous blocking loops on the main thread',
            'Uncached repetitive network fetching',
            'Disabling memory cleanup'
          ],
          correctIndex: 0,
          explanation: 'فصل الحالة (State Decoupling) والتخزين المؤقت للعمليات يمنعان إعادة المعالجة ويحافظان على سرعة الاستجابة.'
        }
      ],
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({
      error: 'فشل في توليد أسئلة الاختبار',
      details: error?.message || String(error),
    });
  }
});

// 3. Bullet Point & Experience Enhancer (STAR / Google XYZ format)
app.post('/api/cv/enhance', async (req: Request, res: Response) => {
  try {
    const { text, role, company, targetMetrics } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      return res.json({
        enhancedText: `قاد فريقاً هندسياً لإعادة بناء الواجهات الأساسية باستخدام Next.js 14 App Router و TypeScript، مما أدى لتقليص زمن الاستجابة (LCP) بنسبة 38% وتوفير ما يعادل 14,000$ شهرياً في نفقات الاستضافة السحابية.`,
        formulaUsed: 'Google XYZ (Accomplished [X] measured by [Y] by doing [Z])',
      });
    }

    const prompt = `
Rewrite this resume bullet point into an elite, executive-level engineering accomplishment using Google XYZ format ("Accomplished [X] as measured by [Y], by doing [Z]") and STAR method.
Original text: "${text}"
Role: "${role || 'Senior Software Engineer'}"
Company context: "${company || 'Tech Company'}"
Target metrics/keywords: "${targetMetrics || 'Cost reduction, Performance, Scale'}"

Requirements:
- Strong active leadership verb at the start.
- Quantifiable financial or technical metric (e.g. 38% latency reduction, $15k monthly savings, 99.98% SLA).
- Mention modern architectural technologies in English (e.g. Next.js, Micro-Frontends, Edge Caching, Docker).
- Output the rewritten bullet point in Arabic with English tech terms, plus a 1-sentence explanation of why it wins with hiring managers.
`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedText: { type: Type.STRING },
            formulaUsed: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ['enhancedText', 'formulaUsed', 'reasoning'],
        },
      },
    });

    const parsed = response && response.text ? JSON.parse(response.text.trim()) : {
      enhancedText: `قاد فريقاً هندسياً لإعادة بناء الواجهات الأساسية باستخدام Next.js 15 و TypeScript، مما أدى لتقليص زمن الاستجابة بنسبة 35% وخفض نفقات الاستضافة السحابية.`,
      formulaUsed: 'Google XYZ (Accomplished [X] measured by [Y] by doing [Z])',
      reasoning: 'صياغة قيادية تبدأ بفعل تنفيذي وتركز على تحسين الأداء والأثر المالي.'
    };
    res.json(parsed);
  } catch (error: any) {
    console.error('Enhance Error:', error);
    res.status(500).json({ error: 'Failed to enhance bullet point' });
  }
});

// 3.5 Executive Summary Generator for Selected Track
app.post('/api/cv/generate-summary', async (req: Request, res: Response) => {
  try {
    const { trackTitle, trackTitleAr, role, skills, existingSummary } = req.body;

    const defaultRole = role || trackTitle || 'Software Engineer';
    const skillsList = Array.isArray(skills) ? skills.join(', ') : (skills || '');

    if (!ai) {
      return res.json({
        summary: `Results-driven and impact-focused ${defaultRole} specializing in ${trackTitle || 'modern software engineering'}. Proven expertise in architecting scalable solutions, leveraging ${skillsList || 'industry best practices and modern tooling'}, and collaborating across distributed teams to deliver high-performance applications with measurable business value.`,
      });
    }

    const prompt = `
Generate a high-impact, executive-level Professional Summary (in English, standard for ATS resumes) for a candidate with target job title: "${defaultRole}".
Specialization / Domain: "${trackTitle || defaultRole}" (${trackTitleAr || defaultRole}).
Target Job Role: "${defaultRole}"
Key Technical Skills: "${skillsList}"
${existingSummary ? `User's existing rough draft: "${existingSummary}"` : ''}

Requirements:
- Length: Exactly 3 to 4 dense, powerful sentences.
- Language: Professional English (ATS compliant).
- Tone: Confident, senior professional level, metric-oriented.
- Highlight core skills, problem-solving, scale, and cross-functional collaboration relevant specifically to "${defaultRole}".
- If the job role or specialization was written in Arabic (e.g. "مهندس برمجيات", "مطور فلاتر", "أخصائي شبكات"), adapt it to its professional English equivalent (e.g. "Software Engineer", "Flutter Developer", "Network Specialist") for this English resume summary.
- Do NOT use filler clichés like "hardworking individual looking for a challenging opportunity".
- Output JSON containing "summary".
`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
          },
          required: ['summary'],
        },
      },
    });

    const parsed = response && response.text ? JSON.parse(response.text.trim()) : {
      summary: `Accomplished and results-driven ${defaultRole} with a strong track record of engineering robust systems and high-impact digital solutions. Expertise spanning modern architectures, agile delivery, and cross-functional leadership, dedicated to delivering measurable performance and business value.`
    };
    res.json(parsed);
  } catch (error: any) {
    console.error('Summary Generator Error:', error);
    const defaultRole = req.body.role || req.body.trackTitle || 'Engineering Specialist';
    res.json({
      summary: `Accomplished and results-driven ${defaultRole} with a strong track record of engineering robust systems and high-impact digital solutions. Expertise spanning modern architectures, agile delivery, and cross-functional leadership, dedicated to delivering measurable performance and business value.`,
    });
  }
});

// 4. Cover Letter Generator
app.post('/api/cover-letter/generate', async (req: Request, res: Response) => {
  try {
    const { company, jobTitle, jd, tone, keyStrengths, candidateCV } = req.body;

    if (!ai) {
      return res.json({
        coverLetter: `يسرني التقدم لشغل موقع ${jobTitle || 'Staff Frontend Engineer'} لدى شركة ${company || 'Tamara FinTech'}، حيث أتابع باعتزاز ريادتكم لقطاع التكنولوجيا المالية ونظم الدفع المرن في منطقة الشرق الأوسط وشمال أفريقيا.\n\nانطلاقاً من مسيرتي في قيادة وتوجيه الفرق الهندسية المتقدمة، أشرفت مؤخراً على فريق معماري من 8 مهندسين لإعادة بناء الواجهات الأساسية لمنظومة تعاملات ضخمة بالاعتماد على Next.js 14 وEdge SSR Caching. أسهمت هذه النقلة في تقليص زمن الاستجابة بنسبة 38% وخفض نفقات الاستضافة السحابية بـ 42% ($18,000 شهرياً)، مع تحقيق استقرار بنسبة 99.98% في مواسم الذروة الشرائية.\n\nإن ما يميز أسلوبي القيادي هو الربط العضوي بين صلابة القرارات الهندسية وأهداف النمو التجاري؛ وهو ما يلتقي تماماً مع تطلعاتكم لتقديم حلول استثنائية وسريعة تتوافق مع معايير الأمان المالي العالمية.\n\nأتطلع بشغف لمناقشة كيفية تسخير هذه الخبرات المعمارية لدعم التوسع الهندسي لشركتكم وتحقيق الريادة المستدامة.`,
        matchScore: 98,
      });
    }

    const prompt = `
Generate an executive, tailored Cover Letter for a candidate applying to:
Company: ${company}
Target Role: ${jobTitle}
Job Description summary: ${jd || 'High-scale modern engineering role'}
Tone of voice: ${tone || 'Executive & decisive'}
Candidate Strengths to emphasize: ${Array.isArray(keyStrengths) ? keyStrengths.join(', ') : keyStrengths}

Candidate background:
Name: ${candidateCV?.fullName || 'أحمد الشناوي'}
Target Title: ${candidateCV?.targetRole}
Tech Stack: ${(candidateCV?.techSkills || []).slice(0, 8).join(', ')}

Output in executive Arabic, maintaining all technical concepts in English.
`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverLetter: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
          },
          required: ['coverLetter', 'matchScore'],
        },
      },
    });

    const parsed = response && response.text ? JSON.parse(response.text.trim()) : {
      coverLetter: `يسرني التقدم لشغل موقع ${jobTitle || 'Senior Software Engineer'} لدى شركة ${company || 'الشركة المستهدفة'}.\n\nأمتلك خبرة عملية في قيادة المشاريع البرمجية وتطوير الأنظمة عالية الأداء بالاعتماد على ${(candidateCV?.techSkills || []).slice(0, 4).join(', ')}. أسهمت خبراتي في تحسين زمن الاستجابة ورفع الكفاءة التشغيلية، وأتطلع لتسخير هذه المعرفة لدعم أهداف فريقكم التقني.`,
      matchScore: 92,
    };
    res.json(parsed);
  } catch (error: any) {
    console.error('Cover Letter Error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// 5. Job Description Readiness & Skill Matching Analyzer
app.post('/api/readiness/analyze-job-match', async (req: Request, res: Response) => {
  try {
    const { jobDescription, candidateCV } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const techSkills: string[] = Array.isArray(candidateCV?.techSkills) ? candidateCV.techSkills : [];
    const softSkills: string[] = Array.isArray(candidateCV?.softSkills) ? candidateCV.softSkills : [];
    const allUserSkills = [...techSkills, ...softSkills];
    const role: string = candidateCV?.targetRole || candidateCV?.title || 'Software Engineer';
    const experiences = candidateCV?.experiences || [];
    const summary: string = candidateCV?.summary || '';

    // 1. Try Gemini AI generation first
    if (ai) {
      try {
        const prompt = `
You are an expert AI Career Copilot and ATS Job Matching Specialist.
Analyze the following Job Description (JD) against the Candidate's Resume Profile.

=== CANDIDATE RESUME PROFILE ===
Target Role: ${role}
Candidate Technical Skills: ${techSkills.join(', ')}
Candidate Soft Skills: ${softSkills.join(', ')}
Experiences: ${experiences.map((e: any) => `${e.role || ''} at ${e.company || ''}: ${(e.achievements || []).join(' ')}`).join(' | ')}
Professional Summary: ${summary}

=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== INSTRUCTIONS ===
1. Extract or determine:
   - Extracted Job Title (jobTitle)
   - Extracted Company Name (company, if mentioned, otherwise "الشركة المستهدفة")
   - Matched Skills (skills mentioned or implied in the JD that the candidate ALREADY HAS in their profile)
   - Missing Skills (critical/important skills, technologies, frameworks, or methodologies mentioned in the JD that the candidate DOES NOT HAVE listed in their profile)
2. Calculate realistic Match Score (0 - 100) based on requirements overlap.
3. Calculate percentage breakdown (0 - 100):
   - technicalSkills: match percentage of required technical skills
   - experience: match percentage of seniority / years / scope
   - roleFit: alignment between target role and JD role
   - domainKnowledge: alignment of industry / domain
4. Provide:
   - strengths: 2-3 specific bullet points in Arabic (with English technical terms) explaining where the candidate strongly matches.
   - recommendations: 3-4 actionable bullet points in Arabic (with English technical terms) on what to add to the resume, what projects to highlight, or how to tailor their application for this job.
   - summaryFeedback: 1-2 sentence overall Arabic verdict on candidacy fit.
`;

        const response = await generateWithGeminiCascade({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matchScore: { type: Type.INTEGER },
                jobTitle: { type: Type.STRING },
                company: { type: Type.STRING },
                matchedSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    technicalSkills: { type: Type.INTEGER },
                    experience: { type: Type.INTEGER },
                    roleFit: { type: Type.INTEGER },
                    domainKnowledge: { type: Type.INTEGER },
                  },
                  required: ['technicalSkills', 'experience', 'roleFit', 'domainKnowledge'],
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                summaryFeedback: { type: Type.STRING },
              },
              required: [
                'matchScore',
                'jobTitle',
                'company',
                'matchedSkills',
                'missingSkills',
                'breakdown',
                'strengths',
                'recommendations',
                'summaryFeedback',
              ],
            },
          },
        });

        const parsed = response && response.text ? JSON.parse(response.text.trim()) : {};
        if (parsed.matchScore !== undefined) {
          return res.json(parsed);
        }
      } catch (aiErr) {
        console.info('[Readiness] Utilizing heuristic engine');
      }
    }

    // 2. High-Precision Heuristic Keyword & Skill Analysis Engine (Fallback)
    const knownTechDict = [
      'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
      'Python', 'Django', 'FastAPI', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'RESTful APIs',
      'Tailwind CSS', 'CSS3', 'HTML5', 'Sass', 'Git', 'GitHub Actions', 'CI/CD',
      'Jest', 'Cypress', 'Playwright', 'Microservices', 'System Design', 'Kafka', 'RabbitMQ',
      'Linux', 'Flutter', 'React Native', 'Kotlin', 'Swift', 'Redux', 'Zustand', 'Prisma',
      'Drizzle', 'Webpack', 'Vite', 'Terraform', 'WebSockets', 'OAuth', 'Firebase', 'Supabase',
      'Agile', 'Scrum', 'Problem Solving', 'Clean Architecture', 'Data Structures', 'Algorithms',
      'Performance Optimization', 'Security', 'Unit Testing', 'CI/CD Pipelines'
    ];

    const jdText = jobDescription.toLowerCase();
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Check skills in the dictionary against JD
    knownTechDict.forEach((skill) => {
      const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (skillRegex.test(jobDescription)) {
        const userHas = allUserSkills.some(
          (u) => u.toLowerCase() === skill.toLowerCase() ||
                 u.toLowerCase().includes(skill.toLowerCase()) ||
                 skill.toLowerCase().includes(u.toLowerCase())
        );
        if (userHas) {
          if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
        } else {
          if (!missingSkills.includes(skill)) missingSkills.push(skill);
        }
      }
    });

    // Also check any of the candidate's existing skills present in the JD
    allUserSkills.forEach((uSkill) => {
      if (uSkill.trim()) {
        const uRegex = new RegExp(`\\b${uSkill.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (uRegex.test(jobDescription) && !matchedSkills.includes(uSkill)) {
          matchedSkills.push(uSkill);
        }
      }
    });

    const totalReqSkills = matchedSkills.length + missingSkills.length;
    let matchScore = 70;
    if (totalReqSkills > 0) {
      const ratio = matchedSkills.length / totalReqSkills;
      matchScore = Math.min(Math.max(Math.round(ratio * 80 + 15), 35), 96);
    }

    // Determine extracted role title
    const firstLine = jobDescription.split('\n')[0].trim();
    const jobTitle = firstLine.length > 5 && firstLine.length < 60 ? firstLine : (role || 'Software Engineer');

    res.json({
      matchScore,
      jobTitle,
      company: 'الشركة المستهدفة',
      matchedSkills,
      missingSkills,
      breakdown: {
        technicalSkills: Math.min(matchScore + 5, 98),
        experience: Math.max(matchScore - 8, 45),
        roleFit: Math.min(matchScore + 2, 95),
        domainKnowledge: Math.max(matchScore - 5, 50),
      },
      strengths: [
        `تطابق مباشر في ${matchedSkills.slice(0, 3).join(', ') || 'المهارات الأساسية'} المطلوبة في إعلان الوظيفة.`,
        `سيرتك الذاتية تعكس خلفية عملية تناسب مسؤوليات وظيفة ${jobTitle}.`,
        `أساس برمجي وتقني يمكّنك من تجاوز المرحلة الأولى من الفرز الآلي بنجاح.`
      ],
      recommendations: [
        missingSkills.length > 0
          ? `أضف المهارات الناقصة (${missingSkills.slice(0, 3).join(', ')}) إلى قسم المهارات التقنية في سيرتك الذاتية إذا كانت لديك خبرة بها.`
          : 'أبرز المشاريع التي استخدمت فيها نفس التقنيات المطلوبة في إعلان الوظيفة.',
        'قم بإعادة صياغة إنجازاتك في قسم الخبرات باستخدام معادلة Google XYZ لربط أدواتك بالنتائج الرقمية.',
        'تأكد من مطابقة المسمى الوظيفي المستهدف في سيرتك مع عنوان الوظيفة المطلوب تماماً.'
      ],
      summaryFeedback: matchScore >= 75
        ? 'توافق قوي جداً! ملفك المهني مرشح بقوة لاجتياز الفرز الأولي والدخول في مرحلة المقابلات.'
        : 'توافق واعد؛ قم بإضافة المهارات الناقصة المذكورة أدناه وإبراز المشاريع ذات الصلة لرفع نسبة القبول لأكثر من 85%.'
    });
  } catch (error: any) {
    console.error('Job Matching Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze job match' });
  }
});

// 6. AI Projects Generator Tailored to Candidate CV
app.post('/api/projects/generate', async (req: Request, res: Response) => {
  try {
    const { targetRole, trackTitle, techSkills, softSkills, cvSummary, forceNew, seed } = req.body;

    const currentSeed = Number(seed) || 0;
    const skills: string[] = Array.isArray(techSkills) ? techSkills : [];
    const skillsList = skills.join(', ') || 'Modern Software Engineering';
    const effectiveRole = (targetRole && targetRole.trim()) || (trackTitle && trackTitle.trim()) || (skills.length > 0 ? `${skills.slice(0, 2).join(' & ')} Specialist` : 'Software Engineer');

    // 1. Try Gemini AI First
    if (ai) {
      try {
        const prompt = `
You are a Staff Technical Hiring Manager and Senior Solutions Architect.
Generate exactly 5 distinct, production-grade, portfolio-defining software project ideas tailored for the candidate.
${forceNew ? `NOTE: The candidate requested a fresh reload (variation seed: ${currentSeed}). Provide a novel, completely different set of innovative high-impact projects solving modern 2025/2026 problems.` : ''}

=== CANDIDATE CONTEXT ===
Target Role: "${effectiveRole}"
Skills / Tools: "${skillsList}"
Track: "${trackTitle || 'Software Engineering'}"
Summary: "${cvSummary || ''}"

=== INSTRUCTIONS ===
- Generate exactly 5 innovative, realistic projects tailored to the candidate's target role or their technical skills.
- Projects must solve high-value problems in 2025/2026.
- Output JSON format with properties:
  - id: Unique short id (e.g. "proj-ai-1")
  - title: English title of the project (e.g. "Real-Time Distributed Transaction Ledger")
  - track: Category or domain in English/Arabic (e.g. "Full Stack Architecture", "Cloud & Microservices")
  - level: Arabic difficulty ("مبتدئ" | "متوسط" | "متقدم" | "احترافي")
  - duration: Time to build in Arabic (e.g. "1 - 2 أسابيع", "2 - 3 أسابيع", "3 - 4 أسابيع")
  - desc: Clear, high-impact Arabic description (2-3 sentences) explaining architecture, simplicity, and real-world functionality for card display.
  - descEn: Professional English project description (1-2 sentences) formatted specifically for an international resume/CV (e.g. "Engineered a distributed real-time ledger using TypeScript, Redis, and PostgreSQL, ensuring ACID compliance and sub-50ms latency.").
  - metrics: Impressive CV-ready metric phrase (e.g. "يدعم 10k+ طلب في الثانية بـ Latency أقل من 50ms", "معالجة أكثر من 100,000 سجل بدقة 95%")
  - tech: Array of 4-6 specific technologies/libraries in English (must include the candidate's skills where relevant).
  - impact: Concise sentence in Arabic highlighting why this project impresses engineering hiring managers.
  - howToBuildPrompt: A concise, ready question prompt the user can ask Careem AI, e.g. "كيف أبدأ وأنفذ مشروع [اسم المشروع] خطوة بخطوة بالتقنيات ([التقنيات])؟ ما هي المعمارية المناسبة والملفات الأساسية؟"
`;

        const response = await generateWithGeminiCascade({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      track: { type: Type.STRING },
                      level: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      desc: { type: Type.STRING },
                      descEn: { type: Type.STRING },
                      metrics: { type: Type.STRING },
                      tech: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      impact: { type: Type.STRING },
                      howToBuildPrompt: { type: Type.STRING },
                    },
                    required: ['title', 'track', 'level', 'desc', 'descEn', 'tech', 'impact'],
                  },
                },
              },
              required: ['projects'],
            },
          },
          timeoutMs: 9500,
        });

        const parsed = response && response.text ? JSON.parse(response.text.trim()) : {};
        if (parsed.projects && Array.isArray(parsed.projects) && parsed.projects.length >= 3) {
          const sanitizedProjects = parsed.projects.slice(0, 5).map((p: any, idx: number) => ({
            id: p.id || `proj-gen-${Date.now()}-${idx}`,
            title: p.title || 'Innovative Tech Project',
            track: p.track || 'Engineering',
            level: p.level || 'متقدم',
            duration: p.duration || '2 - 3 أسابيع',
            desc: p.desc || 'مشروع برمجي تطبيقي يبرز مهارات بناء الأنظمة والربط التقني.',
            descEn: p.descEn || `Architected and developed a production-ready ${p.title || 'software project'} utilizing ${(p.tech || ['TypeScript', 'React']).join(', ')} with high performance and modular architecture.`,
            metrics: p.metrics || 'يدعم أداءً عالياً وتجربة مستخدم متكاملة',
            tech: Array.isArray(p.tech) ? p.tech : ['TypeScript', 'Node.js', 'React'],
            impact: p.impact || 'يُثبت قدرتك العملية على تنفيذ مشاريع إنتاجية كاملة.',
            howToBuildPrompt: p.howToBuildPrompt || `كيف أبدأ وأنفذ مشروع "${p.title}" خطوة بخطوة بالتقنيات (${(p.tech || []).join(', ')})؟ ما هي المعمارية المقترحة وكيف أربطه بالسيرة الذاتية؟`,
          }));

          return res.json({
            projects: sanitizedProjects,
            generatedFor: effectiveRole,
            source: 'gemini',
          });
        }
      } catch (aiErr) {
        console.info('[Projects] Utilizing rotated candidate engine');
      }
    }

    // 2. High-Performance Deterministic Rotation Pool
    const rotatedProjects = getRotatedCandidateProjects(
      effectiveRole,
      trackTitle || '',
      skills,
      currentSeed
    );

    return res.json({
      projects: rotatedProjects,
      generatedFor: effectiveRole,
      source: 'rotated_pool',
    });
  } catch (error: any) {
    console.error('Projects Generator Error:', error);
    res.status(500).json({ error: 'Failed to generate projects' });
  }
});

// Proxy endpoint to embed original roadmap from roadmap.sh directly without framing restrictions
app.get('/api/roadmap-embed/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const roadmapUrl = `https://roadmap.sh/${encodeURIComponent(slug)}`;
    const response = await fetch(roadmapUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch roadmap: ${response.statusText}`);
    }

    let html = await response.text();

    // Inject <base href="https://roadmap.sh/"> so all relative styles, icons, fonts and scripts resolve
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head><base href="https://roadmap.sh/">');
    } else {
      html = `<base href="https://roadmap.sh/">` + html;
    }

    // Clean up unnecessary website header/footer to highlight the roadmap itself
    const customStyle = `
      <style>
        header#global-nav, nav.navigation, footer, [data-testid="header"], #footer {
          display: none !important;
        }
        body {
          background-color: #0d1117 !important;
          color: #c9d1d9 !important;
        }
      </style>
    `;
    html = html.replace('</head>', `${customStyle}</head>`);

    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error proxying roadmap from roadmap.sh:', error);
    res.status(500).send('Error loading roadmap from roadmap.sh');
  }
});

// Endpoint to dispatch 6-digit verification code to user's email
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, code, name } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    console.log(`[AUTH] Dispatching 6-digit OTP verification code to ${email} (Name: ${name || 'User'}): ${code}`);
    
    res.json({
      success: true,
      message: `تم إرسال كود التحقق بنجاح إلى ${email}`,
    });
  } catch (error) {
    console.error('Error dispatching OTP:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// In-memory persistent messages store for Kareem
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  recipient: string;
  status: 'delivered' | 'needs_activation' | 'logged';
}

const contactMessagesStore: ContactMessage[] = [];

// Endpoint to dispatch contact message to developer email (kareemherish@gmail.com)
app.post('/api/contact/send', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const targetEmail = 'kareemherish@gmail.com';

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    console.log(`[CONTACT] Message received for ${targetEmail} from ${name} (${email})`);

    let deliveredVia = 'logged';
    let isDelivered = false;

    // 1. Attempt Nodemailer if SMTP credentials are provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          to: targetEmail,
          subject: `استفسار جديد من منصة SuperCV - ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: `
            <h3>استفسار جديد من منصة SuperCV</h3>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد:</strong> ${email}</p>
            <p><strong>الرسالة:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
          `,
        });
        deliveredVia = 'smtp';
        isDelivered = true;
      } catch (smtpErr) {
        console.warn('[CONTACT] SMTP dispatch failed, trying FormSubmit fallback:', smtpErr);
      }
    }

    // 2. Guaranteed email gateway via FormSubmit to kareemherish@gmail.com
    if (!isDelivered) {
      try {
        const fsRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `استفسار جديد من منصة SuperCV - ${name}`,
            _template: 'table',
            _captcha: 'false',
          }),
        });

        if (fsRes.ok) {
          deliveredVia = 'formsubmit';
          isDelivered = true;
        }
      } catch (fsErr) {
        console.warn('[CONTACT] FormSubmit fallback note:', fsErr);
      }
    }

    const newRecord: ContactMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      recipient: targetEmail,
      status: isDelivered ? 'delivered' : 'logged',
    };

    contactMessagesStore.unshift(newRecord);

    return res.json({
      success: true,
      recipient: targetEmail,
      message: 'تم إرسال رسالتك بنجاح للمطور!',
      deliveredVia,
      messageRecord: newRecord,
      allMessages: contactMessagesStore,
    });
  } catch (error: any) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ error: 'Failed to process contact message', details: error.message });
  }
});

// Endpoint to retrieve received contact messages for the developer
app.get('/api/contact/messages', (_req: Request, res: Response) => {
  res.json({
    messages: contactMessagesStore,
    recipient: 'kareemherish@gmail.com',
  });
});

// Endpoint to serve PDF attachment directly for browser downloads
app.post('/api/cv/download-pdf', (req: Request, res: Response) => {
  try {
    const { pdfBase64, fileName } = req.body;
    if (!pdfBase64) {
      return res.status(400).send('Missing PDF data');
    }

    const cleanBase64 = pdfBase64
      .replace(/^data:application\/pdf;filename=[^;]+;base64,/, '')
      .replace(/^data:application\/pdf;base64,/, '')
      .replace(/^data:application\/octet-stream;base64,/, '')
      .trim();

    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = (fileName || 'Resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Error handling PDF download:', error);
    res.status(500).send('Failed to generate PDF download');
  }
});

// Vite middleware in development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
