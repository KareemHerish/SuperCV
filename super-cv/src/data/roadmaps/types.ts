export interface RoadmapStage {
  number: string;
  name: string;
  nameAr: string;
  description: string;
  skills: string[];
  level?: 'أساسي' | 'متوسط' | 'متقدم' | 'احترافي';
  projectFocus?: string;
}

export interface DetailedRoadmapTrack {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  level: string;
  duration: string;
  summary: string;
  officialSlug: string;
  stages: RoadmapStage[];
}
