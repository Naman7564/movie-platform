export interface Genre {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  movies_count?: number;
}

export interface Movie {
  id: number;
  title: string;
  slug: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail: string | null;
  backdrop: string | null;
  genres: Genre[];
  release_date: string | null;
  release_year?: number | null;
  duration: string;
  director?: string;
  writers?: string;
  cast?: string;
  language?: string;
  country?: string;
  rating: number;
  is_featured: boolean;
  is_trending: boolean;
  is_popular: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MovieFilterParams {
  genre?: string;
  year?: string;
  min_rating?: number | string;
  ordering?: string;
  page?: number;
  search?: string;
}
