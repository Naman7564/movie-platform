import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Movie } from '../../types';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { GridSkeleton } from '../../components/Skeleton/Skeleton';
import { TrendingUp } from 'lucide-react';

export const TrendingPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrendingMovies()
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-rose-500" /> Trending Movies
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          The hottest movies capturing audience attention right now across global platforms.
        </p>
      </div>

      {loading ? <GridSkeleton count={12} /> : <MovieGrid movies={movies} />}
    </div>
  );
};
