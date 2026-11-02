import { Components } from './schema';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type DayName = typeof DAYS[number];

export interface Weights {
  activity: number;
  day_performance: number;
  low_competition: number;
}

export interface WindowResult {
  day: string;
  hour: number;
  hourFormatted: string;
  score: number;
}

export interface RecommendationResult {
  bestDay: string;
  bestDayIndex: number;
  bestHour: number;
  bestHourFormatted: string;
  primeTimeScores: Record<string, number>;
  topWindows: WindowResult[];
  best3HourWindow: string[];
}

export interface TimezoneShiftResult {
  originalDay: string;
  originalHour: number;
  originalFormatted: string;
  convertedDay: string;
  convertedHour: number;
  convertedMinute: number;
  convertedFormatted: string;
  isApprox: boolean;
  nearestHour: number;
  nearestHourFormatted: string;
  offsetDiffHours: number;
}

/**
 * Computes the 7x24 release score matrix from components and weights:
 * Release_Score(d,h) = w_activity * S_activity[d][h]
 *                    + w_day_performance * S_day_perf[d]
 *                    + w_low_competition * (1 - S_competition[d])
 */
export function computeReleaseMatrix(
  components: Components,
  genre: string | 'all',
  weights: Weights
): number[][] {
  const { activity, day_performance, low_competition } = weights;
  const sActivity = components.S_activity;
  const sComp = components.S_competition;
  const sDayPerf =
    genre === 'all' || !components.S_day_perf_by_genre[genre]
      ? components.S_day_perf_global
      : components.S_day_perf_by_genre[genre];

  const matrix: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    const perfVal = sDayPerf[d];
    const compVal = 1 - sComp[d];
    for (let h = 0; h < 24; h++) {
      const actVal = sActivity[d][h];
      const score = activity * actVal + day_performance * perfVal + low_competition * compVal;
      row.push(Number(score.toFixed(4)));
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Computes prime time score for each day (mean of top k=5 hours).
 */
export function computePrimeScores(matrix: number[][], k = 5): Record<string, number> {
  const result: Record<string, number> = {};
  for (let d = 0; d < 7; d++) {
    const row = [...matrix[d]];
    row.sort((a, b) => b - a);
    const topK = row.slice(0, k);
    const mean = topK.reduce((sum, val) => sum + val, 0) / k;
    result[DAYS[d]] = Number(mean.toFixed(4));
  }
  return result;
}

/**
 * Finds best day (highest prime score) and best hour (argmax of that day).
 */
export function findBestRecommendation(
  matrix: number[][],
  kPrime = 5,
  kTopWindows = 5
): RecommendationResult {
  const primeScores = computePrimeScores(matrix, kPrime);

  let bestDay: string = DAYS[0];
  let bestDayIndex = 0;
  let highestPrime = -Infinity;

  for (let d = 0; d < 7; d++) {
    const day = DAYS[d];
    const score = primeScores[day];
    if (score > highestPrime) {
      highestPrime = score;
      bestDay = day;
      bestDayIndex = d;
    }
  }

  // Best hour = argmax on best day
  const bestDayRow = matrix[bestDayIndex];
  let bestHour = 0;
  let highestHourScore = -Infinity;
  for (let h = 0; h < 24; h++) {
    if (bestDayRow[h] > highestHourScore) {
      highestHourScore = bestDayRow[h];
      bestHour = h;
    }
  }

  // Top windows overall
  const allSlots: WindowResult[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      allSlots.push({
        day: DAYS[d],
        hour: h,
        hourFormatted: `${String(h).padStart(2, '0')}:00`,
        score: matrix[d][h],
      });
    }
  }
  allSlots.sort((a, b) => b.score - a.score);
  const topWindows = allSlots.slice(0, kTopWindows);

  // Best 3-hour window on best day: top 3 hours on that day sorted chronologically
  const hoursWithScore = bestDayRow.map((score, h) => ({ hour: h, score }));
  hoursWithScore.sort((a, b) => b.score - a.score);
  const top3Hours = hoursWithScore.slice(0, 3).map((item) => item.hour).sort((a, b) => a - b);
  const best3HourWindow = top3Hours.map((h) => `${String(h).padStart(2, '0')}:00`);

  return {
    bestDay,
    bestDayIndex,
    bestHour,
    bestHourFormatted: `${String(bestHour).padStart(2, '0')}:00`,
    primeTimeScores: primeScores,
    topWindows,
    best3HourWindow,
  };
}

/**
 * Rebalances 3 weights so they always sum to 1.0 (100%).
 * When keyToChange is adjusted to newValue, the other two weights are adjusted proportionally.
 */
export function rebalanceWeights(
  currentWeights: Weights,
  keyToChange: keyof Weights,
  newValue: number
): Weights {
  // Clamp between 0 and 1
  const clampedVal = Math.max(0, Math.min(1, Math.round(newValue * 100) / 100));
  const remaining = Math.max(0, 1 - clampedVal);

  const otherKeys = (Object.keys(currentWeights) as (keyof Weights)[]).filter(
    (k) => k !== keyToChange
  );
  const otherSum = currentWeights[otherKeys[0]] + currentWeights[otherKeys[1]];

  let w1: number;
  let w2: number;

  if (otherSum <= 0.0001) {
    w1 = Math.round((remaining / 2) * 100) / 100;
    w2 = Number((remaining - w1).toFixed(2));
  } else {
    const ratio1 = currentWeights[otherKeys[0]] / otherSum;
    w1 = Math.round(remaining * ratio1 * 100) / 100;
    w2 = Number((remaining - w1).toFixed(2));
  }

  // Ensure exact sum to 1.0
  const result: Weights = { ...currentWeights };
  result[keyToChange] = clampedVal;
  result[otherKeys[0]] = w1;
  result[otherKeys[1]] = w2;

  // Final check to handle floating rounding
  const total = result.activity + result.day_performance + result.low_competition;
  const delta = Number((1.0 - total).toFixed(2));
  if (delta !== 0) {
    result[otherKeys[0]] = Number((result[otherKeys[0]] + delta).toFixed(2));
  }

  return result;
}

/**
 * Converts a slot (day and hour) from audience timezone to artist timezone.
 * Handles circular 24-hour wrap-around, 7-day wrap-around, and fractional offsets.
 * e.g., Sat 22:00 with delta +5.5 hours -> Sun 03:30 (approx 04:00)
 */
export function shiftTimezone(
  day: string,
  hour: number,
  audienceOffset: number,
  artistOffset: number
): TimezoneShiftResult {
  const dayIndex = DAYS.indexOf(day as DayName);
  const validDayIdx = dayIndex >= 0 ? dayIndex : 0;
  const offsetDiffHours = artistOffset - audienceOffset;

  // Convert everything to minutes from Monday 00:00:
  // Day: 0..6, Hour: 0..23, Minute: 0
  const totalMinutesInWeek = 7 * 24 * 60; // 10080 minutes
  const startMinute = (validDayIdx * 24 + hour) * 60;
  const shiftMinutes = Math.round(offsetDiffHours * 60);

  let targetMinute = (startMinute + shiftMinutes) % totalMinutesInWeek;
  if (targetMinute < 0) {
    targetMinute += totalMinutesInWeek;
  }

  const targetDayIdx = Math.floor(targetMinute / (24 * 60));
  const minuteInDay = targetMinute % (24 * 60);
  const targetHour = Math.floor(minuteInDay / 60);
  const targetMinuteInHour = minuteInDay % 60;

  const isApprox = targetMinuteInHour !== 0;
  const nearestHour =
    targetMinuteInHour >= 30 ? (targetHour + 1) % 24 : targetHour;

  const originalFormatted = `${String(hour).padStart(2, '0')}:00`;
  const convertedFormatted = `${String(targetHour).padStart(2, '0')}:${String(targetMinuteInHour).padStart(2, '0')}`;
  const nearestHourFormatted = `${String(nearestHour).padStart(2, '0')}:00`;

  return {
    originalDay: DAYS[validDayIdx],
    originalHour: hour,
    originalFormatted,
    convertedDay: DAYS[targetDayIdx],
    convertedHour: targetHour,
    convertedMinute: targetMinuteInHour,
    convertedFormatted,
    isApprox,
    nearestHour,
    nearestHourFormatted,
    offsetDiffHours,
  };
}
