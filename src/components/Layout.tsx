import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Cpu,
  BookOpen,
  Presentation,
  Menu,
  X,
  Sun,
  Moon,
  Home,
} from 'lucide-react';
import { DemoBanner } from './DemoBanner';
import { WebsiteData } from '../data/schema';

export interface LayoutProps {
  data: WebsiteData | null;
}

export const Layout: React.FC<LayoutProps> = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Toggle theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { to: '/', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { to: '/day', label: 'Best Day', icon: <Calendar className="w-4 h-4" /> },
    { to: '/time', label: 'Best Time', icon: <Clock className="w-4 h-4" /> },
    { to: '/genre', label: 'Genre Explorer', icon: <Layers className="w-4 h-4" /> },
    { to: '/advisor', label: 'Advisor', icon: <Sparkles className="w-4 h-4 text-brand-400" />, highlight: true },
    { to: '/models', label: 'Models', icon: <Cpu className="w-4 h-4" /> },
    { to: '/methodology', label: 'Methodology', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/pitch', label: 'Pitch Deck', icon: <Presentation className="w-4 h-4" /> },
  ];

  // If on /pitch, pitch deck handles its own full-screen presentation, but if rendered in layout or deep link:
  const isPitchPage = location.pathname.startsWith('/pitch');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f14] text-slate-100 font-sans selection:bg-brand-500 selection:text-black">
      {/* Demo Banner */}
      {data && <DemoBanner synthetic={data.meta.synthetic_inputs} />}

      {/* Sticky Navigation */}
      {!isPitchPage && (
        <header className="sticky top-0 z-40 bg-[#0e141b]/95 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo */}
              <Link
                to="/"
                className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
                aria-label="DropClock Homepage"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight text-lg text-white flex items-center gap-1">
                    DropClock
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 ml-1">
                      Advisor
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-400 -mt-1 font-mono">
                    Release-Window Intelligence
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                          : item.highlight
                          ? 'text-brand-300 hover:text-brand-200 hover:bg-slate-800/60'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Header Right Controls */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-800 bg-[#0e141b] px-4 pt-3 pb-5 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Global Footer */}
      {!isPitchPage && (
        <footer className="border-t border-slate-800 bg-[#090d12] mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-300">DropClock</span>
                <span>&bull;</span>
                <span>Music Release-Window Advisor</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-400">
                  {data ? `${data.meta.datasets.tracks} tracks | ${data.meta.datasets.listening_events.toLocaleString()} events` : ''}
                </span>
              </div>

              <div className="text-center md:text-right text-slate-400">
                Data sources: Spotify Most Streamed Songs 2023 (Kaggle), Last.fm 1K User Listening Log, Spotify Historical Daily Charts.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
