import React, { useEffect } from 'react';
import { DetailedRoadmapTrack } from '../data/allRoadmapsData';

interface RoadmapModalProps {
  track: DetailedRoadmapTrack | null;
  onClose: () => void;
  onSelectTrackForCV?: (trackId: string) => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  track,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!track) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-right animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="relative p-6 sm:p-7 border-b border-[var(--color-border)] bg-[var(--bg-surface-low)] overflow-hidden">
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                <span className="material-symbols-outlined text-[26px]">{track.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)]">
                    {track.titleAr}
                  </h3>
                  <span className="font-mono text-xs text-[var(--color-outline)] font-normal border border-[var(--color-border)] px-2 py-0.5 rounded-md bg-[var(--bg-surface-high)]" dir="ltr">
                    {track.title}
                  </span>
                </div>
                {track.duration && (
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-[var(--color-primary)]">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span>{track.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-high)] transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {track.summary && (
            <p className="mt-3 text-xs sm:text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              {track.summary}
            </p>
          )}
        </div>

        {/* Scrollable Roadmap Stages Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Timeline Stages */}
          <div className="space-y-4 relative before:absolute before:inset-y-4 before:right-5 before:w-0.5 before:bg-[var(--color-border)]">
            {track.stages.map((stage, idx) => (
              <div
                key={idx}
                className="relative flex items-start gap-4 pr-1 sm:pr-2 group"
              >
                {/* Stage Number Node */}
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-high)] border border-[var(--color-border)] text-[var(--color-on-surface)] flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-sm relative z-10 group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {stage.number}
                </div>

                {/* Stage Content Card */}
                <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface-low)] border border-[var(--color-border)] group-hover:border-[var(--color-outline)]/40 transition-all shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <span className="font-bold text-sm sm:text-base text-[var(--color-on-surface)]">
                      {stage.nameAr}
                    </span>
                    <span className="text-xs font-mono text-[var(--color-outline)]" dir="ltr">
                      {stage.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-3 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {stage.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] text-[var(--color-on-surface)] shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--bg-surface-low)] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--bg-surface-high)] transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
