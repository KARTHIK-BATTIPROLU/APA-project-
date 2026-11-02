import React from 'react';
import { TrendingDown, Clock, Users } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide02Problem: React.FC<SlideProps> = ({ data }) => {
  const friShare = data.weekday_performance.release_share[4]
    ? (data.weekday_performance.release_share[4] * 100).toFixed(1)
    : '42.0';

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
          02 &bull; The Problem
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          100,000+ tracks drop daily. Release timing is pure guesswork.
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          The music industry operates on autopilot: nearly half of all tracks flood the platform on Friday midnight, triggering catastrophic algorithmic cannibalism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 w-fit">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{friShare}% Friday Glut</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Friday captures the vast majority of releases. Indie artists compete directly with major label superstars for editorial playlist slots on the exact same morning.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-400 w-fit">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">The Zero-Hour Freeze</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Streaming recommendation algorithms rely on velocity. Dropping at the wrong hour means low initial listener momentum, causing recommendation engines to deprioritize the track.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-brand-950/50 border border-brand-500/30 text-brand-400 w-fit">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">Listener Mismatch</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Electronic music peaks on Saturday late nights, while Pop surges during evening commutes. Standardized release schedules ignore genre-specific audience lifestyle rhythms.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>The cost of a bad release slot: lost first-week algorithmic velocity.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide02Notes =
  "Every week thousands of artists release music, yet over 40% of tracks dump onto Spotify at Friday midnight. This herd behavior creates intense competition where indie artists get drowned out by major label marketing budgets before listeners even wake up.";
