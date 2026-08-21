import React from 'react';

export const MovieCardSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="aspect-[2/3] w-full rounded-2xl bg-slate-800/60 border border-white/5 mb-2.5" />
      <div className="h-4 bg-slate-800/80 rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-slate-800/50 rounded w-1/2" />
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[78vh] min-h-[560px] bg-slate-900/60 animate-pulse relative flex flex-col justify-end p-8 sm:p-16 max-w-7xl mx-auto">
      <div className="h-6 w-48 bg-slate-800 rounded-full mb-4" />
      <div className="h-12 w-3/4 max-w-xl bg-slate-800 rounded-xl mb-4" />
      <div className="h-4 w-full max-w-lg bg-slate-800/60 rounded mb-2" />
      <div className="h-4 w-2/3 max-w-md bg-slate-800/60 rounded mb-6" />
      <div className="flex gap-4">
        <div className="h-12 w-36 bg-rose-900/40 rounded-full" />
        <div className="h-12 w-36 bg-slate-800 rounded-full" />
      </div>
    </div>
  );
};

export const CarouselSkeleton: React.FC = () => {
  return (
    <div className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="h-7 w-48 bg-slate-800 rounded mb-4 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-44 flex-shrink-0">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {[...Array(count)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
