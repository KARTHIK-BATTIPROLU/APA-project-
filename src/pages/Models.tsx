import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { WebsiteData } from '../data/schema';
import { ChartCard } from '../components/ChartCard';
import { ColumnDef } from '../components/AccessibleTable';

export interface ModelsProps {
  data: WebsiteData;
}

export const Models: React.FC<ModelsProps> = ({ data }) => {
  const { models, feature_importance } = data;

  // Feature importance data sorted descending
  const featData = [...feature_importance].sort((a, b) => b.Importance - a.Importance).map((item) => ({
    feature: item.Feature,
    importance: item.Importance,
    importancePct: Number((item.Importance * 100).toFixed(1)),
  }));

  const featTableColumns: ColumnDef<typeof featData[0]>[] = [
    { key: 'feature', header: 'Model Feature', align: 'left' },
    {
      key: 'importance',
      header: 'Gini Importance (0-1)',
      align: 'right',
      render: (r) => r.importance.toFixed(4),
    },
    {
      key: 'importancePct',
      header: 'Relative Weight (%)',
      align: 'right',
      render: (r) => `${r.importancePct}%`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Model Architecture & Performance</span>
          <span className="text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
            Random Forest Regressors
          </span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Two distinct Random Forest models power DropClock: an activity-curve smoother for Last.fm hourly traffic and a multi-factor regression model evaluating release-day stream impact while controlling for confounding playlist and chart placements.
        </p>
      </div>

      {/* Model Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model 1: Release-Day Stream Predictor */}
        <div className="bg-[#121820] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Model 1 &bull; Supervised Regression
              </span>
              <span className="text-xs text-slate-400 font-mono">Target: log(streams)</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Random Forest: Release-Day Stream Predictor
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Trained on 952 Spotify 2023 tracks. Models cumulative stream volume conditioned on release weekday, release month, artist count, acoustic attributes, and ecosystem placement.
            </p>

            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-black/40 border border-slate-800 text-center font-mono mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">MAE</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {models.release_day.MAE.toFixed(3)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">RMSE</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {models.release_day.RMSE.toFixed(3)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-brand-400 uppercase font-semibold">R² Score</span>
                <div className="text-base font-bold text-brand-400 mt-0.5">
                  {models.release_day.R2.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="font-semibold text-slate-200">Plain-English Interpretation:</div>
            <p>
              An R² of <strong>{models.release_day.R2.toFixed(3)}</strong> demonstrates that more than half of the variation in cumulative Spotify streaming can be explained by release parameters, playlist reach, and song age.
            </p>
          </div>
        </div>

        {/* Model 2: 168-Hour Activity Smoother */}
        <div className="bg-[#121820] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Model 2 &bull; Temporal Smoother
              </span>
              <span className="text-xs text-slate-400 font-mono">Target: scrobbles/hour</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Random Forest: 168-Hour Activity Smoother
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Trained on 500,000 Last.fm user events. Uses cyclical Fourier encodings (sin/cos of hour and weekday) to filter out sporadic burst noise and learn continuous circadian listener habits.
            </p>

            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-black/40 border border-slate-800 text-center font-mono mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">MAE</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {models.activity.MAE.toFixed(3)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">RMSE</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {models.activity.RMSE.toFixed(3)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-brand-400 uppercase font-semibold">R² Score</span>
                <div className="text-base font-bold text-brand-400 mt-0.5">
                  {models.activity.R2.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="font-semibold text-slate-200">Plain-English Interpretation:</div>
            <p>
              An R² of <strong>{models.activity.R2.toFixed(3)}</strong> verifies that circadian and weekly listening routines are highly regular, reliably pinpointing peak engagement windows week after week.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div>
        <ChartCard
          title="Feature Importance: Release-Day Stream Regression"
          subtitle="Gini impurity reduction across tree splits in the Random Forest model (Target: log-streams)"
          sourceText="Source: Scikit-Learn RandomForestRegressor, 100 trees, 5-fold cross-validated"
          tableData={featData}
          tableColumns={featTableColumns}
          tableCaption="Feature Importance Table"
        >
          <div className="h-[340px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featData}
                layout="vertical"
                margin={{ top: 10, right: 30, bottom: 10, left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 'dataMax + 0.05']} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#9ca3af"
                  tick={{ fill: '#d1d5db', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1720',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}% (${Number(val).toFixed(4)})`, 'Importance']}
                />
                <Bar dataKey="importance" fill="#1DB954" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
