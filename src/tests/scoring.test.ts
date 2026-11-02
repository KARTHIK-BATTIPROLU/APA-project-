import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { WebsiteDataSchema } from '../data/schema';
import {
  computeReleaseMatrix,
  findBestRecommendation,
  rebalanceWeights,
  shiftTimezone,
  DAYS,
} from '../data/scoring';

const jsonPath = path.resolve(__dirname, '../../public/data/website_data.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const websiteData = WebsiteDataSchema.parse(rawData);

describe('scoring.ts unit tests', () => {
  it('recomputed matrix matches release_score_by_genre within 1e-3 for every genre', () => {
    const { components, meta, release_score_by_genre } = websiteData;
    const defaultWeights = meta.weights;

    for (const genre of Object.keys(release_score_by_genre)) {
      const computed = computeReleaseMatrix(components, genre, defaultWeights);
      const expected = release_score_by_genre[genre];

      for (let d = 0; d < 7; d++) {
        for (let h = 0; h < 24; h++) {
          const diff = Math.abs(computed[d][h] - expected[d][h]);
          expect(diff).toBeLessThan(0.001);
        }
      }
    }
  });

  it('recomputed matrix matches release_score_all within 1e-3 for all_genres', () => {
    const { components, meta, release_score_all } = websiteData;
    const defaultWeights = meta.weights;

    const computed = computeReleaseMatrix(components, 'all', defaultWeights);
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        const diff = Math.abs(computed[d][h] - release_score_all[d][h]);
        expect(diff).toBeLessThan(0.001);
      }
    }
  });

  it('best-day and best-hour match recommendation for default genre and all genres', () => {
    const { components, meta, recommendation } = websiteData;
    const defaultWeights = meta.weights;

    // All genres
    const allMatrix = computeReleaseMatrix(components, 'all', defaultWeights);
    const allRec = findBestRecommendation(allMatrix);
    expect(allRec.bestDay).toBe(recommendation.all_genres.best_day);
    expect(allRec.bestHour).toBe(recommendation.all_genres.best_hour);

    // Default genre (Pop)
    const genreMatrix = computeReleaseMatrix(components, meta.default_genre, defaultWeights);
    const genreRec = findBestRecommendation(genreMatrix);
    expect(genreRec.bestDay).toBe(recommendation.genre.best_day);
    expect(genreRec.bestHour).toBe(recommendation.genre.best_hour);

    // Prime time scores match within 1e-3
    for (const day of DAYS) {
      const recScore = recommendation.genre.prime_time_by_day[day];
      const compScore = genreRec.primeTimeScores[day];
      expect(Math.abs(compScore - recScore)).toBeLessThan(0.001);
    }
  });

  it('weights always sum to 1.0 (100%) after slider changes', () => {
    const initial = { activity: 0.5, day_performance: 0.3, low_competition: 0.2 };

    const testChanges: [keyof typeof initial, number][] = [
      ['activity', 0.8],
      ['activity', 0.1],
      ['day_performance', 0.6],
      ['day_performance', 0.0],
      ['low_competition', 0.45],
      ['low_competition', 1.0],
      ['activity', 0.33],
    ];

    for (const [key, val] of testChanges) {
      const rebalanced = rebalanceWeights(initial, key, val);
      const sum = Number((rebalanced.activity + rebalanced.day_performance + rebalanced.low_competition).toFixed(4));
      expect(sum).toBe(1.0);
      expect(rebalanced[key]).toBe(val);
      expect(rebalanced.activity).toBeGreaterThanOrEqual(0);
      expect(rebalanced.day_performance).toBeGreaterThanOrEqual(0);
      expect(rebalanced.low_competition).toBeGreaterThanOrEqual(0);
    }
  });

  it('timezone shifting handles positive offsets with day wrap-around (e.g. Sat 22:00 +5:30 -> Sun ~03:30)', () => {
    // Sat 22:00, audience offset 0 (UTC), artist offset +5.5 (IST)
    const res = shiftTimezone('Sat', 22, 0, 5.5);
    expect(res.originalDay).toBe('Sat');
    expect(res.originalHour).toBe(22);
    expect(res.convertedDay).toBe('Sun');
    expect(res.convertedHour).toBe(3);
    expect(res.convertedMinute).toBe(30);
    expect(res.convertedFormatted).toBe('03:30');
    expect(res.isApprox).toBe(true);
    expect(res.nearestHour).toBe(4);
    expect(res.nearestHourFormatted).toBe('04:00');
  });

  it('timezone shifting handles negative offsets with day wrap-around (e.g. Mon 02:00 -5:00 -> Sun 21:00)', () => {
    // Mon 02:00, audience offset 0 (UTC), artist offset -5 (EST)
    const res = shiftTimezone('Mon', 2, 0, -5);
    expect(res.originalDay).toBe('Mon');
    expect(res.originalHour).toBe(2);
    expect(res.convertedDay).toBe('Sun');
    expect(res.convertedHour).toBe(21);
    expect(res.convertedMinute).toBe(0);
    expect(res.convertedFormatted).toBe('21:00');
    expect(res.isApprox).toBe(false);
  });
});
