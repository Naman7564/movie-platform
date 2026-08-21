import React, { useState } from 'react';
import { Film, Play, AlertCircle } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  autoPlay?: boolean;
  className?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  autoPlay = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  if (!videoId) {
    return (
      <div className={`aspect-video w-full rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-6 ${className}`}>
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <p className="font-semibold text-white">Trailer Unavailable</p>
        <p className="text-sm text-slate-400 mt-1">No valid YouTube video ID found for this movie.</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800/80 group ${className}`}>
      {!isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-center justify-center">
            <button
              aria-label={`Play ${title}`}
              className="w-20 h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-rose-400 mb-1 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> Official YouTube Trailer
              </p>
              <h3 className="text-xl font-bold text-white drop-shadow-md">{title}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-slate-300 border border-white/10">
              Click to Watch
            </span>
          </div>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={`Trailer for ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={() => setHasError(true)}
          className="w-full h-full border-0"
        />
      )}

      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
          <p className="text-white font-medium">Failed to load video player.</p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            Watch on YouTube directly
          </a>
        </div>
      )}
    </div>
  );
};
