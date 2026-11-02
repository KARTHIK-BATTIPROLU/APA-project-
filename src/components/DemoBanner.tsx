import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface DemoBannerProps {
  synthetic: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ synthetic }) => {
  if (!synthetic) return null;

  return (
    <div
      role="alert"
      className="bg-amber-950/80 border-b border-amber-600/50 text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 backdrop-blur-sm sticky top-0 z-50 shadow-md"
    >
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
      <span>
        <strong>Demo data:</strong> synthetic stand-ins with the real schemas. Re-run the notebook on the real datasets to see real results.
      </span>
    </div>
  );
};
