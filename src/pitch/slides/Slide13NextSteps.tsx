import React from 'react';
import { Handshake } from 'lucide-react';
import { SlideProps } from './Slide01Title';

export const Slide13NextSteps: React.FC<SlideProps> = () => {
  const steps = [
    {
      title: '1. Direct Label & Distributor Telemetry',
      desc: 'Ingest native hourly release timestamps from label distributors (DistroKid, TuneCore, The Orchard).',
    },
    {
      title: '2. Per-Genre Diurnal Hour Profiles',
      desc: 'Disaggregate the 24-hour listening curve by musical genre to capture late-night dance peaks vs daytime acoustic study habits.',
    },
    {
      title: '3. Country & Territory Localizations',
      desc: 'Tailor release windows to national holiday schedules, regional radio charts, and localized commute habits.',
    },
    {
      title: '4. Controlled A/B Release Experiments',
      desc: 'Partner with indie labels to drop identical-tier releases across staggered slots and measure 28-day streaming velocity differences.',
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-14 bg-[#0c1219] text-white">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-400 font-bold">
          13 &bull; Future Roadmap & The Ask
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Next Steps & Commercial Expansion
        </h2>
      </div>

      <div className="my-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm sm:text-base font-mono text-brand-300">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/30 flex items-center gap-3 text-xs sm:text-sm text-brand-200">
          <Handshake className="w-5 h-5 text-brand-400 shrink-0" />
          <span>
            <strong>Our Ask:</strong> Strategic pilot partnerships with independent labels and digital distributors to validate DropClock across 500 upcoming commercial releases.
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono border-t border-slate-800/80 pt-4 flex justify-between">
        <span>Transforming music marketing from intuition into high-yield algorithmic precision.</span>
        <span>DropClock Intelligence</span>
      </div>
    </div>
  );
};

export const slide13Notes =
  "Our commercial roadmap focuses on four milestones: direct distributor telemetry, genre-specific diurnal curves, multi-country localized windows, and controlled A/B release experiments. We are actively seeking pilot partners.";
