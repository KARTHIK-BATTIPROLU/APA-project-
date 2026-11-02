import React from 'react';
import { Music2 } from 'lucide-react';
import { SlideProps } from './Slide01Title';
import { Heatmap } from '../../components/Heatmap';

export const Slide08Genre: React.FC<SlideProps> = ({ data }) => {
  const { meta, genre_weekday_index, best_day_by_genre, recommendation } = data;
  const genres = Object.keys(genre_weekday_index).sort();
  const genreHeatmapData = genres.map((g) => genre_weekday_index[g]);
  const currentGenre = recommendation.genre.name;

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          08 &bull; Finding 3: Musical Genre Divergence
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Finding 3: Genre Context Dictates Weekday Rhythms
        </h2>
      </div>

      <div className="my-auto space-y-4">
        <Heatmap
          data={genreHeatmapData}
          rowLabels={genres}
          colLabels={meta.days}
          title="9 × 7 Genre × Weekday Demand Index (Centered at 1.00 Baseline)"
          subtitle="Green indicates above-average streaming demand; rose/coral indicates below-average demand."
          palette="diverging"
          divergingCenter={1.0}
          minValue={0.85}
          maxValue={1.25}
          cellWidth={46}
          cellHeight={22}
          legendLabel="Demand Index"
        />

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-brand-400" />
            <span className="text-slate-300">Active Genre Target: <strong className="text-white">{currentGenre}</strong></span>
          </div>
          <div className="text-brand-400 font-bold">
            Best Weekday for {currentGenre}: {best_day_by_genre[currentGenre] || recommendation.genre.best_day}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Genre demand patterns diverge widely between workday commute listening and weekend leisure.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide08Notes =
  "Finding three highlights musical genre dynamics. Different genres exhibit very different weekly patterns: club and dance styles surge dramatically over the weekend, while acoustic and indie listening remains balanced across weekdays.";
