import { Skeleton } from "@/components/ui/skeleton";

// Performance Insights Skeleton
export const PerformanceInsightsSkeleton = () => (
  <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
    <Skeleton className="h-8 w-48 mb-4 sm:mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#0e0e10] rounded-lg p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        {/* Action Cards */}
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      {/* Subject Breakdown */}
      <div className="bg-[#0e0e10] rounded-lg p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// Weekly Progress Skeleton
export const WeeklyProgressSkeleton = () => (
  <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
    <div className="mb-4 sm:mb-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-16 rounded-lg" />
        ))}
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="text-right">
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
    {/* Chart */}
    <Skeleton className="h-64 w-full" />
  </div>
);

// Flashcard Stats Skeleton
export const FlashcardStatsSkeleton = () => (
  <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
    <div className="flex items-center space-x-2 mb-6">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center justify-center min-h-[80px] md:min-h-[90px]">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      {/* Review Stats */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div>
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
      {/* Last Session */}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  </div>
);

// Pomodoro Stats Skeleton
export const PomodoroStatsSkeleton = () => (
  <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
    <div className="flex items-center space-x-2 mb-6">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      {/* Session Types */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Subject Time */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      {/* Last Session */}
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  </div>
);

// Mock Stats Skeleton
export const MockStatsSkeleton = () => (
  <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white flex flex-col gap-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
    {/* Key Metrics */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-1" />
          <Skeleton className="h-3 w-20 mx-auto" />
        </div>
      ))}
    </div>
    {/* Score Trend */}
    <div>
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-40 w-full" />
    </div>
    {/* Speed Analysis */}
    <div>
      <Skeleton className="h-5 w-24 mb-2" />
      <div className="bg-[#181B23] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2 flex flex-col justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Recent Mocks */}
    <div>
      <Skeleton className="h-5 w-32 mb-2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

// Main Dashboard Skeleton (combines all)
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#0e0e10] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Header Skeleton */}
      <div className="text-center mb-6 lg:mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      
      {/* Performance Insights */}
      <PerformanceInsightsSkeleton />
      
      {/* Weekly Progress */}
      <WeeklyProgressSkeleton />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlashcardStatsSkeleton />
        <PomodoroStatsSkeleton />
      </div>
      
      {/* Mock Stats */}
      <div className="mt-6">
        <MockStatsSkeleton />
      </div>
    </div>
  </div>
); 