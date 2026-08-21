import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MapPin, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-8 min-h-[80vh]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Get in <span className="text-rose-500">Touch</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Have questions about the platform or want to suggest new titles? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Filmora Media Labs</h3>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>support@filmora-cinema.local</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>+1 (555) 019-2834</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>San Francisco, CA • Streaming HQ</span>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">API Documentation</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Filmora REST API endpoints are public and queryable with cross-origin resource sharing support.
            </p>
            <a
              href="http://localhost:8000/api/movies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-block"
            >
              Explore API Endpoints &rarr;
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. Our support team will get back to your query shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-slate-700/70 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-slate-700/70 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Movie suggestion or feedback"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-slate-700/70 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your thoughts..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-slate-700/70 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
