import React, { useState, useMemo, useRef } from 'react';
import {
  RotateCcw,
  Globe,
  Upload,
  Copy,
  Check,
  Flame,
  FileSpreadsheet,
  Info,
  Sparkles,
} from 'lucide-react';
import { WebsiteData } from '../data/schema';
import {
  computeReleaseMatrix,
  findBestRecommendation,
  rebalanceWeights,
  shiftTimezone,
  Weights,
  DAYS,
} from '../data/scoring';
import { parseAndScoreCatalog, CatalogAnalysisResult } from '../data/csvParser';
import { Heatmap } from '../components/Heatmap';
import { GenreSelect } from '../components/GenreSelect';

export interface AdvisorProps {
  data: WebsiteData;
}

interface TimezoneOption {
  label: string;
  offset: number; // in hours from UTC
}

const TIMEZONES: TimezoneOption[] = [
  { label: 'UTC (Coordinated Universal Time)', offset: 0 },
  { label: 'US Pacific (PST, UTC-8)', offset: -8 },
  { label: 'US Mountain (MST, UTC-7)', offset: -7 },
  { label: 'US Central (CST, UTC-6)', offset: -6 },
  { label: 'US Eastern (EST, UTC-5)', offset: -5 },
  { label: 'Brazil (BRT, UTC-3)', offset: -3 },
  { label: 'UK London (GMT/BST, UTC+0)', offset: 0 },
  { label: 'Central Europe (CET/CEST, UTC+1)', offset: 1 },
  { label: 'Eastern Europe (EET, UTC+2)', offset: 2 },
  { label: 'Gulf Standard (GST, UTC+4)', offset: 4 },
  { label: 'India Standard (IST, UTC+5:30)', offset: 5.5 },
  { label: 'Western Indonesia (WIB, UTC+7)', offset: 7 },
  { label: 'China / Singapore (CST/SGT, UTC+8)', offset: 8 },
  { label: 'Japan / Korea (JST/KST, UTC+9)', offset: 9 },
  { label: 'Australia Eastern (AEST, UTC+10)', offset: 10 },
  { label: 'New Zealand (NZST, UTC+12)', offset: 12 },
];

