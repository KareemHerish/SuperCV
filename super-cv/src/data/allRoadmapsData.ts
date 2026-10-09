export * from './roadmaps/types';
import { DetailedRoadmapTrack } from './roadmaps/types';
import { engineeringTracks } from './roadmaps/engineeringTracks';
import { aiDataTracks } from './roadmaps/aiDataTracks';
import { mobileGamesTracks } from './roadmaps/mobileGamesTracks';
import { productDesignTracks } from './roadmaps/productDesignTracks';

export { engineeringTracks, aiDataTracks, mobileGamesTracks, productDesignTracks };

export const ALL_ROADMAPS_MAP: Record<string, DetailedRoadmapTrack> = {
  ...engineeringTracks,
  ...aiDataTracks,
  ...mobileGamesTracks,
  ...productDesignTracks,
};

