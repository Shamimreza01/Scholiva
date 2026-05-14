import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 relative">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-slate-200 relative overflow-hidden" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-32 bg-slate-200 rounded-full relative overflow-hidden" />
              <div className="h-3 w-16 bg-slate-100 rounded-full relative overflow-hidden" />
            </div>
            <div className="h-3 w-40 bg-slate-100 rounded-full relative overflow-hidden" />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-3 relative overflow-hidden" />
        
        {/* Content Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-slate-100 rounded-full relative overflow-hidden" />
          <div className="h-3 w-full bg-slate-100 rounded-full relative overflow-hidden" />
          <div className="h-3 w-2/3 bg-slate-100 rounded-full relative overflow-hidden" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-12 bg-slate-50 rounded-xl relative overflow-hidden" />
            <div className="h-8 w-12 bg-slate-50 rounded-xl relative overflow-hidden" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-10 bg-slate-50 rounded-xl relative overflow-hidden" />
            <div className="h-8 w-10 bg-slate-50 rounded-xl relative overflow-hidden" />
          </div>
        </div>
      </div>

      {/* Comment Section Skeleton */}
      <div className="bg-slate-50/40 px-6 py-6 border-t border-slate-100/60 relative overflow-hidden">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 relative overflow-hidden" />
          <div className="flex-1 h-8 bg-white border border-slate-200 rounded-full relative overflow-hidden" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
