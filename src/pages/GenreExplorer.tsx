import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Music2, Calendar, Award, Flame } from 'lucide-react';
import { WebsiteData } from '../data/schema';
import { GenreSelect } from '../components/GenreSelect';
import { Heatmap } from '../components/Heatmap';
import { ChartCard } from '../components/ChartCard';
import { ColumnDef } from '../components/AccessibleTable';
import { findBestRecommendation } from '../data/scoring';

export interface GenreExplorerProps {
  data: WebsiteData;
}

export const GenreExplorer: React.FC<GenreExplorerProps> = ({ data }) => {
  const { meta, genre_weekday_index, best_day_by_genre, release_score_by_genre } = data;
  const genres = Object.keys(genre_weekday_index).sort();
  const days = meta.days;

  const [selectedGenre, setSelectedGenre] = useState<string>(
    genres.includes(meta.default_genre) ? meta.default_genre : genres[0]
  );

  // Data for 9x7 diverging heatmap: rows are genres, cols are days
  const genreHeatmapData = genres.map((g) => genre_weekday_index[g]);

  // Selected genre demand index
  const selectedDemandSeries = genre_weekday_index[selectedGenre] || [1, 1, 1, 1, 1, 1, 1];
  const demandChartData = days.map((day, i) => ({
    day,
    index: selectedDemandSeries[i],
    relativePct: Number(((selectedDemandSeries[i] - 1.0) * 100).toFixed(1)),
  }));

  // Selected genre release-score matrix & recommendation
  const genreMatrix = release_score_by_genre[selectedGenre] || data.release_score_all;
  const rec = findBestRecommendation(genreMatrix, 5, 5);

  const demandTableColumns: ColumnDef<typeof demandChartData[0]>[] = [
    { key: 'day', header: 'Weekday', align: 'left' },
    {
      key: 'index',
      header: 'Demand Index (1.00 = Avg)',
      align: 'right',
      render: (r) => r.index.toFixed(3),
    },
    {
      key: 'relativePct',
      header: 'Difference from Mean (%)',
      align: 'right',
      render: (r) => (r.relativePct > 0 ? `+${r.relativePct}%` : `${r.relativePct}%`),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Genre Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Genre Explorer</span>
            <span className="text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
              9 Target Genres
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Historical chart demand varies sharply by musical style. Explore genre-specific listening habits and optimal drop windows.
          </p>
        </div>

        <GenreSelect
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          label="Active Genre"
        />
      </div>

      {/* Genre Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#131b24] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-brand-500/20 text-brand-400">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Selected Genre
            </span>
            <div className="text-xl font-bold text-white">{selectedGenre}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b24] border border-brand-500/30 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-brand-500/20 text-brand-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Best Day for {selectedGenre}
            </span>
            <div className="text-xl font-bold text-brand-400">
              {best_day_by_genre[selectedGenre] || rec.bestDay}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b24] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-brand-500/20 text-brand-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Prime Peak Window
            </span>
            <div className="text-xl font-bold text-white font-mono">
              {rec.bestDay} at {rec.bestHourFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* Demand Index Bar Chart */}
      <div>
        <ChartCard
          title={`${selectedGenre}: Weekday Streaming Demand Index`}
          subtitle="Relative demand index from Spotify historical charts (1.00 represents that genre's baseline average day)"
          sourceText={`Source: Spotify Historical Daily Charts (73 countries, Top-200), n = ${meta.datasets.chart_rows.toLocaleString()}`}
          tableData={demandChartData}
          tableColumns={demandTableColumns}
          tableCaption={`${selectedGenre} Weekday Streaming Demand Index`}
        >
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis domain={['auto', 'auto']} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '1.00 Baseline', fill: '#f87171', position: 'right' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1720',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(val: any) => [
                    `${Number(val).toFixed(3)} (${Number(val) >= 1 ? '+' : ''}${((Number(val) - 1) * 100).toFixed(1)}%)`,
                    'Demand Index',
                  ]}
                />
                <Bar dataKey="index" fill="#1DB954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Selected Genre 7x24 Heatmap + Top 5 Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Heatmap
            data={genreMatrix}
            rowLabels={days}
            colLabels={meta.hours.map((h) => `${h}`)}
            title={`Release Score Heatmap (${selectedGenre})`}
            subtitle="7x24 composite release score. Peak cell highlighted."
            palette="sequential"
            peakCell={{ row: rec.bestDayIndex, col: rec.bestHour }}
            legendLabel="Score"
            ariaLabel={`${selectedGenre} Release Score Heatmap`}
          />
        </div>

        {/* Top 5 Windows List */}
        <div className="bg-[#121820] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Top 5 Drop Windows</h3>
          </div>
          <p className="text-xs text-slate-400">
            Ranked highest scoring 1-hour slots for {selectedGenre}:
          </p>

          <ol className="space-y-2.5 font-mono text-xs">
            {rec.topWindows.map((slot, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-brand-950/30 border-brand-500/40 text-brand-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      idx === 0
                        ? 'bg-brand-500 text-black font-extrabold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>
                    {slot.day} at {slot.hourFormatted}
                  </span>
                </div>
                <span className="text-brand-400 font-extrabold">{slot.score.toFixed(3)}</span>
              </li>
            ))}
          </ol>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
            Recommended 3-hour cluster: <strong className="text-white font-mono">{rec.best3HourWindow.join(', ')}</strong> on {rec.bestDay}.
          </div>
        </div>
      </div>

      {/* 9x7 Diverging Heatmap: All Genres x Weekday Index */}
      <div className="pt-4">
        <Heatmap
          data={genreHeatmapData}
          rowLabels={genres}
          colLabels={days}
          title="9 × 7 Genre × Weekday Demand Index (Historical Charts)"
          subtitle="Diverging scale centered on 1.00 (slate neutral). Green represents above-average demand; rose/coral indicates below-average demand."
          palette="diverging"
          divergingCenter={1.0}
          minValue={0.85}
          maxValue={1.25}
          cellWidth={48}
          cellHeight={32}
          valueFormatter={(v) => v.toFixed(3)}
          legendLabel="Demand Index"
          ariaLabel="Genre by Weekday Demand Index Heatmap"
        />
      </div>
    </div>
  );
};
