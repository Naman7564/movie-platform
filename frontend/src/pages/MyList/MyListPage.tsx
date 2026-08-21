import React from 'react';
import { Link } from 'react-router-dom';
import { useMyList } from '../../context/MyListContext';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { Bookmark, Film, Trash2 } from 'lucide-react';

export const MyListPage: React.FC = () => {
  const { myList, removeFromList } = useMyList();

  return (
    <div className="pt-24 pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-rose-500" /> My Saved List
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {myList.length} {myList.length === 1 ? 'movie' : 'movies'} in your private watchlist
          </p>
        </div>

        {myList.length > 0 && (
          <p className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 self-start sm:self-auto">
            Saved locally in browser storage
          </p>
        )}
      </div>

      {myList.length === 0 ? (
        <div className="py-24 text-center rounded-3xl glass border border-dashed border-white/10 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your watchlist is currently empty</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Click the "+ Add to List" button on any movie card or detail page to curate your personal collection.
          </p>
          <Link
            to="/movies"
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/30"
          >
            Discover Movies Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {myList.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard movie={movie} size="sm" className="!w-full" />
              <button
                onClick={() => removeFromList(movie.id)}
                title="Remove from List"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
