import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Movie } from '../../types';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { GridSkeleton } from '../../components/Skeleton/Skeleton';
import { Flame } from 'lucide-react';

export const PopularPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPopularMovies()
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Flame className="w-8 h-8 text-rose-500" /> Popular on Filmora
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          All-time fan favorites and the highest rated cinema experiences.
        </p>
      </div>

      {loading ? <GridSkeleton count={12} /> : <MovieGrid movies={movies} />}
    </div>
  );
};
