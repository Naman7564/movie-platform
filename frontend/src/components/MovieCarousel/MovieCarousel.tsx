import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../../types';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllLink?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  subtitle,
  movies,
  viewAllLink,
  size = 'md',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-8 relative">
      <div className="flex items-end justify-between mb-5 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors mr-3"
            >
              See All &rarr;
            </a>
          )}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto scroll-smooth py-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0">
            <MovieCard movie={movie} size={size} />
          </div>
        ))}
      </div>
    </section>
  );
};
