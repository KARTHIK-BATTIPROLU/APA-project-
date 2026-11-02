import React from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface AccessibleTableProps<T> {
  caption: string;
  columns: ColumnDef<T>[];
  data: T[];
  summary?: string;
}

export function AccessibleTable<T>({
  caption,
  columns,
  data,
  summary,
}: AccessibleTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-[#0d131a] my-2">
      <table
        className="w-full text-left text-xs sm:text-sm text-slate-300 font-sans"
        aria-label={caption}
      >
        <caption className="sr-only">{caption}</caption>
        {summary && <p className="p-2 text-xs text-slate-400 border-b border-slate-800">{summary}</p>}
        <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-mono border-b border-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`py-2.5 px-3 font-semibold ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-slate-800/40 transition-colors focus-within:bg-slate-800/50"
            >
              {columns.map((col) => {
                const cellVal = (row as any)[col.key];
                return (
                  <td
                    key={col.key}
                    className={`py-2 px-3 ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row, i) : String(cellVal ?? '-')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
