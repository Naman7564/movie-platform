import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Movie, Genre } from '../../types';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { GridSkeleton } from '../../components/Skeleton/Skeleton';
import { X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter values from URL query params
  const currentGenre = searchParams.get('genre') || '';
  const currentYear = searchParams.get('year') || '';
  const currentRating = searchParams.get('min_rating') || '';
  const currentOrdering = searchParams.get('ordering') || '-created_at';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    // Load genres once
    api.getGenres().then((res) => {
      const list = Array.isArray(res) ? res : (res as any).results || [];
      setGenres(list);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        if (currentSearch) {
          const res = await api.searchMovies(currentSearch, currentPage);
          setMovies(res.results || []);
          setTotalCount(res.count || 0);
          setTotalPages(Math.ceil((res.count || 0) / 12) || 1);
        } else {
          const res = await api.getMovies({
            genre: currentGenre || undefined,
            year: currentYear || undefined,
            min_rating: currentRating || undefined,
            ordering: currentOrdering || undefined,
            page: currentPage,
          });
          setMovies(res.results || []);
          setTotalCount(res.count || 0);
          setTotalPages(Math.ceil((res.count || 0) / 12) || 1);
        }
      } catch (err) {
        console.error('Movies fetch error:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentGenre, currentYear, currentRating, currentOrdering, currentSearch, currentPage]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentGenre || currentYear || currentRating || currentSearch || currentOrdering !== '-created_at';

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {currentSearch ? `Search Results for "${currentSearch}"` : 'Explore All Movies'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {totalCount} {totalCount === 1 ? 'movie' : 'movies'} available in the catalog
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="glass p-4 rounded-2xl mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Genre Filter */}
            <select
              value={currentGenre}
              onChange={(e) => updateFilter('genre', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white border border-slate-700 focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={currentYear}
              onChange={(e) => updateFilter('year', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white border border-slate-700 focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Years</option>
              {['2026', '2025', '2024', '2023', '2022', '2020', '2019', '2017', '2014', '2010', '2008'].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Minimum Rating */}
            <select
              value={currentRating}
              onChange={(e) => updateFilter('min_rating', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white border border-slate-700 focus:border-rose-500 focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="8.5">8.5+ ⭐ Masterpieces</option>
              <option value="8.0">8.0+ ⭐ Very Good</option>
              <option value="7.0">7.0+ ⭐ Good</option>
            </select>

            {/* Sort Order */}
            <select
              value={currentOrdering}
              onChange={(e) => updateFilter('ordering', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white border border-slate-700 focus:border-rose-500 focus:outline-none"
            >
              <option value="-created_at">Latest Added</option>
              <option value="-rating">Highest Rated</option>
              <option value="-release_date">Newest Release</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/30 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid / Content */}
      {loading ? (
        <GridSkeleton count={12} />
      ) : movies.length === 0 ? (
        <div className="py-20 text-center glass rounded-2xl">
          <p className="text-lg font-semibold text-white mb-2">No movies match your filters.</p>
          <p className="text-sm text-slate-400 mb-6">Try selecting different genres or reset all filters.</p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size="sm" className="!w-full" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateFilter('page', String(currentPage - 1))}
            className="p-2 rounded-xl glass hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => updateFilter('page', String(pageNum))}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40'
                    : 'glass text-slate-300 hover:bg-white/10'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateFilter('page', String(currentPage + 1))}
            className="p-2 rounded-xl glass hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
