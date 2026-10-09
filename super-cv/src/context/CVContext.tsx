import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateCV, ExperienceItem, ProjectItem, VerifiedBadge } from '../types/cv';
import { TECH_ROADMAPS, findTrackById } from '../data/roadmaps';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  retrievedChunks?: { id: string; section: string }[];
  missingSkills?: string[];
  actionSnippet?: string;
}

interface CVContextType {
  cv: CandidateCV;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedAssessmentSkill: string | null;
  setSelectedAssessmentSkill: (skill: string | null) => void;
  updateCV: (partial: Partial<CandidateCV>) => void;
  setTrackId: (trackId: string) => void;
  toggleTechSkill: (skillName: string) => void;
  addCustomTechSkill: (skillName: string) => void;
  removeTechSkill: (skillName: string) => void;
  toggleSoftSkill: (skillName: string) => void;
  addCustomSoftSkill: (skillName: string) => void;
  removeSoftSkill: (skillName: string) => void;
  updateExperience: (index: number, updated: ExperienceItem) => void;
  addExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;
  addVerifiedBadge: (skill: string, score: number) => void;
  calculateAtsScore: () => number;
  hasCreatedCV: boolean;
  loadSampleCV: () => void;
  resetToEmptyCV: () => void;
  userCVs: CandidateCV[];
  saveCVToFirestore: (title?: string) => Promise<boolean>;
  switchCV: (cvId: string) => void;
  createNewCV: () => void;
  deleteCVFromFirestore: (cvId: string) => Promise<void>;
  isSyncing: boolean;
  isLoadingCVs: boolean;
  isTabLoading: boolean;
  setIsTabLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clearChatMessages: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  authInitialMode: 'login' | 'signup';
  setAuthInitialMode: (mode: 'login' | 'signup') => void;
  openAuth: (mode?: 'login' | 'signup') => void;
  pendingAIQuestion: string | null;
  setPendingAIQuestion: (q: string | null) => void;
  askAIWithPrompt: (promptText: string) => void;
}

export const SAMPLE_DATA_SCIENTIST_CV: CandidateCV = {
  id: 'cand-ds-01',
  fullName: 'أحمد ممدوح',
  targetRole: 'Data Scientist',
  trackId: 'ai-engineer',
  email: 'ahmed.mamdouh@example.com',
  phone: '+20 100 123 4567',
  location: 'القاهرة، مصر',
  linkedin: 'linkedin.com/in/ahmed',
  github: 'github.com/ahmed',
  summary: 'Data Scientist & AI Applications Engineer with hands-on expertise in Machine Learning, Python, SQL, and predictive analytics.',
  techSkills: [
    'Python',
    'Machine Learning',
    'SQL',
    'Pandas',
    'NumPy',
    'TensorFlow',
    'Scikit-learn',
    'Data Visualization',
    'Deep Learning',
    'PyTorch',
    'Big Data',
    'Docker',
  ],
  softSkills: [
    'Problem Solving',
    'Analytical Thinking',
    'Team Collaboration',
    'Effective Communication',
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Data Scientist',
      company: 'DataTech MENA',
      location: 'القاهرة (هجين)',
      period: 'مايو 2023 - حتى الآن',
      isCurrent: true,
      achievements: [
        'طوّر نماذج Machine Learning لتحليل بيانات أكثر من 200,000 مستخدم بنسبة دقة 94%.',
        'بنى أنابيب بيانات أوتوماتيكية باستخدام Python و SQL حسنت سرعة معالجة التقارير بنسبة 35%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'بكالوريوس علوم الحاسب والذكاء الاصطناعي',
      institution: 'طالب - جامعة بنها',
      period: '2020 - 2024',
      honors: 'امتياز مع مرتبة الشرف',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Customer Churn Prediction Engine',
      metrics: 'دقة 94.2% في التنبؤ',
      description: 'نظام تنبؤ بسلوك العملاء باستخدام خوارزميات Random Forest و XGBoost.',
      techStack: 'Python, Pandas, Scikit-learn, Streamlit',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Professional Machine Learning Engineer',
      issuer: 'Google Cloud',
      year: '2024',
    },
  ],
  verifiedBadges: [
    {
      id: 'badge-1',
      skill: 'Python',
      score: 95,
      badgeCode: '#9842',
      date: '12 مايو 2025',
    },
    {
      id: 'badge-2',
      skill: 'Machine Learning',
      score: 92,
      badgeCode: '#4512',
      date: '12 مايو 2025',
    },
  ],
  atsScore: 94,
  matchRate: 94,
};

