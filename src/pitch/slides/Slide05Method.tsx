import React from 'react';
import { SlideProps } from './Slide01Title';

export const Slide05Method: React.FC<SlideProps> = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          05 &bull; Analytical Methodology
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Machine Learning Pipeline & Composite Scoring Formula
        </h2>
      </div>

      <div className="my-auto space-y-6">
        {/* Pipeline steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-brand-400 font-bold">1. Cleaning</span>
            <p className="text-slate-300 font-sans text-xs">
              Drop corrupt string entries, handle missing attributes, coerce log-transformed stream targets.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-brand-400 font-bold">2. Feature Eng.</span>
            <p className="text-slate-300 font-sans text-xs">
              Harmonic sin/cos hour cycles, track age normalizers, playlist reach control variables.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-brand-400 font-bold">3. Random Forest</span>
            <p className="text-slate-300 font-sans text-xs">
              Train 100-tree ensemble to smooth circadian activity and extract residual weekday lifts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-brand-400 font-bold">4. Scoring</span>
            <p className="text-slate-300 font-sans text-xs">
              Triangulate listener activity, day performance, and competition into a 168h matrix.
            </p>
          </div>
        </div>

        {/* Formula Box */}
        <div className="p-5 rounded-2xl bg-black/60 border border-brand-500/40 text-center space-y-2">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">
            The Release Score Formula
          </span>
          <div className="text-base sm:text-xl font-mono font-bold text-white">
            Release_Score(d, h) = 0.50 &times; S_activity(d, h) + 0.30 &times; S_day_performance(d) + 0.20 &times; (1 &minus; S_competition(d))
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Prime-time ranking evaluates the mean of the top 5 hours per day to ensure stable, sustained velocity.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Weights are transparent and fully adjustable on the client in real time.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide05Notes =
  "Our methodology uses Random Forest regression to remove scrobble noise while controlling for playlist placement and track age. The composite score weights listener presence at 50%, proven weekday performance at 30%, and low competition at 20%.";
