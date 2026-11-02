import React, { useState } from 'react';
import { Table, BarChart2 } from 'lucide-react';
import { AccessibleTable, ColumnDef } from './AccessibleTable';

export interface ChartCardProps<T = any> {
  title: string;
  subtitle?: string;
  sourceText?: string;
  children: React.ReactNode;
  tableData?: T[];
  tableColumns?: ColumnDef<T>[];
  tableCaption?: string;
  action?: React.ReactNode;
}

export function ChartCard<T = any>({
  title,
  subtitle,
  sourceText,
  children,
  tableData,
  tableColumns,
  tableCaption,
  action,
}: ChartCardProps<T>) {
  const [showTable, setShowTable] = useState(false);

  const hasTable = tableData && tableColumns;

  return (
    <div className="bg-[#121820] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {action}
          {hasTable && (
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={showTable ? 'Switch to chart view' : 'Switch to accessible table view'}
            >
              {showTable ? (
                <>
                  <BarChart2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>Show Chart</span>
                </>
              ) : (
                <>
                  <Table className="w-3.5 h-3.5 text-slate-400" />
                  <span>Show as table</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full min-h-[260px] flex items-center justify-center">
        {showTable && hasTable ? (
          <AccessibleTable
            caption={tableCaption || title}
            columns={tableColumns}
            data={tableData}
          />
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>

      {/* Source Footer */}
      {sourceText && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          {sourceText}
        </div>
      )}
    </div>
  );
}
