import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      style={style}
      className={`bg-slate-200/80 dark:bg-slate-800/70 rounded-xl animate-shimmer-sweep select-none ${className}`}
    />
  );
};

export const ProfileViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      {/* 1. Hero Welcome Banner Skeleton */}
      <div className="relative rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs">
        <div className="flex items-center gap-5 w-full">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2.5 flex-1">
            <Skeleton className="h-7 sm:h-8 w-48 sm:w-72 rounded-lg" />
            <Skeleton className="h-4 w-64 sm:w-96 rounded-md" />
          </div>
          <div className="hidden lg:flex flex-col items-center gap-2 pl-4">
            <Skeleton className="w-28 h-6 rounded-md" />
            <Skeleton className="w-20 h-4 rounded-md" />
          </div>
        </div>
      </div>

      {/* 2. Top Stats Grid Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex items-center justify-between shadow-xs"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-md mt-1" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          </div>
        ))}
      </div>

      {/* 3. Main Grid (2 Columns: CVs List & Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right 2 cols: CVs cards list */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <Skeleton className="h-6 w-40 rounded-lg" />
              </div>
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>

            <div className="flex flex-col gap-3.5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--bg-surface-low)]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4.5 w-36 rounded-md" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3.5 w-20 rounded-md" />
                        <Skeleton className="h-3.5 w-24 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills chips skeleton card */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[70, 90, 60, 110, 85, 95, 75, 120, 65, 80].map((w, idx) => (
                <Skeleton key={idx} className="h-8 rounded-xl" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Left 1 col: Quick actions & Readiness summary */}
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col items-center gap-4 text-center">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-3.5 w-48 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BuildCVSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1520px] mx-auto gap-6 select-none" dir="rtl">
      {/* Top Action & Track Selector Bar Skeleton */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1 md:flex-initial">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-9 w-52 sm:w-64 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Main Split: Form on Right, A4 Live Preview on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: Interactive Form Sections Skeleton (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Section 1: Personal Info */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-5 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>

          {/* Section 2: Skills */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-5 w-36 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[80, 100, 70, 110, 95, 85, 120, 75].map((w, idx) => (
                <Skeleton key={idx} className="h-8 rounded-xl" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>

          {/* Section 3: Experiences */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-5 w-36 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>

            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--bg-surface-low)]/50 flex flex-col gap-3">
              <div className="flex justify-between">
                <Skeleton className="h-4.5 w-40 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Left Column: A4 Resume Preview Sheet Skeleton (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--color-border)] shadow-md flex flex-col gap-6 min-h-[580px]">
            {/* Resume Header */}
            <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-center">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>

            {/* Summary Block */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
            </div>

            {/* Experience Block */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <div className="flex flex-col gap-1.5 pr-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-md" />
                <Skeleton className="h-2.5 w-4/5 rounded-md" />
              </div>
            </div>

            {/* Skills Block */}
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <div className="flex flex-wrap gap-1.5">
                {[50, 65, 55, 75, 60, 70, 80].map((w, idx) => (
                  <Skeleton key={idx} className="h-5 rounded-md" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoadmapsViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Track selector chips */}
      <div className="flex gap-2.5 overflow-x-hidden py-1">
        {[100, 120, 110, 130, 90, 115].map((w, idx) => (
          <Skeleton key={idx} className="h-10 rounded-2xl shrink-0" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Roadmap Stages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AssessmentViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1100px] mx-auto gap-6 select-none" dir="rtl">
      {/* Assessment Header */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-60 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Question Card Skeleton */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-7 w-3/4 rounded-lg" />

        {/* Options */}
        <div className="flex flex-col gap-3.5 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--bg-surface-low)]/40 flex items-center gap-3.5"
            >
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ReadinessViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-6 w-56 rounded-lg" />
            <Skeleton className="h-3.5 w-72 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Input Card Skeleton */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-5">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="flex justify-end items-center pt-1">
          <Skeleton className="h-11 w-44 rounded-2xl" />
        </div>
      </div>

      {/* Match Bar & Cards Preview Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectsViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1440px] mx-auto gap-6 select-none" dir="rtl">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-64 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)] mt-auto">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactViewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-6 lg:px-10 py-6 max-w-[1100px] mx-auto gap-6 select-none" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact info cards */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center gap-4"
            >
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex flex-col gap-4">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded-md pb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
};

export const AskAISkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 py-6 gap-6 select-none" dir="rtl">
      {/* Chat Header Skeleton */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-3 w-44 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>

      {/* Messages Stream Skeleton */}
      <div className="flex flex-col gap-5 flex-1 p-2">
        {/* Assistant message */}
        <div className="flex items-start gap-3 max-w-[85%] self-start">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col gap-2.5 shadow-xs w-80 sm:w-96">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start gap-3 max-w-[75%] self-end flex-row-reverse">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex flex-col gap-2 w-64">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-2/3 rounded-md" />
          </div>
        </div>

        {/* Assistant message */}
        <div className="flex items-start gap-3 max-w-[85%] self-start">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] flex flex-col gap-2.5 shadow-xs w-96">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-5/6 rounded-md" />
            <Skeleton className="h-16 w-full rounded-xl mt-1" />
          </div>
        </div>
      </div>

      {/* Chat Input Bar Skeleton */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[var(--bg-surface-lowest)] border border-[var(--color-border)] shadow-xs flex items-center gap-3">
        <Skeleton className="h-11 flex-1 rounded-2xl" />
        <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
      </div>
    </div>
  );
};

export const TabSkeleton: React.FC<{ tab: string }> = ({ tab }) => {
  switch (tab) {
    case 'profile':
      return <ProfileViewSkeleton />;
    case 'build-cv':
      return <BuildCVSkeleton />;
    case 'roadmaps':
      return <RoadmapsViewSkeleton />;
    case 'assessment':
      return <AssessmentViewSkeleton />;
    case 'readiness':
      return <ReadinessViewSkeleton />;
    case 'projects':
      return <ProjectsViewSkeleton />;
    case 'contact':
      return <ContactViewSkeleton />;
    case 'ask-ai':
      return <AskAISkeleton />;
    default:
      return <BuildCVSkeleton />;
  }
};
