import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, getMovieBackdrop, getMoviePoster } from '../../services/api';
import type { Movie } from '../../types';
import { YouTubePlayer } from '../../components/YouTubePlayer/YouTubePlayer';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { useMyList } from '../../context/MyListContext';
import {
  Star,
  Play,
  Plus,
  Check,
  Calendar,
  Clock,
  Globe,
  Share2,
  ChevronLeft,
  Clapperboard,
} from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isInList, toggleList } = useMyList();

  useEffect(() => {
    if (!slug) return;
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getMovieBySlug(slug);
        setMovie(data);

        // Update Dynamic SEO title and description
        document.title = `${data.title} | Filmora`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.description.slice(0, 160));
        }

        // Fetch similar movies by genre
        if (data.genres && data.genres.length > 0) {
          const simRes = await api.getMovies({ genre: data.genres[0].slug, page: 1 });
          setSimilarMovies((simRes.results || []).filter((m) => m.id !== data.id));
        }
      } catch (err: any) {
        console.error('Movie details error:', err);
        setError('Movie not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <Clapperboard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-slate-400 max-w-md mb-6">{error || 'The requested film could not be located.'}</p>
        <button
          onClick={() => navigate('/movies')}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
        >
          Back to All Movies
        </button>
      </div>
    );
  }

  const inList = isInList(movie.id);
  const backdropUrl = getMovieBackdrop(movie);
  const posterUrl = getMoviePoster(movie);
  const releaseYear = movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '2026');

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Top Subtle Backdrop Atmosphere */}
      <div className="absolute top-0 left-0 right-0 h-[480px] lg:h-[540px] overflow-hidden pointer-events-none z-0">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src = posterUrl;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-[#070913]/50 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-9 pt-24 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass hover:bg-white/10 text-xs font-semibold text-white transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Two-Column Cinematic Hero */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
          {/* Left Column: 2:3 Portrait Poster */}
          <div className="flex justify-center md:justify-start">
            <div className="w-48 sm:w-56 md:w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/90 border border-white/10 bg-slate-900 flex-shrink-0">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Aligned Movie Details */}
          <div className="flex flex-col space-y-5">
            {/* Genre Badges */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/movies?genre=${genre.slug}`}
                    className="px-3 py-1 rounded-full bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Movie Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
              {movie.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-300">
              {movie.rating > 0 && (
                <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 font-bold">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  {movie.rating} / 10
                </span>
              )}
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                {releaseYear}
              </span>
              {movie.duration && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {movie.duration}
                  </span>
                </>
              )}
              {movie.language && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {movie.language}
                  </span>
                </>
              )}
            </div>

            {/* Synopsis */}
            <div className="glass p-5 rounded-2xl border border-white/5 space-y-2 max-w-[850px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Synopsis</h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                {movie.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => toggleList(movie)}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  inList
                    ? 'bg-slate-800 text-rose-400 border border-rose-500/40 shadow-sm'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {inList ? 'In My List' : 'Add to My List'}
              </button>

              <button
                onClick={handleShare}
                aria-label="Share movie link"
                className="px-4 py-3 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white transition-all relative border border-white/10 flex items-center gap-2 text-xs sm:text-sm font-semibold"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-[10px] text-white whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="glass p-5 sm:p-6 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm max-w-[850px] mt-2">
              {movie.director && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-1">
                    Director
                  </span>
                  <p className="text-white font-medium">{movie.director}</p>
                </div>
              )}

              {movie.writers && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-1">
                    Writers
                  </span>
                  <p className="text-white font-medium">{movie.writers}</p>
                </div>
              )}

              {movie.cast && (
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-1">
                    Stars / Cast
                  </span>
                  <p className="text-white font-medium">{movie.cast}</p>
                </div>
              )}

              {movie.country && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-1">
                    Country of Origin
                  </span>
                  <p className="text-white font-medium">{movie.country}</p>
                </div>
              )}

              {movie.release_date && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-1">
                    Release Date
                  </span>
                  <p className="text-white font-medium">{movie.release_date}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="mt-12 lg:mt-14 space-y-4 max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-rose-500 fill-current" /> Official Trailer & Video Player
            </h3>
            <span className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              HD 1080p Embed
            </span>
          </div>
          <div className="w-full">
            <YouTubePlayer
              videoId={movie.youtube_video_id}
              title={movie.title}
            />
          </div>
        </div>

        {/* Similar Movies Carousel */}
        {similarMovies.length > 0 && (
          <div className="mt-14 lg:mt-16 -mx-5 sm:-mx-8 lg:-mx-9">
            <MovieCarousel
              title="More Like This"
              subtitle="Explore related films in the same category"
              movies={similarMovies}
            />
          </div>
        )}
      </div>
    </div>
  );
};
