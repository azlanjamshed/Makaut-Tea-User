import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`} />
);

export const RantCardSkeleton = () => (
  <div className="bg-white border border-[var(--border-color)] shadow-sm rounded-3xl p-5 space-y-4">
    {/* Author Header */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-2xl" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="w-6 h-6 rounded-lg" />
    </div>

    {/* Post text */}
    <div className="space-y-2 py-1">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-11/12 h-4" />
      <Skeleton className="w-4/5 h-4" />
    </div>

    {/* Optional Image skeleton */}
    <Skeleton className="w-full h-48 rounded-2xl" />

    {/* Footer reactions & views */}
    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-8 rounded-xl" />
        <Skeleton className="w-16 h-8 rounded-xl" />
      </div>
      <Skeleton className="w-20 h-6 rounded-xl" />
    </div>
  </div>
);

export const CommentSkeleton = () => (
  <div className="flex gap-3 py-3 border-b border-[var(--border-color)]">
    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3.5" />
        <Skeleton className="w-12 h-3" />
      </div>
      <Skeleton className="w-full h-3.5" />
      <Skeleton className="w-2/3 h-3.5" />
    </div>
  </div>
);

export const NotificationSkeleton = () => (
  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm">
    <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-3/4 h-3.5" />
      <Skeleton className="w-1/4 h-3" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white border border-[var(--border-color)] shadow-sm rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
      <Skeleton className="w-20 h-20 rounded-3xl" />
      <div className="space-y-2 flex flex-col items-center">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-48 h-3.5" />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-[var(--border-color)]">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;
