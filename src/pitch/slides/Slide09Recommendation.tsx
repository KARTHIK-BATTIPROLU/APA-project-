import React from 'react';
import { Award, Flame } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide09Recommendation: React.FC<SlideProps> = ({ data }) => {
  const { recommendation, top_windows_all } = data;
  const genreRec = recommendation.genre;

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          09 &bull; Actionable Recommendation
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          The Prescriptive Release Recommendation
        </h2>
      </div>

      <div className="my-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Big Recommendation Card */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-900 border border-brand-500/50 space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500 text-black font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Optimal Release Window</span>
          </div>

          <div className="text-3xl sm:text-5xl font-black text-white leading-tight font-mono">
            Release <span className="text-brand-400">{genreRec.name}</span> on{' '}
            <span className="text-brand-400">{genreRec.best_day}</span> at{' '}
            <span className="text-brand-400">{String(genreRec.best_hour).padStart(2, '0')}:00</span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-brand-500/30 text-xs sm:text-sm text-brand-200 leading-relaxed">
            <strong>Action Rule:</strong> Push live 1–2 hours earlier (at{' '}
            {String(Math.max(0, genreRec.best_hour - 2)).padStart(2, '0')}:00–
            {String(Math.max(0, genreRec.best_hour - 1)).padStart(2, '0')}:00) to ensure playlist feeds and recommendation caches populate before listener volume peaks.
          </div>
        </div>

        {/* Top 5 Windows */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-brand-400 font-bold">
            <Flame className="w-4 h-4" />
            <span>Top 5 Global Slots</span>
          </div>

          <div className="space-y-1.5">
            {top_windows_all.slice(0, 5).map((w, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{w.Day} {w.Hour}</span>
                </div>
                <span className="text-brand-400 font-bold">{w.Score.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Prime-time calculations evaluate sustained multi-hour listener engagement.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide09Notes =
  "Our headline recommendation for " +
  "Pop is to release on Saturday at 19:00, going live 1 to 2 hours earlier. This window provides the best mathematical trade-off across listener volume, low competition, and algorithmic momentum.";