export const SAMPLE_FULLSTACK_CV: CandidateCV = {
  id: 'cand-fs-02',
  fullName: 'أحمد ممدوح',
  targetRole: 'Full Stack Developer',
  trackId: 'software-engineering',
  title: 'Full Stack Engineer CV',
  email: 'ahmed.dev@example.com',
  phone: '+20 100 123 4567',
  location: 'القاهرة، مصر',
  linkedin: 'linkedin.com/in/ahmed-fs',
  github: 'github.com/ahmed-fs',
  summary: 'Full Stack Software Engineer specializing in modern web ecosystems, React, Node.js, Express, PostgreSQL, and scalable microservices.',
  atsScore: 89,
  techSkills: [
    'TypeScript',
    'React',
    'Node.js',
    'Express.js',
    'PostgreSQL',
    'Tailwind CSS',
    'Next.js',
    'Docker',
    'GraphQL',
  ],
  softSkills: ['Problem Solving', 'Team Leadership', 'Agile & Scrum'],
  experiences: [
    {
      id: 'exp-fs-1',
      role: 'Full Stack Developer',
      company: 'Tech Solutions Hub',
      location: 'القاهرة',
      period: '2023 - الآن',
      isCurrent: true,
      achievements: [
        'تطوير تطبيقات ويب حديثة وواجهات برمجية عالية الأداء باستخدام React و Node.js.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-fs-1',
      degree: 'بكالوريوس هندسة البرمجيات',
      institution: 'جامعة القاهرة - كلية الحاسبات والمعلومات',
      period: '2019 - 2023',
    },
  ],
  projects: [
    {
      id: 'proj-fs-1',
      title: 'Cloud Management Dashboard',
      metrics: 'معالجة 50k طلب يومياً',
      description: 'لوحة تحكم تفاعلية لإدارة الموارد السحابية وتحليل المقاييس في الوقت الفعلي.',
      techStack: 'React, Node.js, PostgreSQL, Tailwind',
      link: 'https://github.com/example/cloud-dashboard',
    },
  ],
  certifications: [
    {
      id: 'cert-fs-1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2024',
    },
  ],
  verifiedBadges: [
    {
      id: 'badge-fs-1',
      skill: 'React',
      score: 93,
      badgeCode: '#3142',
      date: '18 مايو 2025',
    },
    {
      id: 'badge-fs-2',
      skill: 'Node.js',
      score: 90,
      badgeCode: '#8712',
      date: '18 مايو 2025',
    },
  ],
  matchRate: 89,
  updatedAt: '2025-05-18T10:00:00.000Z',
};

export const EMPTY_CV: CandidateCV = {
  id: 'cand-empty',
  fullName: '',
  targetRole: '',
  trackId: 'other',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  techSkills: [],
  softSkills: [],
  experiences: [],
  education: [],
  projects: [],
  certifications: [],
  verifiedBadges: [],
  atsScore: 0,
  matchRate: 0,
};

export const getDefaultCopilotMessages = (): ChatMessage[] => [];

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInitialLoadRef = React.useRef<boolean>(true);
  const [cv, setCv] = useState<CandidateCV>(() => {
    try {
      const saved = localStorage.getItem('supercv_candidate_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.id &&
          parsed.id !== 'cand-ds-01' &&
          parsed.id !== 'cand-fs-02' &&
          parsed.id !== 'cand-empty'
        ) {
          return parsed;
        }
      }
      return EMPTY_CV;
    } catch {
      return EMPTY_CV;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('supercv_copilot_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading chat messages from storage:', e);
    }
    return getDefaultCopilotMessages();
  });

  // Persist chat messages to localStorage so they persist across sidebar tabs
  useEffect(() => {
    try {
      if (chatMessages && chatMessages.length > 0) {
        localStorage.setItem('supercv_copilot_chat', JSON.stringify(chatMessages));
      }
    } catch (e) {
      console.warn('Error persisting chat messages:', e);
    }
  }, [chatMessages]);

  const clearChatMessages = () => {
    try {
      localStorage.removeItem('supercv_copilot_chat');
    } catch {}
    setChatMessages([]);
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  // Listen to logout / clear event from auth or session expiry
  useEffect(() => {
    const handleClearEvent = () => {
      try {
        localStorage.removeItem('supercv_copilot_chat');
      } catch {}
      setChatMessages([]);
    };
    window.addEventListener('supercv_clear_chat', handleClearEvent);
    return () => window.removeEventListener('supercv_clear_chat', handleClearEvent);
  }, []);

  const [userCVs, setUserCVs] = useState<CandidateCV[]>(() => {
    try {
      const saved = localStorage.getItem('supercv_user_cvs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userOnly = parsed.filter(
            (c) =>
              c &&
              c.id &&
              c.id !== 'cand-ds-01' &&
              c.id !== 'cand-fs-02' &&
              c.id !== 'cand-empty'
          );
          if (userOnly.length > 0) return userOnly;
        }
      }
    } catch (e) {
      console.warn('Error reading saved user CVs:', e);
    }
    return [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Always open with 'intro' first when opening the site
  const [activeTab, setActiveTabState] = useState<string>('intro');
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const [isLoadingCVs, setIsLoadingCVs] = useState<boolean>(true);

  const setActiveTab = (tab: string) => {
    if (tab !== activeTab) {
      setIsTabLoading(true);
      setActiveTabState(tab);
      setTimeout(() => {
        setIsTabLoading(false);
      }, 260);
    }
  };

  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setActiveTab('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [pendingAIQuestion, setPendingAIQuestion] = useState<string | null>(null);

  const askAIWithPrompt = (promptText: string) => {
    setPendingAIQuestion(promptText);
    setActiveTab('ask-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      localStorage.removeItem('supercv_active_tab');
    } catch (e) {
      console.error(e);
    }

    const handleLogout = () => {
      setActiveTabState('intro');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('supercv_logout', handleLogout);
    return () => window.removeEventListener('supercv_logout', handleLogout);
  }, []);
  const [selectedAssessmentSkill, setSelectedAssessmentSkill] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('supercv_theme');
      return (savedTheme as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('supercv_theme', theme);
  }, [theme]);

  // Persist CV changes to localStorage
  useEffect(() => {
    try {
      if (
        cv &&
        cv.id !== 'cand-empty' &&
        cv.id !== 'cand-ds-01' &&
        cv.id !== 'cand-fs-02'
      ) {
        localStorage.setItem('supercv_candidate_data', JSON.stringify(cv));
      }
    } catch (e) {
      console.error('Failed to save CV data to localStorage', e);
    }
  }, [cv]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('supercv_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('supercv_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateCV = (partial: Partial<CandidateCV>) => {
    setCv((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('supercv_candidate_data', JSON.stringify(updated));
      } catch {}

      if (prev.id && prev.id !== 'cand-empty') {
        setUserCVs((list) => {
          const idx = list.findIndex((c) => c.id === prev.id);
          if (idx >= 0) {
            const copy = [...list];
            copy[idx] = {
              ...copy[idx],
              ...partial,
              updatedAt: new Date().toISOString(),
            };
            try {
              localStorage.setItem('supercv_user_cvs', JSON.stringify(copy));
            } catch {}
            return copy;
          }
          return list;
        });
      }

      return updated;
    });
  };

  const setTrackId = (trackId: string) => {
    const foundTrack = findTrackById(trackId);
    const isOther = !foundTrack || foundTrack.id === 'other';
    const newTitle = isOther ? 'تراك مخصص' : (foundTrack ? foundTrack.titleAr : 'تراك مخصص');
    const newRole = isOther ? '' : (foundTrack ? (foundTrack.roleTitle || foundTrack.titleEn) : '');

    setCv(prev => {
      const updated = {
        ...prev,
        trackId,
        targetRole: isOther ? prev.targetRole : newRole,
        title: isOther ? (prev.targetRole?.trim() || 'تراك مخصص') : newTitle,
      };

      // If already a registered CV in userCVs, update userCVs synchronously as well
      if (prev.id && prev.id !== 'cand-empty') {
        setUserCVs((cvs) => {
          const idx = cvs.findIndex((c) => c.id === prev.id);
          if (idx >= 0) {
            const list = [...cvs];
            list[idx] = { 
              ...list[idx], 
              trackId, 
              title: updated.title, 
              targetRole: updated.targetRole, 
              updatedAt: new Date().toISOString() 
            };
            try {
              localStorage.setItem('supercv_user_cvs', JSON.stringify(list));
            } catch {}
            return list;
          }
          return cvs;
        });
      }
      return updated;
    });
  };

  const toggleTechSkill = (skillName: string) => {
    setCv(prev => {
      const exists = prev.techSkills.includes(skillName);
      const newSkills = exists
        ? prev.techSkills.filter(s => s !== skillName)
        : [...prev.techSkills, skillName];
      return { ...prev, techSkills: newSkills };
    });
  };

  const addCustomTechSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setCv(prev => {
      if (prev.techSkills.includes(trimmed)) return prev;
      return { ...prev, techSkills: [...prev.techSkills, trimmed] };
    });
  };

  const removeTechSkill = (skillName: string) => {
    setCv(prev => ({
      ...prev,
      techSkills: prev.techSkills.filter(s => s !== skillName),
    }));
  };

  const toggleSoftSkill = (skillName: string) => {
    setCv(prev => {
      const exists = prev.softSkills.includes(skillName);
      const newSkills = exists
        ? prev.softSkills.filter(s => s !== skillName)
        : [...prev.softSkills, skillName];
      return { ...prev, softSkills: newSkills };
    });
  };

  const addCustomSoftSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setCv(prev => {
      if (prev.softSkills.includes(trimmed)) return prev;
      return { ...prev, softSkills: [...prev.softSkills, trimmed] };
    });
  };

  const removeSoftSkill = (skillName: string) => {
    setCv(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter(s => s !== skillName),
    }));
  };

  const updateExperience = (index: number, updated: ExperienceItem) => {
    setCv(prev => {
      const experiences = [...prev.experiences];
      experiences[index] = updated;
      return { ...prev, experiences };
    });
  };

  const addExperience = (exp: ExperienceItem) => {
    setCv(prev => ({
      ...prev,
      experiences: [exp, ...prev.experiences],
    }));
  };

  const deleteExperience = (id: string) => {
    setCv(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id),
    }));
  };

  const addVerifiedBadge = (skill: string, score: number) => {
    const randomCode = '#' + Math.floor(1000 + Math.random() * 9000);
    const newBadge: VerifiedBadge = {
      id: 'badge-' + Date.now(),
      skill,
      score,
      badgeCode: randomCode,
      date: 'اليوم',
    };
    setCv(prev => {
      const filtered = prev.verifiedBadges.filter(b => b.skill !== skill);
      return {
        ...prev,
        verifiedBadges: [newBadge, ...filtered],
        atsScore: Math.min(100, prev.atsScore + 1),
      };
    });
  };

  const calculateAtsScore = () => {
    let score = 50;
    if (cv.fullName && cv.email && cv.phone) score += 10;
    if (cv.summary && cv.summary.length > 50) score += 10;
    if (cv.techSkills.length >= 6) score += 10;
    if (cv.experiences.length >= 2) score += 10;
    if (cv.verifiedBadges.length >= 2) score += 5;
    if (cv.projects.length >= 1) score += 5;
    return Math.min(score, 98);
  };

  const hasCreatedCV = Boolean(
    userCVs.length > 0 ||
    (cv.fullName && cv.fullName.trim().length > 0) ||
    (cv.targetRole && cv.targetRole.trim().length > 0) ||
    (cv.trackId && cv.trackId !== 'other') ||
    cv.techSkills.length > 0
  );

  const loadSampleCV = () => {
    setCv(SAMPLE_DATA_SCIENTIST_CV);
    try {
      localStorage.setItem('supercv_candidate_data', JSON.stringify(SAMPLE_DATA_SCIENTIST_CV));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      if (userCVs.length > 0) {
        const clean = userCVs.filter(
          (c) => c && c.id !== 'cand-ds-01' && c.id !== 'cand-fs-02' && c.id !== 'cand-empty'
        );
        if (clean.length > 0) {
          localStorage.setItem('supercv_user_cvs', JSON.stringify(clean));
        } else {
          localStorage.removeItem('supercv_user_cvs');
        }
      } else {
        localStorage.removeItem('supercv_user_cvs');
      }
    } catch (e) {
      console.warn('Cache error:', e);
    }
  }, [userCVs]);

  // Automatic Real-time Cloud & Local Persistence on every create or edit
  useEffect(() => {
    const hasMeaningfulContent = Boolean(
      (cv.fullName && cv.fullName.trim().length > 0) ||
      (cv.targetRole && cv.targetRole.trim().length > 0) ||
      (cv.techSkills && cv.techSkills.length > 0) ||
      (cv.summary && cv.summary.trim().length > 0)
    );

    // Strictly skip empty or default sample CVs
    if (
      !hasMeaningfulContent ||
      cv.id === 'cand-empty' ||
      cv.id === 'cand-ds-01' ||
      cv.id === 'cand-fs-02'
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      const cvId = cv.id || `cv-${Date.now()}`;
      const toSave: CandidateCV = {
        ...cv,
        id: cvId,
        title: cv.title || cv.targetRole || cv.fullName || 'سيرة ذاتية',
        updatedAt: new Date().toISOString(),
      };

      // 1. Immediately update userCVs so it appears in the CVs selector
      setUserCVs((prev) => {
        const idx = prev.findIndex((c) => c.id === cvId);
        let updated: CandidateCV[];
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = toSave;
        } else {
          updated = [toSave, ...prev];
        }
        try {
          localStorage.setItem('supercv_user_cvs', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 2. Automatically save directly to Firestore
      let currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        try {
          const localSession = JSON.parse(localStorage.getItem('supercv_auth_session') || '{}');
          currentUid = localSession?.uid;
        } catch {
          currentUid = undefined;
        }
      }

      if (currentUid && auth.currentUser) {
        try {
          // Silent background persistence - never freeze or flicker the UI save button
          await setDoc(doc(db, 'users', currentUid, 'cvs', cvId), toSave, { merge: true });
        } catch (err) {
          console.warn('Firestore auto-save notice:', err);
        }
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [cv]);

  // Synchronize CVs with Firestore for logged-in user
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setIsLoadingCVs(false);
        isInitialLoadRef.current = false;
        // Not signed in to Firebase: retain saved local CVs from localStorage if available
        try {
          const savedLocal = localStorage.getItem('supercv_user_cvs');
          if (savedLocal) {
            const parsed = JSON.parse(savedLocal);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setUserCVs(parsed);
              return;
            }
          }
        } catch {}
        return;
      }

      const cvsRef = collection(db, 'users', currentUser.uid, 'cvs');
      const unsubCVs = onSnapshot(
        cvsRef,
        (snapshot) => {
          setIsLoadingCVs(false);
          const loaded: CandidateCV[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CandidateCV;
            // Filter out default sample template IDs if any exist in the database
            if (docSnap.id !== 'cand-ds-01' && docSnap.id !== 'cand-fs-02' && docSnap.id !== 'cand-empty') {
              loaded.push({ ...data, id: docSnap.id });
            }
          });

          // Sort by latest updated date descending
          loaded.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

          setUserCVs(loaded);

          // CRITICAL: Only set cv on the first initial boot from cloud!
          // NEVER overwrite cv during active user creation or editing sessions!
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            if (loaded.length > 0) {
              setCv((prev) => {
                if (prev.id && prev.id !== 'cand-empty' && prev.id !== 'cand-ds-01' && prev.id !== 'cand-fs-02') {
                  const match = loaded.find((c) => c.id === prev.id);
                  if (match) return match;
                  if (prev.id.startsWith('cv-')) return prev;
                }
                return loaded[0];
              });
              try {
                localStorage.setItem('supercv_user_cvs', JSON.stringify(loaded));
              } catch {}
            } else {
              setCv((prev) => {
                if (prev.id && prev.id.startsWith('cv-')) return prev;
                return EMPTY_CV;
              });
            }
          }
        },
        (err) => {
          setIsLoadingCVs(false);
          isInitialLoadRef.current = false;
          console.warn('Firestore CVs sync status:', err?.message || 'Access pending user authentication');
        }
      );

      return () => unsubCVs();
    });

    return () => unsubAuth();
  }, []);

  const saveCVToFirestore = async (customTitle?: string): Promise<boolean> => {
    let currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      try {
        const localSession = JSON.parse(localStorage.getItem('supercv_auth_session') || '{}');
        currentUid = localSession?.uid;
      } catch {
        currentUid = undefined;
      }
    }
    if (!currentUid) {
      let localGuestUid = '';
      try {
        localGuestUid = localStorage.getItem('supercv_guest_uid') || '';
        if (!localGuestUid) {
          localGuestUid = 'guest-' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('supercv_guest_uid', localGuestUid);
        }
      } catch {
        localGuestUid = 'guest-local';
      }
      currentUid = localGuestUid;
    }

    setIsSyncing(true);
    try {
      const cvId = cv.id && cv.id !== 'cand-empty' ? cv.id : `cv-${Date.now()}`;
      const track = findTrackById(cv.trackId || 'other');
      const resolvedTitle = customTitle || 
        (cv.trackId && cv.trackId !== 'other' && track
          ? track.titleAr
          : (cv.targetRole?.trim() || cv.title?.trim() || 'تراك مخصص'));

      const toSave: CandidateCV = {
        ...cv,
        id: cvId,
        userId: currentUid,
        title: resolvedTitle,
        trackId: cv.trackId || 'other',
        targetRole: cv.targetRole?.trim() || (track && track.id !== 'other' ? (track.roleTitle || track.titleEn) : ''),
        updatedAt: new Date().toISOString(),
      };

      // 1. Immediately update userCVs state & localStorage
      setUserCVs((prev) => {
        const idx = prev.findIndex((c) => c.id === cvId);
        let updated: CandidateCV[];
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = toSave;
        } else {
          updated = [toSave, ...prev];
        }
        try {
          localStorage.setItem('supercv_user_cvs', JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
        return updated;
      });

      // 2. Immediately update active CV state & localStorage
      setCv(toSave);
      try {
        localStorage.setItem('supercv_candidate_data', JSON.stringify(toSave));
      } catch (e) {
        console.warn('LocalStorage candidate save error:', e);
      }

      // 3. Deep sanitize to prevent any undefined values from failing Firestore
      const cleanToSave = JSON.parse(
        JSON.stringify(toSave, (_, value) => (value === undefined ? null : value))
      );

      // 4. Resilient Firestore cloud sync with timeout
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'users', auth.currentUser.uid, 'cvs', cvId);
          const savePromise = setDoc(docRef, cleanToSave, { merge: true });
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore timeout')), 3500)
          );
          await Promise.race([savePromise, timeoutPromise]);
        } catch (cloudErr) {
          console.warn('Cloud sync background note (local data saved successfully):', cloudErr);
        }
      }

      return true;
    } catch (err) {
      console.error('Save error:', err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const createNewCV = () => {
    isInitialLoadRef.current = false;
    setIsLoadingCVs(true);
    const newId = `cv-${Date.now()}`;
    const freshCV: CandidateCV = {
      ...EMPTY_CV,
      id: newId,
      title: 'سيرة ذاتية جديدة',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCv(freshCV);
    setUserCVs((prev) => [freshCV, ...prev.filter((c) => c.id !== newId)]);
    try {
      localStorage.setItem('supercv_candidate_data', JSON.stringify(freshCV));
    } catch {}
    setTimeout(() => {
      setIsLoadingCVs(false);
    }, 150);
  };

  const switchCV = (cvId: string) => {
    isInitialLoadRef.current = false;
    setIsLoadingCVs(true);
    const found = userCVs.find((c) => c.id === cvId);
    if (found) {
      setCv(found);
      try {
        localStorage.setItem('supercv_candidate_data', JSON.stringify(found));
      } catch {}
    }
    setTimeout(() => {
      setIsLoadingCVs(false);
    }, 150);
  };

  const deleteCVFromFirestore = async (cvId: string) => {
    const updatedCVs = userCVs.filter((c) => c.id !== cvId);
    setUserCVs(updatedCVs);
    try {
      localStorage.setItem('supercv_user_cvs', JSON.stringify(updatedCVs));
    } catch {}

    if (cv.id === cvId) {
      if (updatedCVs.length > 0) {
        setCv(updatedCVs[0]);
      } else {
        // When all CVs are deleted, wipe to EMPTY_CV completely without creating a placeholder!
        setCv(EMPTY_CV);
        try {
          localStorage.removeItem('supercv_candidate_data');
        } catch {}
      }
    }
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'cvs', cvId));
      } catch (err) {
        console.error('Error deleting CV:', err);
      }
    }
  };

  const resetToEmptyCV = () => {
    setCv(EMPTY_CV);
    try {
      localStorage.setItem('supercv_candidate_data', JSON.stringify(EMPTY_CV));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CVContext.Provider
      value={{
        cv,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        selectedAssessmentSkill,
        setSelectedAssessmentSkill,
        updateCV,
        setTrackId,
        toggleTechSkill,
        addCustomTechSkill,
        removeTechSkill,
        toggleSoftSkill,
        addCustomSoftSkill,
        removeSoftSkill,
        updateExperience,
        addExperience,
        deleteExperience,
        addVerifiedBadge,
        calculateAtsScore,
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
        isTabLoading,
        setIsTabLoading,
        chatMessages,
        setChatMessages,
        clearChatMessages,
        addChatMessage,
        isSidebarCollapsed,
        toggleSidebar,
        authInitialMode,
        setAuthInitialMode,
        openAuth,
        pendingAIQuestion,
        setPendingAIQuestion,
        askAIWithPrompt,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
