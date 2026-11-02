import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-red-950/30 border border-red-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="w-14 h-14 rounded-full bg-red-900/40 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Data Validation Error</h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed whitespace-pre-wrap font-mono text-left bg-black/40 p-3 rounded-lg border border-red-900/40 max-h-60 overflow-y-auto">
          {message}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors shadow-lg shadow-red-950 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Dataset</span>
          </button>
        )}
      </div>
    </div>
  );
};
