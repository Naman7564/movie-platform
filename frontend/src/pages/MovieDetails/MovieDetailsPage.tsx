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
    <div className="min-h-screen pb-20">
      {/* Top Hero Banner with Cinematic Backdrop */}
      <div className="relative w-full h-[65vh] min-h-[480px] max-h-[640px] overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-40"
          onError={(e) => {
            (e.target as HTMLImageElement).src = posterUrl;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-transparent to-[#070913]" />

        {/* Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass hover:bg-white/10 text-xs font-semibold text-white transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-60 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Poster & Quick Info */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-5">
            <div className="w-56 sm:w-64 lg:w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 bg-slate-900 flex-shrink-0">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full max-w-[280px] flex items-center gap-2">
              <button
                onClick={() => toggleList(movie)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  inList
                    ? 'bg-slate-800 text-rose-400 border border-rose-500/40'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {inList ? 'In My List' : 'Add to My List'}
              </button>

              <button
                onClick={handleShare}
                aria-label="Share movie link"
                className="p-3 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white transition-all relative border border-white/10"
              >
                <Share2 className="w-4 h-4" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-[10px] text-white whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Video Player, and Full Info */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres?.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/movies?genre=${genre.slug}`}
                    className="px-3 py-1 rounded-full bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Movie Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                {movie.title}
              </h1>

              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-slate-300">
                <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  {movie.rating} / 10
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {releaseYear}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {movie.duration}
                </span>
                {movie.language && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {movie.language}
                  </span>
                )}
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="glass p-5 rounded-2xl border border-white/5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Synopsis</h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                {movie.description}
              </p>
            </div>

            {/* Official YouTube Trailer Player Component */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-rose-500 fill-current" /> Official Trailer & Video Player
                </h3>
                <span className="text-xs text-slate-400">HD 1080p Embed</span>
              </div>
              <YouTubePlayer
                videoId={movie.youtube_video_id}
                title={movie.title}
              />
            </div>

            {/* Detailed Movie Information Card */}
            <div className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              {movie.director && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-0.5">
                    Director
                  </span>
                  <p className="text-white font-medium">{movie.director}</p>
                </div>
              )}

              {movie.writers && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-0.5">
                    Writers
                  </span>
                  <p className="text-white font-medium">{movie.writers}</p>
                </div>
              )}

              {movie.cast && (
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-0.5">
                    Cast
                  </span>
                  <p className="text-white font-medium">{movie.cast}</p>
                </div>
              )}

              {movie.country && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-0.5">
                    Country of Origin
                  </span>
                  <p className="text-white font-medium">{movie.country}</p>
                </div>
              )}

              {movie.release_date && (
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider font-bold mb-0.5">
                    Release Date
                  </span>
                  <p className="text-white font-medium">{movie.release_date}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Carousel */}
      {similarMovies.length > 0 && (
        <div className="mt-16">
          <MovieCarousel
            title="More Like This"
            subtitle="Explore related films in the same category"
            movies={similarMovies}
          />
        </div>
      )}
    </div>
  );
};
