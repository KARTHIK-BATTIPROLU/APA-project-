import React from 'react';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SlideProps } from './Slide01Title';

export const Slide14QA: React.FC<SlideProps> = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-gradient-to-tr from-[#0c1219] via-[#0a0f15] to-[#06090c] text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-black font-extrabold">
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            DropClock Advisor
          </span>
        </div>
        <span className="font-mono text-xs text-brand-400">Questions & Answers</span>
      </div>

      <div className="my-auto max-w-2xl space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Open Floor</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Thank you.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Every track deserves its optimal moment. Let&rsquo;s stop guessing and start timing releases with algorithmic precision.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            to="/advisor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition-all"
          >
            <span>Launch Advisor App</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
          >
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>DropClock &bull; Optimal Music Release-Window Advisor</span>
        <span>hello@dropclock.ai</span>
      </div>
    </div>
  );
};

export const slide14Notes =
  "Thank you for your time and attention. We now welcome questions regarding our mathematical formulation, Random Forest modeling, or partnership roadmap.";
