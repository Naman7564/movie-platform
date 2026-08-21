import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Clock, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Movie } from '../../types';
import { getMovieBackdrop, getMoviePoster } from '../../services/api';
import { useMyList } from '../../context/MyListContext';

interface HeroProps {
  movies: Movie[];
}

export const Hero: React.FC<HeroProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInList, toggleList } = useMyList();

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return (
      <div className="w-full h-[70vh] min-h-[500px] bg-slate-900 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  const currentMovie = movies[currentIndex] || movies[0];
  const inList = isInList(currentMovie.id);
  const backdropUrl = getMovieBackdrop(currentMovie);
  const releaseYear = currentMovie.release_year || (currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : '2026');

  return (
    <div className="relative w-full h-[620px] sm:h-[660px] lg:h-[700px] min-h-[520px] max-h-[760px] overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          key={currentMovie.id}
          src={backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center opacity-65 transition-opacity duration-1000 transform scale-105 animate-in fade-in"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getMoviePoster(currentMovie);
          }}
        />
        {/* Gradients to blend seamlessly */}
        <div className="absolute inset-0 hero-gradient hidden md:block" />
        <div className="absolute inset-0 hero-mobile-gradient md:hidden" />
      </div>

      {/* Hero Content Area */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start pt-16 sm:pt-20 pb-12 z-10">
        <div className="max-w-2xl lg:max-w-3xl space-y-4 mt-0">
          {/* Tags & Rating */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-300">
            {currentMovie.genres?.slice(0, 3).map((g) => (
              <span key={g.id} className="px-2.5 py-1 rounded-full bg-rose-600/30 border border-rose-500/30 text-rose-300 font-medium">
                {g.name}
              </span>
            ))}
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              {currentMovie.rating}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              {releaseYear}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              {currentMovie.duration}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-[1.08] max-w-2xl">
            {currentMovie.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 max-w-xl font-normal leading-relaxed drop-shadow">
            {currentMovie.description}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              to={`/movies/${currentMovie.slug}`}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Trailer
            </Link>

            <button
              onClick={() => toggleList(currentMovie)}
              className={`px-5 py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 border transition-all duration-300 backdrop-blur-md ${
                inList
                  ? 'bg-slate-800/90 text-rose-400 border-rose-500/50'
                  : 'glass text-white hover:bg-white/10 border-white/20'
              }`}
            >
              {inList ? (
                <>
                  <Check className="w-5 h-5 text-rose-400" />
                  In My List
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to List
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Carousel Navigation Controls & Thumbnails */}
        {movies.length > 1 && (
          <div className="absolute right-4 sm:right-6 lg:right-8 bottom-10 hidden lg:flex items-center gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1))}
              aria-label="Previous featured movie"
              className="p-2 rounded-full glass hover:bg-white/10 text-white transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {movies.slice(0, 5).map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentIndex
                      ? 'border-rose-500 scale-110 shadow-lg shadow-rose-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getMoviePoster(m)} alt={m.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
              aria-label="Next featured movie"
              className="p-2 rounded-full glass hover:bg-white/10 text-white transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Small indicators for mobile */}
        {movies.length > 1 && (
          <div className="flex lg:hidden items-center justify-center gap-1.5 pt-6 self-center">
            {movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-rose-500' : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
