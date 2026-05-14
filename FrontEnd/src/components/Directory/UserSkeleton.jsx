import React from 'react';

const UserSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 shimmer pointer-events-none" />
      
      <div className="flex items-start gap-5">
        {/* Avatar Skeleton */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 relative overflow-hidden" />
        
        <div className="flex-1 min-w-0 space-y-3">
          {/* Name & Role Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-32 bg-slate-200 rounded-full relative overflow-hidden" />
            <div className="h-4 w-12 bg-slate-100 rounded-md relative overflow-hidden" />
          </div>
          
          {/* Email Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-40 bg-slate-100 rounded-full relative overflow-hidden" />
          </div>
          
          {/* Bio Skeleton */}
          <div className="space-y-2 mt-4">
            <div className="h-3 w-full bg-slate-50 rounded-full relative overflow-hidden" />
            <div className="h-3 w-2/3 bg-slate-50 rounded-full relative overflow-hidden" />
          </div>

          {/* Education Skeleton */}
          <div className="pt-2">
            <div className="h-4 w-24 bg-indigo-50 rounded-full relative overflow-hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
