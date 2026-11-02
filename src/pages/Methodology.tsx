import React from 'react';
import {
  Database,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Workflow,
} from 'lucide-react';
import { WebsiteData } from '../data/schema';

export interface MethodologyProps {
  data: WebsiteData;
}

export const Methodology: React.FC<MethodologyProps> = ({ data }) => {
  const { meta, robustness, limitations } = data;
  const datasets = meta.datasets;

  const datasetCards = [
    {
      title: 'Spotify Most Streamed Songs 2023',
      source: 'Kaggle (Spotify Top Hits)',
      rows: `${datasets.tracks.toLocaleString()} tracks`,
      role: 'Weekday performance, log-streams ANOVA, 95% CIs, adjusted weekday effects via Random Forest what-if counterfactuals, and competition density.',
      limitation: 'No release hour timestamp; no genre column; cumulative streams reflect track age.',
    },
    {
      title: 'Last.fm 1K User Listening Log',
      source: 'Last.fm Public Dataset',
      rows: `${datasets.listening_events.toLocaleString()} events`,
      role: 'Global 168-hour (7 days × 24 h) circadian listener activity matrix, smoothed with Random Forest Regressor.',
      limitation: 'Last.fm user demographic skews more enthusiast/desktop compared to global mobile streaming audience.',
    },
    {
      title: 'Spotify Historical Daily Charts',
      source: 'Spotify Daily Top-200 (73 Countries)',
      rows: `${datasets.chart_rows.toLocaleString()} rows`,
      role: 'Cross-genre weekday demand index (9 genres × 7 days) capturing weekend/weekday listening divergence.',
      limitation: 'Top-200 tracks only; subject to survivor bias toward established major-label hits.',
    },
    {
      title: 'Sample Artist Release Catalog',
      source: 'Representative Indie Label Catalog',
      rows: `${datasets.catalog} tracks`,
      role: 'Directional sanity check and validation template for custom user catalog uploads and Spearman correlation.',
      limitation: 'Small sample size (n = 22); treat as directional validation rather than population truth.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Methodology & Analytical Pipeline</span>
          <span className="text-xs font-mono font-medium bg-brand-500/10 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full">
            Transparent Science
          </span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          How DropClock synthesizes four disparate streaming datasets into an actionable release recommendation while honoring statistical uncertainty.
        </p>
      </div>

      {/* End-to-End Pipeline Diagram */}
      <section className="bg-[#121820] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-bold text-white">End-to-End Data Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 font-mono text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-brand-400 font-bold mb-2">01 &bull; Ingestion</span>
            <p className="text-slate-300 font-sans text-xs">
              Load 4 datasets: Spotify tracks, Last.fm events, Top-200 charts, and sample catalog.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-brand-400 font-bold mb-2">02 &bull; Hygiene</span>
            <p className="text-slate-300 font-sans text-xs">
              Coerce streams to numeric, drop corrupt row (BPM110KeyA...), remove duplicates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-brand-400 font-bold mb-2">03 &bull; Features</span>
            <p className="text-slate-300 font-sans text-xs">
              Extract cyclical sin/cos hour encodings, compute track age, label encode factors.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-brand-400 font-bold mb-2">04 &bull; Random Forest</span>
            <p className="text-slate-300 font-sans text-xs">
              Smooth 168h activity curve + predict counterfactual release-day log-streams.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-brand-400 font-bold mb-2">05 &bull; Composite Score</span>
            <p className="text-slate-300 font-sans text-xs">
              Combine activity, day performance, and inverse competition into 7x24 matrix.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/40 flex flex-col justify-between">
            <span className="text-brand-300 font-bold mb-2">06 &bull; DropClock</span>
            <p className="text-slate-200 font-sans text-xs font-medium">
              Interactive Advisor, timezone converter, prime-time ranker & built-in pitch deck.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Dataset Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-400" />
          <span>The Four Contributing Datasets</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasetCards.map((ds, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#121820] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{ds.title}</h3>
                  <span className="font-mono text-xs text-brand-400 px-2.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                    {ds.rows}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mb-3">{ds.source}</div>
                <div className="text-xs text-slate-300 leading-relaxed mb-3">
                  <strong className="text-slate-200">Role:</strong> {ds.role}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] text-amber-300/90 leading-relaxed">
                <strong>Limitation:</strong> {ds.limitation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formula & Weight Rationale */}
      <section className="bg-[#121820] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Release Score Mathematical Formula</h2>
          <p className="text-xs text-slate-300">
            Computed across all 168 hours of the week for a given genre $g$, weekday $d \in [0..6]$, and hour $h \in [0..23]$:
          </p>
        </div>

        <div className="p-4 rounded-xl bg-black/60 border border-brand-500/30 text-brand-300 font-mono text-sm sm:text-base text-center overflow-x-auto">
          Release_Score(d, h) = 0.50 &times; S_activity(d, h) + 0.30 &times; S_day_performance(d) + 0.20 &times; (1 &minus; S_competition(d))
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Sliders className="w-4 h-4" />
            <span>Weight Rationale (Explicit Modelling Assumption):</span>
          </div>
          <p>
            The 50 / 30 / 20 weighting is an empirical assumption reflecting marketing reality:
            listener availability has the highest immediate ceiling effect (50%); day performance reflects macro consumer listening modes (30%); and avoiding peak release competition (20%) prevents algorithmic burial during Friday catalog surges.
          </p>
        </div>

        {/* Robustness Panel */}
        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Robustness Sensitivity Analysis ({robustness.combos_tested} Weight Combinations Tested)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            We systematically swept activity weight from 0.20 to 0.80 and day performance from 0.10 to 0.60 across all feasible permutations. Winning day frequency:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(robustness.best_day_frequency).map(([day, share]) => (
              <div
                key={day}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <span className="text-slate-300 font-bold">{day}</span>
                <span className="text-brand-400 font-extrabold text-sm">
                  {(Number(share) * 100).toFixed(1)}% of combos
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations List */}
      <section className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">Documented Analytical Limitations</h2>
        </div>
        <p className="text-xs text-slate-400">
          To maintain scientific integrity, all recommendations must be evaluated within these known analytical boundaries:
        </p>

        <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-300">
          {limitations.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-red-900/20">
              <span className="w-5 h-5 rounded-full bg-red-900/50 text-red-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
