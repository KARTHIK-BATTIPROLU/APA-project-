import React, { useState, useId } from 'react';

export interface HeatmapCell {
  rowLabel: string;
  colLabel: string;
  value: number;
  rowIdx: number;
  colIdx: number;
  isPeak?: boolean;
}

export interface HeatmapProps {
  data: number[][]; // [rows][cols]
  rowLabels: string[];
  colLabels: string[];
  title?: string;
  subtitle?: string;
  valueFormatter?: (v: number) => string;
  palette?: 'sequential' | 'diverging';
  divergingCenter?: number; // default 1.00
  minValue?: number;
  maxValue?: number;
  peakCell?: { row: number; col: number };
  cellHeight?: number;
  cellWidth?: number;
  legendLabel?: string;
  ariaLabel?: string;
}

/**
 * Color interpolation for sequential score palette (0.0 to 1.0)
 * Deep charcoal -> dark forest -> emerald -> vibrant mint
 */
function getSequentialColor(normalized: number): string {
  const t = Math.max(0, Math.min(1, normalized));
  if (t < 0.2) {
    // #121c15 to #173822
    const f = t / 0.2;
    const r = Math.round(18 + f * (23 - 18));
    const g = Math.round(28 + f * (56 - 28));
    const b = Math.round(21 + f * (34 - 21));
    return `rgb(${r}, ${g}, ${b})`;
  } else if (t < 0.5) {
    // #173822 to #166534
    const f = (t - 0.2) / 0.3;
    const r = Math.round(23 + f * (22 - 23));
    const g = Math.round(56 + f * (101 - 56));
    const b = Math.round(34 + f * (52 - 34));
    return `rgb(${r}, ${g}, ${b})`;
  } else if (t < 0.8) {
    // #166534 to #1DB954
    const f = (t - 0.5) / 0.3;
    const r = Math.round(22 + f * (29 - 22));
    const g = Math.round(101 + f * (185 - 101));
    const b = Math.round(52 + f * (84 - 52));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // #1DB954 to #86efac
    const f = (t - 0.8) / 0.2;
    const r = Math.round(29 + f * (134 - 29));
    const g = Math.round(185 + f * (239 - 185));
    const b = Math.round(84 + f * (172 - 84));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

/**
 * Diverging palette centered on divergingCenter (typically 1.00)
 * Low (< 1.0): Rose/Coral (#ef4444) -> Amber (#f59e0b) -> Slate/Neutral at 1.00 (#334155) -> Emerald (#10b981 / #1DB954)
 */
function getDivergingColor(val: number, center = 1.0, min = 0.8, max = 1.2): string {
  if (val < center) {
    const span = Math.max(0.01, center - min);
    const t = Math.max(0, Math.min(1, (center - val) / span)); // 0 at center, 1 at min
    // Center neutral (#374151) to low rose-coral (#f43f5e)
    const r = Math.round(55 + t * (244 - 55));
    const g = Math.round(65 + t * (63 - 65));
    const b = Math.round(81 + t * (94 - 81));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const span = Math.max(0.01, max - center);
    const t = Math.max(0, Math.min(1, (val - center) / span)); // 0 at center, 1 at max
    // Center neutral (#374151) to emerald green (#1DB954)
    const r = Math.round(55 + t * (29 - 55));
    const g = Math.round(65 + t * (185 - 65));
    const b = Math.round(81 + t * (84 - 81));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  rowLabels,
  colLabels,
  title,
  subtitle,
  valueFormatter = (v) => v.toFixed(3),
  palette = 'sequential',
  divergingCenter = 1.0,
  minValue,
  maxValue,
  peakCell,
  cellHeight = 26,
  cellWidth = 32,
  legendLabel = 'Score Intensity',
  ariaLabel = 'Data Heatmap',
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const filterId = useId();

  const numRows = rowLabels.length;
  const numCols = colLabels.length;

  // Compute min/max if not provided
  let calculatedMin = Infinity;
  let calculatedMax = -Infinity;
  let autoPeak = { row: 0, col: 0, val: -Infinity };

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const v = data[r]?.[c] ?? 0;
      if (v < calculatedMin) calculatedMin = v;
      if (v > calculatedMax) calculatedMax = v;
      if (v > autoPeak.val) {
        autoPeak = { row: r, col: c, val: v };
      }
    }
  }

  const effectiveMin = minValue !== undefined ? minValue : calculatedMin;
  const effectiveMax = maxValue !== undefined ? maxValue : calculatedMax;
  const activePeak = peakCell || { row: autoPeak.row, col: autoPeak.col };

  const leftMargin = 68;
  const topMargin = 30;
  const bottomMargin = 40;
  const rightMargin = 20;

  const svgWidth = leftMargin + numCols * cellWidth + rightMargin;
  const svgHeight = topMargin + numRows * cellHeight + bottomMargin;

  const getColor = (val: number): string => {
    if (palette === 'diverging') {
      return getDivergingColor(val, divergingCenter, effectiveMin, effectiveMax);
    }
    const range = effectiveMax - effectiveMin || 1;
    const norm = (val - effectiveMin) / range;
    return getSequentialColor(norm);
  };

  return (
    <div className="relative w-full overflow-x-auto bg-[#0e141b] border border-slate-800 rounded-xl p-4 shadow-lg text-slate-200">
      {/* Title & Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-slate-400">{legendLabel}:</span>
          <span>{valueFormatter(effectiveMin)}</span>
          <div
            className="h-3 w-28 rounded-sm shadow-inner"
            style={{
              background:
                palette === 'diverging'
                  ? `linear-gradient(to right, ${getColor(effectiveMin)}, ${getColor(divergingCenter)}, ${getColor(effectiveMax)})`
                  : `linear-gradient(to right, ${getColor(effectiveMin)}, ${getColor(effectiveMin + (effectiveMax - effectiveMin) * 0.5)}, ${getColor(effectiveMax)})`,
            }}
            title={`Scale from ${valueFormatter(effectiveMin)} to ${valueFormatter(effectiveMax)}`}
          />
          <span>{valueFormatter(effectiveMax)}</span>
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-700">
            <span className="inline-block w-3 h-3 rounded-sm border-2 border-brand-accent bg-brand-500/30" />
            <span className="text-[11px] text-brand-400">Peak</span>
          </div>
        </div>
      </div>

      {/* SVG Heatmap */}
      <div className="relative flex justify-center min-w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-full h-auto select-none font-sans"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Column labels (Hours or Days) */}
          <g className="text-[11px] font-mono fill-slate-400">
            {colLabels.map((col, c) => (
              <text
                key={`col-${c}`}
                x={leftMargin + c * cellWidth + cellWidth / 2}
                y={topMargin - 10}
                textAnchor="middle"
                className="select-none text-[11px]"
              >
                {col}
              </text>
            ))}
          </g>

          {/* Row labels (Days or Genres) */}
          <g className="text-xs font-semibold fill-slate-300">
            {rowLabels.map((row, r) => (
              <text
                key={`row-${r}`}
                x={leftMargin - 10}
                y={topMargin + r * cellHeight + cellHeight / 2 + 4}
                textAnchor="end"
                className="select-none"
              >
                {row}
              </text>
            ))}
          </g>

          {/* Heatmap Cells */}
          <g>
            {data.map((rowVals, r) =>
              rowVals.map((val, c) => {
                const x = leftMargin + c * cellWidth;
                const y = topMargin + r * cellHeight;
                const isPeak = activePeak.row === r && activePeak.col === c;
                const isHovered =
                  hoveredCell?.rowIdx === r && hoveredCell?.colIdx === c;

                return (
                  <g key={`cell-${r}-${c}`}>
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={cellWidth - 2}
                      height={cellHeight - 2}
                      rx={3}
                      fill={getColor(val)}
                      stroke={
                        isPeak
                          ? '#1ed760'
                          : isHovered
                          ? '#ffffff'
                          : 'rgba(255, 255, 255, 0.07)'
                      }
                      strokeWidth={isPeak ? 2.5 : isHovered ? 2 : 1}
                      filter={isPeak ? `url(#glow-${filterId})` : undefined}
                      className="cursor-pointer transition-all duration-150 focus:outline-none"
                      tabIndex={0}
                      role="gridcell"
                      aria-label={`${rowLabels[r]}, ${colLabels[c]}: ${valueFormatter(val)}${isPeak ? ' (Peak)' : ''}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          rowLabel: rowLabels[r],
                          colLabel: colLabels[c],
                          value: val,
                          rowIdx: r,
                          colIdx: c,
                          isPeak,
                        });
                        setTooltipPos({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                        setTooltipPos(null);
                      }}
                      onFocus={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          rowLabel: rowLabels[r],
                          colLabel: colLabels[c],
                          value: val,
                          rowIdx: r,
                          colIdx: c,
                          isPeak,
                        });
                        setTooltipPos({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onBlur={() => {
                        setHoveredCell(null);
                        setTooltipPos(null);
                      }}
                    />
                    {isPeak && (
                      <circle
                        cx={x + cellWidth / 2}
                        cy={y + cellHeight / 2}
                        r={3}
                        fill="#ffffff"
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredCell && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full -mt-2 px-3 py-2 bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-lg shadow-2xl text-xs whitespace-nowrap"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-200">
              {hoveredCell.rowLabel} &bull; {hoveredCell.colLabel}
            </span>
            {hoveredCell.isPeak && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-black">
                PEAK
              </span>
            )}
          </div>
          <div className="font-mono text-brand-400 font-bold text-sm">
            {valueFormatter(hoveredCell.value)}
          </div>
        </div>
      )}
    </div>
  );
};
