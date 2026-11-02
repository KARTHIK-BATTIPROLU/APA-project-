import React from 'react';
import { SlideProps } from './Slide01Title';

export const Slide04Datasets: React.FC<SlideProps> = ({ data }) => {
  const ds = data.meta.datasets;

  const cards = [
    {
      name: 'Spotify Most Streamed Songs 2023',
      source: 'Kaggle',
      rows: `${ds.tracks.toLocaleString()} tracks`,
      role: 'Weekday performance, ANOVA significance, 95% CIs, competition density.',
    },
    {
      name: 'Last.fm 1K User Listening Log',
      source: 'Last.fm Public Stream',
      rows: `${ds.listening_events.toLocaleString()} events`,
      role: 'Global 168-hour (7x24) listening activity matrix, smoothed via Random Forest.',
    },
    {
      name: 'Spotify Historical Daily Charts',
      source: 'Spotify Top-200 (73 Countries)',
      rows: `${ds.chart_rows.toLocaleString()} rows`,
      role: 'Genre x Weekday streaming demand index across 9 major music styles.',
    },
    {
      name: 'Sample Artist Release Catalog',
      source: 'Indie Artist Catalog',
      rows: `${ds.catalog} tracks`,
      role: 'Real-world validation template & Spearman rank correlation sanity check.',
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          04 &bull; The Datasets
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Four Datasets Synthesized into One Single Truth
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {cards.map((c, i) => (
          <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm sm:text-base">{c.name}</h3>
              <span className="font-mono text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {c.rows}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">Source: {c.source}</div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              <strong className="text-slate-200">Contribution:</strong> {c.role}
            </p>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Combining macro-level charts with micro-level scrobble logs solves the missing-timestamp challenge.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide04Notes =
  "No single public dataset provides both the release hour and the streaming outcome. By fusing Spotify's 2023 hit songs with 500,000 Last.fm user scrobble timestamps and 100,000 multi-country chart rows, we solve this data gap comprehensively.";
