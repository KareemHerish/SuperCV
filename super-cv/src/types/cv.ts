export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  metrics: string; // e.g. "1.2k Stars on GitHub" or "Used by 15 enterprise clients"
  description: string;
  techStack: string;
  link?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface VerifiedBadge {
  id: string;
  skill: string;
  score: number;
  badgeCode: string;
  date: string;
}

export interface CandidateCV {
  id: string;
  fullName: string;
  targetRole: string;
  trackId: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
  summary: string;
  techSkills: string[];
  softSkills: string[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  verifiedBadges: VerifiedBadge[];
  atsScore: number;
  matchRate: number;
  userId?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}
