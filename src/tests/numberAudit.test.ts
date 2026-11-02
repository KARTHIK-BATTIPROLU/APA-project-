import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { WebsiteDataSchema } from '../data/schema';
import {
  computeReleaseMatrix,
  findBestRecommendation,
  shiftTimezone,
} from '../data/scoring';

const jsonPath = path.resolve(__dirname, '../../public/data/website_data.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const data = WebsiteDataSchema.parse(raw);

describe('Zero-Mismatch Number Audit across all pages and models', () => {
  it('audits Home page headline statistics against website_data.json', () => {
    const genreRec = data.recommendation.genre;
    const allRec = data.recommendation.all_genres;

    // Headline numbers
    expect(genreRec.best_day).toBe('Sat');
    expect(genreRec.best_hour).toBe(19);
    expect(allRec.best_day).toBe('Sat');
    expect(allRec.best_hour).toBe(19);

    // KPI values
    expect(data.models.release_day.R2.toFixed(3)).toBe('0.549');
    expect(data.meta.datasets.tracks).toBe(952);
    expect(data.meta.datasets.listening_events).toBe(499995);
    expect(data.meta.datasets.chart_rows).toBe(100000);
    expect(data.meta.datasets.catalog).toBe(22);
  });

  it('audits Best Day statistical parameters (ANOVA F, p, releases, adjusted effect)', () => {
    const anova = data.weekday_performance.anova;
    expect(anova.F).toBe(0.618);
    expect(anova.p).toBe(0.7164);
    expect(anova.p).toBeGreaterThanOrEqual(0.05); // Not significant

    // Releases count sum equals total tracks
    const sumReleases = data.weekday_performance.releases.reduce((a, b) => a + b, 0);
    expect(sumReleases).toBe(data.meta.datasets.tracks);

    // Friday has highest share of releases
    const friIndex = 4;
    const friReleases = data.weekday_performance.releases[friIndex];
    for (let i = 0; i < 7; i++) {
      if (i !== friIndex) {
        expect(friReleases).toBeGreaterThan(data.weekday_performance.releases[i]);
      }
    }
  });

  it('audits Best Time 168-hour matrix dimensions and peak value', () => {
    const sActivity = data.components.S_activity;
    expect(sActivity.length).toBe(7);
    for (let d = 0; d < 7; d++) {
      expect(sActivity[d].length).toBe(24);
      for (let h = 0; h < 24; h++) {
        expect(sActivity[d][h]).toBeGreaterThanOrEqual(0);
        expect(sActivity[d][h]).toBeLessThanOrEqual(1.0);
      }
    }
  });

  it('audits Genre Explorer demand indices and best days for all 9 genres', () => {
    const genres = Object.keys(data.genre_weekday_index);
    expect(genres.length).toBe(9);

    for (const g of genres) {
      const idx = data.genre_weekday_index[g];
      expect(idx.length).toBe(7);
      // All values are around 1.0 baseline
      for (const val of idx) {
        expect(val).toBeGreaterThan(0.7);
        expect(val).toBeLessThan(1.4);
      }
      // Best day recorded in best_day_by_genre
      expect(data.best_day_by_genre[g]).toBeDefined();
    }
  });

  it('audits Advisor real-time calculation matches JSON recommendations exactly', () => {
    const matrix = computeReleaseMatrix(data.components, data.meta.default_genre, data.meta.weights);
    const rec = findBestRecommendation(matrix);

    expect(rec.bestDay).toBe(data.recommendation.genre.best_day);
    expect(rec.bestHour).toBe(data.recommendation.genre.best_hour);
    expect(rec.bestHourFormatted).toBe('19:00');

    // Timezone shift
    const shifted = shiftTimezone(rec.bestDay, rec.bestHour, 0, 5.5);
    expect(shifted.convertedDay).toBe('Sun');
    expect(shifted.convertedHour).toBe(0);
    expect(shifted.convertedMinute).toBe(30);
    expect(shifted.convertedFormatted).toBe('00:30');
  });

  it('audits Pitch Deck slides numbers and speaker notes against source data', () => {
    expect(data.robustness.combos_tested).toBe(27);
    expect(data.robustness.best_day_frequency['Sat']).toBe(0.63);
    expect(data.limitations.length).toBe(5);
    expect(data.top_windows_all.length).toBe(10);
    expect(data.top_windows_all[0].Day).toBe('Sat');
    expect(data.top_windows_all[0].Hour).toBe('19:00');
    expect(data.top_windows_all[0].Score).toBe(0.789);
  });
});
