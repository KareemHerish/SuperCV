import { ALL_ROADMAPS_MAP, DetailedRoadmapTrack } from './allRoadmapsData';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  importance: 'essential' | 'recommended' | 'advanced';
  description: string;
}

export interface TrackRoadmap {
  id: string;
  titleAr: string;
  titleEn: string;
  roleTitle: string;
  descriptionAr: string;
  icon: string;
  officialSlug?: string;
  categories: {
    nameAr: string;
    nameEn: string;
    skills: SkillItem[];
  }[];
}

// Convert a detailed roadmap track (from allRoadmapsData) into TrackRoadmap format
export function convertDetailedTrackToRoadmap(track: DetailedRoadmapTrack): TrackRoadmap {
  const trackId = track.id || track.officialSlug || track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: trackId,
    titleAr: track.titleAr,
    titleEn: track.title,
    roleTitle: track.title,
    descriptionAr: track.summary,
    icon: track.icon || 'alt_route',
    officialSlug: track.officialSlug,
    categories: (track.stages || []).map((stage, sIdx) => ({
      nameAr: stage.nameAr || stage.name,
      nameEn: stage.name,
      skills: (stage.skills || []).map((skillName, skIdx) => ({
        id: `${trackId}-${stage.number || sIdx + 1}-${skIdx}`,
        name: skillName,
        category: stage.name,
        importance: skIdx < 2 ? 'essential' : 'recommended',
        description: skillName,
      })),
    })),
  };
}

// All 30 Tracks mapped from allRoadmapsData.ts
export const ALL_30_TECH_ROADMAPS: TrackRoadmap[] = Object.values(ALL_ROADMAPS_MAP).map(convertDetailedTrackToRoadmap);

// Keep TECH_ROADMAPS pointing to all 30 roadmaps
export const TECH_ROADMAPS: TrackRoadmap[] = ALL_30_TECH_ROADMAPS;

export const OTHER_TRACK: TrackRoadmap = {
  id: 'other',
  titleAr: 'تراك أخر',
  titleEn: 'Custom Track',
  roleTitle: '',
  descriptionAr: 'مسار مخصص يمكنك تحديد مسماه الوظيفي ومهاراته بحرية',
  icon: 'tune',
  categories: [],
};

// Helper to find a track by ID, slug, or title
export function findTrackById(trackId?: string): TrackRoadmap | undefined {
  if (!trackId) return undefined;
  const cleanId = trackId.toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (cleanId === 'other') return OTHER_TRACK;
  return ALL_30_TECH_ROADMAPS.find((t) => {
    const tCleanId = t.id.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const tCleanTitle = t.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const tCleanSlug = (t.officialSlug || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    return tCleanId === cleanId || tCleanTitle === cleanId || tCleanSlug === cleanId;
  });
}

export interface SoftSkillOption {
  id: string;
  name: string;
  category: string;
  descriptionAr: string;
}

// User-focused, industry-standard soft skills (Communication, Leadership, Teamwork, etc.)
export const SOFT_SKILLS_OPTIONS: SoftSkillOption[] = [
  {
    id: 'communication',
    name: 'Communication',
    category: 'Communication',
    descriptionAr: 'التواصل الفعال ونقل الأفكار بوضوح للفريق والعملاء',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'Leadership',
    descriptionAr: 'القيادة وتوجيه الفرق وتحفيز الزملاء لتحقيق النتائج',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    category: 'Collaboration',
    descriptionAr: 'العمل الجماعي والتعاون الإيجابي ضمن بيئات العمل',
  },
  {
    id: 'problem_solving',
    name: 'Problem Solving',
    category: 'Analytical',
    descriptionAr: 'حل المشكلات والتفكير المنطقي لإيجاد حلول عملية',
  },
  {
    id: 'time_management',
    name: 'Time Management',
    category: 'Organization',
    descriptionAr: 'تنظيم الوقت وترتيب الأولويات وتسليم المهام في موعدها',
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    category: 'Growth',
    descriptionAr: 'المرونة وسرعة التأقلم مع متطلبات العمل والتقنيات الحديثة',
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking',
    category: 'Analytical',
    descriptionAr: 'التفكير النقدي وتحليل المواقف لاتخاذ قرارات مدروسة',
  },
  {
    id: 'work_ethic',
    name: 'Work Ethic',
    category: 'Professionalism',
    descriptionAr: 'الانضباط العالي وتحمل المسؤولية والالتزام بجودة المخرجات',
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    category: 'Communication',
    descriptionAr: 'مهارات التفاوض والإقناع والوصول إلى أفضل الحلول',
  },
  {
    id: 'active_listening',
    name: 'Active Listening',
    category: 'Communication',
    descriptionAr: 'الاستماع النشط لفهم احتياجات الفريق والعميل بدقة',
  },
  {
    id: 'mentorship',
    name: 'Mentorship',
    category: 'Leadership',
    descriptionAr: 'مساعدة الزملاء المبتدئين ونقل المعرفة والخبرات',
  },
  {
    id: 'conflict_resolution',
    name: 'Conflict Resolution',
    category: 'Management',
    descriptionAr: 'حل الخلافات وحفظ بيئة عمل تعاونية وبناءة',
  },
];
