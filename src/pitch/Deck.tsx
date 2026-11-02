import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Grid,
  FileText,
  Printer,
  X,
  Home,
} from 'lucide-react';
import { WebsiteData } from '../data/schema';
import { Slide01Title, slide01Notes } from './slides/Slide01Title';
import { Slide02Problem, slide02Notes } from './slides/Slide02Problem';
import { Slide03Question, slide03Notes } from './slides/Slide03Question';
import { Slide04Datasets, slide04Notes } from './slides/Slide04Datasets';
import { Slide05Method, slide05Notes } from './slides/Slide05Method';
import { Slide06BestDay, slide06Notes } from './slides/Slide06BestDay';
import { Slide07BestTime, slide07Notes } from './slides/Slide07BestTime';
import { Slide08Genre, slide08Notes } from './slides/Slide08Genre';
import { Slide09Recommendation, slide09Notes } from './slides/Slide09Recommendation';
import { Slide10Robustness, slide10Notes } from './slides/Slide10Robustness';
import { Slide11Limitations, slide11Notes } from './slides/Slide11Limitations';
import { Slide12Demo, slide12Notes } from './slides/Slide12Demo';
import { Slide13NextSteps, slide13Notes } from './slides/Slide13NextSteps';
import { Slide14QA, slide14Notes } from './slides/Slide14QA';

export interface DeckProps {
  data: WebsiteData;
}

interface SlideItem {
  id: number;
  title: string;
  component: React.ComponentType<{ data: WebsiteData }>;
  notes: string;
}

