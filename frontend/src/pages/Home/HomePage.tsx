import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Movie, Genre } from '../../types';
import { Hero } from '../../components/Hero/Hero';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { HeroSkeleton, CarouselSkeleton } from '../../components/Skeleton/Skeleton';
import { Sparkles, Clapperboard } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredRes, trendingRes, popularRes, latestRes, genresRes] = await Promise.all([
          api.getFeaturedMovies().catch(() => []),
          api.getTrendingMovies().catch(() => []),
          api.getPopularMovies().catch(() => []),
          api.getLatestMovies().catch(() => []),
          api.getGenres().catch(() => []),
        ]);

        setFeaturedMovies(featuredRes);
        setTrendingMovies(trendingRes);
        setPopularMovies(popularRes);
        setLatestMovies(latestRes);

        const genreList = Array.isArray(genresRes) ? genresRes : (genresRes as any).results || [];
        setGenres(genreList);
      } catch (err: any) {
        console.error('Home page load error:', err);
        setError('Failed to connect to Django API backend. Ensure the backend server is active.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <HeroSkeleton />
        <CarouselSkeleton />
        <CarouselSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <Clapperboard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Movies</h2>
        <p className="text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Hero Showcase Section */}
      <Hero movies={featuredMovies.length > 0 ? featuredMovies : latestMovies} />

      {/* 2. Trending Movies Carousel */}
      <MovieCarousel
        title="Trending Movies"
        subtitle="The most watched and trending releases this week"
        movies={trendingMovies}
        viewAllLink="/trending"
      />

      {/* 3. Popular Movies Carousel */}
      <MovieCarousel
        title="Popular on Filmora"
        subtitle="Critically acclaimed movies loved by fans"
        movies={popularMovies}
        viewAllLink="/popular"
      />

      {/* 4. Explore Genres Section */}
      {genres.length > 0 && (
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" /> Browse by Genre
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Explore movies by your favorite theme</p>
            </div>
            <Link to="/genres" className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300">
              All Genres &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {genres.slice(0, 10).map((genre) => (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.slug}`}
                className="group relative h-24 rounded-2xl overflow-hidden glass hover:border-rose-500/40 transition-all p-4 flex flex-col justify-end shadow-md hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent group-hover:from-rose-950/40 transition-colors" />
                <h3 className="relative font-bold text-white text-base group-hover:text-rose-300 transition-colors">
                  {genre.name}
                </h3>
                {genre.movies_count !== undefined && (
                  <span className="relative text-[11px] text-slate-400">
                    {genre.movies_count} movies
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Latest Movies Responsive Grid */}
      <MovieGrid
        title="Latest Releases"
        subtitle="Newly added films and upcoming trailers"
        movies={latestMovies}
      />
    </div>
  );
};
