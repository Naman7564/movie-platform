import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Genre } from '../../types';
import { Sparkles, Layers } from 'lucide-react';

export const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGenres()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as any).results || [];
        setGenres(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const genreGradients = [
    'from-rose-600/30 to-amber-600/20 hover:border-rose-500/50',
    'from-blue-600/30 to-cyan-600/20 hover:border-blue-500/50',
    'from-purple-600/30 to-pink-600/20 hover:border-purple-500/50',
    'from-emerald-600/30 to-teal-600/20 hover:border-emerald-500/50',
    'from-orange-600/30 to-red-600/20 hover:border-orange-500/50',
    'from-indigo-600/30 to-violet-600/20 hover:border-indigo-500/50',
  ];

  return (
    <div className="pt-24 pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-rose-500" /> Movie Genres & Categories
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore our complete cinematic universe categorized by story, emotion, and theme.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {genres.map((genre, idx) => {
            const grad = genreGradients[idx % genreGradients.length];
            return (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.slug}`}
                className={`group relative rounded-2xl overflow-hidden glass p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] shadow-xl bg-gradient-to-br ${grad} flex flex-col justify-between min-h-[160px]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                      {genre.name}
                    </h3>
                    <Layers className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {genre.description || `Browse popular and acclaimed ${genre.name} releases.`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-semibold text-rose-400">
                  <span>{genre.movies_count ?? 0} Titles Available</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
