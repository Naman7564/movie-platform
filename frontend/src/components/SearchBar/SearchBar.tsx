import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Play } from 'lucide-react';
import { api, getMoviePoster } from '../../services/api';
import type { Movie } from '../../types';

interface SearchBarProps {
  onClose?: () => void;
  isMobileModal?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose, isMobileModal = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await api.searchMovies(query);
        setResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMovie = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onClose) onClose();
    navigate(`/movies/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      if (onClose) onClose();
      navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchContainerRef} className={`relative ${isMobileModal ? 'w-full' : 'w-64 lg:w-80'}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search movies, cast, director..."
          className="w-full pl-10 pr-10 py-2 rounded-full bg-slate-900/90 text-sm text-white placeholder-slate-400 border border-slate-700/60 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            aria-label="Clear search query"
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-8 w-4 h-4 text-rose-400 animate-spin" />
        )}
      </div>

      {/* Instant Search Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 max-h-96 overflow-y-auto rounded-2xl glass-card border border-slate-700/60 shadow-2xl p-2 z-50">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400">Searching film vault...</div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 flex justify-between">
                <span>Results</span>
                <span>{results.length} found</span>
              </div>
              {results.slice(0, 6).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group"
                >
                  <img
                    src={getMoviePoster(movie)}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0 bg-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
                      {movie.title}
                    </h5>
                    <p className="text-xs text-slate-400 truncate">
                      {movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '')} •{' '}
                      {movie.genres?.map((g) => g.name).join(', ') || 'Movie'}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                  navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-rose-400 hover:text-rose-300 border-t border-white/5 mt-1"
              >
                View all results &rarr;
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No movies found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
