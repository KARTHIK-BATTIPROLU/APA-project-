import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ErrorBar,
} from 'recharts';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { WebsiteData } from '../data/schema';
import { ChartCard } from '../components/ChartCard';
import { ColumnDef } from '../components/AccessibleTable';

export interface BestDayProps {
  data: WebsiteData;
}

export const BestDay: React.FC<BestDayProps> = ({ data }) => {
  const { meta, weekday_performance } = data;
  const days = meta.days;

  // Prepare data for competition chart
  const competitionData = days.map((day, i) => ({
    day,
    releases: weekday_performance.releases[i],
    release_share: Number((weekday_performance.release_share[i] * 100).toFixed(1)),
    median_streams: weekday_performance.median_streams_millions[i],
  }));

  // Prepare data for raw log-streams chart with 95% CI
  const streamData = days.map((day, i) => ({
    day,
    mean_log_streams: weekday_performance.mean_log_streams[i],
    ci95: weekday_performance.ci95[i],
    lower_ci: Number((weekday_performance.mean_log_streams[i] - weekday_performance.ci95[i]).toFixed(3)),
    upper_ci: Number((weekday_performance.mean_log_streams[i] + weekday_performance.ci95[i]).toFixed(3)),
  }));

  // Prepare data for adjusted effect chart with CI
  const adjustedData = days.map((day, i) => ({
    day,
    adjusted_effect: weekday_performance.adjusted_effect[i],
    adjusted_ci95: weekday_performance.adjusted_ci95[i],
    lower_adj: Number((weekday_performance.adjusted_effect[i] - weekday_performance.adjusted_ci95[i]).toFixed(3)),
    upper_adj: Number((weekday_performance.adjusted_effect[i] + weekday_performance.adjusted_ci95[i]).toFixed(3)),
  }));

  // Columns for Accessible Tables
  const compColumns: ColumnDef<typeof competitionData[0]>[] = [
    { key: 'day', header: 'Weekday', align: 'left' },
    { key: 'releases', header: 'Total Releases (Tracks)', align: 'right' },
    {
      key: 'release_share',
      header: 'Market Share (%)',
      align: 'right',
      render: (r) => `${r.release_share}%`,
    },
    {
      key: 'median_streams',
      header: 'Median Streams (M)',
      align: 'right',
      render: (r) => `${r.median_streams}M`,
    },
  ];

  const streamColumns: ColumnDef<typeof streamData[0]>[] = [
    { key: 'day', header: 'Weekday', align: 'left' },
    { key: 'mean_log_streams', header: 'Mean log(streams)', align: 'right' },
    { key: 'ci95', header: '95% Confidence Interval (±)', align: 'right' },
    {
      key: 'range',
      header: '95% CI Range',
      align: 'right',
      render: (r) => `[${r.lower_ci}, ${r.upper_ci}]`,
    },
  ];

  const adjColumns: ColumnDef<typeof adjustedData[0]>[] = [
    { key: 'day', header: 'Weekday', align: 'left' },
    {
      key: 'adjusted_effect',
      header: 'Adjusted Effect (log scale)',
      align: 'right',
      render: (r) => (r.adjusted_effect > 0 ? `+${r.adjusted_effect}` : `${r.adjusted_effect}`),
    },
    { key: 'adjusted_ci95', header: 'Adjusted 95% CI (±)', align: 'right' },
    {
      key: 'range',
      header: 'Adjusted Range',
      align: 'right',
      render: (r) => `[${r.lower_adj}, ${r.upper_adj}]`,
    },
  ];

  const anova = weekday_performance.anova;
  const isSignificant = anova.p < 0.05;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Best Day: Weekday Streaming Performance</span>
          <span className="text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
            N = {meta.datasets.tracks} Tracks
          </span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Industry convention concentrates drops on Friday. We evaluate raw streams, competition density, and residual weekday effects after controlling for playlist inclusion, chart appearances, and track age.
        </p>
      </div>

      {/* Statistical Rigor & ANOVA Callout */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
          isSignificant
            ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
            : 'bg-amber-950/20 border-amber-600/40 text-amber-200'
        }`}
      >
        <div className="shrink-0 p-2.5 rounded-lg bg-black/40 border border-current/20">
          {isSignificant ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-400" />
          )}
        </div>
        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-white mb-1">
            <span>One-Way ANOVA Test:</span>
            <span className="text-brand-400">F = {anova.F.toFixed(3)}</span>
            <span>&bull;</span>
            <span className="text-brand-400">p = {anova.p.toFixed(4)}</span>
          </div>
          {isSignificant ? (
            <p className="text-emerald-300">
              The raw weekday difference is statistically significant (p &lt; 0.05), indicating meaningful divergence in unadjusted stream counts.
            </p>
          ) : (
            <p className="text-amber-200/90">
              <strong>The raw weekday effect is NOT statistically significant</strong> (F = {anova.F.toFixed(3)}, p = {anova.p.toFixed(4)} &ge; 0.05). Unadjusted stream counts alone do not justify choosing one day over another. Therefore, our model leans heavily on <strong>audience activity timing (50%)</strong> and <strong>low competition density (20%)</strong> rather than assuming Friday grants a magic organic streaming lift.
            </p>
          )}
        </div>
      </div>

      {/* Grid of 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Competition Density */}
        <ChartCard
          title="Releases per Weekday (Competition Density)"
          subtitle="Distribution of track releases across the 7 days of the week"
          sourceText={`Source: Spotify Most Streamed Songs 2023 (Kaggle), n = ${meta.datasets.tracks}`}
          tableData={competitionData}
          tableColumns={compColumns}
          tableCaption="Releases per Weekday and Market Share"
        >
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitionData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1720',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(val: any, name: string) => [
                    name === 'releases' ? `${val} tracks` : `${val}%`,
                    name === 'releases' ? 'Releases' : 'Share',
                  ]}
                />
                <Bar dataKey="releases" fill="#1DB954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Mean Log Streams with 95% CI */}
        <ChartCard
          title="Mean log(streams) with 95% CI"
          subtitle="Raw weekday performance with confidence interval error bars"
          sourceText={`Source: Spotify Most Streamed Songs 2023 (Kaggle), n = ${meta.datasets.tracks}`}
          tableData={streamData}
          tableColumns={streamColumns}
          tableCaption="Mean log-streams with 95% Confidence Intervals"
        >
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1720',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(3)} log streams`, 'Mean log(streams)']}
                />
                <Bar dataKey="mean_log_streams" fill="#15803d" radius={[4, 4, 0, 0]}>
                  <ErrorBar dataKey="ci95" width={8} strokeWidth={2} stroke="#86efac" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Adjusted Weekday Effect (Full width) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Adjusted Weekday Effect (Controlling for Playlists, Charts & Age)"
            subtitle="Residual performance after stripping out playlist reach, chart spots, and song release age"
            sourceText={`Source: Linear/RF Residual Model, n = ${meta.datasets.tracks}`}
            tableData={adjustedData}
            tableColumns={adjColumns}
            tableCaption="Adjusted Weekday Effect"
          >
            <div className="h-[280px] w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adjustedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                  <ReferenceLine y={0} stroke="#4b5563" strokeWidth={1.5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1720',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                    formatter={(val: any) => [`${Number(val).toFixed(3)} adjusted log effect`, 'Adjusted Effect']}
                  />
                  <Bar dataKey="adjusted_effect" fill="#1DB954" radius={[4, 4, 0, 0]}>
                    <ErrorBar dataKey="adjusted_ci95" width={8} strokeWidth={2} stroke="#ffffff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
