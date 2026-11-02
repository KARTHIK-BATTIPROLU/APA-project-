# DropClock &bull; Music Release-Window Advisor & Built-in Pitch Deck

> **"For a given music genre, which day of the week and which time of day is the best moment to publish a track on Spotify?"**

DropClock is a production-quality, data-driven single-page application and interactive pitch deck built on Vite, React 18, TypeScript, and Tailwind CSS. It translates multi-dataset machine learning and statistical modeling from `Spotify_Release_Window_Advisor.ipynb` into a real-time, client-side release-window recommendation product.

Every figure, percentage, model statistic, and recommendation originates from a single source of truth: `public/data/website_data.json`.

---

## 🎵 The Analytical Finding

For the baseline target genre (**Pop**), DropClock recommends:
- **Optimal Release Window**: **Saturday at 19:00** (Local Audience Peak)
- **Strategic Execution Rule**: Go live **1–2 hours before the peak** (17:00–18:00) so platform recommendation engines (Release Radar, Daily Mixes, Discovery algorithms) index and rank the track before listener traffic surges.
- **Why not Friday?** Over 40% of all commercial tracks flood Spotify on Friday. Our one-way ANOVA test reveals $F = 0.618, p = 0.7164$ ($p \ge 0.05$), proving that raw weekday differences are not statistically significant alone. Friday release dominance is an industry habit rather than an organic streaming lift. Saturday captures maximum weekend listener momentum while avoiding Friday release congestion.

---

## 📊 Datasets Contributing to the Analysis

| Dataset | Sample Size | Primary Role & Contribution |
| :--- | :--- | :--- |
| **Spotify Most Streamed Songs 2023** | 952 tracks | Weekday stream performance, ANOVA, 95% CIs, adjusted weekday effects via Random Forest what-if counterfactuals, and competition density. |
| **Last.fm 1K User Listening Log** | 500,000 events | 168-hour (7 days &times; 24 h) circadian listener activity matrix, smoothed by Random Forest. |
| **Spotify Historical Daily Charts** | 100,000 rows | 9 Genres &times; 7 Weekdays demand index from Top-200 daily charts across 73 countries. |
| **Sample Artist Release Catalog** | 22 tracks | Directional validation check and template for custom user catalog CSV upload. |

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js `v18+` (tested on Node v22.20.0)
- npm `v9+` (tested on npm 10.9.3)
- Python `3.10+` (if re-running the notebook analysis)

### Installation
```bash
# Clone or navigate to the project directory
cd DropClock

# Install dependencies
npm install
```

### Sync Dataset
Ensure `public/data/website_data.json` is synced from notebook outputs:
```bash
npm run data:sync
```

### Run Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests & Verification
```bash
# Run Vitest unit tests (scoring, schema, number audit)
npm run test

# Type-check TypeScript codebase
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🔄 How to Swap in Real Data

DropClock includes **Demo-Data Honesty**:
- If `meta.synthetic_inputs === true`, a persistent banner is displayed:
  > *"Demo data: synthetic stand-ins with the real schemas. Re-run the notebook on the real datasets to see real results."*
- When real data files are present, this banner disappears automatically.

### Steps to compute from real datasets:
1. Place the four real dataset files in the project root:
   - `spotify_2023_tracks.csv`
   - `lastfm_listening_sample.parquet`
   - `spotify_chart_historical.csv`
   - `sample_artist_releases.csv`
2. Execute the notebook or analysis script:
   ```bash
   python run_analysis.py
   ```
   *(The script automatically detects real files and sets `synthetic_inputs = False` in `outputs/website_data.json`).*
3. Sync the generated file to the public directory:
   ```bash
   npm run data:sync
   ```
4. Rebuild the application:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying as a Static Site

DropClock has **zero backend runtime dependencies**. The entire application is statically compiled into `dist/` and loads `/data/website_data.json` via asynchronous client-side fetch.

### Deploy to Vercel
```bash
npx vercel deploy --prod
```

### Deploy to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages / Static S3 / Cloudflare Pages
- Ensure all static assets in `dist/` and `dist/data/` are served.
- Configure client-side routing to fallback to `index.html` for unknown paths.

---

## 🖥️ Application Pages

1. **`/` Home**: Executive summary, headline recommendation, 6 core KPI cards, mini heatmap preview, and quick navigation.
2. **`/day` Best Day**: Releases per weekday (competition density), mean log-streams with 95% CI error bars, adjusted effect controlling for playlists and age, and honest ANOVA significance reporting.
3. **`/time` Best Time**: 168-hour activity matrix ($S_{\text{activity}}$), 24-hour diurnal curve selector with weekday vs. weekend overlay, and 1–2 hour lead time callout.
4. **`/genre` Genre Explorer**: 9-genre demand index bar chart (1.00 baseline), 9&times;7 diverging demand heatmap, top 5 windows per genre.
5. **`/advisor` Interactive Advisor**:
   - 3 coupled sliders with automatic proportional rebalancing ensuring $\sum w = 100\%$.
   - Circular timezone translation engine handling 24-hour wrap-around, 7-day wrap-around, and fractional offsets (e.g. UTC to IST +5:30).
   - In-browser CSV catalog uploader with Spearman rank correlation calculation.
   - "Copy recommendation" clipboard helper.
6. **`/models` Model Performance**: Metrics tables for both Random Forest models (MAE, RMSE, $R^2$), plain-English interpretation, and Gini feature-importance chart.
7. **`/methodology` Methodology & Limitations**: End-to-end data pipeline flowchart, 4 dataset cards, score formula, robustness sweep results (27 combinations), and 5 documented analytical limitations.
8. **`/pitch` Pitch Deck**: Interactive 14-slide presenter built directly into the site.

---

## 🎤 Built-in Pitch Deck (`/pitch`)

The pitch deck is an in-browser presentation system built to 16:9 aspect ratio with live data integration:

### Presenter Controls:
- **`→` / `Space` / `PageDown`**: Advance to next slide.
- **`←` / `PageUp`**: Return to previous slide.
- **`F`**: Toggle full-screen mode.
- **`N`**: Toggle speaker notes drawer (2–4 plain-English sentences per slide).
- **`G`**: Open slide thumbnail navigator modal.
- **`Ctrl + P` / `Cmd + P`**: Print or Save as PDF (exact 1 slide per page layout).
- **Deep-Linking**: Direct URLs supported, e.g. `/pitch#6` opens Slide 6 directly.

---

## 🧪 Verification & Audit Results

- **Vitest Unit Tests**: 16/16 passed (scoring matrix precision within $1\times 10^{-3}$, weight rebalancing, circular timezone math, Zod schema validation).
- **DOM Number Audit**: 41/41 statistics verified from rendered browser HTML with 0 discrepancies against `website_data.json`.
- **Responsive Testing**: Verified at 375px mobile and 1440px desktop with 0 horizontal overflow.
- **Accessibility**: Semantic elements, table view toggles for all charts, full keyboard navigability, WCAG AA contrast compliance.
