import React from 'react';
import { Film, Video, Zap, Server, Layout } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <Video className="w-6 h-6 text-rose-500" />,
      title: 'YouTube Embed Architecture',
      desc: 'Seamlessly stream official movie trailers and videos using YouTube embed technology.',
    },
    {
      icon: <Server className="w-6 h-6 text-rose-500" />,
      title: 'Django REST Framework',
      desc: 'High performance backend APIs with dynamic filtering, search, pagination, and admin authentication.',
    },
    {
      icon: <Layout className="w-6 h-6 text-rose-500" />,
      title: 'Cinematic React UI',
      desc: 'Dark modern aesthetic inspired by top-tier streaming services with responsive layouts and fluid transitions.',
    },
    {
      icon: <Zap className="w-6 h-6 text-rose-500" />,
      title: 'Instant Discovery',
      desc: 'Live debounced search, genre filtering, and responsive carousels for effortless movie browsing.',
    },
  ];

  return (
    <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-8 min-h-[80vh]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-rose-600/30">
          <Film className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          About <span className="text-rose-500">Filmora</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Filmora is a modern full-stack movie discovery and streaming web application engineered with React, TypeScript, and Django.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feat, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/80 w-fit border border-slate-800">
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-white">{feat.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5 space-y-4 text-center">
        <h3 className="text-xl font-bold text-white">Full Content Management via Django Admin</h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Administrators can publish new movies, update trailers, attach posters and backdrops, assign genres, and organize featured playlists through the Django admin portal.
        </p>
        <div className="pt-2">
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
          >
            Launch Django Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
};
