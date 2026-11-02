import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide06BestDay: React.FC<SlideProps> = ({ data }) => {
  const anova = data.weekday_performance.anova;
  const isSig = anova.p < 0.05;

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          06 &bull; Finding 1: Weekday Analysis
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Finding 1: Friday is an Industry Habit, Not an Organic Advantage
        </h2>
      </div>

      <div className="my-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-mono uppercase">Competition Share</span>
            <div className="text-3xl font-mono font-bold text-white">
              {(data.weekday_performance.release_share[4] * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-300">
              Of analyzed tracks dropped on Friday, creating peak platform competition.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-mono uppercase">ANOVA F-Statistic</span>
            <div className="text-3xl font-mono font-bold text-amber-400">
              F = {anova.F.toFixed(3)}
            </div>
            <p className="text-xs text-slate-300 font-mono">
              p-value = {anova.p.toFixed(4)} ({isSig ? 'Significant' : 'Not Significant'})
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-brand-500/30 space-y-2">
            <span className="text-xs text-brand-400 font-mono uppercase">Global Best Day</span>
            <div className="text-3xl font-mono font-bold text-brand-400">
              {data.recommendation.all_genres.best_day}
            </div>
            <p className="text-xs text-slate-300">
              Captures weekend listener traffic while escaping the Friday release congestion.
            </p>
          </div>
        </div>

        {/* Statistical Honesty Callout */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Statistical Honesty:</strong> The one-way ANOVA test reveals p = {anova.p.toFixed(4)} &ge; 0.05. Raw weekday release timing does not confer an inherent statistical lift in isolation. This is why DropClock anchors recommendations on <em>active listener presence</em> and <em>uncongested runway</em> rather than blind weekday lore.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Scientific honesty: If the data shows no raw statistical significance, we state it plainly.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide06Notes =
  "Here is our first major finding: Friday's dominance is an industry convention, not an organic listener phenomenon. Our ANOVA test shows p = " +
  "0.7164, proving that raw weekday differences are not statistically significant alone. Success requires timing the release to actual listener presence.";
