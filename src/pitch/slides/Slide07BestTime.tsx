import React from 'react';
import { Zap } from 'lucide-react';
import { SlideProps } from './Slide01Title';
import { Heatmap } from '../../components/Heatmap';

export const Slide07BestTime: React.FC<SlideProps> = ({ data }) => {
  const { meta, components, recommendation } = data;
  const bestHour = recommendation.all_genres.best_hour;
  const bestDay = recommendation.all_genres.best_day;

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          07 &bull; Finding 2: Best Time of Day
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Finding 2: Circadian Listener Activity Peaks at {String(bestHour).padStart(2, '0')}:00
        </h2>
      </div>

      <div className="my-auto space-y-4">
        <Heatmap
          data={components.S_activity}
          rowLabels={meta.days}
          colLabels={meta.hours.map((h) => `${h}`)}
          title="168-Hour Listener Activity Profile (S_activity)"
          subtitle="Hours 0–23 (X) across Mon–Sun (Y). Highest listening intensity outlined in green."
          palette="sequential"
          peakCell={{ row: meta.days.indexOf(bestDay), col: bestHour }}
          legendLabel="Activity"
          cellHeight={20}
          cellWidth={28}
        />

        <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/30 flex items-center gap-3 text-xs sm:text-sm text-brand-200">
          <Zap className="w-5 h-5 text-brand-400 shrink-0" />
          <span>
            <strong>Strategic Execution Rule:</strong> Go live 1–2 hours before {String(bestHour).padStart(2, '0')}:00 (at {String(Math.max(0, bestHour - 2)).padStart(2, '0')}:00–{String(Math.max(0, bestHour - 1)).padStart(2, '0')}:00). This provides necessary ingestion buffer so algorithmic engines index your track as listener traffic peaks.
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Global scrobble data proves listener engagement follows strict circadian cycles.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide07Notes =
  "Finding two reveals the exact time of day. Circadian listening intensity consistently peaks in the evening hours, specifically around 19:00 local time. We recommend artists publish 1 to 2 hours before this peak so the release is fully processed by recommendation algorithms when the audience arrives.";
