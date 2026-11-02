import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Sliders, Globe, ArrowRight } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide12Demo: React.FC<SlideProps> = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          12 &bull; Interactive Product
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Live Product Demo: The Interactive Advisor
        </h2>
      </div>

      <div className="my-auto max-w-4xl w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#121820] border border-brand-500/40 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>DropClock Release Advisor Web App</span>
            </h3>
            <p className="text-xs text-slate-300">
              Try live sliders, custom timezones, and in-browser CSV catalog scoring.
            </p>
          </div>

          <Link
            to="/advisor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-brand-500/25"
          >
            <span>Try It Live</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <div className="text-brand-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Dynamic Weights</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Sliders rebalance automatically to 100% while recalculating the 168h matrix client-side.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <div className="text-brand-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Timezone Engine</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Translates peak audience time into artist studio local time with circular 24h & 7-day wrap.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <div className="text-brand-400 font-bold">In-Browser CSV</div>
            <p className="text-slate-400 font-sans text-xs">
              Upload release catalogs to calculate client-side Spearman rank correlations against model scores.
            </p>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Static, privacy-preserving, zero-backend architecture.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide12Notes =
  "Here is our live product in action. The web interface lets artists and label managers experiment with weights, adjust timezones, and even upload their own catalog to see if their past releases aligned with optimal windows.";