export const Advisor: React.FC<AdvisorProps> = ({ data }) => {
  const { meta, components, robustness } = data;
  const genres = Object.keys(data.genre_weekday_index).sort();

  // 1. Controls state
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [weights, setWeights] = useState<Weights>({
    activity: meta.weights.activity,
    day_performance: meta.weights.day_performance,
    low_competition: meta.weights.low_competition,
  });

  const [audienceTzOffset, setAudienceTzOffset] = useState<number>(0); // Audience UTC default
  const [artistTzOffset, setArtistTzOffset] = useState<number>(5.5); // Artist IST default (+5:30)

  // Catalog analysis state
  const [catalogResult, setCatalogResult] = useState<CatalogAnalysisResult | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogFileName, setCatalogFileName] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Client-side recomputation with scoring.ts
  const activeMatrix = useMemo(() => {
    return computeReleaseMatrix(components, selectedGenre, weights);
  }, [components, selectedGenre, weights]);

  const rec = useMemo(() => {
    return findBestRecommendation(activeMatrix, 5, 5);
  }, [activeMatrix]);

  // 3. Timezone conversion for the best slot
  const convertedSlot = useMemo(() => {
    return shiftTimezone(rec.bestDay, rec.bestHour, audienceTzOffset, artistTzOffset);
  }, [rec.bestDay, rec.bestHour, audienceTzOffset, artistTzOffset]);

  // Slider change handler with automatic rebalancing
  const handleSliderChange = (key: keyof Weights, rawVal: number) => {
    const nextWeights = rebalanceWeights(weights, key, rawVal);
    setWeights(nextWeights);
  };

  const handleResetWeights = () => {
    setWeights({
      activity: meta.weights.activity,
      day_performance: meta.weights.day_performance,
      low_competition: meta.weights.low_competition,
    });
  };

  // CSV upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCatalogFileName(file.name);
    setIsCatalogLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = parseAndScoreCatalog(text, activeMatrix);
      setCatalogResult(res);
      setIsCatalogLoading(false);
    };
    reader.readAsText(file);
  };

  // Use Sample Catalog Button
  const handleUseSampleCatalog = async () => {
    setIsCatalogLoading(true);
    setCatalogFileName('sample_catalog.csv (Built-in)');
    try {
      const res = await fetch('/data/sample_catalog.csv');
      const text = await res.text();
      const scored = parseAndScoreCatalog(text, activeMatrix);
      setCatalogResult(scored);
    } catch (err) {
      console.error('Failed to load sample catalog:', err);
    } finally {
      setIsCatalogLoading(false);
    }
  };

  // Copy recommendation text
  const handleCopyRecommendation = () => {
    const text = `DropClock Recommendation for ${selectedGenre === 'all' ? 'All Genres' : selectedGenre}:
- Target Audience Slot: ${rec.bestDay} at ${rec.bestHourFormatted}
- Local Studio Time: ${convertedSlot.convertedDay} at ${convertedSlot.convertedFormatted} ${convertedSlot.isApprox ? '(approx.)' : ''}
- Recommended 3-Hour Window: ${rec.best3HourWindow.join(', ')} on ${rec.bestDay}
- Formula Weights: Activity ${(weights.activity * 100).toFixed(0)}%, Day Performance ${(weights.day_performance * 100).toFixed(0)}%, Low Competition ${(weights.low_competition * 100).toFixed(0)}%
- Top 5 Windows:
${rec.topWindows.map((w, i) => `  ${i + 1}. ${w.day} ${w.hourFormatted} (Score: ${w.score.toFixed(3)})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Interactive Release Advisor</span>
            <span className="text-xs font-mono font-medium bg-brand-500/10 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full">
              Real-Time Recomputation
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Customize weighting balance, audience timezone conversion, and evaluate historical performance against your catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyRecommendation}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs sm:text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Copy recommendation summary to clipboard"
        >
          {copySuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Recommendation</span>
            </>
          )}
        </button>
      </div>

      {/* Controls Card: Sliders, Genre, Timezones */}
      <div className="bg-[#121820] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Genre Selector */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              01 &bull; Target Musical Genre
            </h2>
            <GenreSelect
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              includeAllOption={true}
              label="Genre"
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              Select &ldquo;All Genres&rdquo; for global baseline demand, or filter for specific genre listening habits across 73 countries.
            </p>
          </div>

          {/* Column 2: Weight Sliders (sum always = 100%) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                02 &bull; Scoring Weight Priorities (Always 100%)
              </h2>
              <button
                type="button"
                onClick={handleResetWeights}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-brand-400 transition-colors font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (50/30/20)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Activity Slider */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Listener Activity</span>
                  <span className="font-mono font-bold text-brand-400">
                    {(weights.activity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.activity}
                  onChange={(e) => handleSliderChange('activity', parseFloat(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                  aria-label="Listener Activity Weight"
                />
                <span className="text-[11px] text-slate-400 block">Circadian stream volume</span>
              </div>

              {/* Day Performance Slider */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Day Performance</span>
                  <span className="font-mono font-bold text-brand-400">
                    {(weights.day_performance * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.day_performance}
                  onChange={(e) => handleSliderChange('day_performance', parseFloat(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                  aria-label="Day Performance Weight"
                />
                <span className="text-[11px] text-slate-400 block">Historical weekday lift</span>
              </div>

              {/* Low Competition Slider */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Low Competition</span>
                  <span className="font-mono font-bold text-brand-400">
                    {(weights.low_competition * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.low_competition}
                  onChange={(e) => handleSliderChange('low_competition', parseFloat(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                  aria-label="Low Competition Weight"
                />
                <span className="text-[11px] text-slate-400 block">Inverse drop congestion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Timezone Converter */}
        <div className="border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              03 &bull; Circular Timezone Translation (Wrap-Around Engine)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="aud-tz" className="block text-xs text-slate-400 mb-1.5 font-medium">
                Target Audience Timezone (Peak Listening Market):
              </label>
              <select
                id="aud-tz"
                value={audienceTzOffset}
                onChange={(e) => setAudienceTzOffset(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-brand-500"
              >
                {TIMEZONES.map((tz) => (
                  <option key={`aud-${tz.label}`} value={tz.offset}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="art-tz" className="block text-xs text-slate-400 mb-1.5 font-medium">
                My Local Studio Timezone (Artist / Publisher Time):
              </label>
              <select
                id="art-tz"
                value={artistTzOffset}
                onChange={(e) => setArtistTzOffset(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-brand-500"
              >
                {TIMEZONES.map((tz) => (
                  <option key={`art-${tz.label}`} value={tz.offset}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recalculated Recommendation Headline Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/40 via-[#131b24] to-[#131b24] border border-brand-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-500 text-black">
              LIVE OPTIMUM
            </span>
            <span className="text-xs font-mono text-slate-400">
              Audience Peak: {rec.bestDay} at {rec.bestHourFormatted}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            Drop at <span className="text-brand-400">{convertedSlot.convertedDay} {convertedSlot.convertedFormatted}</span>
            {convertedSlot.isApprox && (
              <span className="text-xs font-mono text-amber-300 ml-2 px-2 py-0.5 bg-amber-950/60 rounded border border-amber-500/30">
                approx. (nearest {convertedSlot.nearestHourFormatted})
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 max-w-xl">
            Targeting the {rec.bestDay} {rec.bestHourFormatted} audience peak means publishing from your studio on{' '}
            <strong className="text-white">{convertedSlot.convertedDay} at {convertedSlot.convertedFormatted}</strong>.
            Recommended 3-hour cluster: <strong className="text-brand-300 font-mono">{rec.best3HourWindow.join(', ')}</strong>.
          </p>
        </div>

        {/* Top 3 KPI mini-summary */}
        <div className="flex items-center gap-3 font-mono text-center">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800 min-w-[90px]">
            <span className="text-[10px] text-slate-400 block uppercase">Best Day</span>
            <span className="text-lg font-bold text-brand-400">{rec.bestDay}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800 min-w-[90px]">
            <span className="text-[10px] text-slate-400 block uppercase">Best Hour</span>
            <span className="text-lg font-bold text-white">{rec.bestHourFormatted}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800 min-w-[90px]">
            <span className="text-[10px] text-slate-400 block uppercase">Prime Score</span>
            <span className="text-lg font-bold text-brand-300">
              {rec.primeTimeScores[rec.bestDay]?.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Heatmap + Top 5 Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Heatmap
            data={activeMatrix}
            rowLabels={DAYS as unknown as string[]}
            colLabels={meta.hours.map((h) => `${h}`)}
            title={`Dynamic Release Score Matrix (${selectedGenre === 'all' ? 'All Genres' : selectedGenre})`}
            subtitle="Recalculated on client. Adjust sliders above to watch the intensity landscape shift in real time."
            palette="sequential"
            peakCell={{ row: rec.bestDayIndex, col: rec.bestHour }}
            legendLabel="Score"
            ariaLabel="Interactive Dynamic Heatmap"
          />
        </div>

        {/* Top 5 Windows Panel */}
        <div className="bg-[#121820] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-white">Top 5 Slots</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Audience Local</span>
          </div>

          <ol className="space-y-2 font-mono text-xs">
            {rec.topWindows.map((slot, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-brand-950/40 border-brand-500/40 text-brand-300 font-bold'
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
                    {slot.day} {slot.hourFormatted}
                  </span>
                </div>
                <span className="text-brand-400 font-extrabold">{slot.score.toFixed(3)}</span>
              </li>
            ))}
          </ol>

          {/* Robustness Panel */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Robustness Sensitivity ({robustness.combos_tested} Weight Sweeps)
            </h4>
            <div className="space-y-1 font-mono text-[11px]">
              {Object.entries(robustness.best_day_frequency).map(([day, share]) => (
                <div key={day} className="flex justify-between text-slate-400">
                  <span>{day} wins:</span>
                  <span className="text-slate-200 font-bold">{(Number(share) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog CSV Upload & Spearman Correlation Section */}
      <section className="bg-[#121820] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white">
                Directional Sanity Check: Analyze Your Release Catalog
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Upload your catalog CSV to score historical releases against the active DropClock model and calculate the Spearman rank correlation with first-7-day streams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload CSV</span>
            </button>

            <button
              type="button"
              onClick={handleUseSampleCatalog}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use Sample File (22 tracks)</span>
            </button>
          </div>
        </div>

        {isCatalogLoading && (
          <div className="p-4 text-center text-xs text-slate-400 font-mono animate-pulse">
            Parsing catalog and scoring slots in browser...
          </div>
        )}

        {catalogResult && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Dataset: {catalogFileName} &bull; {catalogResult.rowCount} Tracks Evaluated
                </span>
                <div className="text-base font-bold text-white mt-1">
                  Spearman Rank Correlation: <span className="text-brand-400 font-mono text-lg font-extrabold">{catalogResult.spearmanCorrelation.toFixed(3)}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {catalogResult.directionalSummary}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/30 text-[11px] text-amber-300 max-w-xs leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                Small sample check: directional indicator only; not causal proof.
              </div>
            </div>

            {/* Catalog sample table preview */}
            <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs font-mono text-slate-300 bg-slate-900/60">
                <thead className="bg-black/60 text-slate-400 text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Track ID</th>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Weekday</th>
                    <th className="py-2 px-3">Hour</th>
                    <th className="py-2 px-3 text-right">Model Score</th>
                    <th className="py-2 px-3 text-right">7-Day Streams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {catalogResult.rows.slice(0, 8).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 text-slate-400">{row.track_id}</td>
                      <td className="py-1.5 px-3 text-white font-medium">{row.track_title}</td>
                      <td className="py-1.5 px-3">{row.weekday}</td>
                      <td className="py-1.5 px-3">{row.hour !== undefined ? `${String(row.hour).padStart(2, '0')}:00` : '-'}</td>
                      <td className="py-1.5 px-3 text-right text-brand-400 font-bold">{row.slot_score?.toFixed(3)}</td>
                      <td className="py-1.5 px-3 text-right text-slate-200">{row.streams_first_7_days.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
