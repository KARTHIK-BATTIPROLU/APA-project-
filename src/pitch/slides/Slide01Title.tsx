import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { WebsiteData } from '../../data/schema';

export interface SlideProps {
  data: WebsiteData;
}

export const Slide01Title: React.FC<SlideProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-gradient-to-br from-[#0c1219] via-[#090e13] to-[#06090c] text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-brand-500/20">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-brand-400">
            DropClock Analytics Platform
          </span>
        </div>
        <span className="font-mono text-xs text-slate-400 border border-slate-800 px-3 py-1 rounded-full">
          Release-Window Intelligence
        </span>
      </div>

      <div className="my-auto max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Optimal Release-Window Advisor</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          When should your track drop?
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
          Turning 500,000+ listener events, 952 global hit tracks, and 73-country daily charts into an algorithmic release-window recommendation engine.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4">
        <div>DropClock Executive Pitch &bull; Product Overview</div>
        <div>Default Target: {data.recommendation.genre.name}</div>
      </div>
    </div>
  );
};

export const slide01Notes =
  "Welcome everyone. DropClock solves one of the music industry's most expensive gambles: determining the exact weekday and hour to publish a song on Spotify. We combine listener activity, historical release performance, and competition density to replace guesswork with data.";