export const Deck: React.FC<DeckProps> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const deckContainerRef = useRef<HTMLDivElement | null>(null);

  const SLIDES: SlideItem[] = [
    { id: 1, title: 'Title & Vision', component: Slide01Title, notes: slide01Notes },
    { id: 2, title: 'The Problem: Release Timing', component: Slide02Problem, notes: slide02Notes },
    { id: 3, title: 'Our Core Question', component: Slide03Question, notes: slide03Notes },
    { id: 4, title: 'The 4 Datasets', component: Slide04Datasets, notes: slide04Notes },
    { id: 5, title: 'Methodology & Formula', component: Slide05Method, notes: slide05Notes },
    { id: 6, title: 'Finding 1: Best Day', component: Slide06BestDay, notes: slide06Notes },
    { id: 7, title: 'Finding 2: Best Time', component: Slide07BestTime, notes: slide07Notes },
    { id: 8, title: 'Finding 3: Genre Context', component: Slide08Genre, notes: slide08Notes },
    { id: 9, title: 'The Recommendation', component: Slide09Recommendation, notes: slide09Notes },
    { id: 10, title: 'Model Robustness', component: Slide10Robustness, notes: slide10Notes },
    { id: 11, title: 'Limitations', component: Slide11Limitations, notes: slide11Notes },
    { id: 12, title: 'Product Demo', component: Slide12Demo, notes: slide12Notes },
    { id: 13, title: 'Roadmap & Ask', component: Slide13NextSteps, notes: slide13Notes },
    { id: 14, title: 'Thank You & Q&A', component: Slide14QA, notes: slide14Notes },
  ];

  // Parse slide number from hash, e.g. #3 -> index 2
  const getIndexFromHash = useCallback((): number => {
    const hash = location.hash.replace('#', '');
    const num = parseInt(hash, 10);
    if (!isNaN(num) && num >= 1 && num <= SLIDES.length) {
      return num - 1;
    }
    return 0;
  }, [location.hash, SLIDES.length]);

  const [currentIndex, setCurrentIndex] = useState<number>(getIndexFromHash);
  const [showNotes, setShowNotes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync hash when currentIndex changes
  const goToSlide = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(SLIDES.length - 1, index));
      setCurrentIndex(target);
      navigate(`/pitch#${target + 1}`, { replace: true });
    },
    [navigate, SLIDES.length]
  );

  // Sync hash if URL hash changes externally
  useEffect(() => {
    const idx = getIndexFromHash();
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  }, [location.hash, getIndexFromHash, currentIndex]);

  const nextSlide = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide, SLIDES.length]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      deckContainerRef.current?.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'j':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
        case 'k':
          e.preventDefault();
          prevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setShowNotes((v) => !v);
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setShowGrid((v) => !v);
          break;
        case 'Escape':
          if (showGrid) setShowGrid(false);
          if (showNotes) setShowNotes(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, showGrid, showNotes]);

  // Touch Swipe navigation
  const touchStartRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartRef.current;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
    touchStartRef.current = null;
  };

  const currentSlide = SLIDES[currentIndex];
  const CurrentSlideComponent = currentSlide.component;
  const progressPercent = ((currentIndex + 1) / SLIDES.length) * 100;

  return (
    <div
      ref={deckContainerRef}
      className="relative w-full h-screen bg-[#070b0f] text-slate-100 flex flex-col justify-between overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Print View: renders every slide sequentially with CSS page-breaks */}
      <div className="hidden print:block w-full">
        {SLIDES.map((s) => {
          const Comp = s.component;
          return (
            <div
              key={s.id}
              className="w-full h-screen page-break-always break-after-page flex flex-col justify-between p-8 bg-[#0c1219] text-white"
            >
              <Comp data={data} />
              {data.meta.synthetic_inputs && (
                <div className="text-[10px] text-amber-400 font-mono text-center pt-2 border-t border-slate-800">
                  Demo data: synthetic stand-ins with the real schemas.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Screen Presentation View */}
      <div className="print:hidden flex flex-col h-full justify-between">
        {/* Top Header & Controls */}
        <div className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-[#0a0e14]/90 backdrop-blur-md border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Return to Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <span className="text-slate-400 hidden sm:inline">&bull;</span>
            <span className="font-bold text-white">
              Slide {currentIndex + 1} of {SLIDES.length}
            </span>
            <span className="text-slate-400 hidden md:inline truncate max-w-xs">
              : {currentSlide.title}
            </span>
          </div>

          {/* Quick Action Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                showNotes
                  ? 'bg-brand-500 text-black font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Speaker Notes (N)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes</span>
              <kbd className="text-[10px] px-1 bg-black/30 rounded ml-0.5">N</kbd>
            </button>

            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                showGrid
                  ? 'bg-brand-500 text-black font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Slide Grid Overview (G)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
              <kbd className="text-[10px] px-1 bg-black/30 rounded ml-0.5">G</kbd>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <kbd className="text-[10px] px-1 bg-black/30 rounded hidden sm:inline ml-0.5">F</kbd>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print PDF</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-900">
          <div
            className="h-full bg-brand-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Active Slide Stage (16:9 Aspect Ratio Container) */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-6xl aspect-[16/9] max-h-full rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-[#0c1219]">
            <CurrentSlideComponent data={data} />

            {/* Persistent Demo Data Footer inside slide if synthetic */}
            {data.meta.synthetic_inputs && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300">
                Demo data: synthetic stand-ins
              </div>
            )}
          </div>

          {/* Floating Slide Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-brand-500 hover:text-black border border-slate-700 text-slate-300 transition-all disabled:opacity-20 disabled:hover:bg-slate-900/80 disabled:hover:text-slate-300 shadow-xl"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentIndex === SLIDES.length - 1}
            className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-brand-500 hover:text-black border border-slate-700 text-slate-300 transition-all disabled:opacity-20 disabled:hover:bg-slate-900/80 disabled:hover:text-slate-300 shadow-xl"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Speaker Notes Drawer */}
        {showNotes && (
          <div className="relative z-30 p-4 bg-slate-950/95 border-t border-brand-500/30 backdrop-blur-md max-h-40 overflow-y-auto">
            <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase text-brand-400">
                  Speaker Notes (Slide {currentIndex + 1}: {currentSlide.title})
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {currentSlide.notes}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close Speaker Notes"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Slide Grid Modal (Triggered by 'G') */}
        {showGrid && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 max-w-6xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-bold text-white">Slide Navigator (14 Slides)</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGrid(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                aria-label="Close Grid"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6 max-w-6xl mx-auto w-full">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    goToSlide(idx);
                    setShowGrid(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    idx === currentIndex
                      ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                    <span className="text-brand-400 font-bold">{idx + 1}</span>
                    <span className="text-[10px] text-slate-400">16:9</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {slide.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
