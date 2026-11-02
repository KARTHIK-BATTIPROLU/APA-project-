import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide11Limitations: React.FC<SlideProps> = ({ data }) => {
  const { limitations } = data;

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
          11 &bull; Analytical Limitations
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Known Limitations & The Real-Data Validation Path
        </h2>
      </div>

      <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Limitations from limitations[] */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Current Analytical Boundaries</h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            {limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded bg-black/40 border border-slate-800">
                <span className="font-mono text-amber-400 font-bold text-[11px] mt-0.5">{idx + 1}.</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: What real-world API data changes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-brand-500/30 space-y-3">
          <div className="flex items-center gap-2 text-brand-400">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">What Direct Artist Data Adds</h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 font-sans">
            <div className="p-2.5 rounded bg-black/40 border border-slate-800 space-y-1">
              <strong className="text-white block font-mono">1. Native Release Timestamps</strong>
              <span>Replaces Last.fm proxy activity with exact hour-by-hour Spotify listener streams.</span>
            </div>
            <div className="p-2.5 rounded bg-black/40 border border-slate-800 space-y-1">
              <strong className="text-white block font-mono">2. Micro-Market Timezones</strong>
              <span>Maps localized release windows per territory (e.g. US West vs Berlin vs Tokyo).</span>
            </div>
            <div className="p-2.5 rounded bg-black/40 border border-slate-800 space-y-1">
              <strong className="text-white block font-mono">3. Controlled A/B Releases</strong>
              <span>Runs live parallel release experiments on sister tracks to isolate causal timing impact.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Transparent modeling builds credibility and prepares the groundwork for live partner data.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide11Notes =
  "Every serious data product must acknowledge its constraints. Our primary limitation is that public Spotify data lacks release hour stamps, requiring a proxy from Last.fm. Direct Spotify for Artists API access will validate these findings at scale.";
