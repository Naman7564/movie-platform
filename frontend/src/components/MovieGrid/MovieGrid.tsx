import React from 'react';
import type { Movie } from '../../types';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  subtitle,
  emptyMessage = 'No movies found.',
}) => {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-8">
      {title && (
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}

      {movies.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <p className="text-slate-400 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size="sm" className="!w-full" />
          ))}
        </div>
      )}
    </section>
  );
};
