import { z } from 'zod';

export const MetaSchema = z.object({
  project: z.string(),
  default_genre: z.string(),
  synthetic_inputs: z.boolean(),
  days: z.array(z.string()),
  hours: z.array(z.number()),
  weights: z.object({
    activity: z.number(),
    day_performance: z.number(),
    low_competition: z.number(),
  }),
  datasets: z.object({
    tracks: z.number(),
    listening_events: z.number(),
    chart_rows: z.number(),
    catalog: z.number(),
  }),
});

export const SlotSchema = z.object({
  day: z.string(),
  hour: z.number(),
});

export const TopWindowSchema = z.object({
  Day: z.string(),
  Hour: z.string(),
  Score: z.number(),
});

export const WeekdayPerformanceSchema = z.object({
  releases: z.array(z.number()),
  mean_log_streams: z.array(z.number()),
  ci95: z.array(z.number()),
  median_streams_millions: z.array(z.number()),
  release_share: z.array(z.number()),
  adjusted_effect: z.array(z.number()),
  adjusted_ci95: z.array(z.number()),
  anova: z.object({
    F: z.number(),
    p: z.number(),
  }),
});

export const RecommendationSchema = z.object({
  all_genres: z.object({
    best_day: z.string(),
    best_hour: z.number(),
    best_slot: SlotSchema,
  }),
  genre: z.object({
    name: z.string(),
    best_day: z.string(),
    best_hour: z.number(),
    best_slot: SlotSchema,
    prime_time_by_day: z.record(z.string(), z.number()),
  }),
});

export const ComponentsSchema = z.object({
  S_activity: z.array(z.array(z.number())),
  S_competition: z.array(z.number()),
  S_day_perf_global: z.array(z.number()),
  S_day_perf_by_genre: z.record(z.string(), z.array(z.number())),
});

export const ModelMetricsSchema = z.object({
  MAE: z.number(),
  RMSE: z.number(),
  R2: z.number(),
});

export const FeatureImportanceSchema = z.object({
  Feature: z.string(),
  Importance: z.number(),
});

export const RobustnessSchema = z.object({
  best_day_frequency: z.record(z.string(), z.number()),
  combos_tested: z.number(),
});

export const WebsiteDataSchema = z.object({
  meta: MetaSchema,
  recommendation: RecommendationSchema,
  top_windows_all: z.array(TopWindowSchema),
  weekday_performance: WeekdayPerformanceSchema,
  components: ComponentsSchema,
  activity_matrix: z.array(z.array(z.number())),
  release_score_all: z.array(z.array(z.number())),
  release_score_by_genre: z.record(z.string(), z.array(z.array(z.number()))),
  genre_weekday_index: z.record(z.string(), z.array(z.number())),
  best_day_by_genre: z.record(z.string(), z.string()),
  models: z.object({
    release_day: ModelMetricsSchema,
    activity: ModelMetricsSchema,
  }),
  feature_importance: z.array(FeatureImportanceSchema),
  robustness: RobustnessSchema,
  limitations: z.array(z.string()),
});

export type WebsiteData = z.infer<typeof WebsiteDataSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type WeekdayPerformance = z.infer<typeof WeekdayPerformanceSchema>;
export type Components = z.infer<typeof ComponentsSchema>;
