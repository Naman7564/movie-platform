import { Link } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/80 border-t border-white/5 pt-12 pb-8 mt-20 text-slate-400 text-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand */}
        <div className="space-y-3 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FILM<span className="text-rose-500">ORA</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            The cinematic movie streaming & discovery platform powered by Django REST Framework, React, TypeScript, and YouTube official embeds.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-rose-400 transition-colors">Home Featured</Link></li>
            <li><Link to="/movies" className="hover:text-rose-400 transition-colors">All Movies Catalog</Link></li>
            <li><Link to="/genres" className="hover:text-rose-400 transition-colors">Genres & Categories</Link></li>
            <li><Link to="/trending" className="hover:text-rose-400 transition-colors">Trending Now</Link></li>
            <li><Link to="/popular" className="hover:text-rose-400 transition-colors">Popular Releases</Link></li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/my-list" className="hover:text-rose-400 transition-colors">My Watchlist</Link></li>
            <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Filmora</Link></li>
            <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact Support</Link></li>
            <li>
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-400 transition-colors"
              >
                Django Admin Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Tech Stack */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {['React 19', 'TypeScript', 'Tailwind CSS', 'Django 6', 'DRF', 'SQLite3', 'Docker', 'Vite'].map((tech) => (
              <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for modern cinema discovery.
        </p>
        <p className="text-slate-400">
          Official YouTube API & Embeds compliant. All video rights belong to respective owners.
        </p>
      </div>
    </footer>
  );
};
