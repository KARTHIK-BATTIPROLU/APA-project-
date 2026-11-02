import Papa from 'papaparse';
import { DAYS } from './scoring';

export interface CatalogRow {
  track_id: string;
  track_title: string;
  artist_name: string;
  release_datetime_local: string;
  timezone?: string;
  target_market?: string;
  streams_first_7_days: number;
  save_count?: number;
  weekday?: string;
  hour?: number;
  slot_score?: number;
}

export interface CatalogAnalysisResult {
  rows: CatalogRow[];
  spearmanCorrelation: number;
  rowCount: number;
  directionalSummary: string;
}

function getRanks(values: number[]): number[] {
  const sorted = values
    .map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value);

  const ranks = new Array(values.length).fill(0);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].value === sorted[i].value) {
      j++;
    }
    const avgRank = (i + 1 + (j + 1)) / 2;
    for (let k = i; k <= j; k++) {
      ranks[sorted[k].index] = avgRank;
    }
    i = j + 1;
  }
  return ranks;
}

export function computeSpearman(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  const rx = getRanks(x);
  const ry = getRanks(y);

  const meanRx = rx.reduce((acc, v) => acc + v, 0) / n;
  const meanRy = ry.reduce((acc, v) => acc + v, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanRx;
    const dy = ry[i] - meanRy;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return Number((num / den).toFixed(3));
}

export function parseAndScoreCatalog(
  csvText: string,
  releaseMatrix: number[][]
): CatalogAnalysisResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const rows: CatalogRow[] = [];
  const scores: number[] = [];
  const streams: number[] = [];

  for (const raw of parsed.data) {
    const track_id = raw['track_id'] || `TRK_${Math.random().toString(36).substring(7)}`;
    const track_title = raw['track_title'] || 'Unknown Track';
    const artist_name = raw['artist_name'] || 'Unknown Artist';
    const release_datetime_local = raw['release_datetime_local'] || '';
    const streams_first_7_days = Number(raw['streams_first_7_days'] || 0);
    const save_count = raw['save_count'] ? Number(raw['save_count']) : undefined;
    const timezone = raw['timezone'] || undefined;
    const target_market = raw['target_market'] || undefined;

    // Parse date
    const dt = new Date(release_datetime_local);
    let weekdayIndex = 0;
    let hour = 12;

    if (!isNaN(dt.getTime())) {
      // JS getDay(): 0 is Sun, 1 is Mon... convert to Mon=0..Sun=6
      const jsDay = dt.getDay();
      weekdayIndex = (jsDay + 6) % 7;
      hour = dt.getHours();
    }

    const slot_score =
      releaseMatrix[weekdayIndex] && releaseMatrix[weekdayIndex][hour] !== undefined
        ? releaseMatrix[weekdayIndex][hour]
        : 0.5;

    const row: CatalogRow = {
      track_id,
      track_title,
      artist_name,
      release_datetime_local,
      timezone,
      target_market,
      streams_first_7_days,
      save_count,
      weekday: DAYS[weekdayIndex],
      hour,
      slot_score,
    };

    rows.push(row);
    scores.push(slot_score);
    streams.push(streams_first_7_days);
  }

  const spearmanCorrelation = computeSpearman(scores, streams);
  const directionalSummary =
    spearmanCorrelation > 0
      ? `Positive directional correlation (r = ${spearmanCorrelation}). Tracks released in higher-scoring windows saw higher 7-day streams.`
      : spearmanCorrelation < 0
      ? `Negative/neutral correlation (r = ${spearmanCorrelation}). Releases in this sample may be dominated by playlist placement or existing fan base size.`
      : `Zero correlation (r = 0.00). Sample size is small (n = ${rows.length}); treat as directional sanity check only.`;

  return {
    rows,
    spearmanCorrelation,
    rowCount: rows.length,
    directionalSummary,
  };
}
