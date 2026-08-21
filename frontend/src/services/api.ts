import axios from 'axios';
import type { Movie, Genre, PaginatedResponse, MovieFilterParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Movie endpoints
  getMovies: async (params?: MovieFilterParams): Promise<PaginatedResponse<Movie>> => {
    const response = await apiClient.get<PaginatedResponse<Movie>>('/movies/', { params });
    return response.data;
  },

  getMovieBySlug: async (slug: string): Promise<Movie> => {
    const response = await apiClient.get<Movie>(`/movies/${slug}/`);
    return response.data;
  },

  getFeaturedMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/featured/');
    return response.data;
  },

  getTrendingMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/trending/');
    return response.data;
  },

  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/popular/');
    return response.data;
  },

  getLatestMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/latest/');
    return response.data;
  },

  searchMovies: async (query: string, page = 1): Promise<PaginatedResponse<Movie>> => {
    const response = await apiClient.get<PaginatedResponse<Movie>>('/movies/search/', {
      params: { q: query, page },
    });
    return response.data;
  },

  // Genre endpoints
  getGenres: async (): Promise<PaginatedResponse<Genre> | Genre[]> => {
    const response = await apiClient.get<PaginatedResponse<Genre> | Genre[]>('/genres/');
    return response.data;
  },

  getGenreBySlug: async (slug: string): Promise<Genre> => {
    const response = await apiClient.get<Genre>(`/genres/${slug}/`);
    return response.data;
  },
};

export const getYouTubeThumbnail = (videoId: string, quality: 'max' | 'hq' | 'mq' = 'hq'): string => {
  if (!videoId) return '';
  if (quality === 'max') return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  if (quality === 'hq') return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export const getMoviePoster = (movie: Movie): string => {
  if (movie.thumbnail) {
    if (movie.thumbnail.startsWith('http')) return movie.thumbnail;
    const base = API_BASE_URL.replace('/api', '');
    return `${base}${movie.thumbnail}`;
  }
  if (movie.youtube_video_id) {
    return getYouTubeThumbnail(movie.youtube_video_id, 'hq');
  }
  return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
};

export const getMovieBackdrop = (movie: Movie): string => {
  if (movie.backdrop) {
    if (movie.backdrop.startsWith('http')) return movie.backdrop;
    const base = API_BASE_URL.replace('/api', '');
    return `${base}${movie.backdrop}`;
  }
  if (movie.youtube_video_id) {
    return getYouTubeThumbnail(movie.youtube_video_id, 'max');
  }
  return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop';
};
