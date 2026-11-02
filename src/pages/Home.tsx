import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Presentation,
  Calendar,
  Clock,
  Music2,
  Database,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { WebsiteData } from '../data/schema';
import { KpiCard } from '../components/KpiCard';
import { Heatmap } from '../components/Heatmap';

export interface HomeProps {
  data: WebsiteData;
}

export const Home: React.FC<HomeProps> = ({ data }) => {
  const { meta, recommendation, models, release_score_by_genre } = data;
  const genreRec = recommendation.genre;
  const allRec = recommendation.all_genres;

  const defaultGenre = meta.default_genre;
  const heatmapData = release_score_by_genre[defaultGenre] || data.release_score_all;

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131d27] via-[#0f1720] to-[#0b0f14] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimal Release Window Recommendation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Release on{' '}
            <span className="text-brand-400 underline decoration-brand-500/50 decoration-wavy underline-offset-8">
              {genreRec.best_day}
            </span>{' '}
            at{' '}
            <span className="text-brand-400">
              {String(genreRec.best_hour).padStart(2, '0')}:00
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            For <strong className="text-white font-semibold">{genreRec.name}</strong>, publishing at{' '}
            <strong className="text-brand-300">{genreRec.best_day} {String(genreRec.best_hour).padStart(2, '0')}:00</strong> captures peak weekend listener momentum while avoiding Friday release congestion. Go live 1–2 hours before prime time so algorithmic playlists index your track before the audience arrives.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/advisor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Interactive Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/pitch"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm sm:text-base tracking-wide transition-all border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Presentation className="w-4 h-4 text-slate-300" />
              <span>View Pitch Deck</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section aria-label="Key Performance Indicators">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <span>Executive Summary & Metrics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Best Day"
            value={genreRec.best_day}
            subvalue={`${genreRec.name} prime-time peak`}
            badge="Top Day"
            icon={<Calendar className="w-4 h-4 text-brand-400" />}
            variant="accent"
          />

          <KpiCard
            label="Best Hour"
            value={`${String(genreRec.best_hour).padStart(2, '0')}:00`}
            subvalue="Target local audience time"
            badge="Peak Hour"
            icon={<Clock className="w-4 h-4 text-brand-400" />}
            variant="accent"
          />

          <KpiCard
            label="All Genres Slot"
            value={`${allRec.best_day} ${String(allRec.best_hour).padStart(2, '0')}:00`}
            subvalue="Global multi-genre peak"
            icon={<Award className="w-4 h-4 text-slate-400" />}
          />

          <KpiCard
            label="Target Genre"
            value={genreRec.name}
            subvalue="Analyzed demand curve"
            icon={<Music2 className="w-4 h-4 text-slate-400" />}
          />

          <KpiCard
            label="Model R²"
            value={models.release_day.R2.toFixed(3)}
            subvalue="RF release-day fit (log streams)"
            badge="Random Forest"
            icon={<TrendingUp className="w-4 h-4 text-slate-400" />}
          />

          <KpiCard
            label="Datasets Analysed"
            value={(meta.datasets.tracks + meta.datasets.listening_events + meta.datasets.chart_rows).toLocaleString()}
            subvalue={`${meta.datasets.tracks} tracks, ${meta.datasets.listening_events.toLocaleString()} events`}
            badge="4 Datasets"
            icon={<Database className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </section>

      {/* Release-Score Heatmap Preview */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>168-Hour Release Score Landscape</span>
              <span className="text-xs font-mono font-medium text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                {defaultGenre}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Intensity matrix combining listener activity (50%), historical release performance (30%), and low competition (20%).
            </p>
          </div>

          <Link
            to="/time"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
          >
            <span>Explore 24h curve</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <Heatmap
          data={heatmapData}
          rowLabels={meta.days}
          colLabels={meta.hours.map((h) => `${h}`)}
          title={`Release Score Intensity (${defaultGenre})`}
          subtitle="Hours 0–23 (X) across Mon–Sun (Y). Lighter green denotes higher release suitability."
          palette="sequential"
          peakCell={{
            row: meta.days.indexOf(genreRec.best_day),
            col: genreRec.best_hour,
          }}
          legendLabel="Release Score"
        />
      </section>
    </div>
  );
};
