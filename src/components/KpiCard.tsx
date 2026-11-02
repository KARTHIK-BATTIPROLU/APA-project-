import React from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  badge?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subvalue,
  badge,
  icon,
  variant = 'default',
}) => {
  const borderClass =
    variant === 'accent'
      ? 'border-brand-500/40 bg-gradient-to-br from-brand-950/40 via-[#131b24] to-[#131b24]'
      : variant === 'warning'
      ? 'border-amber-500/40 bg-amber-950/20'
      : 'border-slate-800 bg-[#131b24]';

  const valueColor =
    variant === 'accent'
      ? 'text-brand-400'
      : 'text-slate-100';

  return (
    <div
      className={`relative p-5 rounded-xl border ${borderClass} shadow-md hover:border-slate-700 transition-colors flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {badge}
            </span>
          )}
          {icon && <div className="text-slate-400">{icon}</div>}
        </div>
      </div>

      <div className="my-1">
        <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${valueColor}`}>
          {value}
        </div>
        {subvalue && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
            {subvalue}
          </p>
        )}
      </div>
    </div>
  );
};
