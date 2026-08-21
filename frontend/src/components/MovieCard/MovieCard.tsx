import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Check, Play } from 'lucide-react';
import type { Movie } from '../../types';
import { getMoviePoster } from '../../services/api';
import { useMyList } from '../../context/MyListContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  className = '',
  size = 'md',
}) => {
  const { isInList, toggleList } = useMyList();
  const inList = isInList(movie.id);
  const posterUrl = getMoviePoster(movie);

  const sizeClasses = {
    sm: 'w-36 md:w-44',
    md: 'w-44 md:w-56',
    lg: 'w-52 md:w-64',
  };

  const primaryGenre = movie.genres?.[0]?.name || 'Action';
  const releaseYear = movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '2026');

  return (
    <div className={`flex-shrink-0 group relative select-none ${sizeClasses[size]} ${className}`}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-slate-900 shadow-md transition-colors duration-300 group-hover:border-rose-500/40 group-hover:shadow-lg group-hover:shadow-rose-950/30">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <Star className="w-3 h-3 fill-current text-amber-400" />
            <span>{movie.rating}</span>
          </div>
        )}

        {/* Add to List quick button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleList(movie);
          }}
          aria-label={inList ? 'Remove from My List' : 'Add to My List'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all duration-200 backdrop-blur-md ${
            inList
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100'
          }`}
        >
          {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        {/* Dark overlay & Play action on hover */}
        <Link
          to={`/movies/${movie.slug}`}
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5"
        >
          <div className="flex items-center justify-center my-auto">
            <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/50">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
          <span className="text-center text-xs font-semibold text-rose-300 mt-auto">Watch Trailer</span>
        </Link>
      </div>

      {/* Movie info metadata */}
      <Link to={`/movies/${movie.slug}`} className="block mt-2.5">
        <h4 className="text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
          <span>{releaseYear}</span>
          <span>•</span>
          <span className="truncate">{primaryGenre}</span>
        </div>
      </Link>
    </div>
  );
};
