import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, Bookmark, ExternalLink } from 'lucide-react';
import { SearchBar } from '../SearchBar/SearchBar';
import { useMyList } from '../../context/MyListContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { myList } = useMyList();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Genres', path: '/genres' },
    { name: 'Trending', path: '/trending' },
    { name: 'Popular', path: '/popular' },
    { name: 'My List', path: '/my-list', badge: myList.length > 0 ? myList.length : null },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070913]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
          : 'bg-gradient-to-b from-[#070913]/90 via-[#070913]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
            FILM<span className="text-rose-500">ORA</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-rose-600/20 border border-rose-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
              {link.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Search & Admin Action */}
        <div className="hidden sm:flex items-center gap-3">
          <SearchBar />
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            title="Django Admin Panel"
            className="p-2 rounded-full glass hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold px-3 border border-white/10"
          >
            <span>Admin</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Mobile Hamburger & Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/my-list"
            className="p-2 rounded-full glass text-slate-300 hover:text-white relative"
            aria-label="My List"
          >
            <Bookmark className="w-4 h-4" />
            {myList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center">
                {myList.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full glass text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#070913]/98 backdrop-blur-xl border-b border-white/10 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
          <SearchBar onClose={() => setMobileMenuOpen(false)} isMobileModal />
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'text-white bg-rose-600/30 border border-rose-500/40'
                      : 'text-slate-300 hover:text-white bg-slate-900/50'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-xs font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
            <span>Filmora Streaming Discovery</span>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 font-semibold flex items-center gap-1"
            >
              Open Django Admin <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
