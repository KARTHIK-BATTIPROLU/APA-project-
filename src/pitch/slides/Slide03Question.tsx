import React from 'react';
import { Calendar, Clock, Music2 } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide03Question: React.FC<SlideProps> = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          03 &bull; Core Research Objective
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          The Core Question
        </h2>
      </div>

      <div className="my-auto max-w-4xl p-8 rounded-2xl bg-slate-900/80 border border-brand-500/30 space-y-6 shadow-2xl">
        <div className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
          &ldquo;For a given music genre, which{' '}
          <span className="text-brand-400 underline decoration-brand-500/50 underline-offset-4">
            day of the week
          </span>{' '}
          and which{' '}
          <span className="text-brand-400 underline decoration-brand-500/50 underline-offset-4">
            time of day
          </span>{' '}
          is the best moment to publish a track on Spotify?&rdquo;
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Target Weekday (Mon–Sun)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Target Hour (0:00–23:00)</span>
          </div>
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-brand-400" />
            <span>Specific Musical Style (9 Genres)</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>DropClock replaces arbitrary industry habits with reproducible data science.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide03Notes =
  "Our entire product is designed to answer this single question with precision. Rather than giving a generic one-size-fits-all answer, DropClock personalizes the recommendation to both the genre and the exact audience timezone.";
