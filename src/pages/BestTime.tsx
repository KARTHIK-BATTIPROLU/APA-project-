import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Zap } from 'lucide-react';
import { WebsiteData } from '../data/schema';
import { Heatmap } from '../components/Heatmap';
import { ChartCard } from '../components/ChartCard';
import { ColumnDef } from '../components/AccessibleTable';

export interface BestTimeProps {
  data: WebsiteData;
}

export const BestTime: React.FC<BestTimeProps> = ({ data }) => {
  const { meta, components } = data;
  const sActivity = components.S_activity;
  const days = meta.days;
  const hours = meta.hours;

  const [selectedDay, setSelectedDay] = useState<string>('Sat');

  // Compute peak cell in sActivity
  let peakVal = -Infinity;
  let peakDayIdx = 0;
  let peakHour = 0;
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      if (sActivity[d][h] > peakVal) {
        peakVal = sActivity[d][h];
        peakDayIdx = d;
        peakHour = h;
      }
    }
  }

  // Compute weekday average (Mon-Fri) and weekend average (Sat-Sun)
  const hourlyComparisonData = hours.map((h) => {
    let weekdaySum = 0;
    for (let d = 0; d < 5; d++) weekdaySum += sActivity[d][h];
    const weekdayAvg = Number((weekdaySum / 5).toFixed(4));

    let weekendSum = 0;
    for (let d = 5; d < 7; d++) weekendSum += sActivity[d][h];
    const weekendAvg = Number((weekendSum / 2).toFixed(4));

    const selectedDayIdx = days.indexOf(selectedDay);
    const selectedVal = selectedDayIdx >= 0 ? sActivity[selectedDayIdx][h] : weekdayAvg;

    return {
      hour: `${String(h).padStart(2, '0')}:00`,
      hourNum: h,
      selectedDayVal: selectedVal,
      weekdayAvg,
      weekendAvg,
    };
  });

  const tableColumns: ColumnDef<typeof hourlyComparisonData[0]>[] = [
    { key: 'hour', header: 'Hour of Day', align: 'left' },
    {
      key: 'selectedDayVal',
      header: `${selectedDay} Intensity`,
      align: 'right',
      render: (r) => r.selectedDayVal.toFixed(4),
    },
    {
      key: 'weekdayAvg',
      header: 'Weekday Avg (Mon-Fri)',
      align: 'right',
      render: (r) => r.weekdayAvg.toFixed(4),
    },
    {
      key: 'weekendAvg',
      header: 'Weekend Avg (Sat-Sun)',
      align: 'right',
      render: (r) => r.weekendAvg.toFixed(4),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Best Time of Day: 168-Hour Activity Matrix</span>
          <span className="text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
            {meta.datasets.listening_events.toLocaleString()} Scrobble Events
          </span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Spotify 2023 lacks release timestamps; we derive global hourly listening intensity from the Last.fm 1,000-user listening log, smoothed via Random Forest to remove individual scrobble noise.
        </p>
      </div>

      {/* Strategic Callout Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-brand-500/40 bg-brand-950/20 text-brand-200 flex items-start gap-3.5 shadow-lg">
        <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 shrink-0 mt-0.5">
          <Zap className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white mb-1">
            Golden Rule: Release 1–2 hours BEFORE the peak
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Streaming platforms experience latency indexing new uploads into Release Radar and Daily Mixes. If peak listener volume occurs at{' '}
            <strong className="text-brand-300">{days[peakDayIdx]} {String(peakHour).padStart(2, '0')}:00</strong>, scheduling your track for{' '}
            <strong className="text-brand-300">{days[peakDayIdx]} {String(Math.max(0, peakHour - 2)).padStart(2, '0')}:00–{String(Math.max(0, peakHour - 1)).padStart(2, '0')}:00</strong> ensures it is fully indexed and positioned on user feeds the moment listener traffic surges.
          </p>
        </div>
      </div>

      {/* 7x24 Activity Heatmap */}
      <div className="space-y-2">
        <Heatmap
          data={sActivity}
          rowLabels={days}
          colLabels={hours.map((h) => `${h}`)}
          title="168-Hour Smoothed Listener Activity Matrix (S_activity)"
          subtitle="Normalized listening volume (0.0 to 1.0). Peak intensity outlined in neon green."
          palette="sequential"
          peakCell={{ row: peakDayIdx, col: peakHour }}
          legendLabel="Listening Intensity"
          ariaLabel="168-Hour Listener Activity Heatmap"
        />
      </div>

      {/* 24-Hour Line Chart with Overlay Controls */}
      <div>
        <ChartCard
          title="24-Hour Diurnal Activity Curve"
          subtitle="Hourly listener intensity comparing selected day against weekday and weekend baselines"
          sourceText={`Source: Last.fm 1K user dataset (500k listening logs), smoothed via Random Forest`}
          tableData={hourlyComparisonData}
          tableColumns={tableColumns}
          tableCaption="24-Hour Listening Intensity Comparison"
          action={
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase font-mono">Day:</span>
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                    selectedDay === d
                      ? 'bg-brand-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[320px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyComparisonData} margin={{ top: 15, right: 25, bottom: 15, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1720',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(val: any, name: string) => [
                    Number(val).toFixed(4),
                    name === 'selectedDayVal'
                      ? `${selectedDay} Intensity`
                      : name === 'weekdayAvg'
                      ? 'Weekday Avg'
                      : 'Weekend Avg',
                  ]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => (
                    <span className="text-slate-300 text-xs">
                      {value === 'selectedDayVal'
                        ? `${selectedDay} Intensity`
                        : value === 'weekdayAvg'
                        ? 'Weekday Average (Mon–Fri)'
                        : 'Weekend Average (Sat–Sun)'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="selectedDayVal"
                  stroke="#1DB954"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#1DB954' }}
                  activeDot={{ r: 6, fill: '#86efac' }}
                />
                <Line
                  type="monotone"
                  dataKey="weekdayAvg"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="weekendAvg"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
